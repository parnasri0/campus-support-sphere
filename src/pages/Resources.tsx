import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileText, Plus, Search, Upload, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Resource {
  id: string;
  user_id: string;
  title: string;
  description: string;
  subject: string;
  file_url: string;
  created_at: string;
}

const subjects = ["Maths", "Physics", "C Programming", "DSA", "Java", "Python", "DBMS", "Networks", "Operating Systems", "Machine Learning", "Other"];

export default function Resources() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [myResources, setMyResources] = useState<Resource[]>([]);
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("DSA");
  const [fileUrl, setFileUrl] = useState("");

  const fetchResources = async () => {
    const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
    if (data) setResources(data);
  };

  const fetchMyResources = async () => {
    if (!user) return;
    const { data } = await supabase.from("resources").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (data) setMyResources(data);
  };

  useEffect(() => { fetchResources(); fetchMyResources(); }, [user]);

  const handleUpload = async () => {
    if (!title || !subject || !fileUrl) { toast.error("Please fill title, subject, and file URL"); return; }
    setLoading(true);
    const { error } = await supabase.from("resources").insert({
      user_id: user?.id, title, description, subject, file_url: fileUrl,
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Resource shared!");
      setTitle(""); setDescription(""); setSubject("DSA"); setFileUrl("");
      fetchResources(); fetchMyResources(); setActiveTab("browse");
    }
  };

  const filtered = resources.filter(r =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header showBack title="Resources" />
      <main className="container py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-module-academic/20">
              <FileText className="h-7 w-7 text-module-academic" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Resources</h1>
              <p className="text-muted-foreground text-sm">Share and discover study materials</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6 h-12 rounded-2xl bg-secondary p-1">
              <TabsTrigger value="browse" className="rounded-xl data-[state=active]:bg-card"><Search className="h-4 w-4 mr-2" />Browse</TabsTrigger>
              <TabsTrigger value="upload" className="rounded-xl data-[state=active]:bg-card"><Upload className="h-4 w-4 mr-2" />Upload</TabsTrigger>
              <TabsTrigger value="mine" className="rounded-xl data-[state=active]:bg-card"><FileText className="h-4 w-4 mr-2" />My Uploads</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="mt-0 space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search resources..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-12 rounded-2xl" />
              </div>
              {filtered.length === 0 ? (
                <div className="text-center py-12"><FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" /><p className="text-muted-foreground">No resources found</p></div>
              ) : (
                <AnimatePresence>
                  {filtered.map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold text-foreground">{r.title}</h3>
                            <Badge variant="secondary">{r.subject}</Badge>
                          </div>
                          {r.description && <p className="text-sm text-muted-foreground mb-3">{r.description}</p>}
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
                            <a href={r.file_url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline"><ExternalLink className="h-4 w-4 mr-2" />Open</Button>
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </TabsContent>

            <TabsContent value="upload" className="mt-0">
              <Card>
                <CardHeader><CardTitle className="text-lg">Share a Resource</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label>Title</Label><Input placeholder="e.g., DSA Notes Chapter 5" value={title} onChange={e => setTitle(e.target.value)} className="h-12 rounded-xl" /></div>
                  <div className="space-y-2"><Label>Description (Optional)</Label><Textarea placeholder="What's in this resource?" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="rounded-xl" /></div>
                  <div className="space-y-2">
                    <Label>Subject</Label>
                    <Select value={subject} onValueChange={setSubject}>
                      <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>File URL (Google Drive, Dropbox, etc.)</Label><Input placeholder="https://drive.google.com/..." value={fileUrl} onChange={e => setFileUrl(e.target.value)} className="h-12 rounded-xl" /></div>
                  <Button variant="hero" size="lg" className="w-full" onClick={handleUpload} disabled={loading}>
                    <Plus className="h-4 w-4 mr-2" />{loading ? "Uploading..." : "Share Resource"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mine" className="mt-0 space-y-4">
              {myResources.length === 0 ? (
                <div className="text-center py-12"><FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" /><p className="text-muted-foreground">No resources uploaded yet</p></div>
              ) : myResources.map(r => (
                <Card key={r.id}><CardContent className="p-4">
                  <h4 className="font-medium">{r.title}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="secondary">{r.subject}</Badge>
                    <a href={r.file_url} target="_blank" rel="noopener noreferrer"><Button size="sm" variant="outline"><ExternalLink className="h-4 w-4" /></Button></a>
                  </div>
                </CardContent></Card>
              ))}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
