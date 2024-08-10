'use client';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getItems, createNewItem } from '@/services/apiItems';
import Style from './itemspage.module.css';
import { IItem } from '@/models/itemModel';
import Image from 'next/image';
import Link from 'next/link';
import { getSession } from "next-auth/react";


export default function ItemsPage() {
    const [items, setItems] = useState<IItem[]>([]);
    const [newItem, setNewItem] = useState<Partial<IItem>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const router = useRouter();
    const params = useParams();
    const stockId = params.stockId as string;

    useEffect(() => {
        async function fetchItems() {
            if (stockId) {
                try {
                    const session = await getSession();
                    if (!session || !session.user || !session.user.email) {
                        throw new Error('User not authenticated');
                    }

                    const data = await getItems(stockId);
                    setItems(data.items);
                } catch (error) {
                    console.error('Failed to fetch items:', error);
                }
            }
        }

        fetchItems();
    }, [stockId]);

    const handleCreateItem = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!imageFile) return;

        try {
            const formData = new FormData();
            formData.append('file', imageFile);
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadRes.ok) throw new Error('Failed to upload image');

            const uploadData = await uploadRes.json();
            const imageUrl = uploadData.url;

            await createNewItem(stockId, { ...newItem, image: imageUrl });
            const session = await getSession();
            if (!session || !session.user || !session.user.email) {
                throw new Error('User not authenticated');
            }

            const data = await getItems(stockId);
            setItems(data.items);
            setNewItem({});
            setImageFile(null);
        } catch (error) {
            console.error('Failed to create item:', error);
        }
    };


    return (
        <div className={Style.itemsPage}>
            <div className={Style.addItemPage}>
                <h3>Create New Item</h3>
                <form onSubmit={handleCreateItem}>
                    <div className={Style.inputGroup}>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Item name..."
                            value={newItem.name || ''}
                            required
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        />
                    </div>
                    <div className={Style.inputGroup}>
                        <label htmlFor="barcode">Barcode:</label>
                        <input
                            type="text"
                            id="barcode"
                            placeholder="Barcode..."
                            value={newItem.barcode || ''}
                            onChange={(e) => setNewItem({ ...newItem, barcode: e.target.value })}
                        />
                    </div>
                    <div className={Style.inputGroup}>
                        <label htmlFor="category">Category:</label>
                        <input
                            type="text"
                            id="category"
                            placeholder="Item category..."
                            value={newItem.category || ''}
                            required
                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                        />
                    </div>
                    <div className={Style.inputGroup}>
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            type="number"
                            id="quantity"
                            placeholder="Quantity..."
                            value={newItem.quantity || ''}
                            required
                            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                        />
                    </div>
                    <div className={Style.inputGroup}>
                        <label htmlFor="unitPrice">Unit Price:</label>
                        <input
                            type="number"
                            id="unitPrice"
                            placeholder="Unit Price..."
                            value={newItem.unitPrice || ''}
                            onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div className={Style.inputGroup}>
                        <label htmlFor="wholesalePrice">Wholesale Price:</label>
                        <input
                            type="number"
                            id="wholesalePrice"
                            placeholder="Wholesale Price..."
                            value={newItem.wholesalePrice || ''}
                            onChange={(e) => setNewItem({ ...newItem, wholesalePrice: parseFloat(e.target.value) })}
                        />
                    </div>
                    <div className={Style.inputGroup}>
                        <label htmlFor="producer">Producer:</label>
                        <input
                            type="text"
                            id="producer"
                            placeholder="Producer..."
                            value={newItem.producer || ''}
                            onChange={(e) => setNewItem({ ...newItem, producer: e.target.value })}
                        />
                    </div>
                    <div className={`${Style.inputGroup} ${Style.lastInputGroup}`}>
                        <label htmlFor="image" className={Style.imgLabel}>Image: Click to upload</label>
                        <input
                            type="file"
                            className={Style.imgInput}
                            id="image"
                            onChange={(e) => {
                                if (e.target.files?.[0]) {
                                    setImageFile(e.target.files[0]);
                                }
                            }}
                        />
                          <button type="submit" className={Style.btn}>Create</button>
                    </div>
                </form>
            </div>
            <div className={Style.yourItemsArea}>
                <h3>Your Items</h3>
                <div className={Style.yourItems}>
                    {items.length === 0 ? (
                        <h1>The Item you create will appear here</h1>
                    ) : (
                        <Table>
                            <TableCaption>Your items</TableCaption>
                            <TableHeader>
                                <TableRow className={Style.tableRow}>
                                    <TableHead className={Style.tableHead}>Image</TableHead>
                                    <TableHead className={Style.tableHead}>Name</TableHead>
                                    <TableHead className={Style.tableHead}>Category</TableHead>
                                    <TableHead className={Style.tableHead}>Quantity</TableHead>
                                    <TableHead className={Style.tableHead}>Unit Price</TableHead>
                                    <TableHead className={Style.tableHead}>Wholesale Price</TableHead>
                                    <TableHead className={Style.tableHead}>Producer</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item._id?.toString()} className={Style.tableRowItems}>
                                        <TableCell>
                                            {item.image && (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={70}
                                                    height={70}
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className={Style.tableHead}>{item.name}</TableCell>
                                        <TableCell className={Style.tableHead}>{item.category}</TableCell>
                                        <TableCell className={Style.tableHead}>{item.quantity}</TableCell>
                                        <TableCell className={Style.tableHead}>${item.unitPrice}</TableCell>
                                        <TableCell className={Style.tableHead}>${item.wholesalePrice}</TableCell>
                                        <TableCell className={Style.tableHead}>{item.producer}</TableCell>
                                        <TableCell className={Style.tableHead}>
                                            <Link href={`/stocks/${stockId}/items/${item._id?.toString()}`}>
                                                Manage
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    );
}
