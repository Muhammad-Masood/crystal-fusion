"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface Order {
  id: string;
  customer: string;
  product: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  amount: number;
  date: string;
  trackingId: string;
}

interface OverviewMetric {
  title: string;
  value: string;
//   change: string;
//   trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("today");

  // Mock data
  const overviewMetrics: OverviewMetric[] = [
    {
      title: "Total Orders",
      value: "247",
    //   change: "+12.5%",
    //   trend: "up",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: "Certificates Issued",
      value: "1,834",
    //   change: "+8.2%",
    //   trend: "up",
      icon: <Award className="h-5 w-5" />,
    },
    {
      title: "Pending Shipments",
      value: "89",
    //   change: "-3.1%",
    //   trend: "down",
      icon: <Truck className="h-5 w-5" />,
    },
    {
      title: "Active Users",
      value: "12,456",
    //   change: "+15.3%",
    //   trend: "up",
      icon: <Users className="h-5 w-5" />,
    },
  ];

  const orders: Order[] = [
    {
      id: "ORD-001",
      customer: "John Smith",
      product: "Premium Wireless Headphones",
      status: "processing",
      amount: 299.99,
      date: "2024-01-20",
      trackingId: "VCH-ABC123XYZ",
    },
    {
      id: "ORD-002",
      customer: "Sarah Johnson",
      product: "Smart Watch Pro",
      status: "shipped",
      amount: 449.99,
      date: "2024-01-20",
      trackingId: "VCH-DEF456ABC",
    },
    {
      id: "ORD-003",
      customer: "Mike Chen",
      product: "Bluetooth Speaker",
      status: "delivered",
      amount: 129.99,
      date: "2024-01-19",
      trackingId: "VCH-GHI789DEF",
    },
    {
      id: "ORD-004",
      customer: "Emily Davis",
      product: "Laptop Stand",
      status: "pending",
      amount: 79.99,
      date: "2024-01-20",
      trackingId: "VCH-JKL012GHI",
    },
    {
      id: "ORD-005",
      customer: "David Wilson",
      product: "Wireless Charger",
      status: "processing",
      amount: 59.99,
      date: "2024-01-20",
      trackingId: "VCH-MNO345JKL",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: <Clock className="h-3 w-3" />,
      },
      processing: {
        color: "bg-blue-100 text-blue-800",
        icon: <RefreshCw className="h-3 w-3" />,
      },
      shipped: {
        color: "bg-purple-100 text-purple-800",
        icon: <Truck className="h-3 w-3" />,
      },
      delivered: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: <AlertCircle className="h-3 w-3" />,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge
        variant="secondary"
        className={`${config.color} flex items-center gap-1`}
      >
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.trackingId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar */}
        <Sidebar className="border-r border-slate-200">
          <SidebarHeader className="border-b border-slate-200 p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  CrystalFusion
                </h2>
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
                      <a href="#" className="flex items-center space-x-3">
                        <Truck className="h-4 w-4" />
                        <span>Shipments</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#" className="flex items-center space-x-3">
                        <Award className="h-4 w-4" />
                        <span>Certificates</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {/* <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#" className="flex items-center space-x-3">
                        <Mail className="h-4 w-4" />
                        <span>Emails</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem> */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="#" className="flex items-center space-x-3">
                        <Database className="h-4 w-4" />
                        <span>Blockchain Logs</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <SidebarInset className="flex-1">
          <div className="flex flex-col">
            {/* Header */}
            <header className="flex h-16 items-center gap-4 border-b border-slate-200 bg-white px-6">
              <SidebarTrigger />
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-slate-900">
                  Dashboard Overview
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </header>

            {/* Main Dashboard Content */}
            <main className="flex-1 p-6 space-y-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {overviewMetrics.map((metric, index) => (
                  <Card
                    key={index}
                    className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-slate-600">
                        {metric.title}
                      </CardTitle>
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <div className="text-blue-600">{metric.icon}</div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-slate-900 mb-1">
                        {metric.value}
                      </div>
                      {/* <div className="flex items-center text-sm">
                        {metric.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : metric.trend === "down" ? (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        ) : null}
                        <span
                          className={
                            metric.trend === "up"
                              ? "text-green-600"
                              : metric.trend === "down"
                              ? "text-red-600"
                              : "text-slate-500"
                          }
                        >
                          {metric.change}
                        </span>
                        <span className="text-slate-500 ml-1">
                          from yesterday
                        </span>
                      </div> */}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Search and Filters */}
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Active Orders
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
                      <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                      >
                        <SelectTrigger className="w-40 border-slate-300">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                      >
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="rounded-lg border border-slate-200 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="font-semibold text-slate-700">
                            Order ID
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Customer
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Product
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Amount
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Date
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700">
                            Tracking ID
                          </TableHead>
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
                              {order.customer}
                            </TableCell>
                            <TableCell className="text-slate-700">
                              {order.product}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(order.status)}
                            </TableCell>
                            <TableCell className="font-medium text-slate-900">
                              ${order.amount}
                            </TableCell>
                            <TableCell className="text-slate-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {order.date}
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm text-slate-600">
                              {order.trackingId}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
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
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Order
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer">
                                    <Package className="h-4 w-4 mr-2" />
                                    Track Package
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="cursor-pointer text-red-600">
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
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="bg-transparent"
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="bg-transparent"
                      >
                        Next
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
}
