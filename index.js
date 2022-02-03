// $ npm init
// $ npm install express mongodb body-parser cors
// $ npm install nodemon --save-dev
// "scripts": {
//     "start": "nodemon index.js",
//   }

// database connection
// $npm install dotenv

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.d1hvr.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJhonStore").collection("products");
  const ordersCollection = client.db("emaJhonStore").collection("orders");
//   console.log("database connected");

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        // console.log(products);
        
        productsCollection.insertOne(products)
        .then(result => {
            // console.log(result);
            // console.log(result.insertedCount);
            res.send(result.insertedCount);
        })
    })
    app.get('/products', (req, res) => {
        productsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/orders', (req, res) => {
        ordersCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: {$in: productKeys}})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            // console.log(result);
            // res.send(result.acknowledged);
            res.send(result);
        })
    })
});

const port = process.env.PORT || 5000 ;
app.listen(port)