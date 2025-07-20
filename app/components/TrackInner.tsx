"use client";
import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Printer,
} from "lucide-react";
import { QRScanner } from "./QRScanner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Order } from "@/lib/interfaces";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Lazy-load QRScanner to avoid SSR issues
// const QRScanner = dynamic(() => import("@/components/qr-scanner"), { ssr: false });

export function TrackInner({ orders }: { orders: Order[] }) {
  const params = useSearchParams();
  const router = useRouter();

  const [orderID, setOrderID] = useState<number | null>(null);
  const [txHash, setTxHash] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // On initial load, parse from URL if exists
  useEffect(() => {
    const id = params.get("orderID");
    const txHash = params.get("txHash");
    if (id && txHash) {
      setOrderID(parseInt(id));
      setTxHash(txHash);
      const order = orders.find((order) => order.id == parseInt(id));
      console.log("Order: ", order);
      if (order) {
        setOrderDetails(order);
      }
    }
  }, [params]);

  const handleScanResult = (data: string) => {
    try {
      console.log("On scan data: ", data);
      const url = new URL(data);
      const id = url.searchParams.get("orderID");
      const txHash = url.searchParams.get("txHash");
      if (!id || !txHash) {
        alert("Invalid QR code.");
        return;
      }
      setOrderID(parseInt(id));
      setTxHash(txHash);
      setShowScanner(false);
    } catch (error) {
      alert("Failed to parse QR code.");
    }
  };

  const handleTrackingInput = () => {
    try {
      const order = orders.find((order) => order.id == orderID);
      console.log("Order: ", order);
      if (order) {
        console.log("updada");
        setOrderDetails(order);
      }
      console.log("ORDER DETAULS: ", orderDetails, orderDetails?.csShipping);
    } catch (error) {
      alert("Failed to handle tracking input.");
    }
  };

  const formattedDate = (ts: number) => new Date(ts * 1000).toLocaleString();
  console.log(orderDetails ? orderDetails.timestamp : "noooooo");

  const steps = [
    {
      id: "step-1",
      label: "Customer Pickup",
      hash: orderDetails?.csShipping?.csShippingHash || "",
      timestamp: orderDetails?.csShipping?.timestamp || 0,
      icon: <Package className="w-5 h-5" />,
    },
    {
      id: "step-2",
      label: "Quality Analysis",
      hash: orderDetails?.analysis?.analysisHash || "",
      timestamp: orderDetails?.analysis?.timestamp || 0,
      icon: <FlaskConical className="w-5 h-5" />,
    },
    {
      id: "step-3",
      label: "Crystal Fusion Pickup",
      hash: orderDetails?.cfShipping?.cfShippingHash || "",
      timestamp: orderDetails?.cfShipping?.timestamp || 0,
      icon: <Truck className="w-5 h-5" />,
    },
    {
      id: "step-4",
      label: "Certificate Issued",
      hash: orderDetails?.certificate?.certificatesHashes || [""],
      timestamp: orderDetails?.certificate?.timestamp || 0,
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: "step-5",
      label: "Shipped to Belgium",
      hash: orderDetails?.shippingTwo?.shippingTwoHash || "",
      timestamp: orderDetails?.shippingTwo?.timestamp || 0,
      icon: <Truck className="w-5 h-5" />,
    },
    {
      id: "step-6",
      label: "Final Delivery",
      hash: orderDetails?.finalDelivery?.finalDeliveryHash || "",
      timestamp: orderDetails?.finalDelivery?.timestamp || 0,
      icon: <CheckCircle className="w-5 h-5" />,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Track Your Order</CardTitle>
        </CardHeader>

        <CardContent>
          {/* QR Scanner Toggle */}
          <div className="text-center mb-4">
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

          {/* QR Hash + Manual Input */}
          {!orderDetails && (
            <div className="flex gap-2 flex-col md:flex-row mb-4">
              <Input
                placeholder="Enter Order ID"
                value={orderID || ""}
                onChange={(e) => setOrderID(Number(e.target.value))}
              />
              <Button onClick={handleTrackingInput}>Fetch</Button>
            </div>
          )}

          {/* Timestamp Badge */}
          {orderDetails && (
            <Badge className="mb-4">
              Created: {formattedDate(orderDetails.timestamp)}
            </Badge>
          )}

          {/* Loading State */}
          {isLoading && <p className="text-sm">Loading…</p>}

          {/* Timeline Steps */}
          {orderDetails && (
            <div className="space-y-4">
              {steps.map((step, index) => (
                <Card key={index} className="p-4 border-l-4 border-blue-500">
                  <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
                    <div className="flex items-center gap-2">
                      {step.icon}
                      <span className="font-medium">{step.label}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {step.timestamp && step.timestamp > 0
                        ? formattedDate(step.timestamp)
                        : "Not completed"}
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-gray-500 break-words">
                    {step.hash ? (
                      step.id === "step-2" ? (
                        <Button
                          variant="link"
                          size="sm"
                          className="p-0 text-blue-600 break-words whitespace-normal cursor-pointer"
                          onClick={() =>
                            window.open(step.hash as string, "_blank")
                          }
                        >
                          <span className="break-all">{step.hash}</span>
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </Button>
                      ) : step.id === "step-4" ? (
                        <div className="flex flex-wrap gap-1">
                          {(step.hash as string[]).map((hash, index) => (
                            <Button
                              key={index}
                              variant="link"
                              size="sm"
                              className="p-0 text-blue-600 whitespace-normal break-words cursor-pointer"
                              onClick={() => window.open(hash, "_blank")}
                            >
                              <span className="break-all">{hash}</span>
                              <ExternalLink className="w-4 h-4 ml-1" />
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="p-0 text-blue-600 break-words">
                          Hash - <span className="break-all">{step.hash}</span>
                        </p>
                      )
                    ) : (
                      <span>Pending</span>
                    )}
                    {txHash && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 text-blue-600"
                        onClick={() =>
                          window.open(
                            `https://sepolia.arbiscan.io/tx/${txHash}`,
                            "_blank"
                          )
                        }
                      >
                        {txHash}
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* PDF Report Button */}
          {orderDetails && (
            // <Button
            //   className="mt-6 w-full"
            //   onClick={() => {
            //     // Replace this with actual PDF logic
            //     alert("PDF generation coming soon!");
            //   }}
            // >
            //   Download Full Report (PDF)
            // </Button>
            // <Button
            //   onClick={() => window.print()}
            //   variant="outline"
            //   className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
            // >
            //   <Printer className="h-4 w-4 mr-2" />
            //   Print
            // </Button>
            <Button
              className="mt-6 w-full"
              onClick={() => {
                const doc = new jsPDF();
                doc.setFontSize(16);
                doc.text("Order Tracking Report", 14, 20);

                doc.setFontSize(12);
                doc.text(`Order ID: ${orderDetails.id}`, 14, 30);
                doc.text(
                  `Created: ${formattedDate(orderDetails.timestamp)}`,
                  14,
                  38
                );

                const stepData = [
                  {
                    label: "Customer Pickup",
                    hash: orderDetails.csShipping?.csShippingHash || "Pending",
                    timestamp: orderDetails.csShipping?.timestamp
                      ? formattedDate(orderDetails.csShipping.timestamp)
                      : "Pending",
                  },
                  {
                    label: "Quality Analysis",
                    hash: orderDetails.analysis?.analysisHash || "Pending",
                    timestamp: orderDetails.analysis?.timestamp
                      ? formattedDate(orderDetails.analysis.timestamp)
                      : "Pending",
                  },
                  {
                    label: "Crystal Fusion Pickup",
                    hash: orderDetails.cfShipping?.cfShippingHash || "Pending",
                    timestamp: orderDetails.cfShipping?.timestamp
                      ? formattedDate(orderDetails.cfShipping.timestamp)
                      : "Pending",
                  },
                  {
                    label: "Certificate Issued",
                    hash:
                      orderDetails.certificate?.certificatesHashes?.length > 0
                        ? orderDetails.certificate.certificatesHashes[
                            orderDetails.certificate.certificatesHashes.length -
                              1
                          ]
                        : "Pending",
                    timestamp: orderDetails.certificate?.timestamp
                      ? formattedDate(orderDetails.certificate.timestamp)
                      : "Pending",
                  },
                  {
                    label: "Shipped to Belgium",
                    hash:
                      orderDetails.shippingTwo?.shippingTwoHash || "Pending",
                    timestamp: orderDetails.shippingTwo?.timestamp
                      ? formattedDate(orderDetails.shippingTwo.timestamp)
                      : "Pending",
                  },
                  {
                    label: "Final Delivery",
                    hash:
                      orderDetails.finalDelivery?.finalDeliveryHash ||
                      "Pending",
                    timestamp: orderDetails.finalDelivery?.timestamp
                      ? formattedDate(orderDetails.finalDelivery.timestamp)
                      : "Pending",
                  },
                ];

                autoTable(doc, {
                  startY: 45,
                  head: [["Step", "Transaction Hash", "Timestamp"]],
                  body: stepData.map((step) => [
                    step.label,
                    step.hash,
                    step.timestamp,
                  ]),
                  styles: { fontSize: 10 },
                  headStyles: { fillColor: [22, 119, 255] },
                });

                doc.save(`Order_${orderDetails.id}_Report.pdf`);
              }}
            >
              Download Full Report (PDF)
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
