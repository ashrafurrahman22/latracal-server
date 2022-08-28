const express = require('express');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors())
app.use(express.json());

// mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vwie7ai.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





async function run(){
    try {
        await client.connect();
        const parkingCollection = client.db('parkingApp').collection('parking');
        

        // product api
        app.get('/parking', async(req, res)=>{
            const query = {};
            const cursor  = parkingCollection.find(query);
            const parkings = await cursor.toArray();
            res.send(parkings);
        })
        
        //  catch single item
         app.get('/parking/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await parkingCollection.findOne(query);
            res.send(result);
        })


        // post API
        app.post('/parking', async(req, res)=>{
            const parking = req.body;
            const result = await parkingCollection.insertOne(parking);
            res.send(result);
        });

        // update stock
        app.put('/parking/:id', async(req, res)=>{
            const id = req.params.id;
            const updatedParking = req.body;
            const filter = {_id : ObjectId(id)};
            const options = { upsert : true };
            const updatedDoc = {
                $set : {
                    name : updatedParking.name,
                    vihicleNumber : updatedParking.vihicleNumber,
                    checkIn : updatedParking.checkIn,
                    checkOut : updatedParking.checkOut
                }
            };
            const result = await parkingCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
            })


        //  Delete
         app.delete('/parking/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await parkingCollection.deleteOne(query);
            res.send(result);
        });

    }
    finally {

    }

}
run().catch(console.dir);

// root
app.get('/', (req, res)=>{
    res.send('parking server is running')
});

// root listen
app.listen(port, ()=>{
    console.log('parking Server is running on port', port);
})