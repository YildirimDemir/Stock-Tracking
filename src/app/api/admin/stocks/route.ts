import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/helpers/mongodb';
import Stock from '@/models/stockModel';
import { getServerSession } from 'next-auth';
import User from '@/models/userModel';

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

        // Kullanıcıyı bul
        const user = await User.findOne({ email: userEmail }).exec();
        if (!user) {
            return NextResponse.json({ message: "User not found!" }, { status: 404 });
        }

        // Kullanıcının stoklarını almak yerine, tüm stokları döndüren bir sorgu yap
        const stocks = await Stock.find()
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