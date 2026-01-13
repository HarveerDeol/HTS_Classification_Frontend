"use client";
import React, { useState } from 'react';
import InputCard from "../components/InputCard";
import OutputCard from "../components/OutputCard";
import LoadingCard from "../components/LoadingCard";
import CustomAlert from "../components/CustomAlert"
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"

export const HomePage = () => {
  const [apiError, setApiError] = useState(null);
  const [apiErrorColor, setApiErrorColor] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState(null);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
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
  );
};