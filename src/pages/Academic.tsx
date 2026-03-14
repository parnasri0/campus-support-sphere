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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, HelpCircle, MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Doubt {
  id: string;
  user_id: string;
  title: string;
  description: string;
  subject: string;
  created_at: string;
}

interface DoubtAnswer {
  id: string;
  doubt_id: string;
  user_id: string;
  answer: string;
  created_at: string;
}

const subjects = ["Maths", "Physics", "C Programming", "DSA", "Java", "Python", "DBMS", "Networks", "Operating Systems", "Machine Learning", "Other"];

const getSubjectColor = (subj: string) => {
  const colors: Record<string, string> = {
    DSA: "bg-blue-100 text-blue-700", Java: "bg-orange-100 text-orange-700", Python: "bg-green-100 text-green-700",
    DBMS: "bg-purple-100 text-purple-700", Maths: "bg-red-100 text-red-700", Networks: "bg-cyan-100 text-cyan-700",
  };
  return colors[subj] || "bg-gray-100 text-gray-700";
};

export default function Academic() {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [myDoubts, setMyDoubts] = useState<Doubt[]>([]);
  const [answers, setAnswers] = useState<Record<string, DoubtAnswer[]>>({});
  const [activeTab, setActiveTab] = useState("feed");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("DSA");
  const [answerText, setAnswerText] = useState<Record<string, string>>({});
  const [expandedDoubt, setExpandedDoubt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchDoubts = async () => {
    const [allRes, myRes] = await Promise.all([
      supabase.from("doubts").select("*").order("created_at", { ascending: false }),
      user ? supabase.from("doubts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }) : Promise.resolve({ data: [] }),
    ]);
    if (allRes.data) setDoubts(allRes.data);
    if (myRes.data) setMyDoubts(myRes.data as Doubt[]);
  };

  const fetchAnswers = async (doubtId: string) => {
    const { data } = await supabase.from("doubt_answers").select("*").eq("doubt_id", doubtId).order("created_at", { ascending: true });
    if (data) setAnswers(prev => ({ ...prev, [doubtId]: data }));
  };

  useEffect(() => { fetchDoubts(); }, [user]);

  const handleCreate = async () => {
    if (!title || !description) { toast.error("Please fill all fields"); return; }
    setLoading(true);
    const { error } = await supabase.from("doubts").insert({ user_id: user?.id, title, description, subject });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Question posted!"); setTitle(""); setDescription(""); setSubject("DSA"); fetchDoubts(); setActiveTab("feed"); }
  };

  const handleAnswer = async (doubtId: string) => {
    const text = answerText[doubtId];
    if (!text?.trim()) { toast.error("Write an answer"); return; }
    const { error } = await supabase.from("doubt_answers").insert({ doubt_id: doubtId, user_id: user?.id, answer: text });
    if (error) toast.error(error.message);
    else { toast.success("Answer posted!"); setAnswerText(prev => ({ ...prev, [doubtId]: "" })); fetchAnswers(doubtId); }
  };

  const toggleExpand = (doubtId: string) => {
    if (expandedDoubt === doubtId) { setExpandedDoubt(null); }
    else { setExpandedDoubt(doubtId); fetchAnswers(doubtId); }
  };

  const renderDoubtCard = (doubt: Doubt, index: number, showAnswer = true) => (
    <motion.div key={doubt.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <Card className="overflow-hidden border-l-4 border-l-module-academic">
        <CardContent className="p-4">
          <Badge className={getSubjectColor(doubt.subject)}>{doubt.subject}</Badge>
          <h3 className="font-semibold text-lg mt-3 mb-1">{doubt.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{doubt.description}</p>

          {showAnswer && (
            <>
              <Button variant="outline" size="sm" onClick={() => toggleExpand(doubt.id)} className="mb-3">
                <MessageCircle className="h-4 w-4 mr-2" />
                {expandedDoubt === doubt.id ? "Hide Answers" : "View/Answer"}
                {answers[doubt.id] && ` (${answers[doubt.id].length})`}
              </Button>

              {expandedDoubt === doubt.id && (
                <div className="space-y-3 mt-3 border-t pt-3">
                  {(answers[doubt.id] || []).map(a => (
                    <div key={a.id} className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-sm">{a.answer}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(a.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                  {doubt.user_id !== user?.id && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Write your answer..."
                        value={answerText[doubt.id] || ""}
                        onChange={e => setAnswerText(prev => ({ ...prev, [doubt.id]: e.target.value }))}
                      />
                      <Button size="sm" onClick={() => handleAnswer(doubt.id)}><Send className="h-4 w-4" /></Button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header />
      <main className="container py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-module-academic/20">
              <BookOpen className="h-5 w-5 text-module-academic" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">Academic Support</h1>
          </div>
          <p className="text-muted-foreground">Post doubts and help fellow students</p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="feed">Doubts Feed</TabsTrigger>
            <TabsTrigger value="create">Ask Question</TabsTrigger>
            <TabsTrigger value="mine">My Doubts</TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <div className="space-y-4">
              {doubts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground"><HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No questions posted yet</p></div>
              ) : doubts.filter(d => d.user_id !== user?.id).map((d, i) => renderDoubtCard(d, i))}
            </div>
          </TabsContent>

          <TabsContent value="create">
            <Card><CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4"><Plus className="h-5 w-5 text-module-academic" /><h2 className="font-semibold text-lg">Post Academic Doubt</h2></div>
              <Input placeholder="Title (e.g., Need help with Binary Search)" value={title} onChange={e => setTitle(e.target.value)} />
              <Textarea placeholder="Describe your doubt in detail..." value={description} onChange={e => setDescription(e.target.value)} rows={4} />
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                <SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <Button onClick={handleCreate} className="w-full bg-module-academic hover:bg-module-academic/90" disabled={loading}>
                {loading ? "Posting..." : "Post Question"}
              </Button>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="mine">
            <div className="space-y-4">
              {myDoubts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground"><BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No questions posted yet</p></div>
              ) : myDoubts.map((d, i) => renderDoubtCard(d, i))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
}
