import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Edit3, LogOut, Settings, Car, Package, Users, Heart, BookOpen, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

const skills = [
  "Backend Development",
  "Academic Support",
  "Volunteering",
  "Errands",
  "Python",
  "UI/UX",
];

const stats = [
  { label: "Rides Shared", value: 12, icon: Car, color: "bg-module-rides/10 text-module-rides" },
  { label: "Items Lent", value: 8, icon: Package, color: "bg-module-rent/10 text-module-rent" },
  { label: "Errands Done", value: 23, icon: Users, color: "bg-module-errands/10 text-module-errands" },
  { label: "Events Joined", value: 5, icon: Heart, color: "bg-module-volunteer/10 text-module-volunteer" },
];

export default function Profile() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header showBack title="Profile" />

      <main className="container py-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="relative inline-block mb-4">
            <Avatar className="h-28 w-28 ring-4 ring-primary/20 shadow-xl">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-module-collab text-3xl font-bold text-white">
                YS
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-card shadow-lg border border-border hover:bg-secondary transition-colors">
              <Edit3 className="h-4 w-4" />
            </button>
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground mb-1">
            Yashaswini
          </h1>
          <p className="text-muted-foreground mb-3">2nd Year • CSE</p>

          <div className="flex items-center justify-center gap-1 text-warning">
            {[1, 2, 3, 4].map((i) => (
              <Star key={i} className="h-5 w-5 fill-current" />
            ))}
            <Star className="h-5 w-5 fill-current opacity-50" />
            <span className="text-foreground font-semibold ml-2">4.5</span>
            <span className="text-muted-foreground text-sm">(32 reviews)</span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`flex items-center gap-3 p-4 rounded-2xl ${stat.color}`}
            >
              <stat.icon className="h-6 w-6" />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs opacity-80">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Handshake className="h-5 w-5 text-primary" />
                Skills & Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="rounded-full px-3 py-1">
                    {skill}
                  </Badge>
                ))}
                <button className="flex items-center gap-1 px-3 py-1 rounded-full border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <span>+</span> Add
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <Button variant="outline" size="lg" className="w-full justify-start">
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Button>
          <Button variant="outline" size="lg" className="w-full justify-start">
            <Edit3 className="h-5 w-5 mr-3" />
            Edit Profile
          </Button>
          <Link to="/">
            <Button variant="destructive" size="lg" className="w-full justify-start">
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </Link>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
