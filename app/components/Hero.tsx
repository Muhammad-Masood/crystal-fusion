import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QrCode, Search } from "lucide-react";
import { Track } from "./Track";

export const Hero = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Verify Your Product with{" "}
            <span className="text-blue-600">Confidence</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Harness the power of blockchain technology to ensure product
            authenticity. Track your items from origin to delivery with
            tamper-proof verification.
          </p>
        </div>

        <Track />
      </div>
    </section>
  );
};
