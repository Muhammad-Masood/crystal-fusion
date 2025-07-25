"use server"
const dynamic = 'force-dynamic'

import { Order } from "@/lib/interfaces";
import { AdminDashboard } from "../components/AdminDashboard";
import { contractReadOnly } from "@/lib/utils";
import AdminProtectedPage from "../components/AdminAccess";

export default async function page() {
  const result = await contractReadOnly.getAllProducts();
  console.log("result: ", result);
  const orders: Order[] = result.map((order: Order) => {
    return {
      id: Number(order.id),
      qrHash: order.qrHash,
      Cshipping: {
        cfShippingHash: order.csShipping.csShippingHash,
        timestamp: Number(order.csShipping.timestamp.toString()),
      },
      analysis: {
        analysisHash: order.analysis.analysisHash,
        timestamp: Number(order.analysis.timestamp.toString()),
      },
      cfShipping: {
        cfShippingHash: order.cfShipping.cfShippingHash,
        timestamp: Number(order.cfShipping.timestamp.toString()),
      },
      certificate: {
        certificatesHashes: order.certificate.certificatesHashes,
        timestamp: Number(order.certificate.timestamp.toString()),
      },
      shippingTwo: {
        shippingTwoHash: order.shippingTwo.shippingTwoHash,
        timestamp: Number(order.shippingTwo.timestamp.toString()),
      },
      finalDelivery: {
        finalDeliveryHash: order.finalDelivery.finalDeliveryHash,
        timestamp: Number(order.finalDelivery.timestamp.toString()),
      },
      timestamp: Number(order.timestamp.toString()),
    };
  });
  console.log("Orders: ", orders);
  return (
    <AdminProtectedPage>
      <AdminDashboard orders={orders} />;
    </AdminProtectedPage>
  );
}
