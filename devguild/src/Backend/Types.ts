export interface Apartment {
  id: number;
  name: string;
  description: string;
  size: number;
  room_nr: number;
  price: number;
  latitude: number;
  longitude: number;
  owner_id: number;
  rental_status: "AVAILABLE" | "RENTED";
  created_at: number;
  updated_at: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  type: "CLIENT" | "REALTOR" | "ADMIN";
  password?: string;
}

export interface Filter {
  min: number;
  max: number;
}
