import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit3, LogOut, Settings, Handshake } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const skills = ["Backend Development", "Academic Support", "Volunteering", "Python", "UI/UX"];

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header showBack title="Profile" />
      <main className="container py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Avatar className="h-28 w-28 ring-4 ring-primary/20 shadow-xl mx-auto mb-4">
            <AvatarFallback className="bg-gradient-to-br from-primary to-module-collab text-3xl font-bold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h1 className="font-display text-2xl font-bold text-foreground mb-1">{displayName}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Handshake className="h-5 w-5 text-primary" />Skills & Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="rounded-full px-3 py-1">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3">
          <Button variant="outline" size="lg" className="w-full justify-start"><Settings className="h-5 w-5 mr-3" />Settings</Button>
          <Button variant="outline" size="lg" className="w-full justify-start"><Edit3 className="h-5 w-5 mr-3" />Edit Profile</Button>
          <Button variant="destructive" size="lg" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-3" />Logout
          </Button>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
