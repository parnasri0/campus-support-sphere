import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Car, Users, DollarSign, Plus } from "lucide-react";
import { Ride } from "@/types/rides";

const pricingLabels: Record<string, string> = {
  free: "Free",
  per_seat: "Per Seat",
  split: "Split",
};

interface MyPostedRidesProps {
  rides: Ride[];
  onOfferClick: () => void;
}

export function MyPostedRides({ rides, onOfferClick }: MyPostedRidesProps) {
  if (rides.length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h3 className="font-semibold text-foreground mb-2">No rides posted yet</h3>
        <Button onClick={onOfferClick}>
          <Plus className="h-4 w-4 mr-2" />Offer a Ride
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {rides.map((ride) => (
        <Card key={ride.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-success" />
              <span className="font-medium text-foreground">{ride.from_location}</span>
              <span className="text-muted-foreground">→</span>
              <MapPin className="h-4 w-4 text-destructive" />
              <span className="font-medium text-foreground">{ride.to_location}</span>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{ride.departure_time} → {ride.expected_arrival}</span>
              <span className="flex items-center gap-1"><Car className="h-3.5 w-3.5" />{ride.vehicle}</span>
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{ride.seats} seats</span>
              <Badge variant="secondary" className="text-xs">
                <DollarSign className="h-3 w-3 mr-0.5" />{pricingLabels[ride.pricing_method] || ride.pricing_method}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
