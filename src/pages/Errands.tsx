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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, MapPin, Clock, Zap, CheckCircle, AlertCircle, ListTodo } from "lucide-react";

interface Errand {
  id: string;
  title: string;
  description: string;
  pickup: string;
  drop: string;
  urgency: "Immediate" | "Today" | "Flexible";
  createdBy: { name: string };
  status: "pending" | "accepted" | "completed";
}

const errands: Errand[] = [
  {
    id: "1",
    title: "Need printouts",
    description: "10 pages of notes to be printed from the lab",
    pickup: "CSE Lab",
    drop: "Hostel Block B",
    urgency: "Immediate",
    createdBy: { name: "Priya" },
    status: "pending",
  },
  {
    id: "2",
    title: "Submit assignment",
    description: "Submit my DAA assignment to Prof. Sharma's office",
    pickup: "Hostel A",
    drop: "Faculty Block",
    urgency: "Today",
    createdBy: { name: "Rahul" },
    status: "pending",
  },
  {
    id: "3",
    title: "Buy lab record",
    description: "Need someone to pick up a lab record from the bookstore",
    pickup: "Bookstore",
    drop: "Main Gate",
    urgency: "Flexible",
    createdBy: { name: "Sneha" },
    status: "pending",
  },
];

const urgencyStyles = {
  Immediate: { bg: "bg-destructive/10 text-destructive", icon: Zap },
  Today: { bg: "bg-warning/10 text-warning", icon: Clock },
  Flexible: { bg: "bg-success/10 text-success", icon: CheckCircle },
};

export default function Errands() {
  const [activeTab, setActiveTab] = useState("feed");
  const [acceptedErrands, setAcceptedErrands] = useState<string[]>([]);

  const handleAcceptErrand = (id: string) => {
    setAcceptedErrands((prev) => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header showBack title="Errands" />

      <main className="container py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-module-errands/20">
              <Users className="h-7 w-7 text-module-errands" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Errands</h1>
              <p className="text-muted-foreground text-sm">Get tasks done or help others</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6 h-12 rounded-2xl bg-secondary p-1">
              <TabsTrigger value="create" className="rounded-xl data-[state=active]:bg-card">
                <Plus className="h-4 w-4 mr-2" />
                Create
              </TabsTrigger>
              <TabsTrigger value="feed" className="rounded-xl data-[state=active]:bg-card">
                <ListTodo className="h-4 w-4 mr-2" />
                Feed
              </TabsTrigger>
              <TabsTrigger value="my" className="rounded-xl data-[state=active]:bg-card">
                <Users className="h-4 w-4 mr-2" />
                My Tasks
              </TabsTrigger>
            </TabsList>

            {/* Create Errand Tab */}
            <TabsContent value="create" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Create an Errand</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Task Title</Label>
                    <Input placeholder="e.g., Need printouts" className="h-12 rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Describe what you need..." className="rounded-xl resize-none" rows={3} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Pickup Location</Label>
                      <Input placeholder="e.g., Library" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Drop-off Location</Label>
                      <Input placeholder="e.g., Hostel A" className="h-12 rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Urgency</Label>
                    <Select>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="How urgent is this?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">🔴 Immediate</SelectItem>
                        <SelectItem value="today">🟡 Today</SelectItem>
                        <SelectItem value="flexible">🟢 Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="hero" size="lg" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Errand
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Feed Tab */}
            <TabsContent value="feed" className="mt-0 space-y-4">
              <AnimatePresence>
                {errands.map((errand, index) => {
                  const urgencyStyle = urgencyStyles[errand.urgency];
                  const UrgencyIcon = urgencyStyle.icon;

                  return (
                    <motion.div
                      key={errand.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-module-errands/20 text-module-errands text-xs font-semibold">
                                  {errand.createdBy.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{errand.createdBy.name}</span>
                            </div>
                            <Badge className={`${urgencyStyle.bg} border-0`}>
                              <UrgencyIcon className="h-3 w-3 mr-1" />
                              {errand.urgency}
                            </Badge>
                          </div>

                          <h3 className="font-semibold text-foreground mb-2">{errand.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{errand.description}</p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-success" />
                              {errand.pickup}
                            </span>
                            <span>→</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-destructive" />
                              {errand.drop}
                            </span>
                          </div>

                          <Button
                            className="w-full"
                            variant={acceptedErrands.includes(errand.id) ? "secondary" : "default"}
                            disabled={acceptedErrands.includes(errand.id)}
                            onClick={() => handleAcceptErrand(errand.id)}
                          >
                            {acceptedErrands.includes(errand.id) ? "Accepted ✓" : "Accept Errand"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </TabsContent>

            {/* My Tasks Tab */}
            <TabsContent value="my" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Errands I Created</h3>
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No errands created yet</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-4">Errands I Accepted</h3>
                  {acceptedErrands.length > 0 ? (
                    <div className="space-y-4">
                      {errands
                        .filter((e) => acceptedErrands.includes(e.id))
                        .map((errand) => (
                          <Card key={errand.id}>
                            <CardContent className="p-4">
                              <h4 className="font-medium">{errand.title}</h4>
                              <p className="text-sm text-muted-foreground">{errand.pickup} → {errand.drop}</p>
                              <Button variant="success" size="sm" className="mt-3">
                                Mark Completed
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No accepted errands</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
