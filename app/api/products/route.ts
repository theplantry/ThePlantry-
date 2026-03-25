import { NextResponse } from 'next/server';

const fallbackProducts = [
  {
    id: 1,
    name: 'Dreamwell Nightcap',
    category: 'Beverages',
    price: 1800,
    image_url: '/assets/products/dreamwell-nightcap.jpg',
    description: 'Restful herbal tonic for evening wellness',
    stock: 50,
    available: true,
  },
  {
    id: 2,
    name: 'Harmony Hearty Brew',
    category: 'Beverages',
    price: 2200,
    image_url: '/assets/products/harmony-hearty-brew.jpg',
    description: 'Rooted warmth and balance',
    stock: 45,
    available: true,
  },
  {
    id: 3,
    name: 'Power Pulse Bar',
    category: 'Snacks',
    price: 1500,
    image_url: '/assets/products/power-pulse-bar.jpg',
    description: 'Energy dense plant-based bar',
    stock: 60,
    available: true,
  },
  {
    id: 4,
    name: 'Rise & Nourish Bowl',
    category: 'Supplements',
    price: 2800,
    image_url: '/assets/products/rise-nourish-bowl.jpg',
    description: 'Morning superfood bowl mix',
    stock: 30,
    available: true,
  },
  {
    id: 5,
    name: 'Vital Spark Elixir',
    category: 'Supplements',
    price: 2500,
    image_url: '/assets/products/vital-spark-elixir.jpg',
    description: 'Vibrant immune support blend',
    stock: 40,
    available: true,
  },
  {
    id: 6,
    name: 'Wellness Wave',
    category: 'Beverages',
    price: 1900,
    image_url: '/assets/products/wellness-wave.jpg',
    description: 'Hydration + adaptogen infusion',
    stock: 55,
    available: true,
  },
];

export async function GET(request: Request) {
  try {
    // For now, return fallback products (would connect to database in production)
    return NextResponse.json(fallbackProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(fallbackProducts);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct = { ...body, id: Math.max(...fallbackProducts.map(p => p.id)) + 1 };
    fallbackProducts.push(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
