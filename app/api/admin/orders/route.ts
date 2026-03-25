import { NextResponse } from 'next/server';

const mockOrders = [
  {
    id: 1,
    user_email: 'customer@example.com',
    total_amount: 5500,
    status: 'delivered',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    user_email: 'user@example.com',
    total_amount: 3200,
    status: 'shipped',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 3,
    user_email: 'buyer@example.com',
    total_amount: 7800,
    status: 'processing',
    created_at: new Date(),
  },
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let filteredOrders = mockOrders;
    if (status) {
      filteredOrders = mockOrders.filter(o => o.status === status);
    }

    return NextResponse.json(
      filteredOrders.slice(offset, offset + limit)
    );
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
