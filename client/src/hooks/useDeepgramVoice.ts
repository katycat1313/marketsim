import { useState, useRef, useCallback, useEffect } from 'react';

interface UseDeepgramVoiceOptions {
  defaultVoice?: 'aura-orion-en' | 'aura-asteria-en' | 'aura-arcas-en' | 'aura-luna-en';
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

export function useDeepgramVoice(options: UseDeepgramVoiceOptions = {}) {
  const {
    defaultVoice = 'aura-orion-en',
    onStart,
    onEnd,
    onError
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeepgramEnabled, setIsDeepgramEnabled] = useState<boolean | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if Deepgram is configured on the backend
  useEffect(() => {
    fetch('/api/deepgram/status')
      .then(res => res.json())
      .then(data => {
        setIsDeepgramEnabled(Boolean(data.enabled));
      })
      .catch(() => {
        setIsDeepgramEnabled(false);
      });
  }, []);

  /**
   * Play speech using Deepgram Aura TTS with Web Speech API fallback
   */
  const speak = useCallback(async (text: string, voiceOverride?: string) => {
    if (!text.trim()) return;

    // Cancel existing audio/speech
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const voice = voiceOverride || defaultVoice;
    setIsLoading(true);

    try {
      // 1. Try Deepgram Aura TTS via server endpoint
      const response = await fetch('/api/deepgram/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onplay = () => {
          setIsLoading(false);
          setIsSpeaking(true);
          onStart?.();
        };

        audio.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          onEnd?.();
        };

        audio.onerror = (e) => {
          console.warn("Deepgram audio playback error, falling back to Web Speech API", e);
          fallbackWebSpeech(text);
        };

        await audio.play();
        return;
      }
    } catch (err) {
      console.warn("Deepgram request failed, using browser Web Speech API fallback:", err);
    }

    // 2. Fallback to browser Web Speech API
    fallbackWebSpeech(text);
  }, [defaultVoice, onStart, onEnd, onError]);

  const fallbackWebSpeech = useCallback((text: string) => {
    setIsLoading(false);
    if (!('speechSynthesis' in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
      onStart?.();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
    };

    utterance.onerror = (err) => {
      setIsSpeaking(false);
      onError?.(err);
    };

    window.speechSynthesis.speak(utterance);
  }, [onStart, onEnd, onError]);

  /**
   * Stop any current speech playback
   */
  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsLoading(false);
    onEnd?.();
  }, [onEnd]);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    isDeepgramEnabled
  };
}

export default useDeepgramVoice;
