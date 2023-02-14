import express from "express";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json());


app.use([])


app.listen(port, () => console.log(`Server running on port ${process.env.PORT}`));