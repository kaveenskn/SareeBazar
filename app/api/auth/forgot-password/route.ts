import { NextResponse, NextRequest } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      // To prevent email enumeration, return success even if user not found
      return NextResponse.json(
        { message: 'If an account with that email exists, we sent a password reset link.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    const resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save({ validateBeforeSave: false });

    // In a real application, you would send an email here.
    // For this project, we'll log the reset URL to the console so we can test it
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    console.log('\n\n--- PASSWORD RESET LINK ---');
    console.log(resetUrl);
    console.log('---------------------------\n\n');

    return NextResponse.json(
      { message: 'If an account with that email exists, we sent a password reset link.' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
