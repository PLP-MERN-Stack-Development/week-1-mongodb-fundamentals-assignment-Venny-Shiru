// insert_books.js - Enhanced version with better error handling

const { MongoClient } = require('mongodb');

// Connection URI with options for better compatibility
const uri = 'mongodb://localhost:27017';
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 5, // Maintain a minimum of 5 socket connections
  maxIdleTimeMS: 30000, // Close connections after 30s of inactivity
};

const dbName = 'plp_bookstore';
const collectionName = 'books';

// Sample book data (same as original)
const books = [
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    published_year: 1960,
    price: 12.99,
    in_stock: true,
    pages: 336,
    publisher: 'J. B. Lippincott & Co.'
  },
  {
    title: '1984',
    author: 'George Orwell',
    genre: 'Dystopian',
    published_year: 1949,
    price: 10.99,
    in_stock: true,
    pages: 328,
    publisher: 'Secker & Warburg'
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    published_year: 1925,
    price: 9.99,
    in_stock: true,
    pages: 180,
    publisher: 'Charles Scribner\'s Sons'
  },
  {
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Dystopian',
    published_year: 1932,
    price: 11.50,
    in_stock: false,
    pages: 311,
    publisher: 'Chatto & Windus'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    published_year: 1937,
    price: 14.99,
    in_stock: true,
    pages: 310,
    publisher: 'George Allen & Unwin'
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    published_year: 1951,
    price: 8.99,
    in_stock: true,
    pages: 224,
    publisher: 'Little, Brown and Company'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    published_year: 1813,
    price: 7.99,
    in_stock: true,
    pages: 432,
    publisher: 'T. Egerton, Whitehall'
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    published_year: 1954,
    price: 19.99,
    in_stock: true,
    pages: 1178,
    publisher: 'Allen & Unwin'
  },
  {
    title: 'Animal Farm',
    author: 'George Orwell',
    genre: 'Political Satire',
    published_year: 1945,
    price: 8.50,
    in_stock: false,
    pages: 112,
    publisher: 'Secker & Warburg'
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Fiction',
    published_year: 1988,
    price: 10.99,
    in_stock: true,
    pages: 197,
    publisher: 'HarperOne'
  },
  {
    title: 'Moby Dick',
    author: 'Herman Melville',
    genre: 'Adventure',
    published_year: 1851,
    price: 12.50,
    in_stock: false,
    pages: 635,
    publisher: 'Harper & Brothers'
  },
  {
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    genre: 'Gothic Fiction',
    published_year: 1847,
    price: 9.99,
    in_stock: true,
    pages: 342,
    publisher: 'Thomas Cautley Newby'
  }
];

// Function to test MongoDB connection
async function testConnection() {
  const client = new MongoClient(uri, options);
  
  try {
    console.log('Testing MongoDB connection...');
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB server");
    
    return client;
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    
    if (error.name === 'MongoServerSelectionError') {
      console.error("- Make sure MongoDB is running on localhost:27017");
      console.error("- Check if MongoDB service is started");
    } else if (error.name === 'MongoParseError') {
      console.error("- Check your connection URI format");
    } else {
      console.error("- Error details:", error.message);
    }
    
    throw error;
  }
}

// Enhanced function to insert books
async function insertBooks() {
  let client;

  try {
    // Test connection first
    client = await testConnection();
    
    // Get database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Check if collection already has documents
    console.log('\nChecking existing data...');
    const count = await collection.countDocuments();
    
    if (count > 0) {
      console.log(`📋 Collection already contains ${count} documents`);
      console.log('🗑️  Dropping collection to start fresh...');
      await collection.drop();
      console.log('✅ Collection dropped successfully');
    } else {
      console.log('📋 Collection is empty, proceeding with insert');
    }

    // Insert the books
    console.log('\n📚 Inserting books...');
    const result = await collection.insertMany(books);
    console.log(`✅ ${result.insertedCount} books were successfully inserted!`);

    // Verify insertion by counting documents
    const newCount = await collection.countDocuments();
    console.log(`📊 Total documents in collection: ${newCount}`);

    // Display sample of inserted books
    console.log('\n📖 Sample of inserted books:');
    const sampleBooks = await collection.find({}).limit(5).toArray();
    sampleBooks.forEach((book, index) => {
      console.log(`  ${index + 1}. "${book.title}" by ${book.author} (${book.published_year}) - $${book.price}`);
    });
    
    if (books.length > 5) {
      console.log(`  ... and ${books.length - 5} more books`);
    }

    // Create an index on commonly queried fields for better performance
    console.log('\n🔍 Creating indexes for better query performance...');
    await collection.createIndex({ author: 1 });
    await collection.createIndex({ genre: 1 });
    await collection.createIndex({ published_year: 1 });
    console.log('✅ Indexes created successfully');

  } catch (error) {
    console.error('\n❌ Error occurred during operation:');
    
    if (error.name === 'MongoWriteError') {
      console.error('- Database write error:', error.message);
    } else if (error.name === 'MongoNetworkError') {
      console.error('- Network connection error:', error.message);
    } else {
      console.error('- Unexpected error:', error.message);
    }
    
    console.error('\n🔧 Troubleshooting tips:');
    console.error('1. Ensure MongoDB is running: `mongod` or check system services');
    console.error('2. Verify connection string is correct');
    console.error('3. Check MongoDB logs for additional error details');
    console.error('4. Ensure you have write permissions to the database');
    
  } finally {
    // Close the connection
    if (client) {
      await client.close();
      console.log('\n🔌 Connection closed');
    }
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting MongoDB Book Import Script');
  console.log('=====================================');
  
  try {
    await insertBooks();
    console.log('\n🎉 Script completed successfully!');
    
    console.log('\n💡 Try these MongoDB queries in your MongoDB shell:');
    console.log('   db.books.find().pretty()');
    console.log('   db.books.find({ author: "George Orwell" })');
    console.log('   db.books.find({ in_stock: true }).count()');
    
  } catch (error) {
    console.error('\n💥 Script failed to complete');
    process.exit(1);
  }
}

// Run the script
main();