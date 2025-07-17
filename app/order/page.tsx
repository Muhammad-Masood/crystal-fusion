import { Contract, ethers } from "ethers";
import {
  useActiveAccount,
  useActiveWallet,
  useSendTransaction,
  useWalletInfo,
} from "thirdweb/react";
import { contractABI, contractAddress } from "@/lib/contract";
import { getContract, prepareContractCall } from "thirdweb";
import { arbitrumSepolia } from "thirdweb/chains";
import { client, provider } from "@/lib/utils";
import OrderForm from "../components/OrderForm";

export default async function pahge() {
  // const signer = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY!, provider);
  // console.log(signer);

  return <OrderForm />;
}
