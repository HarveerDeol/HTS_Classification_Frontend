"use client";
import React, { useState, useEffect } from 'react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { marked } from 'marked';

const OutputCard = ({ className, resultData, onNewClassification }) => {
  const [chapter, setChapter] = useState('');
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  const [tariff, setTariff] = useState('');

  const [chapterDescription, setChapterDescription] = useState('');
  const [headingDescription, setHeadingDescription] = useState('');
  const [subheadingDescription, setSubheadingDescription] = useState('');
  const [tariffDescription, setTariffDescription] = useState('');
  const [tariffHeading, setTariffHeading] = useState('');

  const [confidence, setConfidence] = useState(0);
  const [justification, setJustification] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (resultData?.classification) {
      const c = resultData.classification;
      setChapter(c.structure.chapter.code);
      setHeading(c.structure.heading.code);
      setSubheading(c.structure.subheading.code);
      setTariff(c.hts_code);

      setChapterDescription(c.structure.chapter.description);
      setHeadingDescription(c.structure.heading.description);
      setSubheadingDescription(c.structure.subheading.description);
      setTariffDescription(c.description);
      setTariffHeading(c.description);

      setConfidence(c.confidence);
      setJustification(marked.parse(resultData.justification));
    }
  }, [resultData]);


  const handleCopy = () => {
    navigator.clipboard.writeText(tariff);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  }

  return (
    <div
      className={cn(
        'p-8 flex w-full py-20 rounded-xl items-center justify-center',
        className
      )}
    >
      <LiquidGlassCard
        glowIntensity="sm"
        shadowIntensity="sm"
        borderRadius="12px"
        blurIntensity="sm"
        draggable
        className="p-8 w-[90vw] max-w-4xl"
      >
        <div className="space-y-8 w-full relative z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 flex items-center gap-2">
                <span className="text-white font-semibold text-2xl">{tariff}</span>
                {isCopied ? (
                  <Check className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Copy className="w-5 h-5 text-white/70 cursor-pointer hover:text-white transition-colors" onClick={handleCopy} />
                )}
              </div>
            </div>
            <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 rounded-lg px-4 py-1.5">
              <span className="text-emerald-300 font-medium text-sm">High confidence</span>
            </div>
          </div>

          <div>
            <h3 className="text-white/70 text-sm font-medium mb-2">Customs description</h3>
            <p className="text-white text-xl font-medium">{tariffDescription}</p>
          </div>

          <div>
            <h2 className="text-white text-2xl font-bold mb-6">Harmonized code breakdown</h2>
            
            <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden">
              <div className="grid grid-cols-5 gap-4 px-6 py-4 border-b border-white/20">
                <div className="col-span-1">
                  <span className="text-white/70 font-semibold text-sm">Section</span>
                </div>
                <div className="col-span-4">
                  <span className="text-white/70 font-semibold text-sm">Description</span>
                </div>
              </div>

              <div className="divide-y divide-white/10">
                <div className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                  <div className="col-span-1">
                    <div className="text-white font-semibold text-lg">{chapter}</div>
                    <div className="text-white/50 text-xs mt-1">Chapter</div>
                  </div>
                  <div className="col-span-4">
                    <p className="text-white">{chapterDescription}</p>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                  <div className="col-span-1">
                    <div className="text-white font-semibold text-lg">{heading}</div>
                    <div className="text-white/50 text-xs mt-1">Heading</div>
                  </div>
                  <div className="col-span-4">
                    <p className="text-white">{headingDescription}</p>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                  <div className="col-span-1">
                    <div className="text-white font-semibold text-lg">{subheading}</div>
                    <div className="text-white/50 text-xs mt-1">Subheading</div>
                  </div>
                  <div className="col-span-4">
                    <p className="text-white">{subheadingDescription}</p>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-white/5 transition-colors">
                  <div className="col-span-1">
                    <div className="text-white font-semibold text-lg">{tariff}</div>
                    <div className="text-white/50 text-xs mt-1">Tariff</div>
                  </div>
                  <div className="col-span-4">
                    <p className="text-white">{tariffHeading}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div>
            <h2 className="text-white text-2xl font-bold mb-3">Justification</h2>
            <div className="text-white/80 mb-4" dangerouslySetInnerHTML={{ __html: justification }} />
          </div>
          <div className="pt-4 border-t border-white/20">
        <Button
          onClick={onNewClassification}
          className="pointer-events-auto w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm px-6 py-3 rounded-lg font-medium transition-colors">
          New Classification
        </Button>
      </div>
        </div>
      </LiquidGlassCard>
      
    </div>
  );
};

export default OutputCard;