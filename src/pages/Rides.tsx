import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Car, Inbox, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Ride } from "@/types/rides";
import { OfferRideForm } from "@/components/rides/OfferRideForm";
import { BrowseRides } from "@/components/rides/BrowseRides";
import { DriverRequests } from "@/components/rides/DriverRequests";
import { MyRequests } from "@/components/rides/MyRequests";
import { MyPostedRides } from "@/components/rides/MyPostedRides";

export default function Rides() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("browse");
  const [rides, setRides] = useState<Ride[]>([]);
  const [myRides, setMyRides] = useState<Ride[]>([]);

  const fetchRides = async () => {
    const { data } = await supabase
      .from("rides")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setRides(data as Ride[]);
  };

  const fetchMyRides = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("rides")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setMyRides(data as Ride[]);
  };

  useEffect(() => {
    fetchRides();
    fetchMyRides();
  }, [user]);

  const refresh = () => {
    fetchRides();
    fetchMyRides();
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
            <TabsList className="grid w-full grid-cols-4 mb-6 h-12 rounded-2xl bg-secondary p-1">
              <TabsTrigger value="browse" className="rounded-xl data-[state=active]:bg-card text-xs px-1">
                <Search className="h-4 w-4 mr-1" />Browse
              </TabsTrigger>
              <TabsTrigger value="offer" className="rounded-xl data-[state=active]:bg-card text-xs px-1">
                <Plus className="h-4 w-4 mr-1" />Offer
              </TabsTrigger>
              <TabsTrigger value="my-rides" className="rounded-xl data-[state=active]:bg-card text-xs px-1">
                <Car className="h-4 w-4 mr-1" />Posted
              </TabsTrigger>
              <TabsTrigger value="requests" className="rounded-xl data-[state=active]:bg-card text-xs px-1">
                <Inbox className="h-4 w-4 mr-1" />Requests
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="mt-0">
              <BrowseRides rides={rides} onRequested={refresh} />
            </TabsContent>

            <TabsContent value="offer" className="mt-0">
              <OfferRideForm onPosted={() => { refresh(); setActiveTab("my-rides"); }} />
            </TabsContent>

            <TabsContent value="my-rides" className="mt-0">
              <MyPostedRides rides={myRides} onOfferClick={() => setActiveTab("offer")} />
            </TabsContent>

            <TabsContent value="requests" className="mt-0">
              <DriverRequests />
            </TabsContent>

            <TabsContent value="my-requests" className="mt-0">
              <MyRequests />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
