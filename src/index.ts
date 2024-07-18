import express, { Response } from "express";
import dotenv from "dotenv";

import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from "mongodb";

dotenv.config();
const app = express();
const port = process.env.PORT;

const uri = process.env.MONGO_URI as string;

dotenv.config();

app.use(express.json());

// app.get("/", (res: Response) => {
//     res.send("SignIn and SignUp application");
// });

// app.use("", sensorRo);

// // Middleware catch-all for all not routes
// app.use((res:any) => {
//     res.status(404).send({ messagem: "Rota não encontrada" });
// });

// const run = async () => {
//     console.log(uri);
//     await mongoose.connect(uri);
//     console.log("Connected to myDB");
// };

// // Conect into the datadase and run application
// run().then(() => {
//     app.listen(port, () => {
//         console.log(`Server running on http://localhost:${port}`);
//     });
// });

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);