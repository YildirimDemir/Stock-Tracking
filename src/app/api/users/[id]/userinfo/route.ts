import { NextResponse } from 'next/server';
import User, { IUser } from '@/models/userModel';
import { connectToDB } from '@/helpers/mongodb';

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
    const { id } = params;
    const { username, email } = await req.json();

    if (!id) {
        return NextResponse.json({ message: "ID not found..." }, { status: 400 });
    }

    await connectToDB();

    const updatedUser: IUser | null = await User.findByIdAndUpdate(
        id,
        { username, email },
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        return NextResponse.json({ message: "User update failed..." }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
};
