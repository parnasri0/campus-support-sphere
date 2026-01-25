import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { RequestCard, Request } from "@/components/requests/RequestCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Clock, X } from "lucide-react";

const initialRequests: Request[] = [
  {
    id: "1",
    type: "ride",
    title: "Hostel → Metro Station",
    description: "Need a ride to the metro station for my train at 6 PM. Can share fuel cost.",
    from: { name: "Rahul Sharma", rating: 4.8 },
    timestamp: "2 minutes ago",
    status: "pending",
    metadata: { Time: "5:30 PM", Vehicle: "Bike", Seats: "1" },
  },
  {
    id: "2",
    type: "ride",
    title: "Library → Main Gate",
    description: "Quick ride needed after evening study session.",
    from: { name: "Priya Patel", rating: 4.5 },
    timestamp: "15 minutes ago",
    status: "pending",
    metadata: { Time: "8:00 PM", Vehicle: "Car" },
  },
  {
    id: "3",
    type: "rent",
    title: "Scientific Calculator",
    description: "Need a scientific calculator for my engineering mechanics exam tomorrow.",
    from: { name: "Amit Kumar", rating: 4.2 },
    timestamp: "1 hour ago",
    status: "pending",
    metadata: { Duration: "1 day", Return: "Lab Building" },
  },
  {
    id: "4",
    type: "volunteer",
    title: "Cultural Fest Volunteer",
    description: "Request to join as a backstage volunteer for the annual cultural fest.",
    from: { name: "Sneha Reddy", rating: 4.9 },
    timestamp: "3 hours ago",
    status: "pending",
    metadata: { Date: "Feb 15", Role: "Backstage" },
  },
  {
    id: "5",
    type: "volunteer",
    title: "NSS Blood Donation Camp",
    description: "Want to help organize the blood donation drive next week.",
    from: { name: "Vikram Singh", rating: 4.7 },
    timestamp: "5 hours ago",
    status: "pending",
    metadata: { Date: "Feb 20", Role: "Coordinator" },
  },
  {
    id: "6",
    type: "volunteer",
    title: "Tree Plantation Drive",
    description: "Interested in volunteering for the campus green initiative.",
    from: { name: "Ananya Gupta", rating: 4.6 },
    timestamp: "Yesterday",
    status: "pending",
    metadata: { Date: "Feb 18", Spots: "25" },
  },
];

export default function Requests() {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [activeTab, setActiveTab] = useState("pending");

  const handleAccept = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "accepted" as const } : r))
    );
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r))
    );
  };

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const acceptedRequests = requests.filter((r) => r.status === "accepted");
  const rejectedRequests = requests.filter((r) => r.status === "rejected");

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header showBack title="Requests" />

      <main className="container py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Manage Requests
          </h1>
          <p className="text-muted-foreground mb-6">
            Review and respond to incoming requests
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 h-12 rounded-2xl bg-secondary p-1">
              <TabsTrigger
                value="pending"
                className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <Clock className="h-4 w-4 mr-2" />
                Pending
                {pendingRequests.length > 0 && (
                  <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                    {pendingRequests.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="accepted"
                className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <Check className="h-4 w-4 mr-2" />
                Accepted
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm"
              >
                <X className="h-4 w-4 mr-2" />
                Declined
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-0">
              <AnimatePresence mode="popLayout">
                {pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <RequestCard
                        key={request.id}
                        request={request}
                        onAccept={handleAccept}
                        onReject={handleReject}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Clock className="h-12 w-12 text-muted-foreground/50" />}
                    title="No pending requests"
                    description="You're all caught up! New requests will appear here."
                  />
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="accepted" className="mt-0">
              <AnimatePresence mode="popLayout">
                {acceptedRequests.length > 0 ? (
                  <div className="space-y-4">
                    {acceptedRequests.map((request) => (
                      <RequestCard key={request.id} request={request} showActions={false} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<Check className="h-12 w-12 text-muted-foreground/50" />}
                    title="No accepted requests"
                    description="Requests you accept will appear here."
                  />
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="rejected" className="mt-0">
              <AnimatePresence mode="popLayout">
                {rejectedRequests.length > 0 ? (
                  <div className="space-y-4">
                    {rejectedRequests.map((request) => (
                      <RequestCard key={request.id} request={request} showActions={false} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={<X className="h-12 w-12 text-muted-foreground/50" />}
                    title="No declined requests"
                    description="Requests you decline will appear here."
                  />
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      {icon}
      <h3 className="font-semibold text-foreground mt-4 mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
    </motion.div>
  );
}
