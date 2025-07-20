import { Card, CardContent } from "@/components/ui/card";
import { QrCode } from "lucide-react";
import { TrackInner } from "./TrackInner";
import { Order } from "@/lib/interfaces";

export const Track = ({ orders }: { orders: Order[] }) => {
  return (
    <div className="max-w-2xl mx-auto" id="track">
      <Card className="border-0 shadow-xl bg-white/70 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-6">
            <QrCode className="h-12 w-12 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Track Your Product
            </h2>
          </div>

          <TrackInner orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
};
