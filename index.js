
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express(cors());
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const PORT = process.env.PORT || 9000;

// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USERNAME)

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.xjpiwvy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    

    const database = client.db("productDB");
    const productCollection = database.collection("product");
    const cartCollection = database.collection("cart");

    // crud operation for products
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct)
      res.send(result);
    })
    // read operation
    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // read operation for specific product
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    })
    app.put('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;
      const product = {
        $set: {
          productName: updatedProduct.productName,
          brandName: updatedProduct.brandName,
          productImg: updatedProduct.productImg,
          productType: updatedProduct.productType,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
          description: updatedProduct.description
        }
      }
      const result = await productCollection.updateOne(filter, product, options)
      res.send(result)
    })
    // delete operation
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })

    // crud operation for cart
    app.post('/cart', async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await cartCollection.insertOne(product)
      res.send(result);
    })
    app.get('/cart', async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: id };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('SrsTech server is ready')
})

app.listen(PORT, () => {
  console.log(`SrsTech server is running on http://127.0.0.1:${PORT}`)
})