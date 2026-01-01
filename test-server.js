const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
require('dotenv').config();

async function startTestServer() {
  try {
    console.log('Starting MongoDB Memory Server...');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    
    console.log(`MongoDB Memory Server started at: ${uri}`);
    
    // Update environment variable
    process.env.MONGODB_URI = uri;
    
    // Start the main server
    require('./server.js');
    
  } catch (error) {
    console.error('Error starting test server:', error);
    process.exit(1);
  }
}

startTestServer();
