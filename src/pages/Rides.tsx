import { useState } from "react";
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
import { Search, Plus, Car, MapPin, Clock, Users, Star, Filter } from "lucide-react";

interface Ride {
  id: string;
  from: string;
  to: string;
  time: string;
  vehicle: string;
  seats: number;
  driver: {
    name: string;
    rating: number;
  };
}

const availableRides: Ride[] = [
  {
    id: "1",
    from: "Hostel",
    to: "Metro Station",
    time: "5:30 PM",
    vehicle: "Car",
    seats: 3,
    driver: { name: "Rahul S", rating: 4.8 },
  },
  {
    id: "2",
    from: "Main Gate",
    to: "Market",
    time: "6:00 PM",
    vehicle: "Bike",
    seats: 1,
    driver: { name: "Priya P", rating: 4.5 },
  },
  {
    id: "3",
    from: "Library",
    to: "Bus Stop",
    time: "7:30 PM",
    vehicle: "Car",
    seats: 2,
    driver: { name: "Amit K", rating: 4.9 },
  },
];

const locations = ["Hostel", "Main Gate", "Library", "Canteen", "Metro Station", "Market", "Bus Stop"];

export default function Rides() {
  const [activeTab, setActiveTab] = useState("find");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [requestedRides, setRequestedRides] = useState<string[]>([]);

  const handleRequestRide = (id: string) => {
    setRequestedRides((prev) => [...prev, id]);
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
                <Search className="h-4 w-4 mr-2" />
                Find
              </TabsTrigger>
              <TabsTrigger value="offer" className="rounded-xl data-[state=active]:bg-card">
                <Plus className="h-4 w-4 mr-2" />
                Offer
              </TabsTrigger>
              <TabsTrigger value="my" className="rounded-xl data-[state=active]:bg-card">
                <Car className="h-4 w-4 mr-2" />
                My Rides
              </TabsTrigger>
            </TabsList>

            {/* Find Rides Tab */}
            <TabsContent value="find" className="mt-0 space-y-6">
              {/* Filters */}
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-success" />
                        Pickup
                      </Label>
                      <Select value={pickup} onValueChange={setPickup}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select pickup point" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-destructive" />
                        Destination
                      </Label>
                      <Select value={destination} onValueChange={setDestination}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full" size="lg">
                    <Search className="h-4 w-4 mr-2" />
                    Search Rides
                  </Button>
                </CardContent>
              </Card>

              {/* Available Rides */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Available Rides</h3>
                <div className="space-y-4">
                  <AnimatePresence>
                    {availableRides.map((ride, index) => (
                      <motion.div
                        key={ride.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                {/* Route */}
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="flex flex-col items-center">
                                    <div className="w-2.5 h-2.5 rounded-full bg-success" />
                                    <div className="w-0.5 h-8 bg-border" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-foreground">{ride.from}</p>
                                    <div className="h-4" />
                                    <p className="font-medium text-foreground">{ride.to}</p>
                                  </div>
                                </div>

                                {/* Details */}
                                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {ride.time}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Car className="h-4 w-4" />
                                    {ride.vehicle}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    {ride.seats} seats
                                  </span>
                                </div>
                              </div>

                              {/* Driver */}
                              <div className="text-right">
                                <Avatar className="h-10 w-10 mb-2 ml-auto">
                                  <AvatarFallback className="bg-module-rides/20 text-module-rides text-sm font-semibold">
                                    {ride.driver.name.split(" ").map(n => n[0]).join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <p className="font-medium text-sm">{ride.driver.name}</p>
                                <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                                  <Star className="h-3 w-3 fill-warning text-warning" />
                                  {ride.driver.rating}
                                </div>
                              </div>
                            </div>

                            <Button
                              className="w-full mt-4"
                              variant={requestedRides.includes(ride.id) ? "secondary" : "default"}
                              disabled={requestedRides.includes(ride.id)}
                              onClick={() => handleRequestRide(ride.id)}
                            >
                              {requestedRides.includes(ride.id) ? "Request Sent ✓" : "Request Ride"}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </TabsContent>

            {/* Offer Ride Tab */}
            <TabsContent value="offer" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Post a Ride</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Start Point</Label>
                    <Select>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select start point" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Destination</Label>
                    <Select>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vehicle</Label>
                      <Select>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bike">Bike</SelectItem>
                          <SelectItem value="car">Car</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Available Seats</Label>
                      <Input type="number" placeholder="1" className="h-12 rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Departure Time</Label>
                    <Input type="time" className="h-12 rounded-xl" />
                  </div>

                  <Button variant="hero" size="lg" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Ride
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* My Rides Tab */}
            <TabsContent value="my" className="mt-0">
              <div className="text-center py-12">
                <Car className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">No rides yet</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Your offered and booked rides will appear here
                </p>
                <Button onClick={() => setActiveTab("offer")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Offer a Ride
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
