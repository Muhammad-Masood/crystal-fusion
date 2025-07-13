"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  QrCode,
  Package,
  Plane,
  FlaskConical,
  Factory,
  Settings,
  Truck,
  CheckCircle,
  Clock,
  ArrowLeft,
  ExternalLink,
  MapPin,
  Calendar,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { TrackInner } from "../components/TrackInner";



export default function TrackingPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Track Your Product
          </h1>
          <p className="text-slate-600">
            Enter your tracking ID or scan QR code to view progress
          </p>
        </div>

        <TrackInner />
      </div>
    </div>
  );
}
