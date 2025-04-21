import connectToDb from "./dbUtils.js";
import cors from "cors";
import express from "express";
import type { Express, Request, Response } from "express";
import logRequest from "./middleware/logRequests.js";
import setupRouting from "./routing/todoEntryV1.js";
import catchAllErrors from "./middleware/errorHandler.js";
import ILogger from "./utils/iLogger.js";
import Logger from "./utils/logger.js";

// configures dotenv to work in your application
const app: Express = express();
app.use(express.json());
app.use(cors());

const port: string = process.env.PORT;
const db = await connectToDb();

app.use(logRequest);

const logger: ILogger = new Logger();
setupRouting(app, db, process.env.API_BASE_PATH, logger);

app.get("/", (request: Request, response: Response): void => { 
  response.status(200).send("Hello World");
});

app.use(catchAllErrors);

app.listen(port, () => { 
  console.log("Server running at PORT: ", port); 
}).on("error", (error) => {
  throw new Error(error.message);
});