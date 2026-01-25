import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  color: "rent" | "rides" | "errands" | "volunteer" | "collab" | "academic";
  count?: number;
}

const colorStyles = {
  rent: {
    bg: "bg-gradient-to-br from-module-rent/20 to-module-rent/5",
    icon: "bg-module-rent text-white",
    border: "hover:border-module-rent/50",
  },
  rides: {
    bg: "bg-gradient-to-br from-module-rides/20 to-module-rides/5",
    icon: "bg-module-rides text-white",
    border: "hover:border-module-rides/50",
  },
  errands: {
    bg: "bg-gradient-to-br from-module-errands/20 to-module-errands/5",
    icon: "bg-module-errands text-white",
    border: "hover:border-module-errands/50",
  },
  volunteer: {
    bg: "bg-gradient-to-br from-module-volunteer/20 to-module-volunteer/5",
    icon: "bg-module-volunteer text-white",
    border: "hover:border-module-volunteer/50",
  },
  collab: {
    bg: "bg-gradient-to-br from-module-collab/20 to-module-collab/5",
    icon: "bg-module-collab text-white",
    border: "hover:border-module-collab/50",
  },
  academic: {
    bg: "bg-gradient-to-br from-module-academic/20 to-module-academic/5",
    icon: "bg-module-academic text-white",
    border: "hover:border-module-academic/50",
  },
};

export function ModuleCard({ title, description, icon: Icon, path, color, count }: ModuleCardProps) {
  const styles = colorStyles[color];

  return (
    <Link to={path}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative overflow-hidden rounded-2xl border-2 border-transparent p-6 transition-all duration-300 ${styles.bg} ${styles.border} cursor-pointer`}
      >
        {/* Count Badge */}
        {count !== undefined && count > 0 && (
          <div className="absolute top-4 right-4">
            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-destructive px-2 text-xs font-bold text-white">
              {count}
            </span>
          </div>
        )}

        {/* Icon */}
        <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${styles.icon} shadow-lg mb-4`}>
          <Icon className="h-7 w-7" />
        </div>

        {/* Content */}
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        {/* Arrow */}
        <div className="absolute bottom-4 right-4 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </motion.div>
    </Link>
  );
}
