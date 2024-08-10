import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/helpers/mongodb';
import Item from '@/models/itemModel';
import Stock from '@/models/stockModel';

export async function GET(req: NextRequest, { params }: { params: { itemId: string } }) {
    try {
        await connectToDB();

        // Belirli itemId ile item'ı bul
        const item = await Item.findById(params.itemId).exec();

        if (!item) {
            return NextResponse.json({ message: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ item }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error fetching item:', error.message);
            return NextResponse.json({ error: 'Failed to fetch item', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ error: 'Failed to fetch item', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { itemId: string } }) {
    try {
        await connectToDB();

        const updateData = await req.json();

        // Belirli itemId ile item'ı güncelle
        const updatedItem = await Item.findByIdAndUpdate(params.itemId, updateData, { new: true }).exec();

        if (!updatedItem) {
            return NextResponse.json({ message: 'Item not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Item updated successfully', item: updatedItem }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error updating item:', error.message);
            return NextResponse.json({ message: 'Failed to update item', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ message: 'Failed to update item', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { itemId: string } }) {
    try {
        await connectToDB();

        // Belirli itemId ile item'ı sil
        const deletedItem = await Item.findByIdAndDelete(params.itemId).exec();

        if (!deletedItem) {
            return NextResponse.json({ message: 'Item not found' }, { status: 404 });
        }

        // İlgili stoku bul ve items listesinden bu item'ı çıkar
        const stock = await Stock.findById(deletedItem.stockId).exec();
        if (stock) {
            stock.items = stock.items.filter((item) => item.toString() !== params.itemId);
            await stock.save();
        }

        return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error deleting item:', error.message);
            return NextResponse.json({ message: 'Failed to delete item', details: error.message }, { status: 500 });
        } else {
            console.error('An unknown error occurred');
            return NextResponse.json({ message: 'Failed to delete item', details: 'An unknown error occurred' }, { status: 500 });
        }
    }
}