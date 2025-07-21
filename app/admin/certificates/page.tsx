import AdminProtectedPage from "@/app/components/AdminAccess";
import { CertificatesManagement } from "@/app/components/Certificates";
import { Order } from "@/lib/interfaces";
import { contractReadOnly } from "@/lib/utils";

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
  let totalCertificatesUploaded = 0;
  orders.forEach((order) => {
    totalCertificatesUploaded += order.certificate.certificatesHashes.length;
  });

  let totalAnalysisUploaded = 0;
  orders.forEach((order) => {
    order.analysis.analysisHash ? (totalAnalysisUploaded += 1) : null;
  });
  return (
    <AdminProtectedPage>
      <CertificatesManagement
        orders={orders}
        totalAnalysisUploaded={totalAnalysisUploaded}
        totalCertificatesUploaded={totalCertificatesUploaded}
      />
    </AdminProtectedPage>
  );
}
