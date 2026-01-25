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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Sparkles, GraduationCap, HelpCircle } from "lucide-react";
import { toast } from "sonner";

interface AcademicPost {
  id: number;
  title: string;
  description: string;
  subject: string;
  createdBy: string;
  helpers: string[];
}

const currentUser = "Yashaswini";
const userSkills = ["Java", "DSA", "DBMS", "Python"];

const subjects = [
  "Maths",
  "Physics",
  "C Programming",
  "DSA",
  "Java",
  "Python",
  "DBMS",
  "Networks",
  "Operating Systems",
  "Machine Learning",
  "Other"
];

export default function Academic() {
  const [posts, setPosts] = useState<AcademicPost[]>([]);
  const [activeTab, setActiveTab] = useState("feed");
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("DSA");

  useEffect(() => {
    const stored = localStorage.getItem("academic_posts");
    if (stored) {
      setPosts(JSON.parse(stored));
    } else {
      // Demo data
      const demoPosts: AcademicPost[] = [
        {
          id: 1,
          title: "Help with Binary Search Tree implementation",
          description: "I'm struggling with the delete operation in BST. Can someone explain the logic for deleting a node with two children?",
          subject: "DSA",
          createdBy: "Rahul Kumar",
          helpers: []
        },
        {
          id: 2,
          title: "DBMS Normalization doubt",
          description: "Can someone explain the difference between 3NF and BCNF with examples? The textbook explanation is confusing.",
          subject: "DBMS",
          createdBy: "Priya Singh",
          helpers: ["Anjali"]
        },
        {
          id: 3,
          title: "Java Multithreading concepts",
          description: "Need help understanding synchronization and deadlock prevention in Java. Preparing for placements.",
          subject: "Java",
          createdBy: "Vikram Patel",
          helpers: []
        },
        {
          id: 4,
          title: "Linear Algebra - Eigenvalues",
          description: "Having trouble calculating eigenvalues for 3x3 matrices. Any tips or resources?",
          subject: "Maths",
          createdBy: "Sneha Gupta",
          helpers: []
        },
        {
          id: 5,
          title: "Python decorators explanation needed",
          description: "I understand basic functions but decorators are confusing. Looking for simple examples.",
          subject: "Python",
          createdBy: currentUser,
          helpers: ["Arun", "Meera"]
        }
      ];
      setPosts(demoPosts);
      localStorage.setItem("academic_posts", JSON.stringify(demoPosts));
    }
  }, []);

  const savePosts = (updatedPosts: AcademicPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem("academic_posts", JSON.stringify(updatedPosts));
  };

  const handleCreatePost = () => {
    if (!title || !description) {
      toast.error("Please fill all fields");
      return;
    }

    const newPost: AcademicPost = {
      id: Date.now(),
      title,
      description,
      subject,
      createdBy: currentUser,
      helpers: []
    };

    savePosts([...posts, newPost]);
    setTitle("");
    setDescription("");
    setSubject("DSA");
    toast.success("Question posted successfully!");
    setActiveTab("feed");
  };

  const handleHelpStudent = (postId: number) => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        if (p.createdBy === currentUser) {
          toast.error("You created this post");
          return p;
        }
        if (p.helpers.includes(currentUser)) {
          toast.error("You already offered help");
          return p;
        }
        return { ...p, helpers: [...p.helpers, currentUser] };
      }
      return p;
    });
    savePosts(updatedPosts);
    toast.success("Your support was sent!");
  };

  const hasSkillMatch = (post: AcademicPost) => {
    return userSkills.map(s => s.toLowerCase()).includes(post.subject.toLowerCase());
  };

  const myPosts = posts.filter(p => p.createdBy === currentUser);
  const feedPosts = posts.filter(p => p.createdBy !== currentUser);
  const matchingPosts = feedPosts.filter(hasSkillMatch);
  const otherPosts = feedPosts.filter(p => !hasSkillMatch(p));

  const getSubjectColor = (subj: string) => {
    const colors: Record<string, string> = {
      "DSA": "bg-blue-100 text-blue-700",
      "Java": "bg-orange-100 text-orange-700",
      "Python": "bg-green-100 text-green-700",
      "DBMS": "bg-purple-100 text-purple-700",
      "Maths": "bg-red-100 text-red-700",
      "Networks": "bg-cyan-100 text-cyan-700",
      "Operating Systems": "bg-yellow-100 text-yellow-700",
      "Machine Learning": "bg-pink-100 text-pink-700",
    };
    return colors[subj] || "bg-gray-100 text-gray-700";
  };

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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-module-academic/20">
              <BookOpen className="h-5 w-5 text-module-academic" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Academic Support
            </h1>
          </div>
          <p className="text-muted-foreground">
            Get tutoring help or assist juniors with their studies
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="feed">Academic Feed</TabsTrigger>
            <TabsTrigger value="create">Ask for Help</TabsTrigger>
            <TabsTrigger value="mine">My Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <div className="space-y-6">
              {matchingPosts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-module-academic" />
                    <h2 className="font-semibold">You Can Help With These</h2>
                  </div>
                  <div className="space-y-4">
                    {matchingPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <Badge className={getSubjectColor(post.subject)}>{post.subject}</Badge>
                              <Badge className="bg-green-100 text-green-700">
                                <GraduationCap className="h-3 w-3 mr-1" />
                                You know this!
                              </Badge>
                            </div>
                            
                            <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">by {post.createdBy}</p>
                            <p className="text-sm text-muted-foreground mb-4">{post.description}</p>
                            
                            {post.helpers.length > 0 && (
                              <p className="text-sm text-muted-foreground mb-3">
                                <strong>{post.helpers.length}</strong> student(s) offered help
                              </p>
                            )}

                            <Button 
                              onClick={() => handleHelpStudent(post.id)}
                              className="w-full bg-module-academic hover:bg-module-academic/90"
                              disabled={post.helpers.includes(currentUser)}
                            >
                              {post.helpers.includes(currentUser) ? "Help Offered" : "Help Student"}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                {matchingPosts.length > 0 && <h2 className="font-semibold mb-4">Other Questions</h2>}
                {otherPosts.length === 0 && matchingPosts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No questions posted yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {otherPosts.map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden border-l-4 border-l-module-academic">
                          <CardContent className="p-4">
                            <Badge className={getSubjectColor(post.subject)}>{post.subject}</Badge>
                            
                            <h3 className="font-semibold text-lg mt-3 mb-1">{post.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">by {post.createdBy}</p>
                            <p className="text-sm text-muted-foreground mb-4">{post.description}</p>
                            
                            {post.helpers.length > 0 && (
                              <p className="text-sm text-muted-foreground mb-3">
                                <strong>{post.helpers.length}</strong> student(s) offered help
                              </p>
                            )}

                            <Button 
                              onClick={() => handleHelpStudent(post.id)}
                              className="w-full bg-module-academic hover:bg-module-academic/90"
                              disabled={post.helpers.includes(currentUser)}
                            >
                              {post.helpers.includes(currentUser) ? "Help Offered" : "Help Student"}
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Plus className="h-5 w-5 text-module-academic" />
                  <h2 className="font-semibold text-lg">Post Academic Doubt</h2>
                </div>

                <Input
                  placeholder="Title (e.g., Need help with Binary Search)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Describe your doubt in detail..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleCreatePost}
                  className="w-full bg-module-academic hover:bg-module-academic/90"
                >
                  Post Question
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mine">
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">My Academic Posts</h2>
              {myPosts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No questions posted yet</p>
                </div>
              ) : (
                myPosts.map(post => (
                  <Card key={post.id}>
                    <CardContent className="p-4">
                      <Badge className={getSubjectColor(post.subject)}>{post.subject}</Badge>
                      
                      <h3 className="font-semibold mt-3">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{post.description}</p>

                      <div>
                        <p className="text-sm font-medium mb-2">
                          Helpers ({post.helpers.length}):
                        </p>
                        {post.helpers.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No one has offered help yet</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {post.helpers.map(person => (
                              <div key={person} className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-module-academic/20 text-module-academic text-xs">
                                    {person.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-green-700">{person}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
}
