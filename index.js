const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();



//middleware
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 5000;



const uri = "mongodb+srv://mohsenalmahmud:Q4e0dhWZvKzkIjV9@cluster0.9qwfxyj.mongodb.net/?retryWrites=true&w=majority";


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
    await client.connect();

    const userCollection = client.db("userDB").collection("users");

    app.post("/users", async(req, res) =>{
      const user = req.body;
      console.log("user", user);
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });

    app.get("/users", async(req, res) =>{
      const result = await userCollection.find().toArray();
      console.log(result);
      res.send(result);
    })
    
    await client.db("admin").command({ ping: 1 });
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