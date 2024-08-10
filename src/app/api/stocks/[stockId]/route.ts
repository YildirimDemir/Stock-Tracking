import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/helpers/mongodb';
import Stock, { IStock } from '@/models/stockModel';
import { getServerSession } from 'next-auth';
import User from '@/models/userModel';

export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const { id } = params;
        const { name } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "ID not found..." }, { status: 400 });
        }

        await connectToDB();

        const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: "You are not allowed!" }, { status: 401 });
        }

        // Kullanıcıyı e-posta ile bul
        const user = await User.findOne({ email: session.user.email }).exec();
        if (!user) {
            return NextResponse.json({ message: "User not found!" }, { status: 404 });
        }

        // Stoku bul ve güncelle
        const updatedStock: IStock | null = await Stock.findOneAndUpdate(
            { _id: id, user: user._id }, // Kullanıcıya ait stokları güncelle
            { name },
            { new: true, runValidators: true }
        );

        if (!updatedStock) {
            return NextResponse.json({ message: "Stock update failed or not found..." }, { status: 404 });
        }

        return NextResponse.json(updatedStock, { status: 200 });
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error updating stock:', error.message);
            return NextResponse.json({ error: 'Error updating stock', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ error: 'Error updating stock', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
}

export const DELETE = async (req: NextRequest, { params }: { params: { stockId: string } }) => {
    try {
        const { stockId } = params;

        if (!stockId) {
            return NextResponse.json({ message: "ID not found..." }, { status: 400 });
        }

        await connectToDB();

        const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: "You are not allowed!" }, { status: 401 });
        }

        // Kullanıcıyı e-posta ile bul
        const user = await User.findOne({ email: session.user.email }).exec();
        if (!user) {
            return NextResponse.json({ message: "User not found!" }, { status: 404 });
        }

        // Stoku bul ve sil
        const deletedStock = await Stock.findOneAndDelete({ _id: stockId, user: user._id });

        if (!deletedStock) {
            return NextResponse.json({ message: "Stock not found or not authorized to delete..." }, { status: 404 });
        }

        // Kullanıcıdan stoğu kaldır
        user.stocks = user.stocks.filter((stock) => !stock.equals(stockId));
        await user.save();

        return NextResponse.json({ message: "Stock deleted successfully" }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error deleting stock:', error.message);
            return NextResponse.json({ error: 'Error deleting stock', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ error: 'Error deleting stock', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
};