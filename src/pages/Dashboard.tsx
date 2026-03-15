import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { Car, Package, Users, BookOpen, Handshake, Heart, Bell, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const modules = [
  { title: "Rides", description: "Share rides with fellow students.", icon: Car, path: "/rides", color: "rides" as const, count: 0 },
  { title: "Rent & Lend", description: "Borrow or lend items.", icon: Package, path: "/rent", color: "rent" as const, count: 0 },
  { title: "Errands", description: "Get help with quick tasks.", icon: Users, path: "/errands", color: "errands" as const, count: 0 },
  { title: "Volunteering", description: "Join campus events.", icon: Heart, path: "/volunteering", color: "volunteer" as const, count: 0 },
  { title: "Collaboration", description: "Find teammates for projects.", icon: Handshake, path: "/collaboration", color: "collab" as const, count: 0 },
  { title: "Academic Support", description: "Post & answer doubts.", icon: BookOpen, path: "/academic", color: "academic" as const, count: 0 },
  
];

export default function Dashboard() {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student";

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header />
      <main className="container py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Hello, {displayName}! 👋
          </h1>
          <p className="text-muted-foreground">What would you like to do today?</p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">Explore Modules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module, index) => (
              <motion.div key={module.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}>
                <ModuleCard {...module} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
