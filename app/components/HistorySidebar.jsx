"use client";
import React, { useState, useEffect } from "react";
import { LiquidGlassCard } from "@/components/ui/liquid-glass";
import { cn } from "@/lib/utils";
import { Clock, Search, Trash2, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const HistorySidebar = ({ className, onSelectHistory }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch history from backend
  useEffect(() => {
    if (!isExpanded) return;

    const idToken = localStorage.getItem("idToken");
    if (!idToken) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        
        const response = await api.get("/history", {
          headers: { Authorization: `Bearer ${idToken}` },
          params: {
            page: 1,
            limit: 50,
            search: searchQuery || "",
          },
        });

        const mappedHistory = response.data.history.map((item) => ({
          id: item.id,
          product: item.product_description,
          htsCode: item.hts_code,
          country: item.country_of_origin,
          date: new Date(item.created_at).toLocaleString(),
          timestamp: new Date(item.created_at),
          isBookmarked: item.is_bookmarked,
          notes: item.notes,
        }));

        setHistory(mappedHistory);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isExpanded, searchQuery]);

  // Filtered history for search bar
  const filteredHistory = history.filter(
    (item) =>
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.htsCode.includes(searchQuery) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    const idToken = localStorage.getItem("idToken");
    if (!idToken) return;

    await api.delete(`/history/${id}`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });

    setHistory(history.filter((item) => item.id !== id));
  };


  const handleClearAll = async () => {
    const idToken = localStorage.getItem("idToken");
    if (!idToken) return;

    await api.delete(`/history`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });

    setHistory([]);
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed top-4 left-4 z-50 p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors shadow-lg"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <X className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
      </motion.button>

      {/* Sidebar Container */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "fixed top-0 left-0 h-screen w-80 lg:w-96 z-40 p-4 lg:p-8",
              className
            )}
          >
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
              onClick={() => setIsExpanded(false)}
            />

            <LiquidGlassCard
              glowIntensity="sm"
              shadowIntensity="md"
              borderRadius="12px"
              blurIntensity="md"
              className="p-6 h-full lg:h-[calc(100vh-4rem)] flex flex-col"
            >
              <div className="space-y-4 relative z-30 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-white/70" />
                    <h2 className="text-white font-semibold text-lg">History</h2>
                  </div>
                  {history.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAll}
                      className="text-xs text-white/50 hover:text-white/80 hover:bg-white/10 transition-colors"
                    >
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    type="text"
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white text-sm placeholder:text-white/40 focus:bg-white/10 focus:border-white/30 transition-all"
                  />
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {loading ? (
                    <p className="text-white/50 text-sm text-center py-12">
                      Loading...
                    </p>
                  ) : filteredHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <Clock className="w-12 h-12 text-white/20 mb-3" />
                      <p className="text-white/50 text-sm">
                        {searchQuery
                          ? "No matching results"
                          : "No classification history yet"}
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {filteredHistory.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() =>
                            onSelectHistory && onSelectHistory(item)
                          }
                          className="group bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg p-3 cursor-pointer transition-all relative"
                        >
                          {/* Delete Button */}
                          <button
                            onClick={(e) => handleDelete(item.id, e)}
                            className="absolute top-2 right-2 p-1.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-white/50 group-hover:text-red-400" />
                          </button>

                          <div className="space-y-2 pr-8">
                            <p className="text-white text-sm font-medium line-clamp-2 leading-snug">
                              {item.product}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-500/20 border border-blue-400/30 rounded px-2 py-0.5">
                                <span className="text-blue-300 text-xs font-mono font-semibold">
                                  {item.htsCode}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-white/50">
                              <span className="flex items-center gap-1">
                                <span className="text-base">
                                  {item.country === "China"
                                    ? "🇨🇳"
                                    : item.country === "Vietnam"
                                    ? "🇻🇳"
                                    : item.country === "India"
                                    ? "🇮🇳"
                                    : item.country === "Mexico"
                                    ? "🇲🇽"
                                    : item.country === "Taiwan"
                                    ? "🇹🇼"
                                    : "🌍"}
                                </span>
                                {item.country}
                              </span>
                              <span>{item.date}</span>
                            </div>
                          </div>

                          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>

                {/* Footer */}
                {history.length > 0 && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-white/50 text-xs text-center">
                      {filteredHistory.length}{" "}
                      {filteredHistory.length === 1
                        ? "classification"
                        : "classifications"}
                      {searchQuery && ` found`}
                    </p>
                  </div>
                )}
              </div>
            </LiquidGlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HistorySidebar;
