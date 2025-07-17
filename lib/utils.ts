import { clsx, type ClassValue } from "clsx";
import { ethers } from "ethers";
import { twMerge } from "tailwind-merge";
import { contractABI, contractAddress } from "./contract";
import { createThirdwebClient } from "thirdweb";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const arbitrumSepoliaRpc = "https://arbitrum-sepolia-rpc.publicnode.com";
export const provider = new ethers.JsonRpcProvider(arbitrumSepoliaRpc);

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_TW_CLIENT_ID,
  secretKey: process.env.TW_SECRET_KEY!,
});

export const contractReadOnly = new ethers.Contract(
  contractAddress,
  contractABI,
  provider
);

// PVIQSHTF9PB44VDAAAGC3ESKAFH1XPBYS2
