"use client";

import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export const QRScanner = ({ onScan, onClose }: QRScannerProps) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: 250,
      },
      false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear().then(onClose);
      },
      (error) => {
        // Optional: Handle scan failure
        console.warn("Scan error:", error);
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [onScan, onClose]);

  return (
    <div className="mt-4">
      <div id="qr-reader" className="w-full" />
    </div>
  );
};
