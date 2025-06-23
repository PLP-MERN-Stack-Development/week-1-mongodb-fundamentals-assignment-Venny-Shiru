# MongoDB Bookstore Project

## 🛠 Prerequisites

Before running this project, ensure you have the following installed:

1. **Node.js** (version 14 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **MongoDB Community Server**
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Or install via package manager:
     ```bash
     # Windows (using Chocolatey)
     choco install mongodb
     
     # macOS (using Homebrew)
     brew install mongodb-community
     
     # Ubuntu/Debian
     sudo apt-get install mongodb
     ```

3. **MongoDB Shell (optional but recommended)**
   - Download from [mongodb.com](https://www.mongodb.com/try/download/shell)

## 🚀 Installation

1. **Clone or download the project**
   ```bash
   git clone <https://github.com/PLP-MERN-Stack-Development/week-1-mongodb-fundamentals-assignment-Venny-Shiru.git>
   cd week-1-mongodb-fundamentals-assignment
   ```

2. **Initialize npm and install dependencies**
   ```bash
   npm init -y
   npm install mongodb
   ```

3. **Start MongoDB service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

4. **Verify MongoDB is running**
   ```bash
   # Check if MongoDB is listening on port 27017
   netstat -an | grep 27017
   
   # Or connect using MongoDB shell
   mongosh
   ```

## 📁 Project Structure

```
project-folder/
├── README.md                     # This file
├── package.json                  # Node.js dependencies
├── insert_books.js              # Original script to populate database
├── enhanced_insert_books.js     # Enhanced version with better error handling
├── mongodb_queries.js           # All MongoDB queries and examples
└── node_modules/                # Dependencies (created after npm install)
```

## 🏁 Getting Started

### Step 1: Populate the Database

First, run the script to insert sample book data into MongoDB:

```bash
# Using the enhanced version (recommended)
node insert_books.js


**Expected Output:**
```
🚀 Starting MongoDB Book Import Script
=====================================
Testing MongoDB connection...
✅ Successfully connected to MongoDB server

📋 Collection is empty, proceeding with insert

📚 Inserting books...
✅ 12 books were successfully inserted!
📊 Total documents in collection: 12

📖 Sample of inserted books:
  1. "To Kill a Mockingbird" by Harper Lee (1960) - $12.99
  2. "1984" by George Orwell (1949) - $10.99
  ...

🎉 Script completed successfully!
```

### Step 2: Verify Data Insertion

Connect to MongoDB and verify the data was inserted:

```bash
# Using MongoDB Shell
mongosh

# In the MongoDB shell:
use plp_bookstore
db.books.find().pretty()
```

## 🎯 Running the Scripts

### Method 1: Using MongoDB Shell (Recommended)

1. **Start MongoDB Shell:**
   ```bash
   mongosh
   ```

2. **Switch to the bookstore database:**
   ```javascript
   use plp_bookstore
   ```

3. **Run individual queries:**
   ```javascript
   // Example: Find all fiction books
   db.books.find({ genre: "Fiction" })
   
   // Example: Find books with projection
   db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })
   ```

### Method 2: Using Node.js Script

Create a new file called `run_queries.js`:

```javascript
const { MongoClient } = require('mongodb');

async function runQueries() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    const db = client.db('plp_bookstore');
    const collection = db.collection('books');
    
    // Example query
    const fictionBooks = await collection.find(
      { genre: "Fiction" },
      { projection: { title: 1, author: 1, price: 1, _id: 0 } }
    ).toArray();
    
    console.log('Fiction Books:', fictionBooks);
    
  } finally {
    await client.close();
  }
}

runQueries().catch(console.error);
```

Then run:
```bash
node run_queries.js
```

### Method 3: Using MongoDB Compass (GUI)

1. **Download MongoDB Compass** from [mongodb.com](https://www.mongodb.com/products/compass)
2. **Connect to:** `mongodb://localhost:27017`
3. **Navigate to:** `plp_bookstore` database → `books` collection
4. **Use the query bar** to run find operations with JSON syntax

## 📚 MongoDB Queries

### Basic CRUD Operations

```javascript
// Find books by genre
db.books.find({ genre: "Fiction" })

// Find books published after 1950
db.books.find({ published_year: { $gt: 1950 } })

// Update book price
db.books.updateOne({ title: "1984" }, { $set: { price: 13.99 } })

// Delete a book
db.books.deleteOne({ title: "Animal Farm" })
```

### Advanced Queries

```javascript
// Books in stock published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } })

// Projection (specific fields only)
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })

// Sorting by price (ascending)
db.books.find().sort({ price: 1 })

// Pagination (5 books per page)
db.books.find().skip(0).limit(5)  // Page 1
db.books.find().skip(5).limit(5)  // Page 2
```

### Aggregation Pipeline

```javascript
// Average price by genre
db.books.aggregate([
  { $group: { _id: "$genre", averagePrice: { $avg: "$price" } } },
  { $sort: { averagePrice: -1 } }
])

// Author with most books
db.books.aggregate([
  { $group: { _id: "$author", bookCount: { $sum: 1 } } },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
])
```

### Indexing

```javascript
// Create indexes
db.books.createIndex({ title: 1 })
db.books.createIndex({ author: 1, published_year: -1 })

// Analyze performance
db.books.find({ title: "1984" }).explain("executionStats")
```

## 🔧 Troubleshooting

### Common Issues and Solutions

#### 1. "Cannot find module 'mongodb'"
```bash
# Solution: Install the MongoDB driver
npm install mongodb
```

#### 2. "MongoServerSelectionError" or "ECONNREFUSED"
```bash
# Solution: Start MongoDB service
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

#### 3. "Permission denied" errors
```bash
# Solution: Run terminal as administrator (Windows) or use sudo (Linux/macOS)
```

#### 4. MongoDB not starting
```bash
# Check MongoDB logs
# Windows: C:\Program Files\MongoDB\Server\5.0\log\mongod.log
# macOS: /usr/local/var/log/mongodb/mongo.log
# Linux: /var/log/mongodb/mongod.log

# Check if port 27017 is in use
netstat -an | grep 27017
```

#### 5. Database/Collection not found
```bash
# Ensure you've run the insert script first
node enhanced_insert_books.js

# Verify in MongoDB shell
mongosh
use plp_bookstore
show collections
```

### Performance Tips

1. **Always use indexes** for frequently queried fields
2. **Use projection** to limit returned fields
3. **Use limit()** for large result sets
4. **Monitor with explain()** to optimize queries

### Development Tips

1. **Use MongoDB Compass** for visual database exploration
2. **Keep MongoDB shell open** for quick testing
3. **Use pretty()** for readable output: `db.books.find().pretty()`
4. **Check query execution time** with `.explain("executionStats")`

## 📖 Additional Resources

- [MongoDB Official Documentation](https://docs.mongodb.com/)
- [MongoDB University (Free Courses)](https://university.mongodb.com/)
- [MongoDB Node.js Driver Documentation](https://mongodb.github.io/node-mongodb-native/)
- [MongoDB Query Reference](https://docs.mongodb.com/manual/reference/operator/query/)
- [Aggregation Pipeline Reference](https://docs.mongodb.com/manual/reference/operator/aggregation/)
