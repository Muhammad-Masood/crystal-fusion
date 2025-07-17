import type React from "react";
import { Order } from "@/lib/interfaces";
import { AdminDashboard } from "../components/AdminDashboard";
import { contractReadOnly } from "@/lib/utils";

export default async function page() {
  const result = await contractReadOnly.getAllProducts();
  const orders: Order[] = result.map((order: any) => {
    return {
      id: Number(order.id),
      qrHash: order.qrHash,
      CshippingHash: order.CshippingHash,
      CFshippingHash: order.CFshippingHash,
      shippingOneHash: order.shippingOneHash,
      shippingTwoHash: order.shippingTwoHash,
      analysisHASH: order.analysisHASH,
      certificateHash: order.certificateHash,
      finalDeliveryHash: order.finalDeliveryHash,
      timestamp: Number(order.timestamp.toString()),
    };
  });
  console.log("Orders: ", orders);
  return <AdminDashboard orders={orders} />;
}
