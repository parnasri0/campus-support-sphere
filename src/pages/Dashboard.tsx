import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { Car, Package, Users, BookOpen, Handshake, Heart, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const modules = [
  {
    title: "Rides",
    description: "Share rides with fellow students, save money and travel safely.",
    icon: Car,
    path: "/rides",
    color: "rides" as const,
    count: 2,
  },
  {
    title: "Rent & Lend",
    description: "Borrow or lend items like calculators, books, and more.",
    icon: Package,
    path: "/rent",
    color: "rent" as const,
    count: 1,
  },
  {
    title: "Errands",
    description: "Get help with quick tasks or help others around campus.",
    icon: Users,
    path: "/errands",
    color: "errands" as const,
    count: 0,
  },
  {
    title: "Volunteering",
    description: "Join campus events and make a difference in your community.",
    icon: Heart,
    path: "/volunteering",
    color: "volunteer" as const,
    count: 3,
  },
  {
    title: "Collaboration",
    description: "Find teammates for projects or get help with assignments.",
    icon: Handshake,
    path: "/collaboration",
    color: "collab" as const,
    count: 0,
  },
  {
    title: "Academic Support",
    description: "Get tutoring help or assist juniors with their studies.",
    icon: BookOpen,
    path: "/academic",
    color: "academic" as const,
    count: 0,
  },
];

export default function Dashboard() {
  const totalRequests = modules.reduce((sum, m) => sum + (m.count || 0), 0);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header notificationCount={totalRequests} />

      <main className="container py-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Good morning, Yashaswini! 👋
          </h1>
          <p className="text-muted-foreground">
            What would you like to do today?
          </p>
        </motion.div>

        {/* Quick Actions */}
        {totalRequests > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Link to="/requests">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-module-collab/10 border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
                    <Bell className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {totalRequests} Pending Request{totalRequests !== 1 ? "s" : ""}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Tap to review and respond
                    </p>
                  </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Modules Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-display text-xl font-semibold text-foreground mb-4">
            Explore Modules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
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
