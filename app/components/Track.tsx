"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QrCode, Search, Camera } from "lucide-react";
import { QRScanner } from "./QRScanner";
import { TrackInner } from "./TrackInner";

export const Track = () => {
  const [inputValue, setInputValue] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  const handleScanResult = (data: string) => {
    setInputValue(data);
    setShowScanner(false);
  };

  return (
    <div className="max-w-2xl mx-auto" id="track">
      <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-6">
            <QrCode className="h-12 w-12 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Track Your Product
            </h2>
          </div>

          <TrackInner />
        </CardContent>
      </Card>
    </div>
  );
};
