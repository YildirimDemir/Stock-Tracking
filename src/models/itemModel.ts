import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
    name: string;
    barcode?: string;
    image?: string;
    category: string;
    quantity: number;
    unitPrice?: number;
    wholesalePrice?: number;
    producer?: string;
    stock: Schema.Types.ObjectId; 
}

const ItemSchema: Schema = new Schema({
    name: { type: String, required: true },
    barcode: { type: String, unique: false },
    image: { type: String },
    category: { type: String },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number },
    wholesalePrice: { type: Number },
    producer: { type: String },
    stock: { type: Schema.Types.ObjectId, ref: 'Stock', required: true }, 
});


const Item = mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);

export default Item;
