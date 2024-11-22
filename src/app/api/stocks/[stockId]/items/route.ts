import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/helpers/mongodb';
import Item from '@/models/itemModel';
import Stock from '@/models/stockModel';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';

export async function GET(req: NextRequest, { params }: { params: { stockId: string } }) {
    try {
        const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: "You are not allowed!" }, { status: 401 });
        }

        await connectToDB();

        const items = await Item.find({ stock: params.stockId }).exec();

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

export async function POST(req: NextRequest, { params }: { params: { stockId: string } }) {
    try {
        const session = await getServerSession();
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ message: "You are not allowed!" }, { status: 401 });
        }

        await connectToDB();

        const stockId = new mongoose.Types.ObjectId(params.stockId);

        const stock = await Stock.findById(stockId).exec();
        if (!stock) {
            return NextResponse.json({ message: "Stock not found!" }, { status: 404 });
        }

        const { name, barcode, image, category, quantity, unitPrice, wholesalePrice, producer } = await req.json();

        if (!name || !quantity || !params.stockId) {
            return NextResponse.json({ message: "Name, quantity, and stock ID are required" }, { status: 400 });
        }

        const newItem = new Item({
            name,
            barcode,
            image,
            category,
            quantity,
            unitPrice,
            wholesalePrice,
            producer,
            stock: stockId, 
        });

        await newItem.save();

        stock.items.push(newItem._id as mongoose.Types.ObjectId);
        await stock.save();

        return NextResponse.json({ message: "Item created successfully", item: newItem }, { status: 201 });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error creating item:', error.message);
            return NextResponse.json({ message: 'Failed to create item', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ message: 'Failed to create item', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
}