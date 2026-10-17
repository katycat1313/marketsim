import React, { useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Info, RefreshCw, Volume2 } from "lucide-react";
import { PipelineStage, LiveDiagnosticInfo } from "@/hooks/useGeminiLive";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface VoiceLevelIndicatorProps {
  volumeLevel: number;
  pipelineStage: PipelineStage;
  isAiSpeaking: boolean;
  isMicMuted: boolean;
  diagnosticInfo: LiveDiagnosticInfo;
  error: string | null;
  onRetry?: () => void;
  className?: string;
}

export function VoiceLevelIndicator({
  volumeLevel,
  pipelineStage,
  isAiSpeaking,
  isMicMuted,
  diagnosticInfo,
  error,
  onRetry,
  className = ""
}: VoiceLevelIndicatorProps) {
  const [open, setOpen] = useState(false);

  // Normalize heights for 4 equalizer bars
  const bar1 = isAiSpeaking
    ? 45 + Math.sin(Date.now() / 120) * 35
    : isMicMuted
    ? 15
    : Math.min(100, Math.max(18, volumeLevel * 110));

  const bar2 = isAiSpeaking
    ? 70 + Math.sin(Date.now() / 100 + 1) * 25
    : isMicMuted
    ? 15
    : Math.min(100, Math.max(22, volumeLevel * 160));

  const bar3 = isAiSpeaking
    ? 60 + Math.sin(Date.now() / 140 + 2) * 30
    : isMicMuted
    ? 15
    : Math.min(100, Math.max(20, volumeLevel * 140));

  const bar4 = isAiSpeaking
    ? 35 + Math.sin(Date.now() / 90 + 3) * 25
    : isMicMuted
    ? 15
    : Math.min(100, Math.max(15, volumeLevel * 90));

  const isError = pipelineStage === "error" || Boolean(error);
  const isConnecting = pipelineStage === "connecting_ws" || pipelineStage === "waiting_setup" || pipelineStage === "requesting_mic";
  const isLive = pipelineStage === "live" || isAiSpeaking;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`h-8 px-2.5 rounded-lg border text-xs flex items-center gap-1.5 transition-all select-none shadow-sm cursor-pointer ${
            isError
              ? "border-rose-500/50 bg-rose-950/40 text-rose-300 hover:bg-rose-950/60"
              : isConnecting
              ? "border-amber-500/40 bg-amber-950/30 text-amber-300 hover:bg-amber-950/50"
              : isAiSpeaking
              ? "border-purple-500/50 bg-purple-950/40 text-purple-300 shadow-purple-950/40"
              : isMicMuted
              ? "border-border/80 bg-secondary/50 text-muted-foreground hover:bg-secondary/70"
              : volumeLevel > 0.15
              ? "border-emerald-500/60 bg-emerald-950/50 text-emerald-300 shadow-emerald-950/50"
              : "border-border/80 bg-background/80 hover:bg-secondary/40 text-foreground"
          } ${className}`}
          title="Click to view live audio diagnostic details"
        >
          {/* Animated 4-bar equalizer */}
          {isError ? (
            <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0 animate-pulse" />
          ) : isConnecting ? (
            <RefreshCw className="h-3 w-3 text-amber-400 shrink-0 animate-spin" />
          ) : (
            <div className="flex items-end gap-[2.5px] h-3.5 w-4 shrink-0 py-[1px]">
              <span
                className={`w-[2.5px] rounded-full transition-all duration-75 ${
                  isAiSpeaking ? "bg-purple-400" : isMicMuted ? "bg-muted-foreground/40" : volumeLevel > 0.15 ? "bg-emerald-400" : "bg-muted-foreground/60"
                }`}
                style={{ height: `${bar1}%` }}
              />
              <span
                className={`w-[2.5px] rounded-full transition-all duration-75 ${
                  isAiSpeaking ? "bg-purple-300" : isMicMuted ? "bg-muted-foreground/40" : volumeLevel > 0.15 ? "bg-emerald-300" : "bg-muted-foreground/60"
                }`}
                style={{ height: `${bar2}%` }}
              />
              <span
                className={`w-[2.5px] rounded-full transition-all duration-75 ${
                  isAiSpeaking ? "bg-purple-400" : isMicMuted ? "bg-muted-foreground/40" : volumeLevel > 0.15 ? "bg-emerald-400" : "bg-muted-foreground/60"
                }`}
                style={{ height: `${bar3}%` }}
              />
              <span
                className={`w-[2.5px] rounded-full transition-all duration-75 ${
                  isAiSpeaking ? "bg-purple-300" : isMicMuted ? "bg-muted-foreground/40" : volumeLevel > 0.15 ? "bg-emerald-300" : "bg-muted-foreground/60"
                }`}
                style={{ height: `${bar4}%` }}
              />
            </div>
          )}

          {/* Compact Status Text */}
          <span className="font-mono text-[10.5px] font-semibold tracking-tight">
            {isError
              ? "Voice Issue"
              : isConnecting
              ? "Connecting..."
              : isAiSpeaking
              ? "Sarah Speaking"
              : isMicMuted
              ? "Mic Muted"
              : volumeLevel > 0.15
              ? "Voice Active"
              : "Listening"}
          </span>

          <Info className="h-3 w-3 opacity-50 shrink-0 ml-0.5" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        side="bottom"
        className="w-80 p-3.5 bg-slate-950/95 border-border/80 backdrop-blur-md shadow-2xl text-xs space-y-3 z-50"
      >
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <Activity className="h-4 w-4 text-primary" />
            <span>Voice Pipeline Telemetry</span>
          </div>
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
              isError
                ? "bg-rose-500/20 text-rose-300"
                : isLive
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-amber-500/20 text-amber-300"
            }`}
          >
            {pipelineStage.toUpperCase()}
          </span>
        </div>

        {/* Live Audio Stages */}
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">1. Mic Hardware Rate:</span>
            <span className="font-mono text-foreground">
              {diagnosticInfo.micSampleRate ? `${diagnosticInfo.micSampleRate} Hz` : "Probing..."}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">2. Resampling Engine:</span>
            <span className="font-mono text-emerald-400">16,000 Hz PCM16</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">3. Handshake Setup ACK:</span>
            <span className={`font-mono font-medium ${diagnosticInfo.setupAcknowledged ? "text-emerald-400" : "text-amber-400"}`}>
              {diagnosticInfo.setupAcknowledged ? "Acknowledged" : "Pending / Waiting"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">4. Audio Packets Streamed:</span>
            <span className="font-mono text-foreground font-semibold">
              {diagnosticInfo.packetsSent} packets
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">5. Mic RMS Volume:</span>
            <span className={`font-mono font-bold ${volumeLevel > 0.15 ? "text-emerald-400" : "text-muted-foreground"}`}>
              {(volumeLevel * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        {/* Error Detail Display */}
        {error && (
          <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-200 text-[11px] leading-relaxed">
            <div className="font-bold flex items-center gap-1 text-rose-300 mb-0.5">
              <AlertTriangle className="h-3 w-3" />
              <span>Diagnostic Warning:</span>
            </div>
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-1 flex items-center justify-end gap-2">
          {onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setOpen(false);
                onRetry();
              }}
              className="h-7 px-2 text-[11px] gap-1 border-border"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reconnect Live</span>
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
