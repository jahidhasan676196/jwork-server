const express = require('express');
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000

// middleware
app.use(express.json())
app.use(cors())
// FSlx23VnFXiXwu9z
// console.log(process.env.USER_DB);


// const uri = `mongodb://localhost:27017`
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASSWORD}@cluster0.rzyh2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const jobsCollection = client.db('jwork').collection('jobs')
    const bidCollection = client.db('jwork').collection('bids')
    app.get('/jobs', async (req, res) => {
      const result = await jobsCollection.find().toArray()
      res.send(result)
    })
    app.get('/jobs/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await jobsCollection.findOne(query)
      res.send(result)
    })
    app.get('/job/:email', async (req, res) => {
      const email = req.params.email
      const query = { buyer_email: email }
      const result = await jobsCollection.find(query).toArray()
      res.send(result)
    })
    app.get('/bids/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email }
      const result = await bidCollection.find(query).toArray()
      res.send(result)
    })
    app.post('/jobs', async (req, res) => {
      const jobsData = req.body
      const result = await jobsCollection.insertOne(jobsData)
      // console.log(jobsData);
      res.send(result)
    })
    app.post('/bids', async (req, res) => {
      const bidsData = req.body
      const result = await bidCollection.insertOne(bidsData)
      console.log(bidsData)
      res.send(result)
    })
    app.put('/update/:id', async(req,res)=>{
      const id=req.params.id
      const elements=req.body
      const filter={_id: new ObjectId(id)}
      const options = { upsert: true };
      const updateDoc={
        $set:{
          ...elements
        }
      }
      const result=await jobsCollection.updateOne(filter,updateDoc,options)
      res.send(result)
    })
    app.delete('/jobsDelete/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await jobsCollection.deleteOne(query)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('helleo ')
})
app.listen(port, (req, res) => {
  console.log(`The server is running ${port}`);
})
