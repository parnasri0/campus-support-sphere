export interface Ride {
  id: string;
  user_id: string;
  from_location: string;
  to_location: string;
  departure_time: string;
  expected_arrival: string;
  vehicle: string;
  seats: number;
  gender_preference: string;
  pricing_method: string;
  contact_number: string;
  created_at: string;
  user_email?: string;
}

export interface RideRequest {
  id: string;
  ride_id: string;
  passenger_id: string;
  passenger_email?: string;
  passenger_gender?: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  rides?: Ride;
}

export const LOCATIONS = [
  "Hostel", "Main Gate", "Library", "Canteen",
  "Metro Station", "Market", "Bus Stop", "Academic Block",
  "Sports Complex", "Parking Lot"
];

export const VEHICLE_TYPES = ["Bike", "Car", "Scooter", "Auto"];

export const PRICING_METHODS = [
  { value: "free", label: "Free" },
  { value: "per_seat", label: "Per Seat" },
  { value: "split", label: "Split Equally" },
];

export const GENDER_OPTIONS = [
  { value: "any", label: "Any" },
  { value: "male", label: "Male Only" },
  { value: "female", label: "Female Only" },
];
