"use client";
import React from 'react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';
import { cn } from '@/lib/utils';
import { Info, Zap, Shield, TrendingUp } from 'lucide-react';

const SideCard = ({ className }) => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get your HTS codes in seconds, not hours"
    },
    {
      icon: Shield,
      title: "Highly Accurate",
      description: "AI-powered classification with expert-level precision"
    },
    {
      icon: TrendingUp,
      title: "Always Learning",
      description: "Our model improves with every classification"
    }
  ];

  return (
    <div
      className={cn(
        'p-8 flex w-full rounded-xl items-start justify-center',
        className
      )}
    >
      <div className="w-full max-w-sm space-y-4">
        {/* Info Card */}
        <LiquidGlassCard
          glowIntensity="sm"
          shadowIntensity="sm"
          borderRadius="12px"
          blurIntensity="sm"
          className="p-6"
        >
          <div className="space-y-4 relative z-30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                <Info className="w-5 h-5 text-blue-300" />
              </div>
              <h3 className="text-white font-semibold text-lg">How it works</h3>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                  1
                </div>
                <p className="text-white/80 leading-relaxed">
                  Describe your product in the text box
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                  2
                </div>
                <p className="text-white/80 leading-relaxed">
                  Select the country of origin (optional but recommended)
                </p>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                  3
                </div>
                <p className="text-white/80 leading-relaxed">
                  Get your HTS code with detailed breakdown and justification
                </p>
              </div>
            </div>
          </div>
        </LiquidGlassCard>

        {/* Features Card */}
        <LiquidGlassCard
          glowIntensity="sm"
          shadowIntensity="sm"
          borderRadius="12px"
          blurIntensity="sm"
          className="p-6"
        >
          <div className="space-y-5 relative z-30">
            <h3 className="text-white font-semibold text-lg">Why choose us?</h3>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 p-2 bg-white/10 border border-white/20 rounded-lg h-fit">
                    <feature.icon className="w-4 h-4 text-white/90" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm mb-1">
                      {feature.title}
                    </h4>
                    <p className="text-white/70 text-xs leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </LiquidGlassCard>

        {/* Stats Card */}
        <LiquidGlassCard
          glowIntensity="sm"
          shadowIntensity="sm"
          borderRadius="12px"
          blurIntensity="sm"
          className="p-6"
        >
          <div className="space-y-4 relative z-30">
            <h3 className="text-white/70 font-medium text-sm">Platform stats</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-white mb-1">
                  10K+
                </div>
                <div className="text-xs text-white/60">
                  Classifications
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold text-white mb-1">
                  98%
                </div>
                <div className="text-xs text-white/60">
                  Accuracy
                </div>
              </div>
            </div>
          </div>
        </LiquidGlassCard>
      </div>
    </div>
  );
};

export default SideCard;