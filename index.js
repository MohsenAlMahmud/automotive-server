require('dotenv').config()
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();



//middleware
app.use(cors());
app.use(express.json());




const port = process.env.PORT || 5000;



const uri = `mongodb+srv://${process.env.AM_USER}:${process.env.AM_PASS}@cluster0.9qwfxyj.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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

    const userCollection = client.db("userDB").collection("users");
    // const productCollection = client.db("productDB").collection("products");

    app.post("/users", async(req, res) =>{
      const user = req.body;
      console.log("user", user);
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });

    // app.post("/products", async(req, res) =>{
    //   const product = req.body;
    //   console.log("product", product);
    //   const result = await productCollection.insertOne(product);
    //   console.log(result);
    //   res.send(result);
    // });

    app.get("/users/:id", async(req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = {
        _id: new ObjectId(id),
      };
      const result = await userCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    // app.get("/users/:id", async(req, res) => {
    //   const id = req.params.id;
    //   console.log(id);
    //   const query = {
    //     _id: new ObjectId(id),
    //   };
    //   const result = await productCollection.findOne(query);
    //   console.log(result);
    //   res.send(result);
    // });

    app.put("/users/:id", async(req, res) =>{
      const id = req.params.id;
      const data = req.body;
      const filter = {
        _id: new ObjectId(id),
      };
      const options = { upsert: true};
      const updateData = {
        $set:{
          image: data.image,
          name: data.name,
          brand: data.brand,
          type: data.type,
          price: data.price,
          shortDescription: data.shortDescription,
          rating: data.rating,
          detailDescription: data.detailDescription

        },
      };
      const result = await userCollection.updateOne(filter, updateData, options);
      res.send(result);
    })

    app.get("/users", async(req, res) =>{
      const result = await userCollection.find().toArray();
      console.log(result);
      res.send(result);
    })
    
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Crud is working nicely..........");
});

app.listen(port, () => {
    console.log(`Simple crud is running on port: ${port}`);
});
