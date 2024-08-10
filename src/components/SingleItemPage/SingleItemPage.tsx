'use client';

import React, { useState, useEffect } from 'react';
import Style from './singleitempage.module.css';
import { useParams, useRouter } from 'next/navigation';
import { getItem, updateItem, deleteItem } from '@/services/apiItems';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SingleItemPage() {
  const [item, setItem] = useState({
    name: '',
    barcode: '',
    category: '',
    quantity: 0,
    unitPrice: 0,
    wholesalePrice: 0,
    producer: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { stockId: stockIdParam, itemId: itemIdParam } = useParams();
  const router = useRouter();

  // Eğer stockId veya itemId array ise, ilk elemanını kullan
  const stockId = Array.isArray(stockIdParam) ? stockIdParam[0] : stockIdParam;
  const itemId = Array.isArray(itemIdParam) ? itemIdParam[0] : itemIdParam;

  useEffect(() => {
    async function fetchItem() {
      try {
        const fetchedItem = await getItem(stockId, itemId);
        setItem(fetchedItem);
      } catch (error) {
        console.error('Failed to fetch item:', error);
      }
    }

    if (stockId && itemId) {
      fetchItem();
    }
  }, [stockId, itemId]);

  const handleUpdateItem = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('Failed to upload image');

        const uploadData = await uploadRes.json();
        const imageUrl = uploadData.url;
        item.image = imageUrl;
      }

      await updateItem(stockId, itemId, item);
      toast.success('Item updated successfully!');
    } catch (error) {
      console.error('Failed to update item:', error);
      toast.error('Failed to update item.');
    }
  };

  const handleDeleteItem = async () => {
    try {
      await deleteItem(stockId, itemId);
      router.push(`/stocks/${stockId}/items`);
      toast.success('Item deleted successfully!');
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to delete item.');
    }
  };

  return (
    <div className={Style.singleItemPage}>
      <h3>Manage Your Item</h3>
      <form onSubmit={handleUpdateItem}>
        <div className={Style.imgGroup}>
            {item.image && (
              <Image src={item.image} alt={item.name} width={320} height={320} />
            )}
          <div className={Style.inputGroup}>
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
          </div>
        </div>
        <div className={Style.dataGroup}>
          <div className={Style.inputGroup}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              placeholder="Item name..."
              value={item.name}
              required
              onChange={(e) => setItem({ ...item, name: e.target.value })}
            />
          </div>
          <div className={Style.inputGroup}>
            <label htmlFor="barcode">Barcode:</label>
            <input
              type="text"
              id="barcode"
              placeholder="Barcode..."
              value={item.barcode}
              onChange={(e) => setItem({ ...item, barcode: e.target.value })}
            />
          </div>
          <div className={Style.inputGroup}>
            <label htmlFor="category">Category:</label>
            <input
              type="text"
              id="category"
              placeholder="Item category..."
              value={item.category}
              required
              onChange={(e) => setItem({ ...item, category: e.target.value })}
            />
          </div>
          <div className={Style.inputGroup}>
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              placeholder="Quantity..."
              value={item.quantity}
              required
              onChange={(e) => setItem({ ...item, quantity: parseInt(e.target.value) })}
            />
          </div>
          <div className={Style.inputGroup}>
            <label htmlFor="unitPrice">Unit Price:</label>
            <input
              type="number"
              id="unitPrice"
              placeholder="Unit Price..."
              value={item.unitPrice}
              onChange={(e) => setItem({ ...item, unitPrice: parseFloat(e.target.value) })}
            />
          </div>
          <div className={Style.inputGroup}>
            <label htmlFor="wholesalePrice">Wholesale Price:</label>
            <input
              type="number"
              id="wholesalePrice"
              placeholder="Wholesale Price..."
              value={item.wholesalePrice}
              onChange={(e) => setItem({ ...item, wholesalePrice: parseFloat(e.target.value) })}
            />
          </div>
          <div className={Style.inputGroup}>
            <label htmlFor="producer">Producer:</label>
            <input
              type="text"
              id="producer"
              placeholder="Producer..."
              value={item.producer}
              onChange={(e) => setItem({ ...item, producer: e.target.value })}
            />
          </div>
        </div>
        <div className={Style.btnGroup}>
        <button type="submit" className={Style.btn}>Save</button>
        <button onClick={handleDeleteItem} className={Style.btn}>Delete</button>
        </div>
      </form>
      <div className={Style.previusLink}>
        <Link href={`/stocks/${stockId}/items/`}>{"<< All Items"}</Link>
      </div>
    </div>
  );
}
