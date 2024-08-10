import { IItem } from "@/models/itemModel";
import { getSession } from "next-auth/react";

export async function getItems(stockId: string) {
    try {
        const session = await getSession();
        if (!session || !session.user || !session.user.email) {
            throw new Error('User not authenticated');
        }

        const res = await fetch(`${process.env.LOCAL_HOST}/api/stocks/${stockId}/items`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.user.email}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch items");
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error fetching items:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
        throw error;
    }
}

export async function createNewItem(stockId: string, itemData: Partial<IItem>) {
    try {
        const res = await fetch(`/api/stocks/${stockId}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(itemData),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || 'Failed to create item');
        }

        return data;
    } catch (error) {
        console.error('Error creating item:', error);
        throw error;
    }
}

export async function getItem(stockId: string, itemId: string): Promise<IItem> {
    try {
        const response = await fetch(`/api/stocks/${stockId}/items/${itemId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch item');
        }
        const data = await response.json();
        return data.item;
    } catch (error) {
        console.error('Error fetching item:', error);
        throw error;
    }
}

export async function updateItem(stockId: string, itemId: string, updateData: Partial<IItem>): Promise<IItem> {
    try {
        const response = await fetch(`/api/stocks/${stockId}/items/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });
        if (!response.ok) {
            throw new Error('Failed to update item');
        }
        const data = await response.json();
        return data.item;
    } catch (error) {
        console.error('Error updating item:', error);
        throw error;
    }
}

export async function deleteItem(stockId: string, itemId: string): Promise<void> {
    try {
        const response = await fetch(`/api/stocks/${stockId}/items/${itemId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete item');
        }
    } catch (error) {
        console.error('Error deleting item:', error);
        throw error;
    }
}