import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LiquidGlassCard } from '@/components/ui/liquid-glass';
import { Shimmer } from "@/components/ai-elements/shimmer";
import { ArrowUp, Copy, Loader2 } from "lucide-react";
import { cn } from '@/lib/utils';


const LoadingCard = () => {
  return (
    <div className="p-8 flex w-full py-20 rounded-xl items-center justify-center">
      <LiquidGlassCard
        glowIntensity="sm"
        shadowIntensity="sm"
        borderRadius="12px"
        blurIntensity="sm"
        className="p-8 w-[90vw] max-w-4xl"
      >
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
          <Shimmer as="h2" className="text-white text-lg">Analyzing your product...</Shimmer>
          <Shimmer as="p" className="text-white/60 text-sm">This may take a few seconds</Shimmer>
        </div>
      </LiquidGlassCard>
    </div>
  );
};

export default LoadingCard;