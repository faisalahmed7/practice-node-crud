const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require('express/lib/response');
const port = process.env.PORT || 5000;



// MiddleWares

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n44g7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()
        const userCollection = client.db('practiceCollection').collection('user');

        //GET: load all the data in the UI
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query)
            const users = await cursor.toArray();
            res.send(users)
        })
        //GET: to load a specific data
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await userCollection.findOne(query);
            res.send(result)


        })


        //POST: Add a new User
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser)
            console.log('new data added', newUser);
            res.send(result)
        })

        //DELETE: Delete a user
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result)

        })

        //PUT: MOdify/Update a user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true }
            const updatedDoc = {
                $set: {
                    name: updateUser.name,
                    email: updateUser.email
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })

    }

    finally {

    }
}

run().catch(console.dir)





app.get('/', (req, res) => {
    res.send('Server is Running')
})

app.listen(port, () => {
    console.log('Server is connected', port);
})