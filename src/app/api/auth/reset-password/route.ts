import { hashPassword } from "@/helpers/authBcrypt";
import { connectToDB } from "@/helpers/mongodb";
import User from "@/models/userModel";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const PATCH = async (request: NextRequest) => {
    try {
        const { token, password, passwordConfirm } = await request.json();

        if (!token || !password || !passwordConfirm) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        await connectToDB();

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return NextResponse.json({ message: "Invalid token or has expired" }, { status: 400 });
        }

        if (password !== passwordConfirm) {
            return NextResponse.json({ message: "Passwords do not match each other!" }, { status: 422 });
        }

        const hashedPassword = await hashPassword(password);
        const updatedUser = await User.findByIdAndUpdate(
            { _id: user._id },
            { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedUser) throw new Error("Password reset failed");

        return NextResponse.json(updatedUser, { status: 200 });

    } catch (error) {
        console.error('Error in PATCH /api/auth/reset-password:', error);
        return NextResponse.json({ message: "Internal Server Error", error: error instanceof Error ? error.message : "An unexpected error occurred" }, { status: 500 });
    }
};
