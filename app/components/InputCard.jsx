import React, { useState } from 'react';
import { LiquidGlassCard } from '@/components/ui/liquid-glass';
import { cn } from '@/lib/utils';
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import axios from 'axios';


const InputCard = ({ className, onError, errorLevel, setIsLoading, setResultData }) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});


  const handleClick = () => {
    if (productDescription.trim() === "") {
      if (onError) onError("Please enter a valid description");
      if (errorLevel) errorLevel("text-yellow-400"); 
      return;
    }
        
    setIsLoading(true);
    onError(null);
    
    api.post('/classify', {
      product_description: productDescription,
      country_of_origin: selectedCountry.slice(2).trim()
    })
    .then(function (response) {
      console.log(response.data);
      setResultData(response.data);
      setIsLoading(false);
    })
    .catch(function (error) {
      setIsLoading(false);
      console.log(error);
      onError(error.message);
      errorLevel("text-red-400");
    });
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
        className="p-6 w-[90vw]"
      >
        <nav className="space-y-4 w-full relative z-30">
          {/* Welcome message */}
          <div className="flex justify-center">
            <div className="text-white text-center font-sans font-medium space-y-2">
              <h1 className="text-4xl md:text-6xl">👋 Hey there!</h1>
              <p className="text-sm md:text-base">I promise I won't judge your typos… much.</p>
            </div>
          </div>

          {/* Textarea + Buttons */}
          <div className="relative w-full">
            {/* Textarea with LiquidGlass styling */}
                  <Textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    rows={5}
                    className="w-full px-3 pt-3 pb-12 rounded-xl text-white font-medium transition-colors hover:bg-white/20 resize-none bg-white/5 backdrop-blur-sm border border-white/20"
                    placeholder="Type your message here."
                    
                  />

                  {/* Dropdown button - bottom-left */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="absolute bottom-2 left-2 px-3 py-1 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg text-sm"
                    >
                    {selectedCountry && selectedCountry !== "" ? selectedCountry : "Country"}
                    </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                    side="top"
                    align="start"
                    className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg p-1 w-40 max-h-64 overflow-y-auto"
                    >
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇨🇦 Canada")}>🇨🇦 Canada</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇲🇽 Mexico")}>🇲🇽 Mexico</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇨🇳 China")}>🇨🇳 China</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇩🇪 Germany")}>🇩🇪 Germany</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇯🇵 Japan")}>🇯🇵 Japan</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇮🇳 India")}>🇮🇳 India</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇻🇳 Vietnam")}>🇻🇳 Vietnam</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇸🇬 Singapore")}>🇸🇬 Singapore</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇰🇷 South Korea")}>🇰🇷 South Korea</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇬🇧 United Kingdom")}>🇬🇧 United Kingdom</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇹🇭 Thailand")}>🇹🇭 Thailand</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇮🇩 Indonesia")}>🇮🇩 Indonesia</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇮🇹 Italy")}>🇮🇹 Italy</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇫🇷 France")}>🇫🇷 France</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇫🇮 Finland")}>🇫🇮 Finland</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇪🇸 Spain")}>🇪🇸 Spain</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇹🇦 Taiwan")}>🇹🇦 Taiwan</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇲🇦 Malaysia")}>🇲🇦 Malaysia</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇵🇭 Philippines")}>🇵🇭 Philippines</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇵🇱 Poland")}>🇵🇱 Poland</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇧🇷 Brazil")}>🇧🇷 Brazil</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇵🇰 Pakistan")}>🇵🇰 Pakistan</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇹🇷 Turkey")}>🇹🇷 Turkey</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇧🇪 Belgium")}>🇧🇪 Belgium</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇮🇪 Ireland")}>🇮🇪 Ireland</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇳🇱 Netherlands")}>🇳🇱 Netherlands</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇦🇺 Australia")}>🇦🇺 Australia</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇦🇷 Argentina")}>🇦🇷 Argentina</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇨🇴 Colombia")}>🇨🇴 Colombia</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇪🇨 Ecuador")}>🇪🇨 Ecuador</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇨🇱 Chile")}>🇨🇱 Chile</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇹🇭 Guatemala")}>🇹🇭 Guatemala</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇭🇳 Honduras")}>🇭🇳 Honduras</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇵🇪 Peru")}>🇵🇪 Peru</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇲🇾 Sweden")}>🇲🇾 Sweden</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇸🇦 Saudi Arabia")}>🇸🇦 Saudi Arabia</DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-white/20 rounded-md px-2 py-1" onClick={() => setSelectedCountry("🇮🇪 Ireland")}>🇮🇪 Ireland</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
            <Button
              className="absolute bottom-2 right-2 p-2  bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-0"
              size="icon"
              aria-label="Submit"
              onClick={handleClick}
            >
              <ArrowUp strokeWidth={2.5} className="text-white" />
            </Button>
          </div>
        </nav>
      </LiquidGlassCard>
    </div>
  );
};

export default InputCard;
