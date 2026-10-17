import { useState, useRef, useCallback, useEffect } from "react";

interface GeminiLiveOptions {
  voiceName?: string; // Aoede, Puck, Charon, Kore, Fenrir
  systemInstruction?: string;
  initialPrompt?: string; // Kickoff spoken turn prompt
  onAssistantTranscript?: (text: string, isFinal: boolean) => void;
  onUserTranscript?: (text: string, isFinal: boolean) => void;
  onInterrupted?: () => void;
  onError?: (err: Error) => void;
}

export type PipelineStage = 
  | "idle"
  | "requesting_mic"
  | "connecting_ws"
  | "waiting_setup"
  | "live"
  | "ai_speaking"
  | "interrupted"
  | "error";

export interface LiveDiagnosticInfo {
  micSampleRate: number;
  packetsSent: number;
  setupAcknowledged: boolean;
  lastCloseCode: number | null;
  lastCloseReason: string | null;
}

export function useGeminiLive() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>("idle");
  const [diagnosticInfo, setDiagnosticInfo] = useState<LiveDiagnosticInfo>({
    micSampleRate: 0,
    packetsSent: 0,
    setupAcknowledged: false,
    lastCloseCode: null,
    lastCloseReason: null
  });

  const wsRef = useRef<WebSocket | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micAudioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const volumeTimerRef = useRef<any>(null);
  const micWorkletNodeRef = useRef<AudioWorkletNode | null>(null);
  const micProcessorRef = useRef<ScriptProcessorNode | null>(null);
  
  const playbackAudioContextRef = useRef<AudioContext | null>(null);
  const scheduledTimeRef = useRef<number>(0);
  const activeAudioSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const currentAssistantTextRef = useRef<string>("");

  const isMicMutedRef = useRef(false);
  const isAiSpeakingRef = useRef(false);
  const isSetupCompleteRef = useRef(false);
  const packetsSentCountRef = useRef(0);

  // Helper: Resample from inputRate down to 16kHz and convert Float32Array to 16-bit linear PCM Little-Endian
  const downsampleAndConvertToPCM16 = (input: Float32Array, inputRate: number): ArrayBuffer => {
    let samples: Float32Array;
    if (inputRate === 16000) {
      samples = input;
    } else {
      const ratio = inputRate / 16000;
      const newLength = Math.round(input.length / ratio);
      samples = new Float32Array(newLength);
      let offsetResult = 0;
      let offsetInput = 0;
      while (offsetResult < samples.length) {
        const nextOffsetInput = Math.round((offsetResult + 1) * ratio);
        let accum = 0;
        let count = 0;
        for (let i = offsetInput; i < nextOffsetInput && i < input.length; i++) {
          accum += input[i];
          count++;
        }
        samples[offsetResult] = count > 0 ? accum / count : 0;
        offsetResult++;
        offsetInput = nextOffsetInput;
      }
    }

    const buffer = new ArrayBuffer(samples.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < samples.length; i++) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    return buffer;
  };

  // Helper: Convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Stop all actively playing audio sources immediately on barge-in
  const stopAllPlayback = useCallback(() => {
    for (const source of activeAudioSourcesRef.current) {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // ignore already stopped sources
      }
    }
    activeAudioSourcesRef.current = [];
    if (playbackAudioContextRef.current) {
      scheduledTimeRef.current = playbackAudioContextRef.current.currentTime;
    }
    isAiSpeakingRef.current = false;
    setIsAiSpeaking(false);
  }, []);

  // Queue and play received 24kHz PCM chunk
  const playAudioChunk = useCallback((base64Data: string) => {
    try {
      if (!playbackAudioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        playbackAudioContextRef.current = new AudioCtx({ sampleRate: 24000 });
      }

      const ctx = playbackAudioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      // Decode base64 to binary
      const binaryString = atob(base64Data);
      const len = binaryString.length;
      const sampleCount = Math.floor(len / 2);
      if (sampleCount === 0) return;

      const float32 = new Float32Array(sampleCount);
      const rawBuffer = new ArrayBuffer(len);
      const uint8 = new Uint8Array(rawBuffer);
      for (let i = 0; i < len; i++) {
        uint8[i] = binaryString.charCodeAt(i);
      }
      const dataView = new DataView(rawBuffer);
      for (let i = 0; i < sampleCount; i++) {
        float32[i] = dataView.getInt16(i * 2, true) / 32768.0;
      }

      const buffer = ctx.createBuffer(1, float32.length, 24000);
      buffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      if (scheduledTimeRef.current < currentTime) {
        scheduledTimeRef.current = currentTime + 0.05; // tiny buffer
      }

      source.start(scheduledTimeRef.current);
      scheduledTimeRef.current += buffer.duration;

      activeAudioSourcesRef.current.push(source);
      isAiSpeakingRef.current = true;
      setIsAiSpeaking(true);
      setPipelineStage("ai_speaking");

      source.onended = () => {
        activeAudioSourcesRef.current = activeAudioSourcesRef.current.filter(s => s !== source);
        if (activeAudioSourcesRef.current.length === 0) {
          isAiSpeakingRef.current = false;
          setIsAiSpeaking(false);
          setPipelineStage("live");
        }
      };
    } catch (err) {
      console.warn("Failed to schedule audio playback chunk:", err);
    }
  }, []);

  // Disconnect & cleanup
  const endSession = useCallback(() => {
    stopAllPlayback();

    if (volumeTimerRef.current) {
      clearInterval(volumeTimerRef.current);
      volumeTimerRef.current = null;
    }
    setVolumeLevel(0);

    // Stop mic stream
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }

    // Stop mic worklet / processor
    if (micWorkletNodeRef.current) {
      micWorkletNodeRef.current.disconnect();
      micWorkletNodeRef.current = null;
    }

    if (micProcessorRef.current) {
      micProcessorRef.current.disconnect();
      micProcessorRef.current = null;
    }

    if (analyserRef.current) {
      analyserRef.current.disconnect();
      analyserRef.current = null;
    }

    if (micAudioContextRef.current) {
      micAudioContextRef.current.close().catch(() => {});
      micAudioContextRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }

    isSetupCompleteRef.current = false;
    isAiSpeakingRef.current = false;
    setIsConnected(false);
    setIsConnecting(false);
    setIsAiSpeaking(false);
  }, [stopAllPlayback]);

  // Start Gemini Live bidirectional session
  const startSession = useCallback(async (options: GeminiLiveOptions) => {
    try {
      endSession();
      setIsConnecting(true);
      setError(null);
      currentAssistantTextRef.current = "";

      // 1. Synchronously create & resume AudioContexts in direct user gesture flow
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;

      // Use system default sample rate (usually 48kHz or 44.1kHz) for microphone capture.
      // Windows Realtek audio requires native rate for createMediaStreamSource to avoid silence.
      if (!micAudioContextRef.current || micAudioContextRef.current.state === "closed") {
        micAudioContextRef.current = new AudioCtx();
      }
      if (micAudioContextRef.current.state === "suspended") {
        await micAudioContextRef.current.resume().catch(() => {});
      }

      // Playback context at 24kHz for Gemini Live audio
      if (!playbackAudioContextRef.current || playbackAudioContextRef.current.state === "closed") {
        playbackAudioContextRef.current = new AudioCtx({ sampleRate: 24000 });
      }
      if (playbackAudioContextRef.current.state === "suspended") {
        await playbackAudioContextRef.current.resume().catch(() => {});
      }

      // 2. Request microphone permission
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      micStreamRef.current = micStream;

      // 3. Fetch ephemeral token from our backend
      const res = await fetch("/api/gemini/live-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store"
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to initialize Gemini Live credentials");
      }

      const { token, endpoint } = await res.json();
      const wsUrl = `${endpoint}?access_token=${token}`;

      // 4. Connect WebSocket
      const ws = new WebSocket(wsUrl);
      ws.binaryType = "arraybuffer";
      wsRef.current = ws;

      ws.onopen = async () => {
        // Send initial setup handshake
        const setupMessage = {
          setup: {
            model: "models/gemini-3.8-live",
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: options.voiceName || "Aoede" // Warm mentor voice
                  }
                }
              }
            },
            inputAudioTranscription: {},
            outputAudioTranscription: {},
            systemInstruction: {
              parts: [
                {
                  text: options.systemInstruction || "You are an expert digital marketing tutor having a real-time conversational lesson with a student."
                }
              ]
            }
          }
        };

        ws.send(JSON.stringify(setupMessage));
        setIsConnected(true);
        setIsConnecting(false);
        setPipelineStage("waiting_setup");

        // 5. Connect Mic to running micAudioContext
        const micAudioCtx = micAudioContextRef.current!;
        if (micAudioCtx.state === "suspended") {
          await micAudioCtx.resume().catch(() => {});
        }
        console.log(`[Gemini Live] Recording AudioContext state: ${micAudioCtx.state}, hardware rate: ${micAudioCtx.sampleRate}Hz`);
        setDiagnosticInfo(prev => ({ ...prev, micSampleRate: micAudioCtx.sampleRate }));

        const source = micAudioCtx.createMediaStreamSource(micStream);

        // Connect AnalyserNode for live volume feedback (green bars)
        try {
          const analyser = micAudioCtx.createAnalyser();
          analyser.fftSize = 256;
          analyser.smoothingTimeConstant = 0.3;
          source.connect(analyser);
          analyserRef.current = analyser;

          const freqData = new Uint8Array(analyser.frequencyBinCount);
          if (volumeTimerRef.current) clearInterval(volumeTimerRef.current);
          volumeTimerRef.current = setInterval(() => {
            if (!analyserRef.current) return;
            analyserRef.current.getByteFrequencyData(freqData);
            let sum = 0;
            for (let i = 0; i < freqData.length; i++) sum += freqData[i];
            const avg = sum / freqData.length;
            // Map typical speaking range (~8-60) to 0.0 - 1.0
            const norm = Math.min(1, Math.max(0, (avg - 2) / 45));
            setVolumeLevel(norm);
          }, 80);
        } catch (analyserErr) {
          console.warn("[Gemini Live] Failed to attach analyser:", analyserErr);
        }

        // Muted gain node acts as a pull sink so Chrome keeps processing audio without echoing to speakers
        const muteGain = micAudioCtx.createGain();
        muteGain.gain.value = 0;
        muteGain.connect(micAudioCtx.destination);

        let sentPacketCount = 0;
        const sendPcmChunk = (float32Data: Float32Array) => {
          // STRICT PROTOCOL: Do NOT stream audio packets until server sends setupComplete ACK
          if (!isSetupCompleteRef.current) return;
          if (ws.readyState !== WebSocket.OPEN) return;
          if (isMicMutedRef.current) return;

          // Downsample from hardware rate (e.g. 48kHz) down to 16kHz PCM16 for Gemini Live
          const pcm16Buffer = downsampleAndConvertToPCM16(float32Data, micAudioCtx.sampleRate);
          const base64Audio = arrayBufferToBase64(pcm16Buffer);

          // Google Gemini Live BidiGenerateContentRealtimeInput:
          // 'mediaChunks' is deprecated and ignored; official schema is realtimeInput.audio
          const audioPayload = {
            realtimeInput: {
              audio: {
                data: base64Audio,
                mimeType: "audio/pcm;rate=16000"
              }
            }
          };

          ws.send(JSON.stringify(audioPayload));

          sentPacketCount++;
          packetsSentCountRef.current = sentPacketCount;
          if (sentPacketCount % 20 === 0) {
            setDiagnosticInfo(prev => ({ ...prev, packetsSent: sentPacketCount }));
          }

          if (sentPacketCount < 5 || sentPacketCount % 40 === 0) {
            let sumSq = 0;
            for (let i = 0; i < float32Data.length; i++) sumSq += float32Data[i] * float32Data[i];
            const rms = Math.sqrt(sumSq / float32Data.length);
            console.log(`[Gemini Live] Mic packet #${sentPacketCount} sent: ${pcm16Buffer.byteLength} bytes @ 16kHz (RMS volume: ${rms.toFixed(4)})`);
          }
        };

        // Try AudioWorkletNode first
        let workletActive = false;
        if (micAudioCtx.audioWorklet) {
          try {
            try {
              await micAudioCtx.audioWorklet.addModule("/pcm-processor.js");
            } catch (loadErr) {
              const pcmCode = `
                class PCMProcessor extends AudioWorkletProcessor {
                  constructor() {
                    super();
                    this.bufferSize = 2048;
                    this.buffer = new Float32Array(this.bufferSize);
                    this.bytesWritten = 0;
                  }
                  process(inputs, outputs) {
                    const input = inputs[0];
                    if (input && input.length > 0) {
                      const channelData = input[0];
                      for (let i = 0; i < channelData.length; i++) {
                        this.buffer[this.bytesWritten++] = channelData[i];
                        if (this.bytesWritten >= this.bufferSize) {
                          this.port.postMessage(this.buffer);
                          this.buffer = new Float32Array(this.bufferSize);
                          this.bytesWritten = 0;
                        }
                      }
                      const output = outputs[0];
                      if (output && output.length > 0) output[0].set(channelData);
                    }
                    return true;
                  }
                }
                registerProcessor('pcm-processor', PCMProcessor);
              `;
              const blob = new Blob([pcmCode], { type: "application/javascript" });
              await micAudioCtx.audioWorklet.addModule(URL.createObjectURL(blob));
            }

            const workletNode = new AudioWorkletNode(micAudioCtx, "pcm-processor");
            micWorkletNodeRef.current = workletNode;

            workletNode.port.onmessage = (event) => {
              if (event.data) {
                workletActive = true;
                const chunk = event.data instanceof Float32Array ? event.data : new Float32Array(event.data);
                sendPcmChunk(chunk);
              }
            };

            source.connect(workletNode);
            workletNode.connect(muteGain);
            console.log("[Gemini Live] AudioWorkletNode active with muteGain sink");
          } catch (workletErr) {
            console.warn("[Gemini Live] AudioWorklet failed, using ScriptProcessorNode:", workletErr);
          }
        }

        // Automatic Watchdog: if AudioWorklet doesn't deliver audio within 1.2s, seamlessly activate ScriptProcessorNode
        setTimeout(() => {
          if (!workletActive && ws.readyState === WebSocket.OPEN) {
            console.log("[Gemini Live] Activating ScriptProcessorNode audio pipeline fallback");
            try {
              const processor = micAudioCtx.createScriptProcessor(2048, 1, 1);
              micProcessorRef.current = processor;

              processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                sendPcmChunk(inputData);
              };

              source.connect(processor);
              processor.connect(muteGain);
            } catch (spErr) {
              console.error("[Gemini Live] ScriptProcessorNode fallback error:", spErr);
            }
          }
        }, 1200);
      };

      ws.onmessage = async (event: MessageEvent) => {
        try {
          let rawText = "";
          if (typeof event.data === "string") {
            rawText = event.data;
          } else if (event.data instanceof ArrayBuffer) {
            rawText = new TextDecoder().decode(event.data);
          } else if (event.data instanceof Blob) {
            rawText = await event.data.text();
          } else if (event.data && typeof (event.data as any).text === "function") {
            rawText = await (event.data as any).text();
          } else {
            rawText = String(event.data);
          }

          if (!rawText || !rawText.trim()) return;

          const data = JSON.parse(rawText);

          // Handle server setup acknowledgment
          if (data.setupComplete) {
            console.log("Gemini Live session setup acknowledged by server");
            isSetupCompleteRef.current = true;
            setPipelineStage("live");
            setDiagnosticInfo(prev => ({ ...prev, setupAcknowledged: true }));

            // If initial kickoff prompt is provided, start the instructor spoken introduction immediately
            if (options.initialPrompt && ws.readyState === WebSocket.OPEN) {
              const kickoffMsg = {
                clientContent: {
                  turns: [
                    {
                      role: "user",
                      parts: [{ text: options.initialPrompt }]
                    }
                  ],
                  turnComplete: true
                }
              };
              ws.send(JSON.stringify(kickoffMsg));
              console.log("[Gemini Live] Sent kickoff greeting prompt to instructor");
            }
            return;
          }

          // Handle server content (audio stream, transcriptions, interruptions)
          if (data.serverContent) {
            const content = data.serverContent;

            // Handle Barge-in Interruption (User spoke while AI was speaking)
            if (content.interrupted) {
              stopAllPlayback();
              setPipelineStage("interrupted");
              if (options.onInterrupted) {
                options.onInterrupted();
              }
            }

            // Play incoming audio chunks & capture text if provided in modelTurn
            if (content.modelTurn?.parts) {
              for (const part of content.modelTurn.parts) {
                if (part.inlineData?.data) {
                  playAudioChunk(part.inlineData.data);
                }
                if (part.text) {
                  currentAssistantTextRef.current += part.text;
                  if (options.onAssistantTranscript) {
                    options.onAssistantTranscript(currentAssistantTextRef.current, false);
                  }
                }
              }
            }

            // Capture Assistant Spoken Transcription
            if (content.outputTranscription?.text) {
              currentAssistantTextRef.current += content.outputTranscription.text;
              if (options.onAssistantTranscript) {
                options.onAssistantTranscript(currentAssistantTextRef.current, false);
              }
            }

            // Capture Student User Transcription (interim or final)
            if (content.inputTranscription?.text && options.onUserTranscript) {
              options.onUserTranscript(content.inputTranscription.text, true);
            } else if (content.interimInputTranscription?.text && options.onUserTranscript) {
              options.onUserTranscript(content.interimInputTranscription.text, false);
            }

            // Turn complete
            if (content.turnComplete) {
              if (options.onAssistantTranscript && currentAssistantTextRef.current) {
                options.onAssistantTranscript(currentAssistantTextRef.current, true);
                currentAssistantTextRef.current = "";
              }
            }
          }
        } catch (parseErr) {
          console.warn("Error parsing Gemini Live WebSocket message:", parseErr);
        }
      };

      ws.onerror = (errEvent) => {
        console.error("Gemini Live WebSocket error:", errEvent);
        const err = new Error("Gemini Live connection error");
        setError("Gemini Live encountered a connection issue");
        setPipelineStage("error");
        if (options.onError) options.onError(err);
      };

      ws.onclose = (closeEvent) => {
        console.log("Gemini Live WebSocket closed:", closeEvent.code, closeEvent.reason);
        setDiagnosticInfo(prev => ({
          ...prev,
          lastCloseCode: closeEvent.code,
          lastCloseReason: closeEvent.reason || null
        }));
        if (closeEvent.code !== 1000) {
          const detail = closeEvent.code === 1011
            ? "Gemini Live service temporarily unavailable (1011). Ready to reconnect."
            : `WebSocket closed (code ${closeEvent.code}): ${closeEvent.reason || "Connection dropped"}`;
          setError(detail);
          setPipelineStage("error");
        }
        endSession();
      };

    } catch (err: any) {
      console.error("Error starting Gemini Live session:", err);
      setError(err.message || "Failed to start live session");
      setIsConnecting(false);
      setIsConnected(false);
      setPipelineStage("error");
      if (options.onError) options.onError(err);
    }
  }, [endSession, downsampleAndConvertToPCM16, arrayBufferToBase64, playAudioChunk, stopAllPlayback]);

  // Send textual interruption or injected turn
  const sendClientText = useCallback((text: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const msg = {
        clientContent: {
          turns: [
            {
              role: "user",
              parts: [{ text }]
            }
          ],
          turnComplete: true
        }
      };
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const toggleMicMute = useCallback(() => {
    setIsMicMuted(prev => {
      const next = !prev;
      isMicMutedRef.current = next;
      return next;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endSession();
    };
  }, [endSession]);

  return {
    isConnected,
    isConnecting,
    isAiSpeaking,
    isMicMuted,
    error,
    volumeLevel,
    pipelineStage,
    diagnosticInfo,
    startSession,
    endSession,
    sendClientText,
    toggleMicMute
  };
}
