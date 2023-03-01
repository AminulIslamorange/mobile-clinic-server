const express = require("express")
require('dotenv').config()
const app = express()
const cors = require('cors')
const { ObjectId,MongoClient,ServerApiVersion } = require('mongodb');
// const { MongoClient, ServerApiVersion } = require('mongodb');
// here I have a chenge MongoClient,  ServerApiVersion,

// const auth = require("./auth");
const auth=require('./auth');
app.use(cors());
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// const uri = `mongodb+srv://aminul123:AYeUqxxtDxel1j8X@cluster0.jc6tmol.mongodb.net/?retryWrites=true&w=majority`
// var uri = `mongodb://${process.env.DB_USER}:${process.env.PASSWORD}@ac-bgahv6g-shard-00-00.mpfz1at.mongodb.net:27017,ac-bgahv6g-shard-00-01.mpfz1at.mongodb.net:27017,ac-bgahv6g-shard-00-02.mpfz1at.mongodb.net:27017/?ssl=true&replicaSet=atlas-jhqpc4-shard-0&authSource=admin&retryWrites=true&w=majority`;



// new mongodb start here



// const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.egb2kgp.mongodb.net/?retryWrites=true&w=majority";

// another new added


// const uri = "mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7blvvmr.mongodb.net/?retryWrites=true&w=majority";



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7blvvmr.mongodb.net/?retryWrites=true&w=majority`;





// mongodb end here
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log('database connected');


app.get('/', (req, res) => {
    res.send("its working")
})
// client.connect(err => {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     else {
        const db = client.db("test");

        // Routes
        app.get('/users', async (req, res) => {
            const users = await db.collection("users").find().toArray()
            res.json({ status: "success", data: users })
        })
    
        // // get 3 services for Home
        app.get('/services/home', async (req, res) => {
            let services = await db.collection("services").find().toArray()
             
            res.json({ status: "success", data: services.slice(-3).reverse() })
        })
        // get all services
        app.get('/services', async (req, res) => {
            const services = await  db.collection("services").find().toArray()
            res.json({ status: "success", data: services })
        })
        // / get one service
        app.get('/service/:id', async (req, res) => {
            let { id } = req.params
            const service = await db.collection("services").findOne ( new ObjectId(id))
            res.json({ status: "success", data: service })
        })
          // Add a service
        //   app.post('/addservice', async (req, res) => {
        //     let { title, shortdescription, longdescription, price, rating, bannerimage, mainimage } = req.body
        //     let myobj = { title, shortdescription, longdescription, price, rating, bannerimage, mainimage }
        //     console.log(myobj);
        //     db.collection("services").insertOne(myobj, (err, result) => {
        //         if (!err) {
        //             res.send(result);
        //             console.log(result);
        //         }
        //         else {
        //             res.send(err)
        //             console.log(result);
        //         }
        //     })
        // });
// new add services asdded
        app.post('/addservice', async (req, res) => {
    let { title, shortdescription, longdescription, price, rating, bannerimage, mainimage } = req.body
    let myobj = { title, shortdescription, longdescription, price, rating, bannerimage, mainimage }
    const result = await db.collection("services").insertOne(myobj);
    res.send(result)

})


        // Add a Review
        app.post('/addreview', async (req, res) => {
            let { title, review, email, productid, photo, rating, name } = req.body
            let myobj = { title, review, email, productid, photo, rating, name }
            
            const result = await  db.collection("reviews").insertOne(myobj);
            res.send(result)

        })
        // app.post('/addreview', async (req, res) => {
        //     let { title, review, email, productid, photo, rating, name } = req.body
        //     let myobj = { title, review, email, productid, photo, rating, name }
        //     db.collection("reviews").insertOne(myobj, (err, data) => {
        //         if (!err) {
        //             res.send(data)
        //         }
        //         else {
        //             res.send(err)
        //         }
        //     })
        // })
         // get reviews by product id 
         app.get('/reviews/:productid', async (req, res) => {
            let { productid } = req.params
            const reviews = await (db.collection("reviews").find({ productid: productid }).toArray())
            res.json({ status: "success", data: reviews })
        })
        // get my reviews by  email 
        app.get('/myreviews/:email', async (req, res) => {
            let { email } = req.params
            const reviews = await (db.collection("reviews").find({ email: email }).toArray())
            res.json({ status: "success", data: reviews })
        })
        
// Delete a review from my reviews

app.delete('/deletereview/:id', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const query = { _id:(new ObjectId(id)) };
    const result = await (db.collection("reviews").deleteOne(query));
    res.send(result);

})

        // Login
        app.post("/login", async (req, res) => {
            console.log('hitting path /login');
            const { email, password } = req.body;       
           let user = {email , password}
            delete user.password
            const token = jwt.sign(user, process.env.JWT_SECRET)
            res.json({
                status: true,
                data: user,
                token

            })
        })

    // }
// });
app.listen(process.env.PORT || 5000, () => {
    console.log('Server is Running');
    client.connect(err => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Connected Server Successfully");
        }

    });
})

module.exports=app;