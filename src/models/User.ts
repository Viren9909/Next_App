import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "User Name is Required"],
        trim: true,
        unique: [true, "User name should unique"]
    },
    email: {
        type: String,
        required: [true, "Email is Required"],
        unique: [true, "Account already registered with this Email."],
        match: [/.+\@.+\..+/, "Enter Valid Email"]
    },
    password: {
        type: String,
        required: [true, "Password is Required"]
    },
    verifyCode: {
        type: String,
        required: [true, "VerifyCode is Required"]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code Expiry is Required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessages: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("users", UserSchema);

export default UserModel;