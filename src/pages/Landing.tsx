import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car, Package, Users, BookOpen, Handshake, Heart } from "lucide-react";

const features = [
  { icon: Car, label: "Rides", description: "Share rides safely" },
  { icon: Package, label: "Rent", description: "Borrow & lend items" },
  { icon: Users, label: "Errands", description: "Get tasks done" },
  { icon: Heart, label: "Volunteer", description: "Help your campus" },
  { icon: Handshake, label: "Collaborate", description: "Team up on projects" },
  { icon: BookOpen, label: "Academic", description: "Peer tutoring" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-hero overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl"
        />
      </div>

      <div className="relative z-10 container min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <span className="text-xl font-bold text-white">C</span>
            </div>
            <span className="font-display text-2xl font-bold text-white">
              CampusConnect
            </span>
          </div>
          <Link to="/signup">
            <Button variant="glass" size="sm">
              Sign Up
            </Button>
          </Link>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Your Campus,
              <br />
              <span className="text-white/90">Connected</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto mb-10">
              The all-in-one platform for student collaboration, support, and community building.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/login">
              <Button size="xl" className="bg-white text-primary hover:bg-white/90 shadow-xl">
                Get Started
              </Button>
            </Link>
            <Button size="xl" variant="glass" className="border-white/30">
              Learn More
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full max-w-4xl"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="glass-dark rounded-2xl p-4 text-center hover:bg-white/20 transition-colors cursor-pointer"
              >
                <feature.icon className="h-8 w-8 text-white mx-auto mb-2" />
                <h3 className="font-semibold text-white text-sm">{feature.label}</h3>
                <p className="text-white/60 text-xs mt-1">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-white/60 text-sm">
          © 2026 CampusConnect. Made for students, by students.
        </footer>
      </div>
    </div>
  );
}
