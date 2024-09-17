import User from "@/models/userModel";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { connectToDB } from "@/helpers/mongodb";

export const POST = async (request: Request) => {
    try {
        const { email } = await request.json();
        console.log("Received email:", email);

        await connectToDB();

        if (!email || !email.includes("@")) {
            console.error("Invalid email format:", email);
            return NextResponse.json({ message: "Invalid input" }, { status: 422 });
        }

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            console.error("No user found with email:", email);
            return NextResponse.json({ message: "There is no user registered with this email!" }, { status: 422 });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        const passwordResetExpires = Date.now() + 3600000; // 1 saat

        existingUser.resetToken = passwordResetToken;
        existingUser.resetTokenExpiry = new Date(passwordResetExpires);
        await existingUser.save({ validateBeforeSave: false });

        const resetUrl = `${process.env.LOCAL_HOST}/reset-password/${resetToken}`;
        const body = `Reset Password by clicking on the following url: ${resetUrl}`;

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_PORT === '465', 
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Reset Password",
            text: body,
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ message: "Reset password email is sent." }, { status: 200 });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: "Failed sending email. Try again!" }, { status: 400 });
    }
};
