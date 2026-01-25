import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Package, MapPin, Clock, Tag, Star } from "lucide-react";

interface RentItem {
  id: string;
  name: string;
  lender: { name: string; rating: number };
  availableUntil: string;
  location: string;
  description?: string;
}

const availableItems: RentItem[] = [
  {
    id: "1",
    name: "Scientific Calculator",
    lender: { name: "Anjali M", rating: 4.6 },
    availableUntil: "5 PM Today",
    location: "Hostel Block A",
    description: "Casio FX-991ES, perfect for exams",
  },
  {
    id: "2",
    name: "Lab Coat",
    lender: { name: "Rahul K", rating: 4.8 },
    availableUntil: "Tomorrow",
    location: "Chemistry Lab",
    description: "Clean, size M, white",
  },
  {
    id: "3",
    name: "DBMS Textbook",
    lender: { name: "Sneha R", rating: 4.5 },
    availableUntil: "1 Week",
    location: "Library",
    description: "Korth 6th Edition",
  },
  {
    id: "4",
    name: "Laptop Charger",
    lender: { name: "Vikram S", rating: 4.7 },
    availableUntil: "Evening",
    location: "CSE Building",
    description: "Type-C 65W",
  },
];

export default function Rent() {
  const [activeTab, setActiveTab] = useState("borrow");
  const [searchQuery, setSearchQuery] = useState("");
  const [requestedItems, setRequestedItems] = useState<string[]>([]);

  const handleRequestItem = (id: string) => {
    setRequestedItems((prev) => [...prev, id]);
  };

  const filteredItems = availableItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <Header showBack title="Rent & Lend" />

      <main className="container py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-module-rent/20">
              <Package className="h-7 w-7 text-module-rent" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Rent & Lend</h1>
              <p className="text-muted-foreground text-sm">Borrow or share items with students</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12 rounded-2xl bg-secondary p-1">
              <TabsTrigger value="borrow" className="rounded-xl data-[state=active]:bg-card">
                <Search className="h-4 w-4 mr-2" />
                Borrow
              </TabsTrigger>
              <TabsTrigger value="lend" className="rounded-xl data-[state=active]:bg-card">
                <Plus className="h-4 w-4 mr-2" />
                Lend
              </TabsTrigger>
            </TabsList>

            {/* Borrow Tab */}
            <TabsContent value="borrow" className="mt-0 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-2xl"
                />
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-module-rent/10 flex-shrink-0">
                              <Tag className="h-6 w-6 text-module-rent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                              {item.description && (
                                <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Available: {item.availableUntil}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{item.location}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-border">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-module-rent/20 text-module-rent text-xs font-semibold">
                                  {item.lender.name.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{item.lender.name}</span>
                              <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                                <Star className="h-3 w-3 fill-warning text-warning" />
                                {item.lender.rating}
                              </span>
                            </div>
                          </div>

                          <Button
                            className="w-full mt-4"
                            size="sm"
                            variant={requestedItems.includes(item.id) ? "secondary" : "default"}
                            disabled={requestedItems.includes(item.id)}
                            onClick={() => handleRequestItem(item.id)}
                          >
                            {requestedItems.includes(item.id) ? "Requested ✓" : "Request"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No items found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try a different search term
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Lend Tab */}
            <TabsContent value="lend" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Post an Item</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Item Name</Label>
                    <Input placeholder="e.g., Scientific Calculator" className="h-12 rounded-xl" />
                  </div>

                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Textarea placeholder="Add details about the item..." className="rounded-xl resize-none" rows={3} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Available Until</Label>
                      <Input placeholder="e.g., 5 PM Today" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input placeholder="e.g., Hostel A" className="h-12 rounded-xl" />
                    </div>
                  </div>

                  <Button variant="hero" size="lg" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Item
                  </Button>
                </CardContent>
              </Card>

              {/* My Posts */}
              <div className="mt-6">
                <h3 className="font-semibold text-foreground mb-4">Your Lend Posts</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Laptop Charger</h4>
                        <p className="text-sm text-muted-foreground">No requests yet</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
