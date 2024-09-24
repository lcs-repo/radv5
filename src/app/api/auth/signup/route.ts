import { NextResponse } from 'next/server';
import dbConnect from '@/app/utils/dbConnect';
import User from '@/app/models/User';

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { name, email, password, role } = await req.json();

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    // Check if the role is valid
    if (role !== 'RT' && role !== 'Radiologist') {
      return NextResponse.json({ success: false, message: 'Invalid role' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 });
    }

    const newUser = await User.create({
      name,
      email,
      password, // Password will be hashed by the pre-save hook
      role,
    });

    console.log('New user created with hashed password:', newUser.password);

    return NextResponse.json({ success: true, message: 'User created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Sign-up error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}