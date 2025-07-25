"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
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
  Mail,
  Bell,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Plane,
  Factory,
  MapPin,
  FileText,
  QrCode,
  Shield,
  ExternalLink,
  Calendar,
  Hash,
  Download,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Order, OrderFormData } from "@/lib/interfaces";
import { QRCodeCanvas } from "qrcode.react";
import { contractABI, contractAddress } from "@/lib/contract";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
import { useRouter } from "next/navigation";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { arbitrumSepolia } from "thirdweb/chains";
import { client, provider } from "@/lib/utils";
import { sendEmail } from "../server";
import { resolveScheme, upload } from "thirdweb/storage";
import { ethers } from "ethers";

interface ShipmentStage {
  id: string;
  title: string;
  description: string;
  // status: "completed" | "in-progress" | "pending";
  icon: React.ReactNode;
  certificateHash?: string;
  requiresBlockchain: boolean;
}

const stages: ShipmentStage[] = [
  {
    id: "stage-1",
    title: "To the Netherlands (Customer Pickup)",
    description: "Package shipped from customer to Netherlands facility",
    icon: <Plane className="h-4 w-4" />,
    requiresBlockchain: true,
  },
  {
    id: "stage-2",
    title: "From Netherlands to Production Unit 1",
    description: "Package shipped to first production facility",
    icon: <Factory className="h-4 w-4" />,
    requiresBlockchain: true,
  },
  {
    id: "stage-3",
    title: "Carbon Enhancement to Production Unit 2",
    description: "Internal transfer between production units",
    icon: <Truck className="h-4 w-4" />,
    requiresBlockchain: false,
  },
  {
    id: "stage-4",
    title: "From Unit 2 to Belgium (Shipment)",
    description: "Unit 2 ships the diamonds to Belgium",
    icon: <Truck className="h-4 w-4" />,
    requiresBlockchain: true,
  },
  {
    id: "stage-5",
    title: "Product is Sent to the Consumer",
    description:
      "Crystal Fusion generates a FedEx shipping label to pick-up the parcel in Belgium and sends it direct to the consumer",
    // status: "pending",
    icon: <MapPin className="h-4 w-4" />,
    requiresBlockchain: true,
  },
];
export function ShipmentManagement({
  shipmentOrders,
}: {
  shipmentOrders: Order[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isLoading, setIsLoading] = useState<{ [stageId: string]: boolean }>(
    {}
  );
  const [uploadedFiles, setUploadedFiles] = useState<{
    [key: string]: File | null;
  }>({});
  // const [fedexTrackings, setFedexTrackings] = useState<{
  //   [stageId: string]: string;
  // }>({});
  // const activeAccount = useActiveAccount();
  const router = useRouter();

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const updateRecordHash = async (orderId: number, stageId: string) => {
    try {
      setIsLoading((prev) => ({ ...prev, [stageId]: true }));
      // if (!activeAccount) {
      //   alert("Please connect your wallet");
      //   return;
      // }
      const file = uploadedFiles[`${orderId}-${stageId}`];
      if (!file) {
        alert("Please select a file before uploading.");
        return;
      }
      const orderData = shipmentOrders.find((order) => order.id == orderId);
      // const customerEmail =
      if (!orderData) {
        alert("Order not found");
        return;
      }
      // store file on ipfs
      const uri = await upload({
        client: client,
        files: [file],
      });
      const url = await resolveScheme({
        uri,
        client: client,
      });
      console.log("URL: ", url);
      const stage = stages.find((stage) => stage.id == stageId);
      if (!stage) return;
      if (stageId == "stage-3") {
        const emails = [
          process.env.NEXT_PUBLIC_NETHERLAND_EMAIL || "test@gmail.com",
          process.env.NEXT_PUBLIC_UNIT_2_EMAIL || "test@gmail.com",
        ];

        sendEmail(
          orderId,
          stage.id,
          stage.title,
          stage.description,
          url,
          emails
        );
        alert("Email sent successfully");
        return;
      }
      const signer = new ethers.Wallet(
        process.env.OWNER_PRIVATE_KEY!,
        provider
      );
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const contractResult = stageId == "stage-1"
        ? await contract.updatePickupShippingTracking(BigInt(orderId), url)
        : stageId == "stage-2"
          ? await contract.updateCFshippingLabal(BigInt(orderId), url)
          : stageId == "stage-3"
            ? await contract.updateShippingTwoLabal(BigInt(orderId), url)
            : await contract.updatefinalDeliveryTracking(BigInt(orderId), url);

      // const contract = getContract({
      //   address: contractAddress,
      //   chain: arbitrumSepolia,
      //   client: client,

      // });

      // const methodAbi =
      //   stageId == "stage-1"
      //     ? "function updatePickupShippingTracking(uint256 id, string _tracking)"
      //     : stageId == "stage-2"
      //       ? "function updateCFshippingLabal(uint256 id, string _tracking)"
      //       : stageId == "stage-3"
      //         ? "function updateShippingTwoLabal(uint256 id, string _tracking)"
      //         : "function updatefinalDeliveryTracking(uint256 id, string _tracking)";
      // const transaction = prepareContractCall({
      //   contract,
      //   method: methodAbi,
      //   params: [BigInt(orderId), url],
      // });
      // const { transactionHash } = await sendTransaction({
      //   account: activeAccount,
      //   transaction,
      // });
      // const stage = stages.find((stage) => stage.id == stageId);
      if (stageId == "stage-1" || stageId == "stage-5") {
        const res = await fetch(orderData.qrHash);
        const orderFormData: OrderFormData = await res.json();
        console.log(orderFormData);
        sendEmail(orderId, stage.id, stage.title, stage.description, url, [
          orderFormData.email,
        ]);
      } else if (stageId == "stage-2") {
        const unit1Email = [process.env.NEXT_PUBLIC_UNIT_1_EMAIL!];
        sendEmail(
          orderId,
          stage.id,
          stage.title,
          stage.description,
          url,
          unit1Email
        );
        alert("Email sent successfully");
      }
      console.log("Transaction result: ", contractResult.hash);
      alert(`Success! Transaction hash: ${contractResult.hash}`);
      router.refresh();
    } catch (error: any) {
      console.log("Error updating record: ", error);
      alert(`Transaction failed. ${error.message}`);
    } finally {
      setIsLoading((prev) => ({ ...prev, [stageId]: false }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      "in-progress": {
        color: "bg-blue-100 text-blue-800",
        label: "In Progress",
      },
      pending: { color: "bg-slate-100 text-slate-600", label: "Pending" },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const filteredOrders = shipmentOrders.filter((order) => {
    const matchesSearch =
      order.id.toString() == searchQuery ||
      order.qrHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.finalDelivery.finalDeliveryHash
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // const matchesStage =
    //   stageFilter === "all" || order.currentStage.toString() === stageFilter;
    return matchesSearch;
  });

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
                    <SidebarMenuButton asChild isActive>
                      <a
                        href="/admin/shipments"
                        className="flex items-center space-x-3"
                      >
                        <Truck className="h-4 w-4" />
                        <span className="text-sm">Shipments</span>
                      </a>
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
                    <SidebarMenuButton asChild>
                      <Link
                        href="/admin/certificates"
                        className="flex items-center space-x-3"
                      >
                        <Award className="h-4 w-4" />
                        <span className="text-sm">Certificates</span>
                      </Link>
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
                  Shipment Management
                </h1>
              </div>
            </header>

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
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg font-semibold text-slate-900">
                            Order ID - {order.id}
                          </CardTitle>
                          {/* {getStatusBadge(
                            order.stages[order.currentStage - 1]?.status ||
                              "pending"
                          )} */}
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                          onClick={() => setShowQrModal(true)}
                        >
                          <QrCode className="h-4 w-4 mr-2" />
                          View QR
                        </Button>
                        {showQrModal && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg relative">
                              <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowQrModal(false)}
                              >
                                ×
                              </button>
                              <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
                                Scan QR Code
                              </h3>
                              <div className="flex justify-center">
                                <QRCodeCanvas
                                  value={`https://sepolia.arbiscan.io/address/${contractAddress}`}
                                  size={200}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toggleOrderExpansion(order.id.toString())
                          }
                          className="p-2"
                        >
                          {expandedOrders.includes(order.id.toString()) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Progress Timeline */}
                    {/* <div className="mt-4">
                      <div className="flex items-center justify-between relative">
                        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200"></div>
                        {order.stages.map((stage, index) => (
                          <div
                            key={stage.id}
                            className="flex flex-col items-center relative z-10"
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                stage.status === "completed"
                                  ? "bg-green-500 border-green-500 text-white"
                                  : stage.status === "in-progress"
                                  ? "bg-blue-500 border-blue-500 text-white"
                                  : "bg-white border-slate-300 text-slate-400"
                              }`}
                            >
                              {stage.status === "completed" ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                stage.icon
                              )}
                            </div>
                            <span className="text-xs text-slate-600 mt-2 text-center max-w-20">
                              Stage {index + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div> */}
                  </CardHeader>

                  {/* Expandable Content */}
                  <Collapsible
                    open={expandedOrders.includes(order.id.toString())}
                  >
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="space-y-6">
                          {stages.map((stage, index) => (
                            <Card
                              key={stage.id}
                              className="border border-slate-200"
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`p-2 rounded-lg bg-slate-100 text-slate-500`}
                                    >
                                      {stage.icon}
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-slate-900">
                                        {stage.title}
                                      </h4>
                                      <p className="text-sm text-slate-600">
                                        {stage.description}
                                      </p>
                                    </div>
                                  </div>
                                  {/* {getStatusIcon(stage.status)} */}
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                {/* Stage 1: To Netherlands */}
                                {index === 0 && (
                                  <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-sm font-medium">
                                          Upload Fedex Shipping Label in Step 2
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
                                                [`${order.id}-${stage.id}`]:
                                                  file,
                                              }));
                                            }}
                                          />
                                          <Button variant="outline" size="sm">
                                            <Upload className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      {stage.requiresBlockchain && (
                                        <Button
                                          // variant="outline"
                                          onClick={() =>
                                            updateRecordHash(order.id, stage.id)
                                          }
                                          disabled={isLoading[stage.id]}
                                          className="bg-purple-600 hover:bg-purple-700 text-white"
                                        >
                                          <Hash className="h-4 w-4 mr-2" />
                                          Send Email and Record on Blockchain
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Stage 2: To Production Unit 1 */}
                                {index === 1 && (
                                  <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-sm font-medium">
                                          Shipment Label
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
                                                [`${order.id}-${stage.id}`]:
                                                  file,
                                              }));
                                            }}
                                          />
                                          <Button variant="outline" size="sm">
                                            <Upload className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      {stage.requiresBlockchain && (
                                        <Button
                                          // variant="outline"
                                          onClick={() =>
                                            updateRecordHash(order.id, stage.id)
                                          }
                                          className="bg-purple-600 hover:bg-purple-700 text-white"
                                          disabled={isLoading[stage.id]}
                                        >
                                          <Hash className="h-4 w-4 mr-2" />
                                          Notify Unit 1 and Record on Blockchain
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {index === 2 && (
                                  <div className="space-y-4">
                                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                      <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="h-4 w-4 text-amber-600" />
                                        <span className="text-sm font-medium text-amber-800">
                                          Information
                                        </span>
                                      </div>
                                      <p className="text-sm text-amber-700">
                                        No Blockchain Entry required at this
                                        step - Internal transfer only
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-sm font-medium">
                                        Shipment Label
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
                                              [`${order.id}-${stage.id}`]: file,
                                            }));
                                          }}
                                        />
                                        <Button variant="outline" size="sm">
                                          <Upload className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                    <Button
                                      className="bg-green-600 hover:bg-green-700"
                                      onClick={() =>
                                        updateRecordHash(order.id, stage.id)
                                      }
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Notify Carbon Enhancement
                                    </Button>
                                  </div>
                                )}
                                {/* SHipment of Diamond from Unit 2 */}
                                {index === 3 && (
                                  <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-sm font-medium">
                                          Shipment Label
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
                                                [`${order.id}-${stage.id}`]:
                                                  file,
                                              }));
                                            }}
                                          />
                                          <Button variant="outline" size="sm">
                                            <Upload className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      {stage.requiresBlockchain && (
                                        <Button
                                          // variant="outline"
                                          onClick={() =>
                                            updateRecordHash(order.id, stage.id)
                                          }
                                          disabled={isLoading[stage.id]}
                                          className="bg-purple-600 hover:bg-purple-700 text-white"
                                        >
                                          <Hash className="h-4 w-4 mr-2" />
                                          Record on Blockchain
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Stage 4: Final Delivery */}
                                {index === 4 && (
                                  <div className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <div className="space-y-2">
                                        <Label className="text-sm font-medium">
                                          Final Delivery Shipping Label
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
                                                [`${order.id}-${stage.id}`]:
                                                  file,
                                              }));
                                            }}
                                          />
                                          <Button variant="outline" size="sm">
                                            <Upload className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button className="bg-purple-600 hover:bg-purple-700">
                                        <Hash className="h-4 w-4 mr-2" />
                                        Email to Customer and Record on
                                        Blockchain
                                      </Button>
                                    </div>
                                  </div>
                                )}
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
                    <Truck className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No Shipments Found
                    </h3>
                    <p className="text-slate-600">
                      No shipments match your current search criteria
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
