
// ===================================
// TASK 2: BASIC CRUD OPERATIONS
// ===================================

// 1. Find all books in a specific genre
db.books.find({ genre: "Fiction" })

// 2. Find books published after a certain year
db.books.find({ published_year: { $gt: 1950 } })

// 3. Find books by a specific author
db.books.find({ author: "George Orwell" })

// 4. Update the price of a specific book
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 13.99 } }
)

// Update multiple books by same author:
db.books.updateMany(
  { author: "George Orwell" },
  { $set: { price: 12.99 } }
)

// 5. Delete a book by its title
db.books.deleteOne({ title: "Animal Farm" })

// ===================================
// TASK 3: ADVANCED QUERIES
// ===================================

// 1. Find books that are both in stock and published after 2010
db.books.find({
  $and: [
    { in_stock: true },
    { published_year: { $gt: 2010 } }
  ]
})

// 2. Use projection to return only title, author, and price fields
// Project specific fields for all books:
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
)

// 3. Implement sorting by price (ascending and descending)

// Sort by price ascending (lowest to highest):
db.books.find().sort({ price: 1 })

// Sort by price descending (highest to lowest):
db.books.find().sort({ price: -1 })

// 4. Implement pagination with limit and skip (5 books per page)

// Page 1 (first 5 books):
db.books.find().limit(5)

// Page 2 (books 6-10):
db.books.find().skip(5).limit(5)

// Page 3 (books 11-15):
db.books.find().skip(10).limit(5)

// Pagination with sorting and projection:
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ title: 1 }).skip(0).limit(5)  // Page 1

db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ title: 1 }).skip(5).limit(5)  // Page 2

// ===================================
// TASK 4: AGGREGATION PIPELINE
// ===================================

// 1. Calculate average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" },
      bookCount: { $sum: 1 }
    }
  },
  {
    $sort: { averagePrice: -1 }
  }
])

// 2. Find the author with the most books in the collection
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 },
      books: { $push: "$title" }
    }
  },
  {
    $sort: { bookCount: -1 }
  },
  {
    $limit: 1
  }
])

// 3. Group books by publication decade and count them
db.books.aggregate([
  {
    $addFields: {
      decade: {
        $concat: [
          { $toString: { $subtract: [{ $toInt: { $divide: ["$published_year", 10] } }, { $mod: [{ $toInt: { $divide: ["$published_year", 10] } }, 10] }] } },
          "0s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 },
      averagePrice: { $avg: "$price" },
      books: { $push: { title: "$title", year: "$published_year" } }
    }
  },
  {
    $sort: { _id: 1 }
  }
])

// ===================================
// TASK 5: INDEXING
// ===================================

// 1. Create an index on the title field
db.books.createIndex({ title: 1 })

// 2. Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 })

// ===================================
// PERFORMANCE ANALYSIS WITH EXPLAIN()
// ===================================

// 1. Query without index (before creating indexes):
db.books.find({ title: "1984" }).explain("executionStats")

// 2. Query with index (after creating title index):
db.books.find({ title: "1984" }).explain("executionStats")

// 3. Compound index usage:
db.books.find({ author: "George Orwell", published_year: { $gte: 1945 } }).explain("executionStats")
