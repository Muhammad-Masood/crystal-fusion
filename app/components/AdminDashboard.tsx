"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Package,
  Truck,
  Award,
  Mail,
  Database,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Shield,
  Users,
  Calendar,
  Download,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { Order, OverviewMetric } from "@/lib/interfaces";
import { getContract, prepareContractCall } from "thirdweb";
import { contractAddress } from "@/lib/contract";
import { arbitrumSepolia } from "thirdweb/chains";
import { client } from "@/lib/utils";
import {
  useActiveAccount,
  useActiveWallet,
  useSendTransaction,
} from "thirdweb/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Mock data
const overviewMetrics: OverviewMetric[] = [
  {
    title: "Total Orders",
    value: "247",
    //   change: "+12.5%",
    //   trend: "up",
    icon: <Package className="h-5 w-5" />,
  },
  // {
  //   title: "Certificates Issued",
  //   value: "1,834",
  //   //   change: "+8.2%",
  //   //   trend: "up",
  //   icon: <Award className="h-5 w-5" />,
  // },
  // {
  //   title: "Pending Shipments",
  //   value: "89",
  //   //   change: "-3.1%",
  //   //   trend: "down",
  //   icon: <Truck className="h-5 w-5" />,
  // },
  // {
  //   title: "Active Users",
  //   value: "12,456",
  //   //   change: "+15.3%",
  //   //   trend: "up",
  //   icon: <Users className="h-5 w-5" />,
  // },
];

export const AdminDashboard = ({ orders }: { orders: Order[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");
  const [deletingOrder, setDeletingOrder] = useState<number | null>(null);
  const activeAccount = useActiveAccount();
  const router = useRouter();
  const { mutate: sendTx, data: transactionResult } = useSendTransaction();

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.qrHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.csShipping.csShippingHash
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      order.cfShipping.cfShippingHash
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all";
    return matchesSearch && matchesStatus;
  });

  const handleCancelOrder = async (orderId: number) => {
    try {
      setDeletingOrder(orderId);
      console.log(deletingOrder);
      const orderIndex = orders.findIndex((order) => order.id === orderId);
      if (!activeAccount) {
        alert("Please connect your wallet");
        return;
      }
      const contract = getContract({
        address: contractAddress,
        chain: arbitrumSepolia,
        client: client,
      });

      const transaction = prepareContractCall({
        contract,
        method: "function removeOrders(uint256 index)",
        params: [BigInt(orderIndex)],
      });
      sendTx(transaction);
      console.log("Transaction result: ", transactionResult);
      setDeletingOrder(null);
      router.refresh();
    } catch (error) {
      console.log("Error storing order form data: ", error);
      setDeletingOrder(null);
      return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar */}
        <Sidebar className="border-r border-slate-200 mt-13">
          <SidebarHeader className="border-b border-slate-200 p-4">
            <div className="flex items-center space-x-2">
              {/* <Shield className="h-8 w-8 text-blue-600" /> */}
              <div className="pt-7">
                {/* <h2 className="text-lg font-bold text-slate-900">
                  CrystalFusion
                </h2> */}
                <p className="text-xs text-slate-500">Admin Dashboard</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-600 font-medium">
                Management
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <a href="#" className="flex items-center space-x-3">
                        <Package className="h-4 w-4" />
                        <span>Orders</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href="/admin/shipments"
                        className="flex items-center space-x-3"
                      >
                        <Truck className="h-4 w-4" />
                        <span>Shipments</span>
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
                        <span>Certificates</span>
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
                  {/* <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#" className="flex items-center space-x-3">
                        <Database className="h-4 w-4" />
                        <span>Blockchain Logs</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem> */}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1">
          <div className="flex flex-col w-full min-w-max pl-20">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4">
              {/* Sidebar toggle + title */}
              <div className="flex items-center justify-between w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <SidebarTrigger />
                  <h1 className="text-xl font-semibold text-slate-900">
                    Dashboard Overview
                  </h1>
                </div>
              </div>

              {/* Buttons */}
              {/* <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent w-full sm:w-auto"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                {/* <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button> */}
              {/* </div> */}
            </header>

            {/* Main Dashboard Content */}
            <main className="flex-1 p-4 sm:p-6 space-y-6 w-full max-w-full">
              {/* <main className="flex-1 p-4 sm:p-6 space-y-6 w-full max-w-screen-xl mx-auto"> */}
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewMetrics.map((metric, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle className="text-sm font-medium text-slate-600">
                        {metric.title}
                      </CardTitle>
                      <div className="bg-blue-50 rounded-lg">
                        <div className="text-blue-600">{metric.icon}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {orders.length}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Search and Filters */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search orders, customers, or tracking IDs..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select value={dateFilter} onValueChange={setDateFilter}>
                        <SelectTrigger className="w-32 border-slate-300">
                          <SelectValue placeholder="Date" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Orders Table */}
                  {/* <div className="rounded-lg border border-slate-200 overflow-x-auto"> */}
                  <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
                    <Table className="min-w-[700px]">
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="font-semibold text-slate-700">
                            Order ID
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            QR Hash
                          </TableHead>
                          {/* <TableHead className="font-semibold text-slate-700">
                            Analysis Hash
                          </TableHead> */}
                          <TableHead className="font-semibold text-slate-700">
                            Date
                          </TableHead>
                          {/* <TableHead className="font-semibold text-slate-700">
                            Amount
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Date
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Tracking ID
                          </TableHead> */}
                          <TableHead className="font-semibold text-slate-700 text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.map((order) => (
                          <TableRow
                            key={order.id}
                            className="hover:bg-slate-50"
                          >
                            <TableCell className="font-medium text-slate-900">
                              {order.id}
                            </TableCell>
                            <TableCell className="text-slate-700">
                              {order.qrHash}
                            </TableCell>
                            {/* <TableCell className="text-slate-700">
                              {order.product}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(order.status)}
                            </TableCell> */}
                            {/* <TableCell className="font-medium text-slate-900">
                              {order.analysisHASH}
                            </TableCell> */}
                            <TableCell className="text-slate-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(
                                  order.timestamp * 1000
                                ).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    disabled={deletingOrder == order.id}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48"
                                >
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() =>
                                      router.push(`/admin/shipments`)
                                    }
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Link
                                      href={`/admin/shipments`}
                                      className="flex"
                                    >
                                      <Edit className="h-4 w-4 mr-4" />
                                      Edit Order
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => router.push(`/track`)}
                                  >
                                    <Package className="h-4 w-4 mr-2" />
                                    Track Package
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="cursor-pointer text-red-600"
                                    onClick={() => handleCancelOrder(order.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Cancel Order
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Table Footer */}
                  <div className="flex items-center justify-between mt-4 text-sm text-slate-600">
                    <div>
                      Showing {filteredOrders.length} of {orders.length} orders
                    </div>
                    <div className="flex items-center space-x-2">
                      {/* <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="bg-transparent"
                      >
                        Previous
                      </Button> */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                      >
                        View More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
