// MongoDB initialization script
// This script creates the application database and user

// Switch to the cevra database
db = db.getSiblingDB('cevra');

// Create a user for the application
db.createUser({
  user: 'cevra_user',
  pwd: 'cevra_password',
  roles: [
    {
      role: 'readWrite',
      db: 'cevra'
    }
  ]
});

// Create initial collections (optional)
db.createCollection('chats');
db.createCollection('chatmessages');
db.createCollection('items');
db.createCollection('storages');

print('Database initialized successfully');