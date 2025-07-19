"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActiveAccount, useSendTransaction } from "thirdweb/react";
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
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800">
            Admin Role Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Grant Admin Role */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Grant Admin Role
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="0xAdminAddress..."
                value={adminAddress}
                onChange={(e) => setAdminAddress(e.target.value)}
              />
              <Button
                className="bg-blue-600 text-white"
                onClick={() =>
                  callContractFunction(
                    "GrantAdminRole",
                    adminAddress,
                    "Admin granted."
                  )
                }
              >
                Grant
              </Button>
            </div>
          </div>

          {/* Revoke Admin Role */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Revoke Admin Role
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="0xAdminAddress..."
                value={adminAddress}
                onChange={(e) => setAdminAddress(e.target.value)}
              />
              <Button
                variant="destructive"
                onClick={() =>
                  callContractFunction(
                    "revokePropertyAdminRole",
                    adminAddress,
                    "Admin revoked."
                  )
                }
              >
                Revoke
              </Button>
            </div>
          </div>

          {/* Transfer Ownership */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Transfer Ownership
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="0xNewOwnerAddress..."
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
              />
              <Button
                className="bg-green-600 text-white"
                onClick={() =>
                  callContractFunction(
                    "TransferOwner",
                    ownerAddress,
                    "Ownership transferred."
                  )
                }
              >
                Transfer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
