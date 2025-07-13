"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Upload,
  CheckCircle,
  QrCode,
  Share2,
  Copy,
  Printer,
  ArrowLeft,
  FileText,
  X,
} from "lucide-react";
import Link from "next/link";

interface OrderFormData {
  name: string;
  email: string;
  address: string;
  phone: string;
  productDetails: string;
  files: File[];
}

interface OrderResult {
  trackingId: string;
  qrCodeData: string;
  timestamp: string;
}

export default function OrderForm() {
  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    email: "",
    address: "",
    phone: "",
    productDetails: "",
    files: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field: keyof OrderFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).slice(0, 5); // Limit to 5 files
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles].slice(0, 5),
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const generateTrackingId = () => {
    return "TRKVRF-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const trackingId = generateTrackingId();
    const result: OrderResult = {
      trackingId,
      qrCodeData: `https://verifychain.com/track/${trackingId}`,
      timestamp: new Date().toISOString(),
    };

    setOrderResult(result);
    setIsSubmitting(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share && orderResult) {
      try {
        await navigator.share({
          title: "VerifyChain Product Tracking",
          text: `Track your product with ID: ${orderResult.trackingId}`,
          url: orderResult.qrCodeData,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  const copyToClipboard = async () => {
    if (orderResult) {
      try {
        await navigator.clipboard.writeText(orderResult.qrCodeData);
        // You could add a toast notification here
      } catch (err) {
        console.log("Error copying:", err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      address: "",
      phone: "",
      productDetails: "",
      files: [],
    });
    setOrderResult(null);
  };

  if (orderResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Order Submitted Successfully!
            </h1>
            <p className="text-slate-600">
              Your product verification has been initiated
            </p>
          </div>

          {/* QR Code Card */}
          <Card className="border-0 shadow-xl bg-white mb-8 print:shadow-none">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-slate-900">
                Your Tracking QR Code
              </CardTitle>
              <p className="text-slate-600">
                Scan or share this QR code to track your product
              </p>
            </CardHeader>
            <CardContent className="text-center">
              {/* QR Code Display */}
              <div className="bg-white p-8 rounded-lg border-2 border-dashed border-slate-200 mb-6 inline-block">
                <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-32 w-32 text-slate-400" />
                </div>
                <div className="text-center">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 mb-2"
                  >
                    {orderResult.trackingId}
                  </Badge>
                  <p className="text-sm text-slate-500 break-all">
                    {orderResult.qrCodeData}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="border-slate-600 text-slate-600 hover:bg-slate-50 bg-transparent"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 p-6 rounded-lg text-left">
                <h3 className="font-semibold text-slate-900 mb-3">
                  How to use your QR code:
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Save or print this QR code for your records
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Share with others to allow them to track the product
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Scan with any QR code reader to access tracking information
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={resetForm}
              variant="outline"
              className="border-slate-300 bg-transparent"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Submit Another Order
            </Button>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Submit Your Order
          </h1>
          <p className="text-slate-600">
            Fill out the form below to start product verification
          </p>
        </div>

        {/* Order Form */}
        <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">
              Order Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter your email"
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-700 font-medium">
                  Shipping Address *
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter your complete shipping address"
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter your phone number"
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="productDetails"
                  className="text-slate-700 font-medium"
                >
                  Product Details *
                </Label>
                <Textarea
                  id="productDetails"
                  value={formData.productDetails}
                  onChange={(e) =>
                    handleInputChange("productDetails", e.target.value)
                  }
                  placeholder="Describe your product (brand, model, specifications, etc.)"
                  className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                  required
                />
              </div>

              {/* File Upload */}
              {/* <div className="space-y-2">
                <Label className="text-slate-700 font-medium">Upload Files</Label>
                <p className="text-sm text-slate-500 mb-3">
                  Upload proof of ownership, product images, or receipts (Max 5 files)
                </p>

                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-300 hover:border-blue-400 hover:bg-slate-50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 mb-2">Drag and drop files here, or</p>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    Browse Files
                  </Button>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </div> */}

              {/* Uploaded Files */}
              {/* {formData.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-slate-700">Uploaded Files:</p>
                    {formData.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-slate-500 mr-2" />
                          <span className="text-sm text-slate-700 truncate">{file.name}</span>
                          <span className="text-xs text-slate-500 ml-2">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )} */}
              {/* </div> */}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing Order...
                  </>
                ) : (
                  "Submit Order"
                )}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                By submitting this form, you agree to our Terms of Service and
                Privacy Policy.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
