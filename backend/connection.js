const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/buysmart';

// Updated connection options removing deprecated flags
const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
};

// In-memory mock data for use when MongoDB is unavailable
const mockUsers = [
    {
        _id: '1',
        username: 'testuser',
        email: 'test@example.com',
        // Password hash for 'password123'
        password: '$2b$10$bS73nJAzuqYV/PL2XTKWGeWw6Gqx1KUhxNnG2HHMzwrC1j0svZ1hC'
    }
];

// Simple in-memory DB for use when MongoDB is unavailable
const inMemoryDB = {
    users: [...mockUsers],
    
    findUserByUsername: (username) => {
        return inMemoryDB.users.find(u => u.username === username);
    },
    
    findUserByEmail: (email) => {
        return inMemoryDB.users.find(u => u.email === email);
    },
    
    findUser: (usernameOrEmail) => {
        // Try to find by username first, then by email
        return inMemoryDB.users.find(
            u => u.username === usernameOrEmail || u.email === usernameOrEmail
        );
    },
    
    addUser: (user) => {
        const newUser = { ...user, _id: Date.now().toString() };
        inMemoryDB.users.push(newUser);
        return newUser;
    }
};

let isConnected = false;

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(MONGO_URI, options);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        isConnected = true;
        return true;
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.log('Starting in fallback mode with in-memory database');
        isConnected = false;
        return false;
    }
};

// Handle connection events
mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to MongoDB');
    isConnected = true;
});

mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
    isConnected = false;
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected from MongoDB');
    isConnected = false;
});

// Handle application termination
process.on('SIGINT', async () => {
    if (isConnected) {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to app termination');
    }
    process.exit(0);
});

module.exports = { 
    connectDB, 
    mongoose, 
    inMemoryDB, 
    isConnected: () => isConnected 
};