import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production';

// Mock user database (shared with login)
const mockUsers: { [key: string]: any } = {};

export async function POST(request: Request) {
  try {
    const { email, password, fullName } = await request.json();

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name required' },
        { status: 400 }
      );
    }

    if (mockUsers[email]) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const userId = Math.random().toString(36).substr(2, 9);
    const user = { id: userId, email, fullName, password };
    mockUsers[email] = user;

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    return NextResponse.json(
      {
        token,
        user: { id: user.id, email: user.email, fullName: user.fullName },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
