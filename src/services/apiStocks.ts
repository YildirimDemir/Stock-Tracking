import { getSession } from "next-auth/react";

export async function getStocks() {
    try {
        const session = await getSession();
        if (!session || !session.user || !session.user.email) {
            throw new Error('User not authenticated');
        }

        const res = await fetch(`${process.env.LOCAL_HOST}/api/stocks`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.user.email}` 
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to fetch stocks");
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export async function createNewStock(newStock: { name: string; user: string; items?: string[] }) {
    try {
        const res = await fetch(`${process.env.LOCAL_HOST}/api/stocks`, {
            method: "POST",
            body: JSON.stringify(newStock),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to create stock");
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating stock:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
        throw error;
    }
}

export async function updateStock(id: string, name: string) {
    try {
        const res = await fetch(`${process.env.LOCAL_HOST}/api/stocks/${id}`, {
            method: "PATCH",
            body: JSON.stringify({ name }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to update stock");
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error updating stock:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
        throw error;
    }
}

export async function deleteStock(id: string) {
    try {
        const res = await fetch(`${process.env.LOCAL_HOST}/api/stocks/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to delete stock");
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error deleting stock:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
        throw error;
    }
}

