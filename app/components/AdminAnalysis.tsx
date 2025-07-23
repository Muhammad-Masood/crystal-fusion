"use client";

import { useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/button";
import { client } from "@/lib/utils";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { useActiveAccount } from "thirdweb/react";
import { upload } from "thirdweb/storage";
import { contractAddress } from "@/lib/contract";
import { arbitrumSepolia } from "thirdweb/chains";
import { useRouter } from "next/navigation";
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
import Link from "next/link";
import { Award, Package, Shield, Truck, Users } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

const ELEMENT_COLORS: any = {
  Carbon: "#ff4d4f",
  Oxygen: "#1890ff",
  Nitrogen: "#52c41a",
  Hydrogen: "#faad14",
  Sulfur: "#722ed1",
};

export default function AnalysisForm() {
  const [composition, setComposition] = useState<any>({
    Carbon: "",
    Oxygen: "",
    Nitrogen: "",
    Hydrogen: "",
    Sulfur: "",
  });
  const [orderId, setOrderId] = useState("");
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chartRef = useRef(null);
  const activeAccount = useActiveAccount();
  const router = useRouter();

  const handleChange = (element: string, value: string) => {
    setComposition((prev: any) => ({ ...prev, [element]: value }));
  };

  const generatePDF = async () => {
    if (!orderId) return alert("Please enter a valid Order ID");
    if (!activeAccount) return alert("Please connect your wallet");

    const chartEl = chartRef.current;
    if (!chartEl) return;

    setIsLoading(true);
    try {
      const canvas = await html2canvas(chartEl);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      pdf.setFontSize(18);
      pdf.text("Crystal Fusion - Elemental Analysis Report", 15, 20);
      pdf.setFontSize(12);
      pdf.text(`Order ID: ${orderId}`, 15, 30);

      let y = 40;
      Object.entries(composition).forEach(([el, val]) => {
        pdf.text(`${el}: ${val}%`, 15, y);
        y += 8;
      });

      pdf.addImage(imgData, "PNG", 15, y + 10, 180, 90);
      const blob = pdf.output("blob");

      const uri = await upload({
        client: client,
        files: [new File([blob], "analysis.pdf")],
      });

      setIpfsUrl(uri);

      const contract = getContract({
        address: contractAddress,
        chain: arbitrumSepolia,
        client: client,
      });

      const transaction = prepareContractCall({
        contract,
        method: "function updateAnalysisHASH(uint256 id, string _hash)",
        params: [BigInt(orderId), uri],
      });

      const { transactionHash } = await sendTransaction({
        account: activeAccount,
        transaction,
      });

      alert(`Success! Tx: ${transactionHash}`);
      router.refresh();
    } catch (err) {
      console.error("Error uploading or storing hash:", err);
      alert("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = {
    labels: Object.keys(composition),
    datasets: [
      {
        data: Object.values(composition).map((v: any) => parseFloat(v) || 0),
        backgroundColor: Object.keys(composition).map(
          (key) => ELEMENT_COLORS[key]
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50 w-full">
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
                    <SidebarMenuButton asChild isActive>
                      <Link
                        href="/admin/analysis"
                        className="flex items-center space-x-3"
                      >
                        <Award className="h-4 w-4" />
                        <span className="text-sm">Analysis</span>
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
                        <span className="text-sm">Roles</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1 w-full">
          <div className="flex flex-col min-h-screen">
            <header className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-200 bg-white px-4 sm:px-6 py-4 w-full">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <SidebarTrigger className="shrink-0" />
                <h1 className="text-lg sm:text-xl font-semibold text-slate-900">
                  Order Analysis
                </h1>
              </div>
            </header>

            <main className="w-full px-4 sm:px-6 py-6">
              <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
                <h2 className="text-xl font-semibold mb-6 text-center">
                  Elemental Composition (COHNS)
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-semibold mb-1">
                    Order ID
                  </label>
                  <input
                    type="number"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full px-3 py-2 border rounded shadow-sm"
                    placeholder="Enter Order ID"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {Object.keys(composition).map((element) => (
                    <div key={element}>
                      <label className="block text-sm font-semibold mb-1">
                        {element}
                      </label>
                      <input
                        type="number"
                        value={composition[element]}
                        onChange={(e) => handleChange(element, e.target.value)}
                        className="w-full px-3 py-2 border rounded shadow-sm"
                        placeholder={`Enter ${element} %`}
                        min={0}
                        max={100}
                      />
                    </div>
                  ))}
                </div>

                <div
                  ref={chartRef}
                  className="bg-gray-50 p-4 rounded shadow mb-6 w-full max-w-sm mx-auto"
                >
                  <Pie data={chartData} />
                </div>

                <div className="text-center">
                  <Button onClick={generatePDF} disabled={isLoading}>
                    {isLoading ? "Uploading..." : "Generate & Upload PDF"}
                  </Button>
                </div>

                {ipfsUrl && (
                  <p className="mt-4 text-sm text-green-700 text-center">
                    Uploaded to IPFS:{" "}
                    <a
                      href={`https://ipfs.io/ipfs/${ipfsUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View PDF
                    </a>
                  </p>
                )}
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
