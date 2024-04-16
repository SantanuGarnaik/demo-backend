import express from 'express';
import dotenv from 'dotenv';
import mongodb from 'mongodb';
import mongoose from 'mongoose';

// Load environment variables from .env file
dotenv.config();

const app = express(); // Create Express application instance

const MongoClient = mongodb.MongoClient;
const url = process.env.MONGODB_URI; // Use environment variable for MongoDB URI
const dbName = 'blog'; // Set your database name here

export let db;

try {
  mongoose.connect(url);
  console.log("Connected to MongoDB");
} catch (error) {
  console.error("Error connecting to MongoDB:", error);
  process.exit(1);
}


