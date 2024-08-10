import { NextResponse } from 'next/server';
import User, { IUser } from '@/models/userModel';
import { connectToDB } from '@/helpers/mongodb';

// Get user by ID
export const GET = async (req: Request, { params }: { params: { id: string } }) => {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ message: "ID not found..." }, { status: 400 });
    }

    await connectToDB();
    const user: IUser | null = await User.findById(id);

    if (!user) {
        return NextResponse.json({ message: "User not found on ID..." }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
};

// Delete user by ID
export const DELETE = async (req: Request, { params }: { params: { id: string } }) => {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ message: "ID not found..." }, { status: 400 });
    }

    await connectToDB();

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
        return NextResponse.json({ message: "User not found on ID..." }, { status: 404 });
    }

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
};
