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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, MapPin, Clock, Zap, CheckCircle, AlertCircle, ListTodo } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Errand {
  id: string;
  user_id: string;
  title: string;
  description: string;
  pickup: string;
  drop_off: string;
  urgency: string;
  status: string;
  accepted_by: string | null;
  created_at: string;
}

const urgencyStyles: Record<string, { bg: string; icon: any }> = {
  Immediate: { bg: "bg-destructive/10 text-destructive", icon: Zap },
  Today: { bg: "bg-warning/10 text-warning", icon: Clock },
  Flexible: { bg: "bg-success/10 text-success", icon: CheckCircle },
};

export default function Errands() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("feed");
  const [errands, setErrands] = useState<Errand[]>([]);
  const [myErrands, setMyErrands] = useState<Errand[]>([]);
  const [acceptedErrands, setAcceptedErrands] = useState<Errand[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropOff, setDropOff] = useState("");
  const [urgency, setUrgency] = useState("");

  const fetchAll = async () => {
    if (!user) return;
    const [allRes, myRes, acceptedRes] = await Promise.all([
      supabase.from("errands").select("*").neq("user_id", user.id).eq("status", "pending").order("created_at", { ascending: false }),
      supabase.from("errands").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("errands").select("*").eq("accepted_by", user.id).order("created_at", { ascending: false }),
    ]);
    if (allRes.data) setErrands(allRes.data);
    if (myRes.data) setMyErrands(myRes.data);
    if (acceptedRes.data) setAcceptedErrands(acceptedRes.data);
  };

  useEffect(() => { fetchAll(); }, [user]);

  const handleCreate = async () => {
    if (!title || !description || !pickup || !dropOff || !urgency) {
      toast.error("Please fill all fields"); return;
    }
    setLoading(true);
    const { error } = await supabase.from("errands").insert({
      user_id: user?.id, title, description, pickup, drop_off: dropOff, urgency, status: "pending",
    });
    setLoading(false);
    if (error) { toast.error(error.message); } else {
      toast.success("Errand posted!");
      setTitle(""); setDescription(""); setPickup(""); setDropOff(""); setUrgency("");
      fetchAll(); setActiveTab("feed");
    }
  };

  const handleAccept = async (id: string) => {
    const { error } = await supabase.from("errands").update({ status: "accepted", accepted_by: user?.id }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Errand accepted!"); fetchAll(); }
  };

  const handleComplete = async (id: string) => {
    const { error } = await supabase.from("errands").update({ status: "completed" }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Marked completed!"); fetchAll(); }
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
              <TabsTrigger value="create" className="rounded-xl data-[state=active]:bg-card"><Plus className="h-4 w-4 mr-2" />Create</TabsTrigger>
              <TabsTrigger value="feed" className="rounded-xl data-[state=active]:bg-card"><ListTodo className="h-4 w-4 mr-2" />Feed</TabsTrigger>
              <TabsTrigger value="my" className="rounded-xl data-[state=active]:bg-card"><Users className="h-4 w-4 mr-2" />My Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="mt-0">
              <Card>
                <CardHeader><CardTitle className="text-lg">Create an Errand</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label>Task Title</Label><Input placeholder="e.g., Need printouts" value={title} onChange={e => setTitle(e.target.value)} className="h-12 rounded-xl" /></div>
                  <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Describe what you need..." value={description} onChange={e => setDescription(e.target.value)} className="rounded-xl resize-none" rows={3} /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Pickup Location</Label><Input placeholder="e.g., Library" value={pickup} onChange={e => setPickup(e.target.value)} className="h-12 rounded-xl" /></div>
                    <div className="space-y-2"><Label>Drop-off Location</Label><Input placeholder="e.g., Hostel A" value={dropOff} onChange={e => setDropOff(e.target.value)} className="h-12 rounded-xl" /></div>
                  </div>
                  <div className="space-y-2">
                    <Label>Urgency</Label>
                    <Select value={urgency} onValueChange={setUrgency}>
                      <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="How urgent?" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Immediate">🔴 Immediate</SelectItem>
                        <SelectItem value="Today">🟡 Today</SelectItem>
                        <SelectItem value="Flexible">🟢 Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="hero" size="lg" className="w-full" onClick={handleCreate} disabled={loading}>
                    <Plus className="h-4 w-4 mr-2" />{loading ? "Posting..." : "Post Errand"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feed" className="mt-0 space-y-4">
              {errands.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground"><AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-50" /><p>No errands available</p></div>
              ) : (
                <AnimatePresence>
                  {errands.map((errand, index) => {
                    const style = urgencyStyles[errand.urgency] || urgencyStyles.Flexible;
                    const UrgencyIcon = style.icon;
                    return (
                      <motion.div key={errand.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                        <Card className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="font-semibold text-foreground">{errand.title}</h3>
                              <Badge className={`${style.bg} border-0`}><UrgencyIcon className="h-3 w-3 mr-1" />{errand.urgency}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">{errand.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                              <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-success" />{errand.pickup}</span>
                              <span>→</span>
                              <span className="flex items-center gap-1"><MapPin className="h-4 w-4 text-destructive" />{errand.drop_off}</span>
                            </div>
                            <Button className="w-full" onClick={() => handleAccept(errand.id)}>Accept Errand</Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </TabsContent>

            <TabsContent value="my" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Errands I Created</h3>
                  {myErrands.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground"><AlertCircle className="h-10 w-10 mx-auto mb-2 opacity-50" /><p className="text-sm">No errands created yet</p></div>
                  ) : (
                    <div className="space-y-4">
                      {myErrands.map(e => (
                        <Card key={e.id}><CardContent className="p-4">
                          <h4 className="font-medium">{e.title}</h4>
                          <p className="text-sm text-muted-foreground">{e.pickup} → {e.drop_off}</p>
                          <Badge className="mt-2" variant="secondary">{e.status}</Badge>
                        </CardContent></Card>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Errands I Accepted</h3>
                  {acceptedErrands.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground"><CheckCircle className="h-10 w-10 mx-auto mb-2 opacity-50" /><p className="text-sm">No accepted errands</p></div>
                  ) : (
                    <div className="space-y-4">
                      {acceptedErrands.map(e => (
                        <Card key={e.id}><CardContent className="p-4">
                          <h4 className="font-medium">{e.title}</h4>
                          <p className="text-sm text-muted-foreground">{e.pickup} → {e.drop_off}</p>
                          {e.status !== "completed" && (
                            <Button size="sm" className="mt-3" onClick={() => handleComplete(e.id)}>Mark Completed</Button>
                          )}
                          {e.status === "completed" && <Badge className="mt-2 bg-success/10 text-success border-0">Completed</Badge>}
                        </CardContent></Card>
                      ))}
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
