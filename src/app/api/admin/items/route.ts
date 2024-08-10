// /app/api/items/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/helpers/mongodb';
import Item from '@/models/itemModel';
import { getServerSession } from 'next-auth';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: "You are not allowed!" }, { status: 401 });
        }

        await connectToDB();

        // Tüm itemleri bul
        const items = await Item.find().exec();

        if (!items || items.length === 0) {
            return NextResponse.json({ message: 'Items not found' }, { status: 404 });
        }

        return NextResponse.json({ count: items.length, items }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching items:', error.message);
            return NextResponse.json({ error: 'Failed to fetch items', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ error: 'Failed to fetch items', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
}
