const express = require('express')
const app = express()
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r0xwjyk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const database = client.db("craftDB");
        const craftCollection = database.collection("crafts");
        const userCollection = database.collection("user");

        app.get('/craftItems', async (req, res) => {
            const cursor = craftCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get("/myCrafts/:email", async (req, res) => {
            console.log(req.params.email);
            const result = await craftCollection.find({ userEmail: req.params.email }).toArray();
            res.send(result);
        })

        app.get("/craftItems/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await craftCollection.findOne(query);
            res.send(result);
        })

        app.post('/craftItems', async (req, res) => {
            const newCraft = req.body;
            const result = await craftCollection.insertOne(newCraft);
            res.send(result);
        })

        app.put('/CraftItems/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) };
            const data = {
                $set: {
                    itemName: req.body.itemName,
                    subcategory: req.body.subcategory,
                    customization: req.body.customization,
                    status: req.body.status,
                    imageURL: req.body.imageURL,
                    processingTime: req.body.processingTime,
                    price: req.body.price,
                    rating: req.body.rating,
                    itemDescription: req.body.itemDescription
                }
            }
            const result = await craftCollection.updateOne(query, data);
            res.send(result);

        })

        app.delete("/deleteCraft/:id", async (req, res) => {
            const result = await craftCollection.deleteOne({ _id: new ObjectId(req.params.id) })
            res.send(result);
        })


        // user related apis 

        app.post('/user', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('art and crafts server is running')
})

app.listen(port, () => {
    console.log(`Crafts server is running on port: ${port}`)
})