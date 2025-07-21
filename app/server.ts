"use server";

import { contractABI, contractAddress } from "@/lib/contract";
import { OrderFormData, OrderResult } from "@/lib/interfaces";
import { provider } from "@/lib/utils";
import { ethers } from "ethers";
import { Resend } from "resend";
import { EmailTemplate } from "./email-template";

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
    const orderId = await contract.totalOrders();
    const result: OrderResult = {
      orderId: Number(orderId),
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

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  orderId: number,
  stageId: string,
  title: string,
  desc: string,
  tracking: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: ["development.masood@gmail.com"],
      subject: title,
      react: EmailTemplate({ stageId, tracking }),
    });
    if (error) {
      console.log("Error sending email: ", error);
      return error;
    }
    return data;
  } catch (error) {
    console.log("Error sending email: ", error);
  }
}
