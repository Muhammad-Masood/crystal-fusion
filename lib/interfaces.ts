type CsShipping = {
  csShippingHash: string;
  timestamp: number;
};
export type Analysis = {
  analysisHash: string;
  timestamp: number;
};
type CFShipping = {
  cfShippingHash: string;
  timestamp: number;
};
export type Certificate = {
  certificatesHashes: string[];
  timestamp: number;
};
type ShippingTwo = {
  shippingTwoHash: string;
  timestamp: number;
};
type FinalDelivery = {
  finalDeliveryHash: string;
  timestamp: number;
};

export interface Order {
  id: number;
  qrHash: string;
  csShipping: CsShipping;
  analysis: Analysis;
  cfShipping: CFShipping;
  certificate: Certificate;
  shippingTwo: ShippingTwo;
  finalDelivery: FinalDelivery;
  timestamp: number;
}

export interface OverviewMetric {
  title: string;
  value: string;
  //   change: string;
  //   trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

export interface OrderFormData {
  // orderId: string;
  // Personal Information
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;

  // Parcel Pickup
  pickupDate: Date | undefined;
  pickupTime: "before-noon" | "after-noon" | "";

  // Source Material
  sourceMaterial: string[];
  sourceMaterialOther: string;
  quantity: string;

  // Diamond Specifications
  caratSizes: { [key: string]: number };
  cutPreference: string;
  colorPreference: string;
  settingPreference: string[];

  // Special Requests
  specialRequests: string;

  // Terms & Acknowledgment
  signatureName: string;
  signatureDate: Date | undefined;
  termsAccepted: boolean;

  creationTime: string;
}

export interface OrderResult {
  orderId: number;
  qrCodeData: string;
  timestamp: string;
  hash: string;
}

export interface EmailTemplateProps {
  stageId: string;
  tracking: string;
}
