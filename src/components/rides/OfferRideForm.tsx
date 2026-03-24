import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { LOCATIONS, VEHICLE_TYPES, PRICING_METHODS, GENDER_OPTIONS } from "@/types/rides";
import { addItem, generateId, getCurrentUser } from "@/lib/store";

interface OfferRideFormProps {
  onPosted: () => void;
}

export function OfferRideForm({ onPosted }: OfferRideFormProps) {
  const user = getCurrentUser();
  const [form, setForm] = useState({
    from_location: "", to_location: "", departure_time: "", expected_arrival: "",
    vehicle: "", seats: "", gender_preference: "", pricing_method: "", contact_number: "",
  });

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    const { from_location, to_location, departure_time, expected_arrival, vehicle, seats, gender_preference, pricing_method, contact_number } = form;
    if (!from_location || !to_location || !departure_time || !expected_arrival || !vehicle || !seats || !gender_preference || !pricing_method || !contact_number) {
      toast.error("Please fill all fields"); return;
    }
    addItem("rides", {
      id: generateId(), user_id: user.id, user_email: user.email,
      from_location, to_location, departure_time, expected_arrival,
      vehicle, seats: Number(seats), gender_preference, pricing_method, contact_number,
      created_at: new Date().toISOString(),
    });
    toast.success("Ride posted successfully!");
    setForm({ from_location: "", to_location: "", departure_time: "", expected_arrival: "", vehicle: "", seats: "", gender_preference: "", pricing_method: "", contact_number: "" });
    onPosted();
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-lg">Offer a Ride</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Gender Preference</Label>
          <Select value={form.gender_preference} onValueChange={v => update("gender_preference", v)}>
            <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Who can request?" /></SelectTrigger>
            <SelectContent>{GENDER_OPTIONS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Start Point</Label>
          <Select value={form.from_location} onValueChange={v => update("from_location", v)}>
            <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select start point" /></SelectTrigger>
            <SelectContent>{LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Destination</Label>
          <Select value={form.to_location} onValueChange={v => update("to_location", v)}>
            <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select destination" /></SelectTrigger>
            <SelectContent>{LOCATIONS.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Departure Time</Label><Input type="time" value={form.departure_time} onChange={e => update("departure_time", e.target.value)} className="h-12 rounded-xl" /></div>
          <div className="space-y-2"><Label>Expected Arrival</Label><Input type="time" value={form.expected_arrival} onChange={e => update("expected_arrival", e.target.value)} className="h-12 rounded-xl" /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Vehicle Type</Label>
            <Select value={form.vehicle} onValueChange={v => update("vehicle", v)}>
              <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>{VEHICLE_TYPES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Available Seats</Label><Input type="number" min="1" placeholder="1" value={form.seats} onChange={e => update("seats", e.target.value)} className="h-12 rounded-xl" /></div>
        </div>
        <div className="space-y-2">
          <Label>Pricing Method</Label>
          <Select value={form.pricing_method} onValueChange={v => update("pricing_method", v)}>
            <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="How to charge?" /></SelectTrigger>
            <SelectContent>{PRICING_METHODS.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Contact Number</Label><Input type="tel" placeholder="Your phone number" value={form.contact_number} onChange={e => update("contact_number", e.target.value)} className="h-12 rounded-xl" /></div>
        <Button variant="hero" size="lg" className="w-full" onClick={handleSubmit}><Plus className="h-4 w-4 mr-2" />Post Ride</Button>
      </CardContent>
    </Card>
  );
}
