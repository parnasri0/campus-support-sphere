import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Car, MapPin, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Ride {
  id: string;
  user_id: string;
  from_location: string;
  to_location: string;
  departure_time: string;
  vehicle: string;
  seats: number;
  created_at: string;
  user_email?: string;
}

const locations = ["Hostel", "Main Gate", "Library", "Canteen", "Metro Station", "Market", "Bus Stop"];

export default function Rides() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("find");
  const [rides, setRides] = useState<Ride[]>([]);
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [fromLoc, setFromLoc] = useState("");
  const [toLoc, setToLoc] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [seats, setSeats] = useState("");
  const [departureTime, setDepartureTime] = useState("");

  const fetchRides = async () => {
    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setRides(data);
  };

  const fetchMyRides = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("rides")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error && data) setMyRides(data);
  };

  useEffect(() => {
    fetchRides();
    fetchMyRides();
  }, [user]);

  const handlePostRide = async () => {
    if (!fromLoc || !toLoc || !vehicle || !seats || !departureTime) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("rides").insert({
      user_id: user?.id,
      from_location: fromLoc,
      to_location: toLoc,
      vehicle,
      seats: Number(seats),
      departure_time: departureTime,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Ride posted!");
      setFromLoc(""); setToLoc(""); setVehicle(""); setSeats(""); setDepartureTime("");
      fetchRides();
      fetchMyRides();
      setActiveTab("find");
    }
  };

  const getUserName = (ride: Ride) => {
    if (ride.user_id === user?.id) return "You";
    return ride.user_email || "Student";
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header showBack title="Rides" />
      <main className="container py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-module-rides/20">
              <Car className="h-7 w-7 text-module-rides" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Rides</h1>
              <p className="text-muted-foreground text-sm">Share rides safely with students</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6 h-12 rounded-2xl bg-secondary p-1">
              <TabsTrigger value="find" className="rounded-xl data-[state=active]:bg-card">
                <Search className="h-4 w-4 mr-2" />Find
              </TabsTrigger>
              <TabsTrigger value="offer" className="rounded-xl data-[state=active]:bg-card">
                <Plus className="h-4 w-4 mr-2" />Offer
              </TabsTrigger>
              <TabsTrigger value="my" className="rounded-xl data-[state=active]:bg-card">
                <Car className="h-4 w-4 mr-2" />My Rides
              </TabsTrigger>
            </TabsList>

            <TabsContent value="find" className="mt-0 space-y-4">
              {rides.length === 0 ? (
                <div className="text-center py-12">
                  <Car className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No rides available yet</p>
                </div>
              ) : (
                <AnimatePresence>
                  {rides.filter(r => r.user_id !== user?.id).map((ride, index) => (
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
                          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{ride.departure_time}</span>
                            <span className="flex items-center gap-1"><Car className="h-4 w-4" />{ride.vehicle}</span>
                            <span className="flex items-center gap-1"><Users className="h-4 w-4" />{ride.seats} seats</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </TabsContent>

            <TabsContent value="offer" className="mt-0">
              <Card>
                <CardHeader><CardTitle className="text-lg">Post a Ride</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Start Point</Label>
                    <Select value={fromLoc} onValueChange={setFromLoc}>
                      <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select start point" /></SelectTrigger>
                      <SelectContent>{locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Destination</Label>
                    <Select value={toLoc} onValueChange={setToLoc}>
                      <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select destination" /></SelectTrigger>
                      <SelectContent>{locations.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vehicle</Label>
                      <Select value={vehicle} onValueChange={setVehicle}>
                        <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bike">Bike</SelectItem>
                          <SelectItem value="Car">Car</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Seats</Label>
                      <Input type="number" placeholder="1" value={seats} onChange={e => setSeats(e.target.value)} className="h-12 rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Departure Time</Label>
                    <Input type="time" value={departureTime} onChange={e => setDepartureTime(e.target.value)} className="h-12 rounded-xl" />
                  </div>
                  <Button variant="hero" size="lg" className="w-full" onClick={handlePostRide} disabled={loading}>
                    <Plus className="h-4 w-4 mr-2" />{loading ? "Posting..." : "Post Ride"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="my" className="mt-0 space-y-4">
              {myRides.length === 0 ? (
                <div className="text-center py-12">
                  <Car className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No rides yet</h3>
                  <Button onClick={() => setActiveTab("offer")}><Plus className="h-4 w-4 mr-2" />Offer a Ride</Button>
                </div>
              ) : (
                myRides.map(ride => (
                  <Card key={ride.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-success" /><span className="font-medium">{ride.from_location}</span>
                        <span>→</span>
                        <MapPin className="h-4 w-4 text-destructive" /><span className="font-medium">{ride.to_location}</span>
                      </div>
                      <div className="flex gap-3 text-sm text-muted-foreground">
                        <span>{ride.departure_time}</span>
                        <span>{ride.vehicle}</span>
                        <span>{ride.seats} seats</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
