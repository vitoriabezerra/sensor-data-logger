import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import sensorRoutes from "./routes/sensor.routes";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT || 4000; // Definir um valor padrão para a porta
const uri = process.env.MONGO_URI as string;

// Configure CORS
const corsOptions = {
    origin: 'http://localhost:3000', // Allow requests from this origin
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Use CORS with the specified options

app.use(express.json());

app.use("", sensorRoutes);

// Middleware catch-all for all not found routes
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).send({ message: "Rota não encontrada" });
});

const run = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to myDB");
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database", error);
        process.exit(1);
    }
};

run();

export default app;
