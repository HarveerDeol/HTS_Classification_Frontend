import React from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { AlertCircleIcon } from "lucide-react";

export default function CustomAlert({ message, errorLevel }) {
  return (
    <LiquidGlassCard
      glowIntensity="sm"
      shadowIntensity="sm"
      borderRadius="12px"
      blurIntensity="sm"
      className="p-6 w-[90vw] max-w-[90vw] flex items-center gap-4 border border-white/20 bg-white/5 backdrop-blur-sm"
    >
      <AlertCircleIcon className={`${errorLevel} w-6 h-6`}  />
      <div className="text-white">
        <h3 className="font-semibold text-lg">Something went wrong</h3>
        <p className="text-sm mt-1">{message || "Unable to process your request."}</p>
      </div>
    </LiquidGlassCard>
  );
}
