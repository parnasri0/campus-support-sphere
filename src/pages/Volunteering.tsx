import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MapPin, Calendar, Clock, Users, Plus, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface VolunteerEvent {
  id: string;
  user_id: string;
  user_email?: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  volunteers_needed: number;
  created_at: string;
}

interface VolunteerRequest {
  id: string;
  event_id: string;
  user_id: string;
  user_email?: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export default function Volunteering() {
  const { user } = useAuth();
  const [events, setEvents] = useState<VolunteerEvent[]>([]);
  const [myEvents, setMyEvents] = useState<VolunteerEvent[]>([]);
  const [requests, setRequests] = useState<Record<string, VolunteerRequest[]>>({});
  const [activeTab, setActiveTab] = useState("feed");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [volunteersNeeded, setVolunteersNeeded] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    const { data } = await supabase.from("volunteer_events").select("*").order("created_at", { ascending: false });
    if (data) {
      setEvents(data as VolunteerEvent[]);
      if (user) setMyEvents((data as VolunteerEvent[]).filter(e => e.user_id === user.id));
    }
  };

  const fetchRequestsForMyEvents = async () => {
    if (!user) return;
    const { data: evts } = await supabase.from("volunteer_events").select("id").eq("user_id", user.id);
    if (!evts || evts.length === 0) return;
    const ids = evts.map(e => e.id);
    const { data } = await supabase.from("volunteer_requests").select("*").in("event_id", ids);
    if (data) {
      const grouped: Record<string, VolunteerRequest[]> = {};
      (data as VolunteerRequest[]).forEach(r => {
        if (!grouped[r.event_id]) grouped[r.event_id] = [];
        grouped[r.event_id].push(r);
      });
      setRequests(grouped);
    }
  };

  useEffect(() => { fetchEvents(); fetchRequestsForMyEvents(); }, [user]);

  const handleCreateEvent = async () => {
    if (!title || !description || !location || !date || !time || !volunteersNeeded) { toast.error("Please fill all fields"); return; }
    setLoading(true);
    const { error } = await supabase.from("volunteer_events").insert({
      user_id: user?.id, user_email: user?.email, title, description, location, date, time, volunteers_needed: Number(volunteersNeeded),
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Event posted!");
      setTitle(""); setDescription(""); setLocation(""); setDate(""); setTime(""); setVolunteersNeeded("");
      fetchEvents(); setActiveTab("feed");
    }
  };

  const handleJoinEvent = async (eventId: string) => {
    if (!user) return;
    const { data: existing } = await supabase.from("volunteer_requests").select("id").eq("event_id", eventId).eq("user_id", user.id).maybeSingle();
    if (existing) { toast.error("Already requested"); return; }
    const { error } = await supabase.from("volunteer_requests").insert({ event_id: eventId, user_id: user.id, user_email: user.email, status: "pending" });
    if (error) toast.error(error.message);
    else { toast.success("Join request sent!"); fetchRequestsForMyEvents(); }
  };

  const handleAction = async (requestId: string, status: "accepted" | "rejected") => {
    const { error } = await supabase.from("volunteer_requests").update({ status }).eq("id", requestId);
    if (error) toast.error(error.message);
    else { toast.success(status === "accepted" ? "Approved!" : "Rejected"); fetchRequestsForMyEvents(); }
  };

  const feedEvents = events; // show all events including own

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header />
      <main className="container py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-module-volunteer/20">
              <Heart className="h-5 w-5 text-module-volunteer" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Volunteering</h1>
          </div>
          <p className="text-muted-foreground">Join events and make a difference in your community</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="feed">Event Feed</TabsTrigger>
            <TabsTrigger value="create">Post Event</TabsTrigger>
            <TabsTrigger value="mine">My Events</TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <div className="space-y-4">
              <AnimatePresence>
                {feedEvents.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-muted-foreground">No events available yet</motion.div>
                ) : feedEvents.map((event, index) => (
                  <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                    <Card className="overflow-hidden border-l-4 border-l-module-volunteer">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">by {event.user_email || "Student"}</p>
                          </div>
                          <Badge variant="secondary" className="bg-module-volunteer/10 text-module-volunteer">
                            {event.volunteers_needed} spots
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /><span>{event.location}</span></div>
                          <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="h-4 w-4" /><span>{event.date}</span></div>
                          <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4" /><span>{event.time}</span></div>
                          <div className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" /><span>{event.volunteers_needed} needed</span></div>
                        </div>
                        {event.user_id !== user?.id && (
                          <Button onClick={() => handleJoinEvent(event.id)} className="w-full bg-module-volunteer hover:bg-module-volunteer/90">
                            Join Event
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4"><Plus className="h-5 w-5 text-module-volunteer" /><h2 className="font-semibold text-lg">Create Event</h2></div>
                <Input placeholder="Event Name" value={title} onChange={e => setTitle(e.target.value)} />
                <Textarea placeholder="Event Description" value={description} onChange={e => setDescription(e.target.value)} rows={3} />
                <Input placeholder="Event Location" value={location} onChange={e => setLocation(e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                  <Input type="time" value={time} onChange={e => setTime(e.target.value)} />
                </div>
                <Input type="number" placeholder="Volunteers Needed" value={volunteersNeeded} onChange={e => setVolunteersNeeded(e.target.value)} />
                <Button onClick={handleCreateEvent} className="w-full bg-module-volunteer hover:bg-module-volunteer/90" disabled={loading}>
                  {loading ? "Posting..." : "Post Event"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mine">
            <div className="space-y-6">
              <div>
                <h2 className="font-semibold text-lg mb-4">Events I Created</h2>
                {myEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No events created yet</p>
                ) : (
                  <div className="space-y-4">
                    {myEvents.map(event => (
                      <Card key={event.id}>
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{event.location} | {event.date}</p>
                          {(requests[event.id] || []).filter(r => r.status === "pending").length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-2">Pending Requests:</p>
                              <div className="space-y-2">
                                {(requests[event.id] || []).filter(r => r.status === "pending").map(req => (
                                  <div key={req.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-module-volunteer/20 text-module-volunteer text-xs">
                                          {(req.user_email || "S")[0].toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm font-medium">{req.user_email || "Student"}</span>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-success hover:bg-success/10" onClick={() => handleAction(req.id, "accepted")}>
                                        <Check className="h-4 w-4" />
                                      </Button>
                                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10" onClick={() => handleAction(req.id, "rejected")}>
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
}
