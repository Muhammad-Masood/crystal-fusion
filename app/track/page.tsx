import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { TrackInner } from "../components/TrackInner";
import { client, contractReadOnly } from "@/lib/utils";
import { Analysis, Order } from "@/lib/interfaces";
import { resolveScheme } from "thirdweb/storage";
import { Suspense } from "react";

export default async function page() {
  const result = await contractReadOnly.getAllProducts();
  console.log("result: ", result);
  let orders: Order[] = [];
  for (const order of result) {
    const orderToPush: Order = {
      id: Number(order.id),
      qrHash: order.qrHash,
      csShipping: {
        csShippingHash: order.csShipping.csShippingHash,
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

    const orderAnalysisHash = order.analysis.analysisHash;
    if (orderAnalysisHash) {
      console.log(orderAnalysisHash);
      const url = await resolveScheme({
        uri: orderAnalysisHash,
        client: client,
      });
      console.log("URL: ", url);
      orderToPush.analysis.analysisHash = url;
    }
    const orderCertificateHashes = order.certificate.certificatesHashes;
    if (orderCertificateHashes.length > 0) {
      for (const hash of orderCertificateHashes) {
        const url = await resolveScheme({
          uri: orderAnalysisHash,
          client: client,
        });
        console.log("URL: ", url);
        orderToPush.certificate.certificatesHashes.push(url);
      }
    }
    orders.push(orderToPush);
  }

  console.log("Orders: ", orders);
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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
        <Suspense fallback={<div>Loading tracker...</div>}>
          <TrackInner orders={orders} />
        </Suspense>
      </div>
    </div>
  );
}
