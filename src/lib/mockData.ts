import { collection, addDoc, getDocs, query, limit, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Product } from '../types';

const MOCK_PRODUCTS: Partial<Product>[] = [
  {
    name: "Smart Energy Hub",
    description: "Real-time energy monitoring and automation for UK households. Optimized for DNO connections and smart meters.",
    price: 89.99,
    category: "Energy-saving",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800",
    energyRating: "A",
    madeInBritain: true,
    isEnergySaver: true,
    carbonFootprint: "2.4kg CO2e",
    tags: ["energy-saving", "smart-home", "british-made"],
    stock: 50
  },
  {
    name: "Cotswold Ceramic Set",
    description: "Morning tea set handcrafted from local Glacial clay in the Cotswolds. Set includes teapot and two mugs.",
    price: 65.00,
    category: "Sustainable Homeware",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80&w=800",
    madeInBritain: true,
    isEnergySaver: false,
    carbonFootprint: "0.5kg CO2e",
    tags: ["sustainable", "handmade", "british-made"],
    stock: 25
  },
  {
    name: "Recycled Wool Pet Bed",
    description: "Orthopedic memory foam core wrapped in 100% recycled British wool. Durable, cozy, and pet-safe.",
    price: 120.00,
    category: "Pet Products",
    image: "https://images.unsplash.com/photo-1541591419107-bb2485dd4742?auto=format&fit=crop&q=80&w=800",
    madeInBritain: true,
    isEnergySaver: false,
    carbonFootprint: "1.2kg CO2e",
    tags: ["eco-friendly", "pets", "wool"],
    stock: 12
  },
  {
    name: "Woolen Draft Excluder",
    description: "Traditional UK draft excluder made with herdwick wool. Essential for lowering heating bills in older homes.",
    price: 34.99,
    category: "Energy-saving",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    energyRating: "A",
    madeInBritain: true,
    isEnergySaver: true,
    carbonFootprint: "0.8kg CO2e",
    tags: ["warmth", "energy-efficiency", "british-wool"],
    stock: 75
  },
  {
    name: "Oak Minimal Wall Art",
    description: "Subtle landscape prints on sustainable FSC-certified oak frames. Minimal British countryside themes.",
    price: 45.00,
    category: "Decor",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&q=80&w=800",
    madeInBritain: true,
    isEnergySaver: false,
    carbonFootprint: "0.3kg CO2e",
    tags: ["decor", "oak", "minimal"],
    stock: 40
  },
  {
    name: "Weather-Resistant Planter",
    description: "Steel planters made in Sheffield. Designed to handle the erratic British weather while looking modern.",
    price: 55.00,
    category: "Garden",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800",
    madeInBritain: true,
    isEnergySaver: false,
    carbonFootprint: "1.5kg CO2e",
    tags: ["garden", "steel", "durable"],
    stock: 20
  },
  {
    name: "London Fog Candle",
    description: "Notes of Earl Grey, Bergamot, and Vanilla. Poured in London using sustainable soy wax.",
    price: 24.00,
    category: "Fragrance",
    image: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&q=80&w=800",
    madeInBritain: true,
    isEnergySaver: false,
    carbonFootprint: "0.1kg CO2e",
    tags: ["fragrance", "soy-wax", "london"],
    stock: 60
  },
  {
    name: "Handwoven Linen Napkins",
    description: "Set of 4 stonewashed linen napkins. Woven in a traditional mill in Ireland. Natural flax color.",
    price: 32.00,
    category: "Sustainable Homeware",
    image: "https://images.unsplash.com/photo-1590656363023-e4a067ca7360?auto=format&fit=crop&q=80&w=800",
    madeInBritain: true,
    isEnergySaver: false,
    carbonFootprint: "0.2kg CO2e",
    tags: ["linen", "tableware", "natural"],
    stock: 35
  },
  {
    name: "Organic Cotton Dog Toy",
    description: "Hand-knotted from GOTS-certified organic cotton. Durable and safe for heavy chewers.",
    price: 15.99,
    category: "Pet Products",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800",
    madeInBritain: true,
    isEnergySaver: false,
    carbonFootprint: "0.1kg CO2e",
    tags: ["pets", "organic", "cotton"],
    stock: 100
  },
  {
    name: "Smart Radiator Valve",
    description: "Individual room temperature control for wet central heating systems. Save up to 30% on heating.",
    price: 49.99,
    category: "Energy-saving",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
    energyRating: "A+",
    madeInBritain: true,
    isEnergySaver: true,
    carbonFootprint: "0.5kg CO2e",
    tags: ["energy-saving", "heating", "smart-valve"],
    stock: 45
  },
  {
    name: "Wildflower Seed Bomb Set",
    description: "Curated mix of native British wildflowers. Help support local pollinators with these easy-to-grow bombs.",
    price: 18.00,
    category: "Garden",
    image: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&q=80&w=800",
    madeInBritain: true,
    isEnergySaver: false,
    carbonFootprint: "0.0kg CO2e",
    tags: ["nature", "bees", "wildflowers"],
    stock: 150
  }
];

export async function seedProducts() {
  const productsCol = collection(db, 'products');
  try {
    const snapshot = await getDocs(query(productsCol, limit(1)));
    
    if (snapshot.empty) {
      console.log("Seeding initial products...");
      for (const product of MOCK_PRODUCTS) {
        await addDoc(productsCol, {
          ...product,
          createdAt: serverTimestamp()
        });
      }
      console.log("Seeding complete!");
    }
  } catch (error: any) {
    console.warn("Seeding skipped: ", error.message || "Connectivity issue");
  }
}
