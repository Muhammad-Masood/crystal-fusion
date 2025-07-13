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
  Camera,
} from "lucide-react";
import Link from "next/link";
import { QRScanner } from "./QRScanner";
import { usePathname, useRouter } from "next/navigation";

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: "completed" | "in-progress" | "pending";
  icon: React.ReactNode;
  location?: string;
  blockchainHash?: string;
}

interface TrackingData {
  trackingId: string;
  productName: string;
  currentStep: number;
  estimatedDelivery: string;
  steps: TrackingStep[];
}

export const TrackInner = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const pathName = usePathname();
  console.log(pathName);

  const handleScanResult = (data: string) => {
    setInputValue(data);
    setShowScanner(false);
  };

  // Mock tracking data
  const mockTrackingData: TrackingData = {
    trackingId: "VCH-ABC123XYZ",
    productName: "Premium Wireless Headphones",
    currentStep: 3,
    estimatedDelivery: "2024-01-25",
    steps: [
      {
        id: "1",
        title: "Order Received",
        description: "Your order has been confirmed and is being prepared",
        timestamp: "2024-01-15 09:30 AM",
        status: "completed",
        icon: <Package className="h-5 w-5" />,
        location: "San Francisco, CA",
        blockchainHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
      },
      {
        id: "2",
        title: "Shipped to Netherlands",
        description: "Package has been shipped to our verification facility",
        timestamp: "2024-01-16 02:15 PM",
        status: "completed",
        icon: <Plane className="h-5 w-5" />,
        location: "Amsterdam, Netherlands",
        blockchainHash: "0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
      },
      {
        id: "3",
        title: "Quality Analysis",
        description: "Product is undergoing comprehensive quality verification",
        timestamp: "2024-01-18 11:45 AM",
        status: "completed",
        icon: <FlaskConical className="h-5 w-5" />,
        location: "Amsterdam, Netherlands",
        blockchainHash: "0x3c4d5e6f7890abcdef1234567890abcdef123456",
      },
      {
        id: "4",
        title: "Production Unit 1",
        description: "Initial manufacturing and assembly process",
        timestamp: "2024-01-20 08:20 AM",
        status: "in-progress",
        icon: <Factory className="h-5 w-5" />,
        location: "Rotterdam, Netherlands",
      },
      {
        id: "5",
        title: "Production Unit 2",
        description: "Final assembly and quality control checks",
        timestamp: "Expected: 2024-01-22",
        status: "pending",
        icon: <Settings className="h-5 w-5" />,
        location: "Rotterdam, Netherlands",
      },
      {
        id: "6",
        title: "Delivered",
        description: "Package delivered to your specified address",
        timestamp: "Expected: 2024-01-25",
        status: "pending",
        icon: <Truck className="h-5 w-5" />,
        location: "Your Address",
      },
    ],
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setTrackingData(mockTrackingData);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "in-progress":
        return (
          <div className="relative">
            <Clock className="h-6 w-6 text-blue-500" />
            <div className="absolute -inset-1 rounded-full border-2 border-blue-500 animate-pulse"></div>
          </div>
        );
      default:
        return <Clock className="h-6 w-6 text-slate-400" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      default:
        return "bg-slate-300";
    }
  };

  const calculateProgress = () => {
    if (!trackingData) return 0;
    const completedSteps = trackingData.steps.filter(
      (step) => step.status === "completed"
    ).length;
    return (completedSteps / trackingData.steps.length) * 100;
  };
  return (
    <div>
      <Card className="border-0 shadow-lg bg-white mb-8">
        <CardContent className="p-6">
          {/* <div className="flex flex-col sm:flex-row gap-4 mb-4"> */}
          <div className="flex flex-col md:flex-row gap-4 mb-4 w-full">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Enter tracking ID (e.g., VCH-ABC123XYZ)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                disabled={isLoading || !searchQuery.trim()}
                className="w-full md:w-auto h-12 px-6 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Track Now
                  </>
                )}
              </Button>
              {/* <Button
                  variant="outline"
                  className="h-12 px-4 border-slate-300 hover:bg-slate-50 bg-transparent"
                  onClick={() => {
                    // In a real app, this would open camera for QR scanning
                    setSearchQuery("VCH-ABC123XYZ");
                  }}
                >
                  <QrCode className="h-4 w-4" />
                </Button> */}
            </div>
          </div>

          <div className="text-center">
            <Button
              variant="outline"
              className="w-full md:w-auto text-blue-600 border-blue-600 hover:bg-blue-50"
              onClick={() => setShowScanner((prev) => !prev)}
            >
              <Camera className="h-5 w-5 mr-2" />
              {showScanner ? "Close Scanner" : "Scan QR Code"}
            </Button>
          </div>

          {showScanner && (
            <QRScanner
              onScan={handleScanResult}
              onClose={() => setShowScanner(false)}
            />
          )}
        </CardContent>
      </Card>

      {/* Tracking Results */}
      {trackingData && (
        <div className="space-y-6">
          {/* Product Info Card */}
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">
                    {trackingData.productName}
                  </h2>
                  <p className="text-slate-600">
                    Tracking ID: {trackingData.trackingId}
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 px-3 py-1"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Est. Delivery: {trackingData.estimatedDelivery}
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    Overall Progress
                  </span>
                  <span className="text-sm text-slate-600">
                    {Math.round(calculateProgress())}% Complete
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-0 shadow-lg bg-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                Tracking Timeline
              </h3>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200"></div>

                {/* Timeline Steps */}
                <div className="space-y-6">
                  {trackingData.steps.map((step, index) => (
                    <div key={step.id} className="relative flex items-start">
                      {/* Timeline Dot */}
                      <div className="relative z-10 flex items-center justify-center">
                        <div
                          className={`w-4 h-4 rounded-full ${getStepColor(
                            step.status
                          )} border-4 border-white shadow-lg`}
                        ></div>
                      </div>

                      {/* Step Content */}
                      <div className="ml-6 flex-1">
                        <Card
                          className={`border-l-4 ${
                            step.status === "completed"
                              ? "border-l-green-500 bg-green-50/30"
                              : step.status === "in-progress"
                              ? "border-l-blue-500 bg-blue-50/30"
                              : "border-l-slate-300 bg-slate-50/30"
                          } shadow-sm hover:shadow-md transition-shadow`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center mb-2">
                                  <div
                                    className={`p-2 rounded-lg mr-3 ${
                                      step.status === "completed"
                                        ? "bg-green-100 text-green-600"
                                        : step.status === "in-progress"
                                        ? "bg-blue-100 text-blue-600"
                                        : "bg-slate-100 text-slate-500"
                                    }`}
                                  >
                                    {step.icon}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-slate-900">
                                      {step.title}
                                    </h4>
                                    {step.location && (
                                      <div className="flex items-center text-sm text-slate-500 mt-1">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {step.location}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <p className="text-slate-600 mb-2">
                                  {step.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-sm text-slate-500">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {step.timestamp}
                                  </div>
                                  <div className="flex items-center">
                                    {getStatusIcon(step.status)}
                                    <Badge
                                      variant="secondary"
                                      className={`ml-2 ${
                                        step.status === "completed"
                                          ? "bg-green-100 text-green-800"
                                          : step.status === "in-progress"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-slate-100 text-slate-600"
                                      }`}
                                    >
                                      {step.status === "completed"
                                        ? "Completed"
                                        : step.status === "in-progress"
                                        ? "In Progress"
                                        : "Pending"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Blockchain Button */}
                            {step.status === "completed" &&
                              step.blockchainHash && (
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full md:w-auto border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                                    onClick={() => {
                                      // In a real app, this would open blockchain explorer
                                      window.open(
                                        `https://arbiscan.io/tx/${step.blockchainHash}`,
                                        "_blank"
                                      );
                                    }}
                                  >
                                    <Shield className="h-4 w-4 mr-2" />
                                    View on Blockchain
                                    <ExternalLink className="h-3 w-3 ml-2" />
                                  </Button>
                                </div>
                              )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-green-50">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-slate-900">
                  Blockchain Verification
                </h3>
              </div>
              <p className="text-slate-600 mb-4">
                All completed steps have been verified and recorded on the
                blockchain for complete transparency and tamper-proof tracking.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  Verified Authentic
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Tamper-Proof
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800"
                >
                  Real-time Updates
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {!trackingData && !isLoading && pathName == "/track" && (
        <Card className="border-0 shadow-lg bg-white">
          <CardContent className="p-12 text-center">
            <QrCode className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Ready to Track
            </h3>
            <p className="text-slate-600">
              Enter your tracking ID above to view your product's journey
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
