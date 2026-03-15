import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Clock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { RideRequest } from "@/types/rides";

export function DriverRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<RideRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!user) return;
    // Get all rides by this driver, then get their requests
    const { data: myRides } = await supabase
      .from("rides")
      .select("id")
      .eq("user_id", user.id);

    if (!myRides || myRides.length === 0) {
      setRequests([]);
      setLoading(false);
      return;
    }

    const rideIds = myRides.map((r) => r.id);
    const { data, error } = await supabase
      .from("ride_requests")
      .select("*, rides(*)")
      .in("ride_id", rideIds)
      .order("created_at", { ascending: false });

    if (!error && data) setRequests(data as RideRequest[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const handleAction = async (requestId: string, status: "accepted" | "rejected") => {
    const { error } = await supabase
      .from("ride_requests")
      .update({ status })
      .eq("id", requestId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(status === "accepted" ? "Request accepted!" : "Request rejected");
      fetchRequests();
    }
  };

  if (loading) {
    return <p className="text-center text-muted-foreground py-8">Loading...</p>;
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">No ride requests yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((req) => (
        <Card key={req.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                  {(req.passenger_email || "S")[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-foreground">{req.passenger_email || "Student"}</p>
                {req.passenger_gender && (
                  <p className="text-xs text-muted-foreground capitalize">{req.passenger_gender}</p>
                )}
              </div>
              <Badge
                variant={req.status === "pending" ? "secondary" : req.status === "accepted" ? "default" : "destructive"}
                className="capitalize"
              >
                {req.status}
              </Badge>
            </div>

            {/* Ride info */}
            {req.rides && (
              <div className="bg-secondary rounded-xl p-3 text-sm mb-3">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-success" />
                  <span>{req.rides.from_location}</span>
                  <span className="mx-1">→</span>
                  <MapPin className="h-3.5 w-3.5 text-destructive" />
                  <span>{req.rides.to_location}</span>
                </div>
              </div>
            )}

            {req.status === "pending" && (
              <div className="flex gap-2">
                <Button variant="default" className="flex-1 bg-success hover:bg-success/90" onClick={() => handleAction(req.id, "accepted")}>
                  <Check className="h-4 w-4 mr-1" />Accept
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => handleAction(req.id, "rejected")}>
                  <X className="h-4 w-4 mr-1" />Reject
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
