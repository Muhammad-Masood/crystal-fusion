"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  FlaskConical,
  Truck,
  Shield,
  CheckCircle,
  Camera,
  ExternalLink,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useSearchParams } from "next/navigation";
import { Order } from "@/lib/interfaces";
import { contractReadOnly } from "@/lib/utils";
import { QRScanner } from "./QRScanner";
import { markOrderAsReceived } from "../server";

export function TrackInner({ orders }: { orders: Order[] }) {
  const params = useSearchParams();
  const [orderID, setOrderID] = useState<number | null>(null);
  const [txHash, setTxHash] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReceived, setIsReceived] = useState<boolean | null>(null);

  const formattedDate = (ts: number) =>
    new Date(ts * 1000).toLocaleString("en-US");

  const fetchOrderDetails = async (id: number) => {
    const order = orders.find((o) => o.id === id);
    if (order) {
      setOrderDetails(order);
      setOrderID(id);
      const received = await contractReadOnly.isOrderReceived(BigInt(id));
      setIsReceived(received);
    } else {
      alert("Order not found.");
    }
  };

  useEffect(() => {
    const id = params.get("orderID");
    const hash = params.get("txHash");
    if (id && hash) {
      fetchOrderDetails(Number(id));
      setTxHash(hash);
    }
  }, [params]);

  const handleTrackingInput = async () => {
    if (!orderID) return;
    setIsLoading(true);
    await fetchOrderDetails(orderID);
    setIsLoading(false);
  };

  const handleScanResult = (data: string) => {
    try {
      const url = new URL(data);
      const id = url.searchParams.get("orderID");
      const hash = url.searchParams.get("txHash");
      if (id && hash) {
        fetchOrderDetails(Number(id));
        setTxHash(hash);
        setShowScanner(false);
      } else {
        alert("Invalid QR code.");
      }
    } catch {
      alert("Failed to parse QR code.");
    }
  };

  const markAsReceived = async () => {
    if (!orderDetails) return;
    try {
      await markOrderAsReceived(orderDetails.id);
      setIsReceived(true);
      alert("Order marked as received.");
    } catch (err) {
      console.error(err);
      alert("Failed to mark as received.");
    }
  };

  const steps = [
    {
      label: "Customer Pickup",
      hash: orderDetails?.csShipping?.csShippingHash || "",
      timestamp: orderDetails?.csShipping?.timestamp || 0,
      icon: <Package className="w-5 h-5" />,
    },
    {
      label: "Quality Analysis",
      hash: orderDetails?.analysis?.analysisHash || "",
      timestamp: orderDetails?.analysis?.timestamp || 0,
      icon: <FlaskConical className="w-5 h-5" />,
    },
    {
      label: "Crystal Fusion Pickup",
      hash: orderDetails?.cfShipping?.cfShippingHash || "",
      timestamp: orderDetails?.cfShipping?.timestamp || 0,
      icon: <Truck className="w-5 h-5" />,
    },
    {
      label: "Certificate Issued",
      hash: orderDetails?.certificate?.certificatesHashes || [""],
      timestamp: orderDetails?.certificate?.timestamp || 0,
      icon: <Shield className="w-5 h-5" />,
    },
    {
      label: "Shipped to Belgium",
      hash: orderDetails?.shippingTwo?.shippingTwoHash || "",
      timestamp: orderDetails?.shippingTwo?.timestamp || 0,
      icon: <Truck className="w-5 h-5" />,
    },
    {
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
          {/* QR Scanner */}
          <div className="mb-4 text-center">
            <Button
              variant="outline"
              onClick={() => setShowScanner(!showScanner)}
            >
              <Camera className="w-4 h-4 mr-2" />
              {showScanner ? "Close Scanner" : "Scan QR Code"}
            </Button>
          </div>

          {showScanner && (
            <QRScanner
              onScan={handleScanResult}
              onClose={() => setShowScanner(false)}
            />
          )}

          {!orderDetails && (
            <div className="flex flex-col md:flex-row gap-2 mb-4">
              <Input
                placeholder="Enter Order ID"
                type="number"
                value={orderID || ""}
                onChange={(e) => setOrderID(Number(e.target.value))}
              />
              <Button onClick={handleTrackingInput}>Fetch</Button>
            </div>
          )}

          {isLoading && <p className="text-sm text-gray-600">Loading...</p>}

          {orderDetails && (
            <>
              <Badge className="mb-4">
                Created: {formattedDate(orderDetails.timestamp)}
              </Badge>

              <div className="space-y-4">
                {steps.map((step, i) => (
                  <Card key={i} className="p-4 border-l-4 border-blue-600">
                    <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-2">
                      <div className="flex items-center gap-2">
                        {step.icon}
                        <span className="font-medium">{step.label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {step.timestamp
                          ? formattedDate(step.timestamp)
                          : "Not completed"}
                      </span>
                    </div>
                    <div className="mt-2 text-sm break-words text-gray-600">
                      {Array.isArray(step.hash) ? (
                        step.hash.map((h, i) => (
                          <Button
                            key={i}
                            variant="link"
                            size="sm"
                            onClick={() => window.open(h, "_blank")}
                            className="p-0 text-blue-600"
                          >
                            {h} <ExternalLink className="w-4 h-4 ml-1" />
                          </Button>
                        ))
                      ) : step.hash ? (
                        <Button
                          variant="link"
                          size="sm"
                          onClick={() =>
                            window.open(step.hash as string, "_blank")
                          }
                          className="p-0 text-blue-600"
                        >
                          {step.hash} <ExternalLink className="w-4 h-4 ml-1" />
                        </Button>
                      ) : (
                        "Pending"
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {txHash && (
                <div className="mt-4">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() =>
                      window.open(
                        `https://sepolia.arbiscan.io/tx/${txHash}`,
                        "_blank"
                      )
                    }
                    className="p-0 text-blue-600"
                  >
                    View TX: {txHash}
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-6 space-y-2">
                {!isReceived && (
                  <Button onClick={markAsReceived} className="w-full">
                    Confirm Package Received
                  </Button>
                )}

                <Button
                  className="w-full"
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

                    const rows = steps.map((s) => [
                      s.label,
                      Array.isArray(s.hash)
                        ? s.hash.join(", ")
                        : s.hash || "Pending",
                      s.timestamp ? formattedDate(s.timestamp) : "Pending",
                    ]);

                    autoTable(doc, {
                      startY: 45,
                      head: [["Step", "Transaction Hash", "Timestamp"]],
                      body: rows,
                      styles: { fontSize: 10 },
                      headStyles: { fillColor: [22, 119, 255] },
                    });

                    doc.save(`Order_${orderDetails.id}_Report.pdf`);
                  }}
                >
                  Download Full Report (PDF)
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
