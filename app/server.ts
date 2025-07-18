"use server";

import { contractABI, contractAddress } from "@/lib/contract";
import { OrderFormData, OrderResult } from "@/lib/interfaces";
import { provider } from "@/lib/utils";
import { ethers } from "ethers";

export const addRecords = async (formData: OrderFormData) => {
  try {
    const formDataString = JSON.stringify(formData);
    const qrHash = ethers.keccak256(ethers.toUtf8Bytes(formDataString));
    console.log("QR Hash: ", qrHash);
    const signer = new ethers.Wallet(process.env.OWNER_PRIVATE_KEY!, provider);
    console.log("Signer: ", signer);
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const contractResult = await contract.addRecords(qrHash);
    console.log("Contract result: ", contractResult);
    const result: OrderResult = {
      orderId: formData.orderId,
      qrCodeData: qrHash,
      timestamp: formData.creationTime,
      hash: contractResult.hash,
    };
    console.log("Result: ", result);
    return result;
  } catch (error) {
    console.log("Error storing order form data: ", error);
    return null;
  }
};