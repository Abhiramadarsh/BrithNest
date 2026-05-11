export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Energy-saving' | 'Sustainable Homeware' | 'Pet Products' | 'Decor' | 'Garden' | 'Fragrance';
  image: string;
  energyRating?: 'A++' | 'A+' | 'A' | 'B' | 'C' | 'D' | 'E';
  madeInBritain: boolean;
  isEnergySaver: boolean;
  carbonFootprint?: string;
  tags: string[];
  stock: number;
}

export interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  publishedAt: string;
}
