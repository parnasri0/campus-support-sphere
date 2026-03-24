import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Clock, Users, DollarSign, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Ride, RideRequest } from "@/types/rides";
import { addItem, getItems, generateId, getCurrentUser } from "@/lib/store";

interface BrowseRidesProps {
  rides: Ride[];
  onRequested: () => void;
}

const pricingLabels: Record<string, string> = { free: "Free", per_seat: "Per Seat", split: "Split Equally" };
const genderLabels: Record<string, string> = { any: "Any Gender", male: "Male Only", female: "Female Only" };

export function BrowseRides({ rides, onRequested }: BrowseRidesProps) {
  const user = getCurrentUser();

  const handleRequest = (rideId: string) => {
    const requests = getItems<RideRequest>("ride_requests");
    if (requests.some(r => r.ride_id === rideId && r.passenger_id === user.id)) {
      toast.error("You already requested this ride"); return;
    }
    addItem("ride_requests", {
      id: generateId(), ride_id: rideId, passenger_id: user.id,
      passenger_email: user.email, status: "pending", created_at: new Date().toISOString(),
    });
    toast.success("Ride requested! The driver will review your request.");
    onRequested();
  };

  const available = rides.filter(r => r.user_id !== user.id);

  if (available.length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">No rides available yet</p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="space-y-4">
        {available.map((ride, index) => (
          <motion.div key={ride.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-success" />
                    <div className="w-0.5 h-8 bg-border" />
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{ride.from_location}</p>
                    <div className="h-4" />
                    <p className="font-medium text-foreground">{ride.to_location}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{ride.departure_time} → {ride.expected_arrival}</span>
                  <span className="flex items-center gap-1"><Car className="h-3.5 w-3.5" />{ride.vehicle}</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{ride.seats} seats</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs"><DollarSign className="h-3 w-3 mr-1" />{pricingLabels[ride.pricing_method] || ride.pricing_method}</Badge>
                  <Badge variant="outline" className="text-xs"><UserCheck className="h-3 w-3 mr-1" />{genderLabels[ride.gender_preference] || ride.gender_preference}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-3">Posted by {ride.user_email || "Student"}</p>
                <Button className="w-full" onClick={() => handleRequest(ride.id)}>Book Now</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}
