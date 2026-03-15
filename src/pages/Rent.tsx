import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Package, MapPin, Clock, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface LendItem {
  id: string;
  user_id: string;
  user_email?: string;
  name: string;
  description?: string;
  available_until: string;
  location: string;
  created_at: string;
}

export default function Rent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("borrow");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<LendItem[]>([]);
  const [myItems, setMyItems] = useState<LendItem[]>([]);
  const [requestedItems, setRequestedItems] = useState<string[]>([]);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");
  const [location, setLocation] = useState("");
  const [posting, setPosting] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase.from("lend_items").select("*").order("created_at", { ascending: false });
    if (data) {
      setItems(data as LendItem[]);
      if (user) setMyItems((data as LendItem[]).filter(i => i.user_id === user.id));
    }
  };

  useEffect(() => { fetchItems(); }, [user]);

  const handlePostItem = async () => {
    if (!name || !availableUntil || !location) { toast.error("Please fill required fields"); return; }
    setPosting(true);
    const { error } = await supabase.from("lend_items").insert({
      user_id: user?.id,
      user_email: user?.email,
      name,
      description: description || null,
      available_until: availableUntil,
      location,
    });
    setPosting(false);
    if (error) { toast.error(error.message); }
    else {
      toast.success("Item posted!");
      setName(""); setDescription(""); setAvailableUntil(""); setLocation("");
      fetchItems();
    }
  };

  const handleRequestItem = (id: string) => {
    setRequestedItems(prev => [...prev, id]);
    toast.success("Request sent!");
  };

  const browseItems = items.filter(i => i.user_id !== user?.id && i.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
                <Search className="h-4 w-4 mr-2" />Borrow
              </TabsTrigger>
              <TabsTrigger value="lend" className="rounded-xl data-[state=active]:bg-card">
                <Plus className="h-4 w-4 mr-2" />Lend
              </TabsTrigger>
            </TabsList>

            <TabsContent value="borrow" className="mt-0 space-y-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search for items..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-12 h-12 rounded-2xl" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {browseItems.map((item, index) => (
                    <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-module-rent/10 flex-shrink-0">
                              <Tag className="h-6 w-6 text-module-rent" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                              {item.description && <p className="text-xs text-muted-foreground truncate">{item.description}</p>}
                            </div>
                          </div>
                          <div className="space-y-2 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>Available: {item.available_until}</span></div>
                            <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{item.location}</span></div>
                          </div>
                          <div className="flex items-center gap-2 pt-3 border-t border-border mb-4">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="bg-module-rent/20 text-module-rent text-xs font-semibold">
                                {(item.user_email || "S")[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{item.user_email || "Student"}</span>
                          </div>
                          <Button className="w-full" size="sm" variant={requestedItems.includes(item.id) ? "secondary" : "default"} disabled={requestedItems.includes(item.id)} onClick={() => handleRequestItem(item.id)}>
                            {requestedItems.includes(item.id) ? "Requested ✓" : "Request"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {browseItems.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-semibold text-foreground mb-2">No items found</h3>
                  <p className="text-sm text-muted-foreground">Try a different search term</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="lend" className="mt-0 space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-lg">Post an Item</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Item Name</Label>
                    <Input placeholder="e.g., Scientific Calculator" className="h-12 rounded-xl" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Description (Optional)</Label>
                    <Textarea placeholder="Add details about the item..." className="rounded-xl resize-none" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Available Until</Label>
                      <Input placeholder="e.g., 5 PM Today" className="h-12 rounded-xl" value={availableUntil} onChange={e => setAvailableUntil(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input placeholder="e.g., Hostel A" className="h-12 rounded-xl" value={location} onChange={e => setLocation(e.target.value)} />
                    </div>
                  </div>
                  <Button size="lg" className="w-full" onClick={handlePostItem} disabled={posting}>
                    <Plus className="h-4 w-4 mr-2" />{posting ? "Posting..." : "Post Item"}
                  </Button>
                </CardContent>
              </Card>

              {myItems.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Your Lend Posts</h3>
                  <div className="space-y-3">
                    {myItems.map(item => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">{item.location} • {item.available_until}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      <BottomNav />
    </div>
  );
}
