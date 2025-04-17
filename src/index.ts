import connectToDb from "./dbUtils.js";
import cors from "cors";
import express from "express";
import type { Express, Request, Response } from "express";
import logRequest from "./Middleware/logRequests.js";
import setupRouting from "./routing.js";

// configures dotenv to work in your application
const app: Express = express();
app.use(express.json());
app.use(cors());

const port: string = process.env.PORT;
const db = await connectToDb();

app.use(logRequest);

setupRouting(app, db, process.env.API_BASE_PATH, process.env.API_CURRENT_VERSION);

app.get("/", (request: Request, response: Response): void => { 
  response.status(200).send("Hello World");
});

app.listen(port, () => { 
  console.log("Server running at PORT: ", port); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});