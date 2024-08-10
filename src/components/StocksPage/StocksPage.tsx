'use client';

import React, { useState, useEffect } from 'react';
import { createNewStock, deleteStock, getStocks } from '@/services/apiStocks';
import { useRouter } from 'next/navigation';
import Style from './stockspage.module.css';
import { FaTimes } from 'react-icons/fa';

export default function StocksPage() {
    const [name, setName] = useState('');
    const [items, setItems] = useState<string[]>([]);
    const [stocks, setStocks] = useState<any[]>([]); // Stokları saklamak için state
    const router = useRouter();

    useEffect(() => {
        // Stokları al ve state'e ata
        async function fetchStocks() {
            try {
                const data = await getStocks();
                setStocks(data.stocks);
            } catch (error) {
                console.error('Failed to fetch stocks:', error);
            }
        }

        fetchStocks();
    }, []);

    const handleCreateStock = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const user = 'user-id'; // Bu kullanıcı ID'sini oturumdan almanız gerekecek
            await createNewStock({ name, user, items });
            // Başarılı olursa stokları tekrar yükle
            const data = await getStocks();
            setStocks(data.stocks);
        } catch (error) {
            console.error('Failed to create stock:', error);
        }
    };

    const handleDeleteStock = async (stockId: string) => {
        try {
            await deleteStock(stockId);
            // Başarılı olursa stokları tekrar yükle
            const data = await getStocks();
            setStocks(data.stocks);
        } catch (error) {
            console.error('Failed to delete stock:', error);
        }
    };

    const handleStockClick = (stockId: string) => {
        // İlgili stok sayfasına yönlendirme
        router.push(`/stocks/${stockId}/items`);
    };

    return (
        <div className={Style.stocksPage}>
            <div className={Style.createNewStock}>
                <form onSubmit={handleCreateStock}>
                <h3>Create New Stock</h3>
                    <div className={Style.inputGroup}>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="My Stock..."
                        required
                    />
                    <button type="submit" className={Style.btn}>Create</button>
                    </div>
                </form>
            </div>
            <div className={Style.stockListArea}>
                <h3>Your Stocks</h3>
                <div className={Style.stockList}>
                    {stocks.length === 0 ? (
                        <h1 className={Style.noStocksWarning}>The stocks you create will appear here</h1>
                    ) : (
                        stocks.map(stock => (
                            <div key={stock._id} className={Style.stockBox}>
                                <h4 onClick={() => handleStockClick(stock._id)}>{stock.name}</h4>
                                <p>{stock.items.length} items</p>
                                <button className={Style.deleteBtn} onClick={() => handleDeleteStock(stock._id)}>
                                    <FaTimes/>
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
