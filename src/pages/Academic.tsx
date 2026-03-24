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
import { toast } from "sonner";
import { getItems, addItem, generateId, getCurrentUser } from "@/lib/store";

interface Doubt { id: string; user_id: string; title: string; description: string; subject: string; created_at: string; }
interface DoubtAnswer { id: string; doubt_id: string; user_id: string; answer: string; created_at: string; }

const subjects = ["Maths", "Physics", "C Programming", "DSA", "Java", "Python", "DBMS", "Networks", "Operating Systems", "Machine Learning", "Other"];
const getSubjectColor = (subj: string) => {
  const colors: Record<string, string> = { DSA: "bg-blue-100 text-blue-700", Java: "bg-orange-100 text-orange-700", Python: "bg-green-100 text-green-700", DBMS: "bg-purple-100 text-purple-700", Maths: "bg-red-100 text-red-700", Networks: "bg-cyan-100 text-cyan-700" };
  return colors[subj] || "bg-gray-100 text-gray-700";
};

export default function Academic() {
  const user = getCurrentUser();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [answers, setAnswers] = useState<Record<string, DoubtAnswer[]>>({});
  const [activeTab, setActiveTab] = useState("feed");
  const [title, setTitle] = useState(""); const [description, setDescription] = useState(""); const [subject, setSubject] = useState("DSA");
  const [answerText, setAnswerText] = useState<Record<string, string>>({});
  const [expandedDoubt, setExpandedDoubt] = useState<string | null>(null);

  const refresh = () => { setDoubts(getItems<Doubt>("doubts")); };
  useEffect(() => { refresh(); }, []);

  const myDoubts = doubts.filter(d => d.user_id === user.id);

  const loadAnswers = (doubtId: string) => {
    const all = getItems<DoubtAnswer>("doubt_answers").filter(a => a.doubt_id === doubtId);
    setAnswers(prev => ({ ...prev, [doubtId]: all }));
  };

  const handleCreate = () => {
    if (!title || !description) { toast.error("Please fill all fields"); return; }
    addItem("doubts", { id: generateId(), user_id: user.id, title, description, subject, created_at: new Date().toISOString() });
    toast.success("Question posted!"); setTitle(""); setDescription(""); setSubject("DSA"); refresh(); setActiveTab("feed");
  };

  const handleAnswer = (doubtId: string) => {
    const text = answerText[doubtId];
    if (!text?.trim()) { toast.error("Write an answer"); return; }
    addItem("doubt_answers", { id: generateId(), doubt_id: doubtId, user_id: user.id, answer: text, created_at: new Date().toISOString() });
    toast.success("Answer posted!"); setAnswerText(prev => ({ ...prev, [doubtId]: "" })); loadAnswers(doubtId);
  };

  const toggleExpand = (doubtId: string) => {
    if (expandedDoubt === doubtId) setExpandedDoubt(null);
    else { setExpandedDoubt(doubtId); loadAnswers(doubtId); }
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
                <MessageCircle className="h-4 w-4 mr-2" />{expandedDoubt === doubt.id ? "Hide Answers" : "View/Answer"}
                {answers[doubt.id] && ` (${answers[doubt.id].length})`}
              </Button>
              {expandedDoubt === doubt.id && (
                <div className="space-y-3 mt-3 border-t pt-3">
                  {(answers[doubt.id] || []).map(a => (
                    <div key={a.id} className="bg-muted/50 p-3 rounded-lg"><p className="text-sm">{a.answer}</p><p className="text-xs text-muted-foreground mt-1">{new Date(a.created_at).toLocaleString()}</p></div>
                  ))}
                  {doubt.user_id !== user.id && (
                    <div className="flex gap-2">
                      <Input placeholder="Write your answer..." value={answerText[doubt.id] || ""} onChange={e => setAnswerText(prev => ({ ...prev, [doubt.id]: e.target.value }))} />
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-module-academic/20"><BookOpen className="h-5 w-5 text-module-academic" /></div>
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
              {doubts.length === 0 ? <div className="text-center py-12 text-muted-foreground"><HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No questions posted yet</p></div>
              : doubts.map((d, i) => renderDoubtCard(d, i))}
            </div>
          </TabsContent>
          <TabsContent value="create">
            <Card><CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4"><Plus className="h-5 w-5 text-module-academic" /><h2 className="font-semibold text-lg">Post Academic Doubt</h2></div>
              <Input placeholder="Title (e.g., Need help with Binary Search)" value={title} onChange={e => setTitle(e.target.value)} />
              <Textarea placeholder="Describe your doubt in detail..." value={description} onChange={e => setDescription(e.target.value)} rows={4} />
              <Select value={subject} onValueChange={setSubject}><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger><SelectContent>{subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
              <Button onClick={handleCreate} className="w-full bg-module-academic hover:bg-module-academic/90">Post Question</Button>
            </CardContent></Card>
          </TabsContent>
          <TabsContent value="mine">
            <div className="space-y-4">
              {myDoubts.length === 0 ? <div className="text-center py-12 text-muted-foreground"><BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" /><p>No questions posted yet</p></div>
              : myDoubts.map((d, i) => renderDoubtCard(d, i))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
}
