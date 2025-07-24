"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Package,
  Truck,
  Award,
  Search,
  Filter,
  Upload,
  Hash,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronRight,
  FlaskConical,
  Factory,
  MapPin,
  Shield,
  ExternalLink,
  Calendar,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Order } from "@/lib/interfaces";
import { upload } from "thirdweb/storage";
import { client } from "@/lib/utils";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { contractAddress } from "@/lib/contract";
import { arbitrumSepolia } from "thirdweb/chains";
import { useRouter } from "next/navigation";

interface CertificateStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  fileUploaded?: boolean;
  // timestamp?: string;
}

interface OverviewMetric {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

export function CertificatesManagement({
  orders,
  totalCertificatesUploaded,
  totalAnalysisUploaded,
}: {
  orders: Order[];
  totalCertificatesUploaded: number;
  totalAnalysisUploaded: number;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<{ [stageId: string]: boolean }>({
    // "step-1": false,
    "step-2": false,
    "step-3": false,
    // "step-4": false,
  });
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: File | null;
  }>({});
  const activeAccount = useActiveAccount();
  const router = useRouter();

  const overviewMetrics: OverviewMetric[] = [
    {
      title: "Total Orders",
      value: orders.length.toString(),
      icon: <Package className="h-4 w-4 sm:h-5 sm:w-5" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Certificates Uploaded",
      value: totalCertificatesUploaded.toString(),
      icon: <Award className="h-4 w-4 sm:h-5 sm:w-5" />,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Analysis Uploaded",
      value: totalAnalysisUploaded.toString(),
      icon: <FlaskConical className="h-4 w-4 sm:h-5 sm:w-5" />,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const steps: CertificateStep[] = [
    // {
    //   id: "step-1",
    //   title: "Product Analysis by Crystal Fusion",
    //   description: "Upload analysis certificate to record hash on blockchain",
    //   icon: <FlaskConical className="h-4 w-4" />,
    //   fileUploaded: true,
    // },
    {
      id: "step-2",
      title: "Certificate from Production Unit 2",
      description: "Upload certificate to record hash on blockchain",
      icon: <Factory className="h-4 w-4" />,
      fileUploaded: true,
    },
    {
      id: "step-3",
      title: "Shipment to Belgium",
      description: "Certificate from Production Unit 2 to record on blockchain",
      icon: <Truck className="h-4 w-4" />,
      fileUploaded: true,
    },
    // {
    //   id: "step-4",
    //   title: "Receiving the diamond and certificate in Belgium",
    //   description: "Upload certificate to record hash on blockchain",
    //   icon: <MapPin className="h-4 w-4" />,
    //   fileUploaded: true,
    // },
  ];

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchQuery) return true;
    const matchesSearch = order.id.toString() == searchQuery;
    return matchesSearch;
  });

  const storeCertificate = async (orderId: number, stepId: string) => {
    try {
      if (!activeAccount) {
        alert("Please connect your wallet");
        return;
      }
      const file = uploadedFiles[`${orderId}-${stepId}`];
      if (!file) {
        alert("Please select a file before uploading.");
        return;
      }

      setIsLoading((prev) => ({ ...prev, [stepId]: true }));
      // store file on ipfs
      const uri = await upload({
        client: client,
        files: [file],
      });
      console.log("Uploaded uri: ", uri);
      // store on uri on blockchain
      const contract = getContract({
        address: contractAddress,
        chain: arbitrumSepolia,
        client: client,
      });
      const methodAbi = "function updateCertificateHASH(uint256 id, string _hash)";
      const transaction = prepareContractCall({
        contract,
        method: methodAbi,
        params: [BigInt(orderId), uri],
      });
      const { transactionHash } = await sendTransaction({
        account: activeAccount,
        transaction,
      });
      console.log("Transaction result: ", transactionHash);
      alert(`Success! Tx: ${transactionHash}`);
      router.refresh();
    } catch (err) {
      console.log("Error storing certificate: ", err);
    } finally {
      setIsLoading((prev) => ({ ...prev, [stepId]: false }));
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50 w-full">
        {/* Sidebar */}
        <Sidebar className="border-r border-slate-200">
          <SidebarHeader className="border-b border-slate-200 p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  CrystalFusion
                </h2>
                <p className="text-xs text-slate-500">Admin Dashboard</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-600 font-medium text-xs sm:text-sm">
                Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href="/admin"
                        className="flex items-center space-x-3"
                      >
                        <Package className="h-4 w-4" />
                        <span className="text-sm">Orders</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href="/admin/shipments"
                        className="flex items-center space-x-3"
                      >
                        <Truck className="h-4 w-4" />
                        <span className="text-sm">Shipments</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href="/admin/analysis"
                        className="flex items-center space-x-3"
                      >
                        <Award className="h-4 w-4" />
                        <span>Analysis</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <a
                        href="/admin/certificates"
                        className="flex items-center space-x-3"
                      >
                        <Award className="h-4 w-4" />
                        <span className="text-sm">Certificates</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href="/admin/roles"
                        className="flex items-center space-x-3"
                      >
                        <Users className="h-4 w-4" />
                        <span>Roles</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1 w-full">
          <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-200 bg-white px-4 sm:px-6 py-4 w-full">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <SidebarTrigger className="shrink-0" />
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Analysis & Certificates Management
                </h1>
              </div>
            </header>

            {/* Overview Section */}
            <div className="p-4 sm:p-6 border-b border-slate-200 bg-white">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full">
                {overviewMetrics.map((metric, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow w-full"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-4">
                      <CardTitle className="text-xs sm:text-sm font-medium text-slate-600 leading-tight">
                        {metric.title}
                      </CardTitle>
                      <div
                        className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${metric.color}`}
                      >
                        {metric.icon}
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0">
                      <div className="text-lg sm:text-2xl font-bold text-slate-900">
                        {metric.value}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Search and Filter Section */}
            <div className="p-4 sm:p-6 border-b border-slate-200 bg-white">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search by Order ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 space-y-6 w-full">
              {filteredOrders.map((order) => (
                <Card
                  key={order.id}
                  className="border-0 shadow-lg bg-white w-full"
                >
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg font-semibold text-slate-900">
                            ORD - {order.id}
                          </CardTitle>
                          {/* {getStatusBadge(order.overallStatus)} */}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-slate-600">
                          {/* <span>{order.productName}</span> */}
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Date:{" "}
                            {new Date(
                              order.timestamp * 1000
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Collapsible
                          open={expandedOrders.includes(order.id.toString())}
                          onOpenChange={() =>
                            toggleOrderExpansion(order.id.toString())
                          }
                        >
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="p-2">
                              {expandedOrders.includes(order.id.toString()) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </Collapsible>
                      </div>
                    </div>

                    {/* Progress Dots */}
                    {/* <div className="mt-4"> */}
                    {/* <div className="flex items-center justify-between relative"> */}
                    {/* <div className="absolute top-2 left-0 right-0 h-0.5 bg-slate-200"></div>
                        {steps.map((step, index) => (
                          <div
                            key={step.id}
                            className="flex flex-col items-center relative z-10"
                          >
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                step.status === "completed"
                                  ? "bg-green-500 border-green-500"
                                  : step.status === "in-progress"
                                  ? "bg-blue-500 border-blue-500"
                                  : "bg-white border-slate-300"
                              }`}
                            ></div>
                            <span className="text-xs text-slate-600 mt-2 text-center max-w-16">
                              Step {index + 1}
                            </span>
                          </div>
                        ))}
                      </div> */}
                    {/* </div> */}
                  </CardHeader>

                  {/* Expandable Content */}
                  <Collapsible
                    open={expandedOrders.includes(order.id.toString())}
                  >
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-6">
                          {steps.map((step, index) => (
                            <Card
                              key={step.id}
                              className="border border-slate-200"
                            >
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-2 rounded-lg ${
                                        // step.status === "completed"
                                        // ? "bg-green-100 text-green-600"
                                        // : step.status === "in-progress"
                                        // ? "bg-blue-100 text-blue-600" :
                                        "bg-slate-100 text-slate-500"
                                      }`}
                                    >
                                      {step.icon}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-slate-900">
                                        {step.title}
                                      </h4>
                                      <p className="text-sm text-slate-600">
                                        {step.description}
                                      </p>
                                    </div>
                                  </div>
                                  {/* {getStatusIcon(step.status)} */}
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {/* Step 1: Product Analysis by Crystal Fusion */}
                                {/* {index === 0 && (
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">
                                        Upload Analysis Certificate (PDF)
                                      </Label>
                                      <div className="flex gap-2">
                                        <Input
                                          type="file"
                                          accept=".pdf"
                                          className="text-sm"
                                          onChange={(e) => {
                                            const file =
                                              e.target.files?.[0] || null;
                                            setUploadedFiles((prev) => ({
                                              ...prev,
                                              [`${order.id}-${step.id}`]: file,
                                            }));
                                          }}
                                        />
                                        <Button variant="outline" size="sm">
                                          <Upload className="h-4 w-4" />
                                        </Button>
                                      </div>
                                      {/* {step.fileUploaded && (
                                        <div className="flex items-center gap-2 text-sm text-green-600">
                                          <CheckCircle className="h-4 w-4" />
                                          <span>
                                            Analysis uploaded successfully
                                          </span>
                                        </div>
                                      )} */}
                                {/* </div>  */}
                                {/* <div className="space-y-2"></div>
                                    <div className="flex gap-2">
                                      <Button
                                        className="bg-blue-600 hover:bg-blue-700"
                                        onClick={() =>
                                          storeCertificate(order.id, step.id)
                                        }
                                        disabled={isLoading[step.id]}
                                      >
                                        <Hash className="h-4 w-4 mr-2" />
                                        Record on Blockchain
                                      </Button>
                                    </div>
                                  </div>
                                )} */}

                                {/* Step 2: Certificate from Production Unit 2 */}
                                {index === 0 && (
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">
                                        Upload Certificate (PDF)
                                      </Label>
                                      <div className="flex gap-2">
                                        <Input
                                          type="file"
                                          accept=".pdf"
                                          className="text-sm"
                                          onChange={(e) => {
                                            const file =
                                              e.target.files?.[0] || null;
                                            setUploadedFiles((prev) => ({
                                              ...prev,
                                              [`${order.id}-${step.id}`]: file,
                                            }));
                                          }}
                                        />
                                        <Button variant="outline" size="sm">
                                          <Upload className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() =>
                                          storeCertificate(order.id, step.id)
                                        }
                                        disabled={isLoading[step.id]}
                                      >
                                        <Hash className="h-4 w-4 mr-2" />
                                        Record Certificate on Blockchain
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {/* Step 3: Shipment to Belgium */}
                                {index === 1 && (
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">
                                        Upload IGI Certificate (PDF)
                                      </Label>
                                      <div className="flex gap-2">
                                        <Input
                                          type="file"
                                          accept=".pdf"
                                          className="text-sm"
                                          onChange={(e) => {
                                            const file =
                                              e.target.files?.[0] || null;
                                            setUploadedFiles((prev) => ({
                                              ...prev,
                                              [`${order.id}-${step.id}`]: file,
                                            }));
                                          }}
                                        />
                                        <Button variant="outline" size="sm">
                                          <Upload className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                    <Button
                                      className="bg-purple-600 hover:bg-purple-700"
                                      onClick={() =>
                                        storeCertificate(order.id, step.id)
                                      }
                                      disabled={isLoading[step.id]}
                                    >
                                      <Hash className="h-4 w-4 mr-2" />
                                      Record on Blockchain
                                    </Button>
                                  </div>
                                )}

                                {/* Step 4: Confirmation in Belgium */}
                                {/* {index === 3 && (
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">
                                        Upload Certificate (PDF)
                                      </Label>
                                      <div className="flex gap-2">
                                        <Input
                                          type="file"
                                          accept=".pdf"
                                          className="text-sm"
                                          onChange={(e) => {
                                            const file =
                                              e.target.files?.[0] || null;
                                            setUploadedFiles((prev) => ({
                                              ...prev,
                                              [`${order.id}-${step.id}`]: file,
                                            }));
                                          }}
                                        />
                                        <Button variant="outline" size="sm">
                                          <Upload className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() =>
                                          storeCertificate(order.id, step.id)
                                        }
                                        disabled={isLoading[step.id]}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Record on blockchain
                                      </Button>
                                    </div>
                                  </div>
                                )} */}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))}

              {filteredOrders.length === 0 && (
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-12 text-center">
                    <Award className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No Certificates Found
                    </h3>
                    <p className="text-slate-600">
                      No certificates match your current search criteria
                    </p>
                  </CardContent>
                </Card>
              )}
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
