import "reflect-metadata";
import express, { 
  Request, 
  Response, 
  NextFunction 
} from "express";
import "express-async-errors";
import cors from "cors";
import { router } from "./routes";

import "./database";

const app = express();//@types/expres 
app.use(cors());

app.get("/test", (req, res) => {
  return res.send("Olá NLW 06 Together - Mission: Node.js, método GET, url /test.")
})//teste
app.post("/test-post", (req, res) => {
  return res.send("Olá NLW 06 Together - Mission: Node.js, método POST, url /test-post.")
}) //teste

app.use(express.json());

app.use(router);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error) {
      return response.status(400).json({
        error: err.message,
      });
    }

    return response.status(500).json({
      status: "error",
      message: "Internal Server Error",
    });
  }
);

app.listen(3000, () => console.log("Server is running!!!"));//http://localhost:3000
