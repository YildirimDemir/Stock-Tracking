import { NextResponse } from 'next/server';
import { hashPassword } from '@/helpers/authBcrypt';
import User, { IUser } from '@/models/userModel';
import { HydratedDocument } from 'mongoose';
import { connectToDB } from '@/helpers/mongodb';

export const POST = async (request: Request) => {
    const { username, email, password, passwordConfirm } = await request.json();

    if (!email || !email.includes("@") || !password || password.trim().length < 7 || !username) {
        return NextResponse.json({ message: "Invalid input." }, { status: 422 });
    }

    await connectToDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return NextResponse.json({ message: "User exists already!" }, { status: 422 });
    }

    if (password !== passwordConfirm) {
        return NextResponse.json({ message: "Passwords are not the same!" }, { status: 422 });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        stocks: []
    });

    await newUser.save();

    return NextResponse.json({ message: "User Created" }, { status: 201 });
};
