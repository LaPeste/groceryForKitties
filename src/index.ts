import connectToDb from "./dbUtils.js";
import cors from "cors";
import express from "express";
import type { Express, Request, Response } from "express";

// configures dotenv to work in your application
const app: Express = express();
app.use(express.json());
app.use(cors());

const port: string = process.env.PORT;
const db = connectToDb();
const apiBasePath: string = process.env.API_BASE_PATH;

// app.get("/", (request: Request, response: Response): void => { 
//   response.status(200).send("Hello World");
// });

app.get(`${apiBasePath}/todoentries/:userId`, async (req: Request, res: Response): Promise<void> => {
  const postRes = await db.manyOrNone(`
    SELECT *
    FROM todoentries
    WHERE user_id=${req.params.userId};`
  );
  res.json(postRes);
});

app.listen(port, () => { 
  console.log("Server running at PORT: ", port); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});