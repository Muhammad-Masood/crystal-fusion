import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  QrCode,
  Truck,
  CheckCircle,
  Package,
  Globe,
  Lock,
  ShieldCheck,
  Search,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { Hero } from "./components/Hero";
import { client, contractReadOnly } from "@/lib/utils";
import { Order } from "@/lib/interfaces";
import { resolveScheme } from "thirdweb/storage";
import { Suspense } from "react";

export default async function page() {
  const result = await contractReadOnly.getAllProducts();
  console.log("result: ", result);
  let orders: Order[] = [];
  for (const order of result) {
    const orderToPush: Order = {
      id: Number(order.id),
      qrHash: order.qrHash,
      csShipping: {
        csShippingHash: order.csShipping.csShippingHash,
        timestamp: Number(order.csShipping.timestamp.toString()),
      },
      analysis: {
        analysisHash: order.analysis.analysisHash,
        timestamp: Number(order.analysis.timestamp.toString()),
      },
      cfShipping: {
        cfShippingHash: order.cfShipping.cfShippingHash,
        timestamp: Number(order.cfShipping.timestamp.toString()),
      },
      certificate: {
        certificatesHashes: order.certificate.certificatesHashes,
        timestamp: Number(order.certificate.timestamp.toString()),
      },
      shippingTwo: {
        shippingTwoHash: order.shippingTwo.shippingTwoHash,
        timestamp: Number(order.shippingTwo.timestamp.toString()),
      },
      finalDelivery: {
        finalDeliveryHash: order.finalDelivery.finalDeliveryHash,
        timestamp: Number(order.finalDelivery.timestamp.toString()),
      },
      timestamp: Number(order.timestamp.toString()),
    };

    const orderAnalysisHash = order.analysis.analysisHash;
    if (orderAnalysisHash) {
      console.log(orderAnalysisHash);
      const url = await resolveScheme({
        uri: orderAnalysisHash,
        client: client,
      });
      console.log("URL: ", url);
      orderToPush.analysis.analysisHash = url;
    }
    const orderCertificateHashes = order.certificate.certificatesHashes;
    if (orderCertificateHashes.length > 0) {
      for (const hash of orderCertificateHashes) {
        const url = await resolveScheme({
          uri: orderAnalysisHash,
          client: client,
        });
        console.log("URL: ", url);
        orderToPush.certificate.certificatesHashes.push(url);
      }
    }
    orders.push(orderToPush);
  }

  console.log("Orders: ", orders);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Suspense fallback={<div>Loading hero...</div>}>
      <Hero orders={orders} />
      </Suspense>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our blockchain-powered verification system ensures complete
              transparency throughout your product's journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1: Order */}
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-10 w-10 text-blue-600" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white">
                  1
                </Badge>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                Order
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Place your order and receive a unique blockchain-verified QR
                code that links to your product's digital identity.
              </p>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <ArrowRight className="h-6 w-6 text-slate-400" />
              </div>
            </div>

            {/* Step 2: Verified */}
            <div className="text-center relative">
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-green-600 text-white">
                  2
                </Badge>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                Verified
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Every step of manufacturing and quality control is recorded on
                the blockchain, creating an immutable verification trail.
              </p>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <ArrowRight className="h-6 w-6 text-slate-400" />
              </div>
            </div>

            {/* Step 3: Delivered */}
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="h-10 w-10 text-purple-600" />
                </div>
                <Badge className="absolute -top-2 -right-2 bg-purple-600 text-white">
                  3
                </Badge>
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-4">
                Delivered
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Track your product in real-time from warehouse to your doorstep
                with complete transparency and authenticity guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Trust CrystalFusion?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built on cutting-edge blockchain technology to provide unmatched
              security and transparency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Blockchain Secured */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Blockchain Secured
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Every transaction is recorded on an immutable blockchain
                  ledger, ensuring complete data integrity and security.
                </p>
              </CardContent>
            </Card>

            {/* Tamper-Proof */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Tamper-Proof
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Cryptographic hashing ensures that once data is recorded, it
                  cannot be altered or manipulated by any party.
                </p>
              </CardContent>
            </Card>

            {/* Global Shipping */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">
                  Global Shipping
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Track products across international borders with real-time
                  updates and customs verification at every checkpoint.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold">CrystalFusion</span>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Revolutionizing product verification through blockchain
                technology. Ensuring authenticity, transparency, and trust in
                every transaction.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <span className="text-slate-300">
                    contact@CrystalFusion.com
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-blue-400" />
                  <span className="text-slate-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-blue-400" />
                  <span className="text-slate-300">San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    Track Product
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-300 hover:text-blue-400 transition-colors"
                  >
                    GDPR Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              © {new Date().getFullYear()} CrystalFusion. All rights reserved.
              Powered by blockchain technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
