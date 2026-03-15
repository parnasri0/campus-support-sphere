import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Clock, MapPin, Phone, Users, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { RideRequest } from "@/types/rides";

export function MyRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("ride_requests")
        .select("*, rides(*)")
        .eq("passenger_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) setRequests(data as RideRequest[]);
      setLoading(false);
    };
    fetch();
  }, [user]);

  if (loading) {
    return <p className="text-center text-muted-foreground py-8">Loading...</p>;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">You haven't requested any rides yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <Card key={req.id}>
          <CardContent className="p-4">
            {/* Status badge */}
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-muted-foreground">Request Status</span>
              <Badge
                variant={req.status === "pending" ? "secondary" : req.status === "accepted" ? "default" : "destructive"}
                className="capitalize"
              >
                {req.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                {req.status}
              </Badge>
            </div>

            {/* Ride details */}
            {req.rides && (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <div className="w-0.5 h-6 bg-border" />
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{req.rides.from_location}</p>
                    <div className="h-2" />
                    <p className="font-medium text-foreground text-sm">{req.rides.to_location}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-2">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{req.rides.departure_time} → {req.rides.expected_arrival}</span>
                  <span className="flex items-center gap-1"><Car className="h-3 w-3" />{req.rides.vehicle}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{req.rides.seats} seats</span>
                </div>

                {/* Show driver contact if accepted */}
                {req.status === "accepted" && (
                  <div className="mt-4 p-3 bg-success/10 rounded-xl border border-success/20">
                    <p className="text-sm font-semibold text-success mb-1">🎉 Request Accepted!</p>
                    <p className="text-sm text-foreground">Driver: {req.rides.user_email || "Student"}</p>
                    <p className="text-sm text-foreground flex items-center gap-1 mt-1">
                      <Phone className="h-3.5 w-3.5" />Contact: {req.rides.contact_number}
                    </p>
                  </div>
                )}

                {req.status === "rejected" && (
                  <div className="mt-4 p-3 bg-destructive/10 rounded-xl border border-destructive/20">
                    <p className="text-sm text-destructive">This request was declined by the driver.</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
