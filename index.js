const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const jwt = require('jsonwebtoken');


//middleware
app.use(cors());
app.use(express.json());


// Verify Token
function verifyToken(req, res, next) {
    const authorizaion = req.headers.authorizaion;
    // console.log('authorizaion', authorizaion);
    if (!authorizaion) {
        return res.status(401).send({
            message: 'No valid Auth Headers',
            status: 401
        })
    }
    const token = authorizaion.split(" ")[1];
    // console.log(token);

    // verify the token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: `Invalid Token`,
                status: 401
            })
        }
        req.decoded = decoded;
        // req.yourName = decoded;
        // req.jwtverifiedToken = decoded;
        return next();
    })
}




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eubulyg.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//jwt-


async function run (){
    try{
        const serviceCollection = client.db('allPhoneData').collection('CategoryData')
        const userCollection = client.db('allPhoneData').collection('userCategory')


        app.get('/services', async(req,res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            // console.log(services)
            res.send(services)
        });

//token------------userPutDB------------------------

        app.put("/user/:email", async (req, res) => {
            try {
                const email = req.params.email;
                console.log(email)
                // check the req
                console.log(req.body);
                const user = req.body;
                const filter = { email: email };
                const options = { upsert: true };
                const updateDoc = {
                    $set: user
                }
                const result = await userCollection.updateOne(filter, updateDoc, options);
        
                // token generate 
                const token = jwt.sign(
                    { email: email },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "60d" }
                )
                res.send({
                    status: "success",
                    message: "Token Created Successfully",
                    data: token
                })
        
        
            }
            catch (err) {
                console.log(err)
            }
        })




        // get single user
app.get("/user/:email", verifyToken, async (req, res) => {
    try {
        const email = req.params.email;
        // console.log(`decode token`, req.decoded);
        // const query = {email:email}
        const user = await userCollection.findOne({ email });
        res.send({
            status: "success",
            message: "Fetch single user",
            data: user
        })
    }
    catch (err) {
        console.log(err)
    }
})




    }
    finally{

    }
}
run().catch(error =>  console.error(error));


//test
app.get('/', async (req,res) => {
    res.send('site running')
})



app.listen((port), ()=> console.log(`site on runing ${port}`))