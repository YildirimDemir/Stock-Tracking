import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/helpers/mongodb';
import Stock from '@/models/stockModel';
import { getServerSession } from 'next-auth';
import User from '@/models/userModel';
import mongoose, { Types } from 'mongoose';


export async function GET(req: NextRequest) {
    try {
        await connectToDB();
        
        // Oturum verilerini al
        const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: "You are not allowed!" }, { status: 401 });
        }

        // Kullanıcı e-posta adresini al
        const userEmail = session.user.email;

        // Kullanıcıyı bul ve stoklarını al
        const user = await User.findOne({ email: userEmail }).exec();
        if (!user) {
            return NextResponse.json({ message: "User not found!" }, { status: 404 });
        }

        const stocks = await Stock.find({ _id: { $in: user.stocks } })
            .populate('user', 'username')
            .exec();

        // Başarılı yanıt dön
        return NextResponse.json({ count: stocks.length, stocks }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching stocks:', error.message);
            return NextResponse.json({ error: 'Failed to fetch stocks', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ error: 'Failed to fetch stocks', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
}

export async function POST(req: NextRequest) {
    try {
        // Oturum verilerini al
        const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: "You are not allowed!" }, { status: 401 });
        }

        // Kullanıcı e-posta adresini al
        const userEmail = session.user.email;

        // Veritabanına bağlan ve kullanıcıyı e-posta ile bul
        await connectToDB();
        const user = await User.findOne({ email: userEmail }).exec();
        if (!user) {
            return NextResponse.json({ message: "User not found!" }, { status: 404 });
        }

        // İstekten gelen verileri al
        const { name, items }: { name: string, items?: string[] } = await req.json();

        // Yeni bir stok oluştur
        const newStock = new Stock({
            name,
            user: user._id as Types.ObjectId, // ObjectId türüne dönüştürme
            items: (items || []).map(item => new mongoose.Types.ObjectId(item)) // Items'ları ObjectId'ye dönüştürme
        });

        await newStock.save();

        // Kullanıcının stoklarına yeni stoku ekle ve kaydet
        user.stocks.push(newStock._id as Types.ObjectId); // ObjectId türüne dönüştürme
        await user.save();

        return NextResponse.json({ message: "Stock created successfully", stock: newStock }, { status: 201 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating stock:', error.message);
            return NextResponse.json({ message: 'Failed to create stock', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ message: 'Failed to create stock', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
}