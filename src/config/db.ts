import dotenv from 'dotenv'

import mongoose from "mongoose";

dotenv.config()

const dbName = process.env.MONGO_DBName;
const mongoURI = process.env.MONGO_URI || `mongodb://0.0.0.0:27017/${dbName}`;

const fullMongoURI = `${mongoURI}/${dbName}?retryWrites=true&w=majority`;

// HW 10
export async function runDb() {
    try {
        await mongoose.connect(fullMongoURI, {});
        console.log('Connected successfully to MongoDB');
    } catch (e) {
        console.log('Failed to connect to MongoDB');
        console.log(e);
        await mongoose.disconnect()
    }
}
