export interface Agent {
  id?: number;
  name: string;
  email: string;
  phone: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  type: 'rent' | 'sale';
  location: string;
  agent: Agent;
  imageUrls?: string[];
}
