import { clsx, type ClassValue } from "clsx";
import { ethers } from "ethers";
import { twMerge } from "tailwind-merge";
import { contractABI, contractAddress } from "./contract";
import { createThirdwebClient } from "thirdweb";
import { upload, download } from "thirdweb/storage";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// const arbitrumSepoliaRpc = "https://api.zan.top/arb-sepolia";
// const arbitrumSepoliaRpc = "https://endpoints.omniatech.io/v1/arbitrum/sepolia/public";
const arbitrumSepoliaRpc = "https://api.zan.top/arb-sepolia"
// https://arbitrum-sepolia-rpc.publicnode.com
// const arbitrumSepoliaRpc = "https://arbitrum-sepolia.gateway.tenderly.co";

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

export const ADMIN_EMAILS = ["development.masood@gmail.com","info@midaslifestyle.nl", "surentechdev@gmail.com"]