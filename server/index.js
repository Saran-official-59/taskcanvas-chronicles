
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/taskcanvas";
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("taskcanvas");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1);
  }
}

// Routes
app.get('/api/tasks/:userId', async (req, res) => {
  try {
    const db = await connectDB();
    const tasks = await db.collection('tasks').find({ userId: req.params.userId }).toArray();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { userId, title, description, labels, columnId } = req.body;
    const db = await connectDB();
    
    const task = {
      userId,
      title,
      description,
      labels,
      columnId,
      createdAt: new Date().toISOString()
    };
    
    const result = await db.collection('tasks').insertOne(task);
    res.status(201).json({ ...task, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { title, description, labels, columnId } = req.body;
    const db = await connectDB();
    
    const result = await db.collection('tasks').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { title, description, labels, columnId } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const db = await connectDB();
    
    const result = await db.collection('tasks').deleteOne(
      { _id: new ObjectId(req.params.id) }
    );
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/board/:userId', async (req, res) => {
  try {
    const db = await connectDB();
    const user = await db.collection('users').findOne({ uid: req.params.userId });
    
    if (!user || !user.board) {
      // Return default board structure if user doesn't have one yet
      return res.json({
        columns: [
          { id: 'column-1', title: 'To Do', taskIds: [] },
          { id: 'column-2', title: 'In Progress', taskIds: [] },
          { id: 'column-3', title: 'Done', taskIds: [] },
        ]
      });
    }
    
    res.json(user.board);
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/board/:userId', async (req, res) => {
  try {
    const { board } = req.body;
    const db = await connectDB();
    
    await db.collection('users').updateOne(
      { uid: req.params.userId },
      { $set: { board } },
      { upsert: true }
    );
    
    res.json({ message: 'Board updated successfully' });
  } catch (error) {
    console.error('Error updating board:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
