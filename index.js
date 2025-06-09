const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.port || 3000;

// middlewares

app.use(cors());
app.use(express.json());

// Testing
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;

const uri = `mongodb+srv://${user}:${pass}@cluster0.ud14df5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Creating the Collection
    const CoffeeCollection = client.db('CoffeeDB').collection('Coffees');

    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;
      //   console.log('Data in the Server: ', newCoffee);
      const result = await CoffeeCollection.insertOne(newCoffee);
      res.send(result);
    });

    app.get('/coffees', async (req, res) => {
      const cursor = CoffeeCollection.find();
      const result = await cursor.toArray();
      //   console.log(result);
      res.send(result);
    });

    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await CoffeeCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

// MongoDB Connection Done

app.get('/', (req, res) => {
  res.send('Coffee Server is getting hotter');
});

app.listen(port, () => {
  console.log(`Coffee Server is running on port ${port}`);
});
