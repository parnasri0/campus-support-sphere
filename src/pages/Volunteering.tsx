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
import { toast } from "sonner";

interface VolunteerEvent {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  volunteersNeeded: number;
  createdBy: string;
  volunteers: string[];
  requests: string[];
}

const currentUser = "Yashaswini";

export default function Volunteering() {
  const [events, setEvents] = useState<VolunteerEvent[]>([]);
  const [activeTab, setActiveTab] = useState("feed");
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [volunteersNeeded, setVolunteersNeeded] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("volunteer_events");
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      // Demo data
      const demoEvents: VolunteerEvent[] = [
        {
          id: 1,
          title: "Blood Donation Camp",
          description: "Annual blood donation drive at the campus health center. Help save lives!",
          location: "Health Center, Block A",
          date: "2026-02-01",
          time: "09:00",
          volunteersNeeded: 10,
          createdBy: "NSS Club",
          volunteers: ["Rahul", "Priya"],
          requests: ["Student1"]
        },
        {
          id: 2,
          title: "Campus Clean-Up Drive",
          description: "Join us to make our campus greener and cleaner. Bring gloves!",
          location: "Main Quad",
          date: "2026-02-05",
          time: "07:00",
          volunteersNeeded: 20,
          createdBy: "Eco Club",
          volunteers: [],
          requests: []
        },
        {
          id: 3,
          title: "Tech Workshop for Juniors",
          description: "Help conduct a basic programming workshop for first-year students.",
          location: "Computer Lab 3",
          date: "2026-02-10",
          time: "14:00",
          volunteersNeeded: 5,
          createdBy: currentUser,
          volunteers: ["Anjali"],
          requests: ["Vikram", "Sneha"]
        }
      ];
      setEvents(demoEvents);
      localStorage.setItem("volunteer_events", JSON.stringify(demoEvents));
    }
  }, []);

  const saveEvents = (updatedEvents: VolunteerEvent[]) => {
    setEvents(updatedEvents);
    localStorage.setItem("volunteer_events", JSON.stringify(updatedEvents));
  };

  const handleCreateEvent = () => {
    if (!title || !description || !location || !date || !time || !volunteersNeeded) {
      toast.error("Please fill all fields");
      return;
    }

    const newEvent: VolunteerEvent = {
      id: Date.now(),
      title,
      description,
      location,
      date,
      time,
      volunteersNeeded: Number(volunteersNeeded),
      createdBy: currentUser,
      volunteers: [],
      requests: []
    };

    saveEvents([...events, newEvent]);
    setTitle("");
    setDescription("");
    setLocation("");
    setDate("");
    setTime("");
    setVolunteersNeeded("");
    toast.success("Event posted successfully!");
    setActiveTab("feed");
  };

  const handleJoinEvent = (eventId: number) => {
    const updatedEvents = events.map(ev => {
      if (ev.id === eventId) {
        if (ev.createdBy === currentUser) {
          toast.error("You can't join your own event");
          return ev;
        }
        if (ev.requests.includes(currentUser) || ev.volunteers.includes(currentUser)) {
          toast.error("Already requested or joined");
          return ev;
        }
        return { ...ev, requests: [...ev.requests, currentUser] };
      }
      return ev;
    });
    saveEvents(updatedEvents);
    toast.success("Join request sent!");
  };

  const handleApprove = (eventId: number, person: string) => {
    const updatedEvents = events.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          volunteers: [...ev.volunteers, person],
          requests: ev.requests.filter(r => r !== person)
        };
      }
      return ev;
    });
    saveEvents(updatedEvents);
    toast.success(`${person} approved!`);
  };

  const handleReject = (eventId: number, person: string) => {
    const updatedEvents = events.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          requests: ev.requests.filter(r => r !== person)
        };
      }
      return ev;
    });
    saveEvents(updatedEvents);
    toast.info(`Request from ${person} declined`);
  };

  const myCreatedEvents = events.filter(e => e.createdBy === currentUser);
  const myJoinedEvents = events.filter(e => e.volunteers.includes(currentUser));
  const feedEvents = events.filter(e => e.createdBy !== currentUser);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header />

      <main className="container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-module-volunteer/20">
              <Heart className="h-5 w-5 text-module-volunteer" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Volunteering
            </h1>
          </div>
          <p className="text-muted-foreground">
            Join events and make a difference in your community
          </p>
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
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 text-muted-foreground"
                  >
                    No events available. Check back later!
                  </motion.div>
                ) : (
                  feedEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden border-l-4 border-l-module-volunteer">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{event.title}</h3>
                              <p className="text-sm text-muted-foreground">by {event.createdBy}</p>
                            </div>
                            <Badge variant="secondary" className="bg-module-volunteer/10 text-module-volunteer">
                              {event.volunteersNeeded - event.volunteers.length} spots left
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                          
                          <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{event.volunteers.length}/{event.volunteersNeeded}</span>
                            </div>
                          </div>

                          <Button 
                            onClick={() => handleJoinEvent(event.id)}
                            className="w-full bg-module-volunteer hover:bg-module-volunteer/90"
                            disabled={event.requests.includes(currentUser) || event.volunteers.includes(currentUser)}
                          >
                            {event.volunteers.includes(currentUser) 
                              ? "Joined" 
                              : event.requests.includes(currentUser) 
                                ? "Requested" 
                                : "Join Event"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Plus className="h-5 w-5 text-module-volunteer" />
                  <h2 className="font-semibold text-lg">Create Volunteering Event</h2>
                </div>

                <Input
                  placeholder="Event Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Event Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
                <Input
                  placeholder="Event Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
                <Input
                  type="number"
                  placeholder="Volunteers Needed"
                  value={volunteersNeeded}
                  onChange={(e) => setVolunteersNeeded(e.target.value)}
                />
                <Button 
                  onClick={handleCreateEvent}
                  className="w-full bg-module-volunteer hover:bg-module-volunteer/90"
                >
                  Post Event
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mine">
            <div className="space-y-6">
              <div>
                <h2 className="font-semibold text-lg mb-4">Events I Created</h2>
                {myCreatedEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No events created yet</p>
                ) : (
                  <div className="space-y-4">
                    {myCreatedEvents.map(event => (
                      <Card key={event.id}>
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{event.location} | {new Date(event.date).toLocaleDateString()}</p>
                          
                          {event.requests.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-2">Pending Requests:</p>
                              <div className="space-y-2">
                                {event.requests.map(req => (
                                  <div key={req} className="flex items-center justify-between bg-muted/50 p-2 rounded-lg">
                                    <div className="flex items-center gap-2">
                                      <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-module-volunteer/20 text-module-volunteer text-xs">
                                          {req.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm font-medium">{req}</span>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
                                        onClick={() => handleApprove(event.id, req)}
                                      >
                                        <Check className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-100"
                                        onClick={() => handleReject(event.id, req)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <p className="text-sm text-muted-foreground">
                            <strong>Volunteers:</strong> {event.volunteers.join(", ") || "None yet"}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="font-semibold text-lg mb-4">Events I Joined</h2>
                {myJoinedEvents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">You haven't joined any events yet</p>
                ) : (
                  <div className="space-y-4">
                    {myJoinedEvents.map(event => (
                      <Card key={event.id}>
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">{event.location} | {new Date(event.date).toLocaleDateString()}</p>
                          <Badge className="mt-2 bg-green-100 text-green-700">Confirmed</Badge>
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
