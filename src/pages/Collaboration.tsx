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
import { Handshake, Plus, Sparkles, Code, Users, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface CollabPost {
  id: number;
  title: string;
  description: string;
  skillsNeeded: string[];
  type: string;
  createdBy: string;
  interested: string[];
}

const currentUser = "Yashaswini";
const userSkills = ["React", "TypeScript", "UI/UX", "Python"];

const collabTypes = [
  { value: "Project", label: "Project", icon: Code },
  { value: "Assignment Help", label: "Assignment Help", icon: BookOpen },
  { value: "Technical Support", label: "Technical Support", icon: Sparkles },
  { value: "Study Group", label: "Study Group", icon: Users },
  { value: "Other", label: "Other", icon: Handshake },
];

export default function Collaboration() {
  const [posts, setPosts] = useState<CollabPost[]>([]);
  const [activeTab, setActiveTab] = useState("feed");
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [type, setType] = useState("Project");

  useEffect(() => {
    const stored = localStorage.getItem("collab_posts");
    if (stored) {
      setPosts(JSON.parse(stored));
    } else {
      // Demo data
      const demoPosts: CollabPost[] = [
        {
          id: 1,
          title: "Need Backend Developer for Hackathon",
          description: "Building a student marketplace app for the upcoming hackathon. Need someone with Node.js/Express experience.",
          skillsNeeded: ["node.js", "express", "mongodb"],
          type: "Project",
          createdBy: "Rahul Kumar",
          interested: []
        },
        {
          id: 2,
          title: "ML Project Partner Needed",
          description: "Working on a sentiment analysis project for social media data. Looking for someone familiar with NLP.",
          skillsNeeded: ["python", "machine learning", "nlp"],
          type: "Project",
          createdBy: "Priya Singh",
          interested: ["Vikram"]
        },
        {
          id: 3,
          title: "UI/UX Help for Portfolio",
          description: "Need help designing a modern portfolio website. Looking for someone with Figma experience.",
          skillsNeeded: ["ui/ux", "figma", "react"],
          type: "Technical Support",
          createdBy: "Anjali Sharma",
          interested: []
        },
        {
          id: 4,
          title: "Study Group for GATE Prep",
          description: "Forming a study group for GATE 2027 CS preparation. Daily 2-hour sessions.",
          skillsNeeded: ["dsa", "algorithms", "dbms"],
          type: "Study Group",
          createdBy: currentUser,
          interested: ["Sneha", "Arun"]
        }
      ];
      setPosts(demoPosts);
      localStorage.setItem("collab_posts", JSON.stringify(demoPosts));
    }
  }, []);

  const savePosts = (updatedPosts: CollabPost[]) => {
    setPosts(updatedPosts);
    localStorage.setItem("collab_posts", JSON.stringify(updatedPosts));
  };

  const handleCreatePost = () => {
    if (!title || !description || !skills) {
      toast.error("Please fill all fields");
      return;
    }

    const newPost: CollabPost = {
      id: Date.now(),
      title,
      description,
      skillsNeeded: skills.toLowerCase().split(",").map(s => s.trim()),
      type,
      createdBy: currentUser,
      interested: []
    };

    savePosts([...posts, newPost]);
    setTitle("");
    setDescription("");
    setSkills("");
    setType("Project");
    toast.success("Collaboration post created!");
    setActiveTab("feed");
  };

  const handleShowInterest = (postId: number) => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        if (p.createdBy === currentUser) {
          toast.error("You created this post");
          return p;
        }
        if (p.interested.includes(currentUser)) {
          toast.error("You already showed interest");
          return p;
        }
        return { ...p, interested: [...p.interested, currentUser] };
      }
      return p;
    });
    savePosts(updatedPosts);
    toast.success("Interest sent!");
  };

  const hasSkillMatch = (post: CollabPost) => {
    return post.skillsNeeded.some(skill =>
      userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
    );
  };

  const myPosts = posts.filter(p => p.createdBy === currentUser);
  const feedPosts = posts.filter(p => p.createdBy !== currentUser);
  const matchingPosts = feedPosts.filter(hasSkillMatch);
  const otherPosts = feedPosts.filter(p => !hasSkillMatch(p));

  const getTypeIcon = (typeValue: string) => {
    const found = collabTypes.find(t => t.value === typeValue);
    return found ? found.icon : Handshake;
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
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-module-collab/20">
              <Handshake className="h-5 w-5 text-module-collab" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Collaboration
            </h1>
          </div>
          <p className="text-muted-foreground">
            Find teammates for projects or get help with assignments
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="feed">Collab Feed</TabsTrigger>
            <TabsTrigger value="create">Post Request</TabsTrigger>
            <TabsTrigger value="mine">My Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <div className="space-y-6">
              {matchingPosts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-5 w-5 text-module-collab" />
                    <h2 className="font-semibold">Matches Your Skills</h2>
                  </div>
                  <div className="space-y-4">
                    {matchingPosts.map((post, index) => {
                      const TypeIcon = getTypeIcon(post.type);
                      return (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="overflow-hidden border-l-4 border-l-green-500">
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                  <TypeIcon className="h-4 w-4 text-muted-foreground" />
                                  <Badge variant="outline">{post.type}</Badge>
                                </div>
                                <Badge className="bg-green-100 text-green-700">Skill Match!</Badge>
                              </div>
                              
                              <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                              <p className="text-sm text-muted-foreground mb-3">by {post.createdBy}</p>
                              <p className="text-sm text-muted-foreground mb-4">{post.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                {post.skillsNeeded.map(skill => (
                                  <Badge 
                                    key={skill} 
                                    variant="secondary"
                                    className={userSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase()) 
                                      ? "bg-green-100 text-green-700" 
                                      : ""}
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              </div>

                              <Button 
                                onClick={() => handleShowInterest(post.id)}
                                className="w-full bg-module-collab hover:bg-module-collab/90"
                                disabled={post.interested.includes(currentUser)}
                              >
                                {post.interested.includes(currentUser) ? "Interest Sent" : "I'm Interested"}
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div>
                {matchingPosts.length > 0 && <h2 className="font-semibold mb-4">Other Opportunities</h2>}
                {otherPosts.length === 0 && matchingPosts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No collaboration posts available
                  </div>
                ) : (
                  <div className="space-y-4">
                    {otherPosts.map((post, index) => {
                      const TypeIcon = getTypeIcon(post.type);
                      return (
                        <motion.div
                          key={post.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="overflow-hidden border-l-4 border-l-module-collab">
                            <CardContent className="p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <TypeIcon className="h-4 w-4 text-muted-foreground" />
                                <Badge variant="outline">{post.type}</Badge>
                              </div>
                              
                              <h3 className="font-semibold text-lg mb-1">{post.title}</h3>
                              <p className="text-sm text-muted-foreground mb-3">by {post.createdBy}</p>
                              <p className="text-sm text-muted-foreground mb-4">{post.description}</p>
                              
                              <div className="flex flex-wrap gap-2 mb-4">
                                {post.skillsNeeded.map(skill => (
                                  <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                              </div>

                              <Button 
                                onClick={() => handleShowInterest(post.id)}
                                className="w-full bg-module-collab hover:bg-module-collab/90"
                                disabled={post.interested.includes(currentUser)}
                              >
                                {post.interested.includes(currentUser) ? "Interest Sent" : "I'm Interested"}
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Plus className="h-5 w-5 text-module-collab" />
                  <h2 className="font-semibold text-lg">Create Collaboration Request</h2>
                </div>

                <Input
                  placeholder="Title (e.g., Need Backend Dev for Hackathon)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Describe what you need..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
                <Input
                  placeholder="Skills Needed (comma separated, e.g., React, Node.js, Python)"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {collabTypes.map(t => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleCreatePost}
                  className="w-full bg-module-collab hover:bg-module-collab/90"
                >
                  Post Request
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mine">
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">My Collaboration Posts</h2>
              {myPosts.length === 0 ? (
                <p className="text-muted-foreground text-center py-12">No posts created yet</p>
              ) : (
                myPosts.map(post => (
                  <Card key={post.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{post.type}</Badge>
                      </div>
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{post.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.skillsNeeded.map(skill => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">
                          Interested ({post.interested.length}):
                        </p>
                        {post.interested.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No responses yet</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {post.interested.map(person => (
                              <div key={person} className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="bg-module-collab/20 text-module-collab text-xs">
                                    {person.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{person}</span>
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
