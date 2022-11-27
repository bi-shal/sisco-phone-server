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
        const serviceCollection = client.db('allPhoneData').collection('CategoryData')
        const userCollection = client.db('allPhoneData').collection('userCategory')
        const categoryAll = client.db('allPhoneData').collection('category')
        const allProducts = client.db('allPhoneData').collection('allProduct')
        const productsCollection = client.db('allPhoneData').collection('formAllProduct')


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

//ALL-PRODUCT-----------
        // app.get('/products/:id', async (req,res) => {
        //     const id = req.params.id;
        //     console.log(id);
        //     const query = allProducts.find(pro => pro.category == id);
        //     console.log(query)
        //     // const cursor = await allProduct.findOne(query);
        //     // res.send(cursor)
        // })

//form-----------
        app.post('/products', async (req, res) => {
            const product = req.body;
            const products = await productsCollection.insertOne(product);
            res.send(products);
        });

        //user-role
        app.post('/usersCreate', async (req, res) => {
            const product = req.body;
            // console.log(product);
            const userss = await userCollection.insertOne(product);
            res.send(userss);
        });
//user-role-----trying
        app.get('/usersCreate', async(req,res) => {
        const query = {};
        const users = await userCollection.find(query).toArray();
        res.send(users)
    })

    //email-role----------last
    app.get('/user/:email', async (req,res) => {
        const email =req.params.email;
        console.log(email);
        const filter = { email: email };
        const result = await userCollection.find(use=> use.email === filter)
        console.log(result);
        res.send(result)
    })

        // app.get('/products/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email: email };
        //     const result = await productsCollection.find(query).toArray();
        //     res.send(result);
        //     // console.log(result);
        // });


        // app.get('/services', async(req,res) => {
        //     const query = {}
        //     const cursor = serviceCollection.find(query);
        //     const services = await cursor.toArray();
        //     // console.log(services)
        //     res.send(services)
        // });

//token------------userPutDB------------------------

        // app.put("/user/:email", async (req, res) => {
        //     try {
        //         const email = req.params.email;
        //         console.log(email)
        //         // check the req
        //         console.log(req.body);
        //         const user = req.body;
        //         const filter = { email: email };
        //         const options = { upsert: true };
        //         const updateDoc = {
        //             $set: user
        //         }
        //         const result = await userCollection.updateOne(filter, updateDoc, options);
        
        //         // token generate 
        //         const token = jwt.sign(
        //             { email: email },
        //             process.env.ACCESS_TOKEN_SECRET,
        //             { expiresIn: "60d" }
        //         )
        //         res.send({
        //             status: "success",
        //             message: "Token Created Successfully",
        //             data: token
        //         })
        
        
        //     }
        //     catch (err) {
        //         console.log(err)
        //     }
        // })


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


// get admin api ---------------------------admin-api
// app.get('/user/admin/:email', async (req, res) => {
//     try {

//         const email = req.params.email;
//         // console.log(`email`, email);
//         const user = await userCollection.findOne({ email: email });
//         const isAdmin = user?.role === 'admin';
//         res.send({
//             isAdmin: isAdmin
//         })

//     } catch (error) {
//         console.log(error);
//     }
// })


// get Seller api ------------------------------------seler
// app.get('/user/seler/:email', async (req, res) => {
//     try {

//         const email = req.params.email;
//         // console.log(`email`, email);
//         const user = await userCollection.findOne({ email: email });
//         const isSeler = user?.role === 'seler';
//         res.send({
//             isSeler: isSeler
//         })

//     } catch (error) {
//         console.log(error);
//     }
// })

// // get buyer api -------------------------------------buyer
// app.get('/user/buyer/:email', async (req, res) => {
//     try {

//         const email = req.params.email;
//         // console.log(`email`, email);
//         const user = await userCollection.findOne({ email: email });
//         const isBuyer = user?.role === 'buyer';
//         res.send({
//             isBuyer: isBuyer
//         })

//     } catch (error) {
//         console.log(error);
//     }
// })

// //----------------------------user---alamin
// app.post('/usersCreate', async (req, res) => {
//     try {

//         const userr = req.body;
//         console.log(userr);
//         const loginUser = await userCollection.findOne({
//             email:userr.email,
//         });
//         if(!loginUser){
//             await userCollection.insertOne(userr);
//         }
//         res.status(200).send({
//             msg:'reisTaion sucessfully'
//         });

//     } catch (error) {
//         console.log(error);
//     };

// })

//     app.get('/usersCreate', async(req,res) => {
//         const query = {};
//         const users = await userCollection.find(query).toArray();
//         res.send(users)
//     })
// //----------------------------user---alamin


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