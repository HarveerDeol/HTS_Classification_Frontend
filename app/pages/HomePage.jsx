"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import InputCard from "../components/InputCard";
import OutputCard from "../components/OutputCard";
import LoadingCard from "../components/LoadingCard";
import SideCard from "../components/SideCard";
import HistorySidebar from "../components/HistorySidebar";
import CustomAlert from "../components/CustomAlert";
import { Button } from "@/components/ui/button";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

export const HomePage = () => {
  const [apiError, setApiError] = useState(null);
  const [apiErrorColor, setApiErrorColor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState(null);


  const handleSelectHistory = (historyItem) => {
    // When a history item is clicked, you could:
    // 1. Load it into the input card for re-classification
    // 2. Show the results directly
    // 3. Navigate to a detailed view
    console.log("Selected history item:", historyItem);
    
    // Example: You could populate the input with the historical data
    // or show a preview/modal with the details
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Login Button - Top Right */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 right-4 z-50"
      >
        <Link href="/login">
          <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm px-6 py-2 rounded-lg font-medium transition-all shadow-lg flex items-center gap-2 group">
            <span>Login</span>
            <svg 
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </Button>
        </Link>
      </motion.div>

      <div className="flex gap-0 lg:gap-8">
        {/* Left Sidebar - History */}
        <HistorySidebar onSelectHistory={handleSelectHistory} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row lg:items-start lg:justify-center gap-8 p-4 lg:p-8 lg:pl-0">
          <div className="flex-1 max-w-5xl">
            <AnimatePresence mode="wait">
              {!isLoading && !resultData && (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: 0.4,
                    scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                  }}
                >
                  <InputCard 
                    onError={setApiError} 
                    errorLevel={setApiErrorColor}
                    setIsLoading={setIsLoading}
                    setResultData={setResultData}
                  />
                </motion.div>
              )}
              
              <AnimatePresence>
                {apiError && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 0.4,
                      scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                    }}
                    className="flex justify-center w-full mt-6"
                  >
                    <CustomAlert message={apiError} errorLevel={apiErrorColor} />
                  </motion.div>
                )}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: 0.4,
                    scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                  }}
                >
                  <LoadingCard />
                </motion.div>
              )}

              {resultData && !isLoading && (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    duration: 0.4,
                    scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
                  }}
                >
                  <OutputCard 
                    resultData={resultData}
                    onNewClassification={() => {setResultData(null); setApiError(null); setApiErrorColor(""); setIsLoading(false);}}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar - Info (Only show on input screen) */}
          {!isLoading && !resultData && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block lg:w-96 lg:sticky lg:top-8"
            >
              <SideCard />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};