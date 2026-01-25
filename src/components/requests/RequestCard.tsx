import { motion } from "framer-motion";
import { Check, X, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Request {
  id: string;
  type: "ride" | "rent" | "errand" | "volunteer" | "collab" | "academic";
  title: string;
  description: string;
  from: {
    name: string;
    avatar?: string;
    rating?: number;
  };
  timestamp: string;
  status: "pending" | "accepted" | "rejected";
  metadata?: Record<string, string>;
}

interface RequestCardProps {
  request: Request;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  showActions?: boolean;
}

const typeColors = {
  ride: "bg-module-rides/10 text-module-rides border-module-rides/30",
  rent: "bg-module-rent/10 text-module-rent border-module-rent/30",
  errand: "bg-module-errands/10 text-module-errands border-module-errands/30",
  volunteer: "bg-module-volunteer/10 text-module-volunteer border-module-volunteer/30",
  collab: "bg-module-collab/10 text-module-collab border-module-collab/30",
  academic: "bg-module-academic/10 text-module-academic border-module-academic/30",
};

const typeLabels = {
  ride: "Ride Request",
  rent: "Rent Request",
  errand: "Errand",
  volunteer: "Volunteer",
  collab: "Collaboration",
  academic: "Academic Help",
};

export function RequestCard({ request, onAccept, onReject, showActions = true }: RequestCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      layout
      className="bg-card rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Avatar className="h-12 w-12 ring-2 ring-background shadow-md">
          <AvatarImage src={request.from.avatar} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {request.from.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground truncate">
              {request.from.name}
            </span>
            {request.from.rating && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                ⭐ {request.from.rating.toFixed(1)}
              </span>
            )}
          </div>
          
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${typeColors[request.type]}`}>
            {typeLabels[request.type]}
          </span>
          
          <h4 className="font-medium text-foreground mt-2">{request.title}</h4>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {request.description}
          </p>

          {/* Metadata */}
          {request.metadata && (
            <div className="flex flex-wrap gap-2 mt-3">
              {Object.entries(request.metadata).map(([key, value]) => (
                <span
                  key={key}
                  className="text-xs bg-secondary px-2 py-1 rounded-lg text-muted-foreground"
                >
                  {key}: <span className="text-foreground font-medium">{value}</span>
                </span>
              ))}
            </div>
          )}

          {/* Timestamp */}
          <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {request.timestamp}
          </div>
        </div>
      </div>

      {/* Actions */}
      {showActions && request.status === "pending" && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-border">
          <Button
            variant="success"
            className="flex-1"
            onClick={() => onAccept?.(request.id)}
          >
            <Check className="h-4 w-4 mr-1" />
            Accept
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onReject?.(request.id)}
          >
            <X className="h-4 w-4 mr-1" />
            Decline
          </Button>
        </div>
      )}

      {/* Status Badge */}
      {request.status !== "pending" && (
        <div className="mt-4 pt-4 border-t border-border">
          <span
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
              request.status === "accepted"
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            }`}
          >
            {request.status === "accepted" ? (
              <>
                <Check className="h-4 w-4 mr-1" /> Accepted
              </>
            ) : (
              <>
                <X className="h-4 w-4 mr-1" /> Declined
              </>
            )}
          </span>
        </div>
      )}
    </motion.div>
  );
}
