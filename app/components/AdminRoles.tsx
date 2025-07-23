"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Shield,
  Users,
  Key,
  UserCheck,
  UserX,
  ArrowRightLeft,
} from "lucide-react";
import Link from "next/link";
import { useActiveAccount } from "thirdweb/react";
import { getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { contractABI, contractAddress } from "@/lib/contract";
import { arbitrumSepolia } from "thirdweb/chains";
import { client } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AdminRoles() {
  const [adminAddress, setAdminAddress] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const activeAccount = useActiveAccount();
  const router = useRouter();

  const callContractFunction = async (
    method: string,
    param: string,
    message: string
  ) => {
    if (!activeAccount) {
      alert("Please Connect wallet.");
      return;
    }

    try {
      setIsLoading(true);
      const contract = getContract({
        address: contractAddress,
        chain: arbitrumSepolia,
        client: client,
        abi: contractABI,
      });

      const transaction = prepareContractCall({
        contract,
        method,
        params: [param],
      });

      const { transactionHash } = await sendTransaction({
        account: activeAccount,
        transaction,
      });

      console.log("Transaction hash: ", transactionHash);
      alert(`${message} Transaction hash: ${transactionHash}`);
      setIsLoading(false);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
      alert(`Transaction failed. ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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
                    <SidebarMenuButton asChild isActive>
                      <a
                        href="/admin/roles"
                        className="flex items-center space-x-3"
                      >
                        <Users className="h-4 w-4" />
                        <span className="text-sm">Roles</span>
                      </a>
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
                  Admin Role Management
                </h1>
              </div>
              {/* Wallet Connection Status */}
              <div className="flex items-center gap-2">
                {activeAccount ? (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-mono">
                      {activeAccount.address.slice(0, 6)}...
                      {activeAccount.address.slice(-4)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Wallet Not Connected</span>
                  </div>
                )}
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 sm:p-6 w-full">
              <div className="max-w-4xl mx-auto">
                {/* Warning Card */}
                {!activeAccount && (
                  <Card className="border-orange-200 bg-orange-50 mb-6">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 text-orange-800">
                        <Key className="h-5 w-5" />
                        <span className="font-medium">
                          Wallet Connection Required
                        </span>
                      </div>
                      <p className="text-sm text-orange-700 mt-1">
                        Please connect your wallet to manage admin roles and
                        perform blockchain transactions.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Role Management Cards */}
                <div className="grid gap-6">
                  {/* Grant Admin Role */}
                  <Card className="border-0 shadow-lg bg-white">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <UserCheck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-slate-900">
                            Grant Admin Role
                          </CardTitle>
                          <p className="text-sm text-slate-600">
                            Add administrative privileges to a wallet address
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">
                          Admin Wallet Address
                        </label>
                        <Input
                          placeholder="0xAdminAddress..."
                          value={adminAddress}
                          onChange={(e) => setAdminAddress(e.target.value)}
                          className="font-mono text-sm border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <Button
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                        onClick={() =>
                          callContractFunction(
                            "GrantAdminRole",
                            adminAddress,
                            "Admin role granted successfully!"
                          )
                        }
                        disabled={isLoading || !activeAccount || !adminAddress}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Grant Admin Role
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Revoke Admin Role */}
                  <Card className="border-0 shadow-lg bg-white">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <UserX className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-slate-900">
                            Revoke Admin Role
                          </CardTitle>
                          <p className="text-sm text-slate-600">
                            Remove administrative privileges from a wallet
                            address
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">
                          Admin Wallet Address
                        </label>
                        <Input
                          placeholder="0xAdminAddress..."
                          value={adminAddress}
                          onChange={(e) => setAdminAddress(e.target.value)}
                          className="font-mono text-sm border-slate-300 focus:border-red-500 focus:ring-red-500"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        className="w-full sm:w-auto"
                        onClick={() =>
                          callContractFunction(
                            "revokePropertyAdminRole",
                            adminAddress,
                            "Admin role revoked successfully!"
                          )
                        }
                        disabled={isLoading || !activeAccount || !adminAddress}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <UserX className="h-4 w-4 mr-2" />
                            Revoke Admin Role
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Transfer Ownership */}
                  <Card className="border-0 shadow-lg bg-white">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <ArrowRightLeft className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-semibold text-slate-900">
                            Transfer Ownership
                          </CardTitle>
                          <p className="text-sm text-slate-600">
                            Transfer contract ownership to a new wallet address
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">
                            Warning
                          </span>
                        </div>
                        <p className="text-sm text-amber-700">
                          This action is irreversible. Make sure you trust the
                          new owner address before proceeding.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">
                          New Owner Wallet Address
                        </label>
                        <Input
                          placeholder="0xNewOwnerAddress..."
                          value={ownerAddress}
                          onChange={(e) => setOwnerAddress(e.target.value)}
                          className="font-mono text-sm border-slate-300 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <Button
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
                        onClick={() =>
                          callContractFunction(
                            "TransferOwner",
                            ownerAddress,
                            "Ownership transferred successfully!"
                          )
                        }
                        disabled={isLoading || !activeAccount || !ownerAddress}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <ArrowRightLeft className="h-4 w-4 mr-2" />
                            Transfer Ownership
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Contract Information */}
                <Card className="border-0 shadow-sm bg-slate-50 mt-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-slate-900">
                      Contract Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
                      <span className="text-slate-600">Contract Address:</span>
                      <span className="font-mono text-slate-900">
                        {contractAddress}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
                      <span className="text-slate-600">Network:</span>
                      <span className="text-slate-900">Arbitrum Sepolia</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
