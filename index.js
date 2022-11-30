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





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.eubulyg.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });






async function run (){
    try{
        const addVitigeCollection = client.db('allPhoneData').collection('addVitige')
        const userCollection = client.db('allPhoneData').collection('userCategory')
        // const userRole = client.db('allPhoneData').collection('userRole')
        const categoryAll = client.db('allPhoneData').collection('category')
        // const allProducts = client.db('allPhoneData').collection('allProduct')
        const productsCollection = client.db('allPhoneData').collection('formAllProduct')
        const bookingsCollection = client.db('allPhoneData').collection('bookings')
        const bookModal = client.db('allPhoneData').collection('bookModal')



//CATEGORY--------------
        app.get('/category', async(req,res) => {
            const query = {};
            const cursor = categoryAll.find(query);
            const category = await cursor.toArray();
            res.send(category)
        })
        app.get('/categoryForm/:category', async(req,res) => {
            const category = req.params.category;
            const query = {category:category};
            const result = await productsCollection.find(query).toArray();
            res.send(result)
        })

//form-----------
        app.post('/products', async (req, res) => {
            const product = req.body;
            // console.log(product)
            const products = await productsCollection.insertOne(product);
            res.send(products);
        });

//myProduct--------

app.get('/bookings/:email', async (req, res) => {
    const email = req.params.email;
    // console.log(email);
    const query = { email: email };
    
    const result = await productsCollection.find(query).toArray();
    res.send(result);
});
//addVitige-collection
app.post('/advertises', async (req, res) => {
    const user = req.body;
    // console.log(user)
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

//myProduct--------

//Shop-route-------------
app.get('/shop', async(req,res) => {
    const query = {};
    const users = await productsCollection.find(query).toArray();
    res.send(users)
})

//Shop-route-------------

//book-Modal------------
app.post('/bookModal', async (req, res) => {
    const user = req.body;
    // console.log(user)
    const userss = await bookModal.insertOne(user);
    res.send(userss);
});
//book-Modal------------

//myOrder------------------------------------------------
app.get('/bookModal', async (req, res) => {
    
    // console.log(email)
    const query = {};
    const result = await bookModal.find(query).toArray();
    console.log(result)
    res.send(result);
    // console.log(result)
});

//myOrder------------------------------

//CateGory------------------------------------------------------------------------
app.get("/api/category/:id", async (req, res) => {
    const id = req.params.id;
    //console.log(id);
  
    const category = await categoryCollection.findOne({
      _id: ObjectId(id),
    });
    //console.log(category.category);
  
    const allProduct = await productCollection
      .find({ category: category.category })
      .toArray();
    //console.log(allProduct);
    res.status(200).send({ product: 'allProduct' })
});


//CateGory-----------------------------------------------------------------------
        //create-role
        app.post('/usersCreate', async (req, res) => {
            const user = req.body;
            // console.log(user)
            const userss = await userCollection.insertOne(user);
            res.send(userss);
        });

 
        // check role
         app.get('/userrole/:email', async (req, res) => {
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
    const result = await bookingsCollection.findOne(query).toArray();
    res.send(result);
});

// get single user
app.get("/user/:email", async (req, res) => {
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