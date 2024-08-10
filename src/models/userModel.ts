import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import Stock from './stockModel';
import Item from './itemModel';

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    stocks: Types.ObjectId[]; 
    resetToken?: string;
    resetTokenExpiry?: Date;
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: [true, 'A username is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'An email is required'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'A password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    stocks: [{ 
        type: Schema.Types.ObjectId,
        ref: 'Stock',
    }],
    resetToken: String,
    resetTokenExpiry: Date
}, {
    timestamps: true,
});

userSchema.pre('findOneAndDelete', async function(next) {
    const userId = this.getQuery()._id;

    // Kullanıcının tüm stoklarını bulun
    const stocks = await Stock.find({ user: userId });

    // Her stok için, stok içindeki itemleri sil ve stokları sil
    for (const stock of stocks) {
        await Item.deleteMany({ stock: stock._id });
        await Stock.deleteOne({ _id: stock._id });
    }

    next();
});


const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;