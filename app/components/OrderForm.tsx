"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Shield,
  ArrowLeft,
  ArrowRight,
  Check,
  CalendarIcon,
  User,
  Package,
  Gem,
  Settings,
  FileText,
  CheckCircle,
  Copy,
  Share2,
  Printer,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react"; // Add at top
import { format } from "date-fns";
import Link from "next/link";
import { Contract, ethers } from "ethers";
import {
  useActiveAccount,
  useActiveWallet,
  useSendTransaction,
  useWalletInfo,
} from "thirdweb/react";
import { contractABI, contractAddress } from "@/lib/contract";
import { getContract, prepareContractCall } from "thirdweb";
import { arbitrumSepolia } from "thirdweb/chains";
import { client, provider } from "@/lib/utils";
import { OrderFormData, OrderResult } from "@/lib/interfaces";
import { addRecords } from "../server";

const initialFormData: OrderFormData = {
  orderId: "",
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  pickupDate: undefined,
  pickupTime: "",
  sourceMaterial: [],
  sourceMaterialOther: "",
  quantity: "",
  caratSizes: {},
  cutPreference: "",
  colorPreference: "",
  settingPreference: [],
  specialRequests: "",
  signatureName: "",
  signatureDate: undefined,
  termsAccepted: false,
  creationTime: "",
};

const steps = [
  { id: 1, title: "Personal Information", icon: <User className="h-5 w-5" /> },
  { id: 2, title: "Pickup Preference", icon: <Package className="h-5 w-5" /> },
  { id: 3, title: "Source Material", icon: <Settings className="h-5 w-5" /> },
  { id: 4, title: "Diamond Specifications", icon: <Gem className="h-5 w-5" /> },
  { id: 5, title: "Special Requests", icon: <FileText className="h-5 w-5" /> },
  {
    id: 6,
    title: "Terms & Acknowledgment",
    icon: <CheckCircle className="h-5 w-5" />,
  },
];

const caratOptions = [
  { size: "0.30", label: "0.30 ct" },
  { size: "0.40", label: "0.40 ct" },
  { size: "0.50", label: "0.50 ct" },
  { size: "0.60", label: "0.60 ct" },
  { size: "0.70", label: "0.70 ct" },
  { size: "0.80", label: "0.80 ct" },
  { size: "0.90", label: "0.90 ct" },
  { size: "1.00", label: "1.00 ct" },
];

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "Netherlands",
  "Switzerland",
  "Other",
];

export default function OrderForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  const updateFormData = (field: keyof OrderFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: keyof OrderFormData, value: string) => {
    const currentArray = formData[field] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    updateFormData(field, newArray);
  };

  const handleCaratQuantityChange = (size: string, quantity: number) => {
    setFormData((prev) => ({
      ...prev,
      caratSizes: {
        ...prev.caratSizes,
        [size]: quantity,
      },
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.fullName &&
          formData.email &&
          formData.phone &&
          formData.address &&
          formData.city &&
          formData.postalCode &&
          formData.country
        );
      case 2:
        return !!(formData.pickupDate && formData.pickupTime);
      case 3:
        return !!(formData.sourceMaterial.length > 0 && formData.quantity);
      case 4:
        return !!(
          Object.values(formData.caratSizes).some((qty) => qty > 0) &&
          formData.cutPreference &&
          formData.colorPreference &&
          formData.settingPreference.length > 0
        );
      case 5:
        return true; // Special requests are optional
      case 6:
        return !!(
          formData.signatureName &&
          formData.signatureDate &&
          formData.termsAccepted
        );
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;

    setIsSubmitting(true);
    try {
      formData.orderId =
        "DMD-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      formData.creationTime = new Date().toISOString();
      // Generate hash of order data anad create QR

      console.log("Form data: ", formData);

      const result = await addRecords(formData);
      setOrderResult(result);
      setIsSubmitting(false);
    } catch (error) {
      console.log("Error storing order form data: ", error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.log("Error copying:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share && orderResult) {
      try {
        await navigator.share({
          title: "Diamond Order Confirmation",
          text: `Your diamond order ${orderResult.orderId} has been confirmed!`,
          url: orderResult.qrCodeData,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  // Confirmation Screen
  if (orderResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-slate-600">
              Your diamond creation order has been successfully submitted
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-white mb-8">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-slate-900">
                Your Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4 mb-6">
                <div>
                  <Label className="text-sm font-medium text-slate-600">
                    Order ID
                  </Label>
                  <div className="flex items-center justify-center space-x-2 mt-1">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 text-lg px-4 py-2"
                    >
                      {orderResult.orderId}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(orderResult.orderId)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-lg border-2 border-dashed border-slate-200 mb-6 inline-block">
                <div className="w-48 h-48 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  {/* <QrCode className="h-32 w-32 text-slate-400" /> */}
                  <QRCodeCanvas
                    value={`https://sepolia.arbiscan.io/tx/${orderResult.hash}`}
                    size={192}
                    level="H"
                    fgColor="#0f172a" // Tailwind slate-900
                    bgColor="#f1f5f9" // Tailwind slate-100
                  />
                </div>
                <p className="text-sm text-slate-600">
                  Scan to track your diamond creation
                </p>
              </div>
              <div className="pb-6 text-sm text-center sm:text-left">
                <p className="text-slate-700">
                  Track your order on blockchain with{" "}
                  <Link
                    href={`https://sepolia.arbiscan.io/tx/${orderResult.hash}`}
                    target="_blank"
                    className="text-blue-600 break-all"
                  >
                    {orderResult.hash}
                  </Link>
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Button
                  onClick={() => window.print()}
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
              </div>

              <div className="bg-blue-50 p-6 rounded-lg text-left">
                <h3 className="font-semibold text-slate-900 mb-3">
                  What happens next?
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    We'll send you a shipping kit for your source material
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Your material will be processed and verified on the
                    blockchain
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Diamond creation typically takes 8-12 weeks
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    Track progress anytime using your QR code or tracking ID
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Diamond Creation Order
          </h1>
          <p className="text-slate-600">
            Transform your precious memories into certified diamonds
          </p>
        </div>

        {/* Progress Indicator */}
        <Card className="border-0 shadow-sm bg-white mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        currentStep >= step.id
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-slate-300 text-slate-400"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center max-w-20 ${
                        currentStep >= step.id
                          ? "text-blue-600 font-medium"
                          : "text-slate-500"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-4 ${
                        currentStep > step.id ? "bg-blue-600" : "bg-slate-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Form Steps */}
        <Card className="border-0 shadow-xl bg-white">
          <CardHeader>
            <CardTitle className="text-2xl text-slate-900">
              {steps[currentStep - 1].title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-slate-700 font-medium"
                    >
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        updateFormData("fullName", e.target.value)
                      }
                      placeholder="Enter your full name"
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-slate-700 font-medium"
                    >
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="Enter your email"
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-medium">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="Enter your phone number"
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-slate-700 font-medium"
                  >
                    Address *
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    placeholder="Enter your street address"
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="city"
                      className="text-slate-700 font-medium"
                    >
                      City *
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      placeholder="City"
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="postalCode"
                      className="text-slate-700 font-medium"
                    >
                      Postal Code *
                    </Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) =>
                        updateFormData("postalCode", e.target.value)
                      }
                      placeholder="Postal Code"
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="country"
                      className="text-slate-700 font-medium"
                    >
                      Country *
                    </Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) =>
                        updateFormData("country", value)
                      }
                    >
                      <SelectTrigger className="border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Parcel Pickup Preference */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">
                    Preferred Pickup Date *
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal border-slate-300 ${
                          !formData.pickupDate && "text-slate-500"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.pickupDate
                          ? format(formData.pickupDate, "PPP")
                          : "Select pickup date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.pickupDate}
                        onSelect={(date) => updateFormData("pickupDate", date)}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-700 font-medium">
                    Preferred Time *
                  </Label>
                  <RadioGroup
                    value={formData.pickupTime}
                    onValueChange={(value) =>
                      updateFormData("pickupTime", value)
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="before-noon" id="before-noon" />
                      <Label
                        htmlFor="before-noon"
                        className="text-slate-700 cursor-pointer"
                      >
                        Before Noon (8:00 AM - 12:00 PM)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="after-noon" id="after-noon" />
                      <Label
                        htmlFor="after-noon"
                        className="text-slate-700 cursor-pointer"
                      >
                        After Noon (12:00 PM - 6:00 PM)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">
                    Pickup Information
                  </h4>
                  <p className="text-sm text-slate-600">
                    We'll send you a secure shipping kit with detailed
                    instructions. Our courier will collect your source material
                    at the specified time and date.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Source Material */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-slate-700 font-medium">
                    Source Material Type *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {["Human", "Animal", "Ashes", "Hair"].map((material) => (
                      <div
                        key={material}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={material}
                          checked={formData.sourceMaterial.includes(material)}
                          onCheckedChange={() =>
                            handleArrayToggle("sourceMaterial", material)
                          }
                        />
                        <Label
                          htmlFor={material}
                          className="text-slate-700 cursor-pointer"
                        >
                          {material}
                        </Label>
                      </div>
                    ))}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="other"
                        checked={formData.sourceMaterial.includes("Other")}
                        onCheckedChange={() =>
                          handleArrayToggle("sourceMaterial", "Other")
                        }
                      />
                      <Label
                        htmlFor="other"
                        className="text-slate-700 cursor-pointer"
                      >
                        Other
                      </Label>
                    </div>
                  </div>
                  {formData.sourceMaterial.includes("Other") && (
                    <Input
                      placeholder="Please specify..."
                      value={formData.sourceMaterialOther}
                      onChange={(e) =>
                        updateFormData("sourceMaterialOther", e.target.value)
                      }
                      className="mt-2 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="quantity"
                    className="text-slate-700 font-medium"
                  >
                    Quantity (grams) *
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => updateFormData("quantity", e.target.value)}
                    placeholder="Enter quantity in grams"
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="text-sm text-slate-500">
                    Minimum 5 grams required for diamond creation
                  </p>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">
                    Important Notes
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>
                      • Source material will be handled with utmost care and
                      respect
                    </li>
                    <li>
                      • All materials are processed in a sterile, controlled
                      environment
                    </li>
                    <li>
                      • Excess material will be returned to you upon request
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 4: Diamond Specifications */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-slate-700 font-medium">
                    Diamond Carat Sizes *
                  </Label>
                  <p className="text-sm text-slate-500">
                    Select quantity for each carat size
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {caratOptions.map((option) => (
                      <div key={option.size} className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700">
                          {option.label}
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max="10"
                          value={formData.caratSizes[option.size] || 0}
                          onChange={(e) =>
                            handleCaratQuantityChange(
                              option.size,
                              Number.parseInt(e.target.value) || 0
                            )
                          }
                          className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-700 font-medium">
                    Cut Preference *
                  </Label>
                  <RadioGroup
                    value={formData.cutPreference}
                    onValueChange={(value) =>
                      updateFormData("cutPreference", value)
                    }
                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                  >
                    {[
                      "Round",
                      "Cushion",
                      "Heart",
                      "Oval",
                      "Pear",
                      "Emerald",
                      "Other",
                    ].map((cut) => (
                      <div key={cut} className="flex items-center space-x-2">
                        <RadioGroupItem value={cut} id={`cut-${cut}`} />
                        <Label
                          htmlFor={`cut-${cut}`}
                          className="text-slate-700 cursor-pointer"
                        >
                          {cut}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-700 font-medium">
                    Color Preference *
                  </Label>
                  <RadioGroup
                    value={formData.colorPreference}
                    onValueChange={(value) =>
                      updateFormData("colorPreference", value)
                    }
                    className="grid grid-cols-2 md:grid-cols-3 gap-3"
                  >
                    {[
                      "Colorless",
                      "Blue",
                      "Pink",
                      "Yellow",
                      "Green",
                      "Black",
                    ].map((color) => (
                      <div key={color} className="flex items-center space-x-2">
                        <RadioGroupItem value={color} id={`color-${color}`} />
                        <Label
                          htmlFor={`color-${color}`}
                          className="text-slate-700 cursor-pointer"
                        >
                          {color}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-slate-700 font-medium">
                    Setting Preference *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {["Ring", "Pendant", "Earrings", "Loose Diamond"].map(
                      (setting) => (
                        <div
                          key={setting}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`setting-${setting}`}
                            checked={formData.settingPreference.includes(
                              setting
                            )}
                            onCheckedChange={() =>
                              handleArrayToggle("settingPreference", setting)
                            }
                          />
                          <Label
                            htmlFor={`setting-${setting}`}
                            className="text-slate-700 cursor-pointer"
                          >
                            {setting}
                          </Label>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Special Requests */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="specialRequests"
                    className="text-slate-700 font-medium"
                  >
                    Special Instructions or Requests
                  </Label>
                  <Textarea
                    id="specialRequests"
                    value={formData.specialRequests}
                    onChange={(e) =>
                      updateFormData("specialRequests", e.target.value)
                    }
                    placeholder="Enter any special instructions, engraving requests, or other customizations..."
                    className="border-slate-300 focus:border-blue-500 focus:ring-blue-500 min-h-[120px]"
                  />
                  <p className="text-sm text-slate-500">
                    Optional: Any specific requests for your diamond creation
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-slate-900 mb-2">
                    Popular Customizations
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Custom engraving on jewelry settings</li>
                    <li>
                      • Specific metal preferences (gold, platinum, silver)
                    </li>
                    <li>• Memorial inscription or dates</li>
                    <li>• Special packaging or presentation requests</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 6: Terms & Acknowledgment */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-lg max-h-64 overflow-y-auto">
                  <h4 className="font-semibold text-slate-900 mb-3">
                    Terms and Conditions
                  </h4>
                  <div className="text-sm text-slate-700 space-y-2">
                    <p>
                      By submitting this order, you acknowledge and agree to the
                      following terms and conditions:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>
                        You confirm that you have the legal right to use the
                        provided source material for diamond creation.
                      </li>
                      <li>
                        The diamond creation process typically takes 8-12 weeks
                        from receipt of source material.
                      </li>
                      <li>
                        All diamonds created will be certified and recorded on
                        the blockchain for authenticity.
                      </li>
                      <li>
                        Source material handling will be conducted with the
                        highest standards of care and respect.
                      </li>
                      <li>
                        Pricing is final upon order confirmation and payment
                        processing will begin immediately.
                      </li>
                      <li>
                        You understand that the diamond creation process is
                        irreversible once begun.
                      </li>
                      <li>
                        All personal information will be handled according to
                        our privacy policy and data protection standards.
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="signatureName"
                      className="text-slate-700 font-medium"
                    >
                      Digital Signature (Full Name) *
                    </Label>
                    <Input
                      id="signatureName"
                      value={formData.signatureName}
                      onChange={(e) =>
                        updateFormData("signatureName", e.target.value)
                      }
                      placeholder="Type your full name as signature"
                      className="border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-medium">
                      Signature Date *
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal border-slate-300 ${
                            !formData.signatureDate && "text-slate-500"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.signatureDate
                            ? format(formData.signatureDate, "PPP")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.signatureDate}
                          onSelect={(date) =>
                            updateFormData("signatureDate", date)
                          }
                          initialFocus
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="termsAccepted"
                    checked={formData.termsAccepted}
                    onCheckedChange={(checked) =>
                      updateFormData("termsAccepted", checked)
                    }
                  />
                  <Label
                    htmlFor="termsAccepted"
                    className="text-slate-700 cursor-pointer"
                  >
                    I have read, understood, and agree to the terms and
                    conditions *
                  </Label>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-slate-200">
              <Button
                onClick={prevStep}
                disabled={currentStep === 1}
                variant="outline"
                className="bg-transparent border-slate-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < 6 ? (
                <Button
                  onClick={nextStep}
                  disabled={!validateStep(currentStep)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!validateStep(6) || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      Submit Order
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
