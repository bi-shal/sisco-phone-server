const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const addVitigeCollection = client.db('allPhoneData').collection('addVitige')
        const userCollection = client.db('allPhoneData').collection('userCategory')
        const userRole = client.db('allPhoneData').collection('userRole')
        const categoryAll = client.db('allPhoneData').collection('category')
        const allProducts = client.db('allPhoneData').collection('allProduct')
        const productsCollection = client.db('allPhoneData').collection('formAllProduct')
        const bookingsCollection = client.db('allPhoneData').collection('bookings')


// verify admin

async function verifyAdmin(req, res, next) {
    const requester = req.decoded?.email;
    // console.log('your crush mail', requester);
    // console.log(`requester `, requester);
    const requesterInfo = await userCollection.findOne({ email: requester })
    // console.log(`requesterInfo `, requesterInfo);
    const requesterRole = requesterInfo?.role;
    console.log(`requesterRole `, requesterRole);
    // if (requesterInfo?.role === 'admin') {
    //     return next();
    // }
    if (!requesterInfo?.role === 'admin') {
        return res.status(401).send({
            message: `You are not admin`,
            status: 401
        })
    }
    return next();
}

//CATEGORY--------------
        app.get('/category', async(req,res) => {
            const query = {};
            const cursor = categoryAll.find(query);
            const category = await cursor.toArray();
            res.send(category)
        })

//form-----------
        app.post('/products', async (req, res) => {
            const product = req.body;
            // console.log(product)
            const products = await productsCollection.insertOne(product);
            res.send(products);
        });

//myProduct---------asif


app.get('/bookings/:email', async (req, res) => {
    const email = req.params.email;
    // console.log(email);
    const query = { email: email };
    // console.log(query);
    const result = await productsCollection.find(query).toArray();
    res.send(result);
});
//addVitige-collection
app.post('/advertise', async (req, res) => {
    const user = req.body;
    // console.log(user);--------------
    const addvige = await addVitigeCollection.insertOne(user);
    res.send(addvige);
});

//getADDcard
app.get('/addCard', async(req,res) => {
    const query = {};
    const users = await addVitigeCollection.find(query).toArray();
    res.send(users)
})
//delete
// app.delete('/delete/:id', async (req, res) => {
//     const id = req.params.id;
//     console.log(id)
//     const query = {_id:id};
//     const result = await addVitigeCollection.deleteOne(query);
//     res.send(result);
// });
app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;
    // console.log(id)
    const query = {_id:ObjectId(id)}
    const result = await productsCollection.deleteOne(query);
    res.send(result);
});

//myProduct---------asif

//Shop-route-------------
app.get('/shop', async(req,res) => {
    const query = {};
    const users = await productsCollection.find(query).toArray();
    res.send(users)
})

//Shop-route-------------





        //user-role
        app.post('/usersCreate', async (req, res) => {
            const user = req.body;
            // console.log(user);--------------
            const userss = await userCollection.insertOne(user);
            res.send(userss);
        });
//user-role-----trying
        app.get('/usersCreate', async(req,res) => {
        const query = {};
        const users = await userCollection.find(query).toArray();
        res.send(users)
    })


    // })
            // check role
            app.get('/usersCreate/:email', async (req, res) => {
                const email = req.params.email;
                // console.log(email)
                const query = { email: email };
                const result = await userCollection.findOne(query);
                res.send(result);
                // console.log(result)
            });


//Boking-collection-start
app.post('/bookings', async (req, res) => {
    const product = req.body;
    const products = await bookingsCollection.insertOne(product);
    res.send(products);
});

app.get('/bookings/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    // console.log(query);
    const result = await bookingsCollection.find(query).toArray();
    res.send(result);
});


//Boking-collection-end


        // get single user
app.get("/user/:email", verifyToken,verifyAdmin, async (req, res) => {
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