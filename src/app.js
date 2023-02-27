import express from "express";
import cors from "cors";
import authRouter from "./routes/authRoute";


const app = express();
app.use(cors());
app.use(express.json());


app.use([authRouter])

const port = 5000

app.listen(port, () => console.log(`Server running on port ${port}`));