import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import sensorRoutes from "./routes/sensor.routes";
import multer from "multer";

dotenv.config();
const app = express();
const port = process.env.PORT;
const uri = process.env.MONGO_URI as string;
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.use("", sensorRoutes);

// Middleware catch-all for all not found routes
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send({ message: "Rota não encontrada" });
});

const run = async () => {
    await mongoose.connect(uri);
    console.log("Connected to myDB");
};

// Connect to the database and run application
run().then(() => {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
});
