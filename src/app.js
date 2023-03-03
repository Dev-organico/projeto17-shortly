import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoute.js";
import shortlyRouter from "./routes/shortlyRoutes.js";


const app = express();
app.use(cors());
app.use(express.json());


app.use([authRouter,shortlyRouter])

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running in port: ${port}`));