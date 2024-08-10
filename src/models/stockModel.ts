import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import Item from './itemModel';

export interface IStock extends Document {
    name: string;
    user: Types.ObjectId; 
    items: Types.ObjectId[];
}

const stockSchema = new Schema<IStock>({
    name: {
        type: String,
        required: [true, 'A stock name is required'],
    },
    user: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        default: []
    }],
}, {
    timestamps: true,
});

stockSchema.pre('findOneAndDelete', async function(next) {
    const stockId = this.getQuery()._id;
    
    try {
        // Stok ile ilişkili tüm itemleri sil
        await Item.deleteMany({ stock: stockId });
        next();
    } catch (error) {
        // Hata türünü `CallbackError` olarak belirle
        next(error as mongoose.CallbackError);
    }
});

const Stock: Model<IStock> = mongoose.models.Stock || mongoose.model<IStock>("Stock", stockSchema);

export default Stock;
