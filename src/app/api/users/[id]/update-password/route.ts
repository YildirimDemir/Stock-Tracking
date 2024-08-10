import { NextResponse } from 'next/server';
import { hashPassword, verifyPassword } from "@/helpers/authBcrypt";
import User from "@/models/userModel";
import { connectToDB } from '@/helpers/mongodb';

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
    const { id } = params;
    const { passwordCurrent, newPassword, passwordConfirm } = await req.json();

    if (!id) {
        return NextResponse.json({ message: "ID not found..." }, { status: 400 });
    }

    if (!passwordCurrent || !newPassword || !passwordConfirm) {
        return NextResponse.json({ message: "All password fields are required..." }, { status: 400 });
    }

    await connectToDB();

    const user = await User.findById(id);
    if (!user) {
        return NextResponse.json({ message: "User not found..." }, { status: 404 });
    }

    if (!user.password) {
        return NextResponse.json({ message: "Password not found for user..." }, { status: 500 });
    }

    const isValid = await verifyPassword(passwordCurrent, user.password);
    if (!isValid) {
        return NextResponse.json({ message: "Current password is incorrect..." }, { status: 403 });
    }

    if (newPassword !== passwordConfirm) {
        return NextResponse.json({ message: "New passwords do not match..." }, { status: 422 });
    }

    const hashedPassword = await hashPassword(newPassword);

    const updatedUser = await User.findByIdAndUpdate(id, { password: hashedPassword }, { new: true, runValidators: true });

    if (!updatedUser) {
        return NextResponse.json({ message: "Password update failed..." }, { status: 500 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
};
