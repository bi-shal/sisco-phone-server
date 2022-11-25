const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express());



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@cluster0.eubulyg.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });






//test
app.get('/', async (req,res) => {
    res.send('site running')
})
// jwt-


app.listen((port), ()=> console.log(`site on runing ${port}`))