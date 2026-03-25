import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { amount, currency, email } = await request.json();

    if (!amount || !currency || !email) {
      return NextResponse.json(
        { error: 'Amount, currency, and email required' },
        { status: 400 }
      );
    }

    // For demo: create mock order ID
    const orderId = Math.random().toString(36).substr(2, 9);
    
    // In production, this would create a Stripe PaymentIntent
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount,
    //   currency,
    //   metadata: { email },
    // });

    return NextResponse.json({
      orderId,
      clientSecret: `pi_demo_${orderId}`,
      status: 'success',
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
