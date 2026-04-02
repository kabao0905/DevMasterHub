// ═══════════════════════════════════════════════════════════════
// DevMaster Hub — MongoDB Curriculum (Backend)
// ═══════════════════════════════════════════════════════════════
const DATA_MONGODB = {
  id:'mongodb', name:'MongoDB', icon:'🍃', color:'#47A248',
  gradient:'linear-gradient(135deg,#47A248,#13AA52)',
  category:'backend',
  description:'NoSQL database — document-based, scalable, flexible schema',
  levels:[
    {id:'newbie',name:'Newbie',badge:'newbie',desc:'MongoDB basics',lessons:[
      {id:'intro',title:'MongoDB & NoSQL Concepts',
       theory:'<p><b>MongoDB</b> = document-oriented NoSQL database. Lưu data dưới dạng JSON-like documents (BSON). Không cần fixed schema.</p><p>Ưu điểm: flexible schema, horizontal scaling, high performance reads.</p>',
       code:'// Document structure\n{\n  "_id": ObjectId("507f1f77bcf86cd799439011"),\n  "name": "John Doe",\n  "email": "john@example.com",\n  "age": 25,\n  "address": {\n    "city": "Hanoi",\n    "country": "Vietnam"\n  },\n  "hobbies": ["coding", "gaming", "reading"],\n  "created_at": ISODate("2024-01-15T10:30:00Z")\n}\n\n// Basic operations\ndb.users.insertOne({ name: "Alice", age: 30 })\ndb.users.find({ age: { $gte: 25 } })\ndb.users.updateOne({ name: "Alice" }, { $set: { age: 31 } })\ndb.users.deleteOne({ name: "Alice" })',
       lang:'javascript',
       keyPoints:['Document = JSON object','Collection = table','Flexible schema','BSON data types'],
       exercise:'Tạo database và CRUD basic operations'},
      {id:'queries',title:'Queries & Operators',
       theory:'<p>MongoDB queries: comparison, logical, array, element operators.</p>',
       code:'// Comparison\ndb.products.find({ price: { $gt: 100, $lte: 500 } })\ndb.users.find({ status: { $in: ["active", "pending"] } })\n\n// Logical\ndb.products.find({\n  $or: [\n    { category: "electronics" },\n    { price: { $lt: 50 } }\n  ]\n})\n\n// Array operators\ndb.users.find({ hobbies: { $all: ["coding", "gaming"] } })\ndb.posts.find({ tags: { $size: 3 } })\ndb.users.find({ "scores.math": { $gte: 90 } })\n\n// Projection (select fields)\ndb.users.find(\n  { age: { $gte: 18 } },\n  { name: 1, email: 1, _id: 0 }\n)\n\n// Sort, Skip, Limit\ndb.products.find().sort({ price: -1 }).skip(10).limit(5)',
       lang:'javascript',
       keyPoints:['$gt, $lt, $gte, $lte comparisons','$or, $and, $not logical','$in, $all array ops','Projection, sort, pagination'],
       exercise:'Viết queries phức tạp cho e-commerce database'}
    ]},
    {id:'junior',name:'Junior',badge:'junior',desc:'Node.js integration & Mongoose',lessons:[
      {id:'mongoose',title:'Mongoose ODM',
       theory:'<p>Mongoose = ODM (Object Document Mapper) cho Node.js. Schema validation, middleware, virtuals.</p>',
       code:'const mongoose = require(\'mongoose\');\n\n// Schema definition\nconst userSchema = new mongoose.Schema({\n  name: { type: String, required: true, trim: true },\n  email: {\n    type: String, required: true, unique: true,\n    lowercase: true, match: /^[\\w.-]+@[\\w.-]+\\.[a-z]{2,}$/\n  },\n  password: { type: String, required: true, minlength: 8 },\n  role: { type: String, enum: [\'user\', \'admin\'], default: \'user\' },\n  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: \'Post\' }]\n}, { timestamps: true });\n\n// Middleware (pre-save hook)\nuserSchema.pre(\'save\', async function(next) {\n  if (this.isModified(\'password\')) {\n    this.password = await bcrypt.hash(this.password, 10);\n  }\n  next();\n});\n\n// Methods\nuserSchema.methods.comparePassword = async function(candidate) {\n  return bcrypt.compare(candidate, this.password);\n};\n\nconst User = mongoose.model(\'User\', userSchema);\n\n// Usage\nconst user = await User.create({ name: \'Alice\', email: \'alice@test.com\', password: \'12345678\' });\nconst users = await User.find({ role: \'admin\' }).populate(\'posts\');',
       lang:'javascript',
       keyPoints:['Schema = data validation','Pre/post middleware hooks','populate() = join-like','Virtual fields'],
       exercise:'Tạo User model với Mongoose validation'},
      {id:'crud-api',title:'REST API with Express + MongoDB',
       theory:'<p>Build full CRUD API: Express routes + MongoDB backend.</p>',
       code:'const express = require(\'express\');\nconst router = express.Router();\nconst Post = require(\'../models/Post\');\n\n// GET all posts\nrouter.get(\'/\', async (req, res) => {\n  try {\n    const { page = 1, limit = 10, sort = \'-createdAt\' } = req.query;\n    const posts = await Post.find()\n      .populate(\'author\', \'name email\')\n      .sort(sort)\n      .skip((page - 1) * limit)\n      .limit(parseInt(limit));\n    const total = await Post.countDocuments();\n    res.json({ posts, total, page: +page, pages: Math.ceil(total / limit) });\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n});\n\n// POST create\nrouter.post(\'/\', auth, async (req, res) => {\n  try {\n    const post = await Post.create({ ...req.body, author: req.user.id });\n    res.status(201).json(post);\n  } catch (err) {\n    res.status(400).json({ error: err.message });\n  }\n});\n\n// PUT update\nrouter.put(\'/:id\', auth, async (req, res) => {\n  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });\n  if (!post) return res.status(404).json({ error: \'Not found\' });\n  res.json(post);\n});',
       lang:'javascript',
       keyPoints:['RESTful route patterns','Pagination with skip/limit','populate() for joins','Error handling middleware'],
       exercise:'Build complete CRUD API cho blog'}
    ]},
    {id:'mid',name:'Mid-Level',badge:'mid',desc:'Aggregation & Indexing',lessons:[
      {id:'aggregation',title:'Aggregation Pipeline',
       theory:'<p>Aggregation = complex data processing. $match, $group, $lookup, $project.</p>',
       code:'// Sales analytics\ndb.orders.aggregate([\n  // Stage 1: Filter recent orders\n  { $match: { createdAt: { $gte: ISODate("2024-01-01") } } },\n\n  // Stage 2: Unwind items array\n  { $unwind: "$items" },\n\n  // Stage 3: Group by category\n  { $group: {\n    _id: "$items.category",\n    totalRevenue: { $sum: { $multiply: ["$items.price", "$items.qty"] } },\n    avgPrice: { $avg: "$items.price" },\n    orderCount: { $sum: 1 },\n    items: { $push: "$items.name" }\n  }},\n\n  // Stage 4: Sort by revenue\n  { $sort: { totalRevenue: -1 } },\n\n  // Stage 5: Lookup category details\n  { $lookup: {\n    from: "categories",\n    localField: "_id",\n    foreignField: "_id",\n    as: "categoryInfo"\n  }},\n\n  // Stage 6: Format output\n  { $project: {\n    category: { $arrayElemAt: ["$categoryInfo.name", 0] },\n    totalRevenue: 1,\n    avgPrice: { $round: ["$avgPrice", 2] },\n    orderCount: 1\n  }}\n]);',
       lang:'javascript',
       keyPoints:['Pipeline stages in order','$match = filter','$group = aggregate','$lookup = join collections'],
       exercise:'Tạo analytics dashboard queries'},
      {id:'indexing',title:'Indexing & Performance',
       theory:'<p>Indexes tăng query performance. Compound, text, geospatial indexes.</p>',
       code:'// Create indexes\ndb.users.createIndex({ email: 1 }, { unique: true })\ndb.products.createIndex({ category: 1, price: -1 })\ndb.posts.createIndex({ title: "text", content: "text" })\ndb.stores.createIndex({ location: "2dsphere" })\n\n// Explain query performance\ndb.users.find({ email: "test@test.com" }).explain("executionStats")\n// Look for: IXSCAN (good) vs COLLSCAN (bad)\n\n// Text search\ndb.posts.find({ $text: { $search: "mongodb tutorial" } })\n\n// Geo queries\ndb.stores.find({\n  location: {\n    $near: {\n      $geometry: { type: "Point", coordinates: [105.8, 21.0] },\n      $maxDistance: 5000  // 5km\n    }\n  }\n})\n\n// TTL index (auto-delete)\ndb.sessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 3600 })',
       lang:'javascript',
       keyPoints:['B-tree indexes','Compound indexes','Text search','explain() for analysis'],
       exercise:'Optimize queries với proper indexing'}
    ]},
    {id:'senior',name:'Senior',badge:'senior',desc:'Transactions & Atlas',lessons:[
      {id:'advanced',title:'Transactions & Replica Sets',
       theory:'<p>MongoDB transactions cho ACID operations. Replica sets cho high availability.</p>',
       code:'// Multi-document transaction\nconst session = await mongoose.startSession();\n\ntry {\n  session.startTransaction();\n\n  // Transfer money between accounts\n  await Account.findByIdAndUpdate(\n    fromAccountId,\n    { $inc: { balance: -amount } },\n    { session }\n  );\n\n  await Account.findByIdAndUpdate(\n    toAccountId,\n    { $inc: { balance: amount } },\n    { session }\n  );\n\n  await Transaction.create([{\n    from: fromAccountId,\n    to: toAccountId,\n    amount,\n    type: \'transfer\'\n  }], { session });\n\n  await session.commitTransaction();\n  console.log(\'Transfer successful!\');\n} catch (error) {\n  await session.abortTransaction();\n  throw error;\n} finally {\n  session.endSession();\n}',
       lang:'javascript',
       keyPoints:['ACID transactions','Session management','Rollback on error','Replica set reads'],
       exercise:'Implement bank transfer with transactions'}
    ]},
    {id:'master',name:'Master',badge:'master',desc:'Scaling & Architecture',lessons:[
      {id:'scaling',title:'Sharding & Production Architecture',
       theory:'<p>Sharding = horizontal scaling. Phân tán data across multiple servers.</p>',
       code:'// Shard key selection\nsh.shardCollection("mydb.orders", { customerId: "hashed" })\n\n// Connection pooling (Mongoose)\nmongoose.connect(process.env.MONGODB_URI, {\n  maxPoolSize: 10,\n  minPoolSize: 2,\n  socketTimeoutMS: 30000,\n  serverSelectionTimeoutMS: 5000,\n  retryWrites: true,\n  w: \'majority\'\n});\n\n// Change Streams (real-time)\nconst pipeline = [{ $match: { operationType: { $in: [\'insert\', \'update\'] } } }];\nconst changeStream = Post.watch(pipeline);\nchangeStream.on(\'change\', (change) => {\n  console.log(\'Change detected:\', change.operationType);\n  io.emit(\'data-change\', change.fullDocument);\n});\n\n// Atlas Search (Lucene-based)\ndb.posts.aggregate([\n  { $search: {\n    index: "default",\n    compound: {\n      must: [{ text: { query: "mongodb", path: "title" } }],\n      should: [{ text: { query: "tutorial", path: "content" } }]\n    }\n  }}\n]);',
       lang:'javascript',
       keyPoints:['Shard key strategy','Connection pooling','Change streams real-time','Atlas Search (Lucene)'],
       exercise:'Setup change streams cho real-time updates'}
    ]}
  ]
};
