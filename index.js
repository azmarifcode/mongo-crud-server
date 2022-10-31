const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());

const uri =
    'mongodb+srv://azmarif2:w6xTQPxdIZ7kdZ9m@cluster0.zh0amk9.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

async function run() {
    try {
        const userCollection = client.db('nodeMongoCurd').collection('users');
        // create
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.send(result);
        });
        // read
        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            console.log(users);
            res.send(users);
        });
        // update
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user);
        });

        // put
        app.put('/users/:id', async (req, res) =>
        {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const user = req.body
            const option = { upsert: true };
            const updateUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
                }
            }
            const result = await userCollection.updateOne(filter,  updateUser, option)
            res.send(result)
        })

        // delete
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('try delete', id);
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
            console.log(result);
        });
    } finally {
    }
}
run().catch((err) => console.log(err));

app.get('/', (req, res) => {
    res.send('curd server is running');
});

app.listen(port, () => {
    console.log(`curd server port is ${port}`);
});
