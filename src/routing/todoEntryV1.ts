import type { NextFunction, Express, Request, Response } from "express";
import pgPromise, { IMain } from "pg-promise";
import ILogger from "../utils/iLogger.js";

export default function setupRouting(app: Express, db: pgPromise.IDatabase<{}>, apiBasePath: string, logger: ILogger): void {
    const versionedApiBasePath: string = `${apiBasePath}/v1`;
    const todoEntryTable: string = "todoentries"

    app.get(`${versionedApiBasePath}/todoentries/:userId`, async (req: Request, res: Response): Promise<void> => {
        try {
            const postRes = await db.manyOrNone(`
                SELECT *
                FROM ${todoEntryTable}
                WHERE userid=${req.params.userId};`
            );
            res.json(postRes);
        }
        catch (e: any) {
            logger.Error(e);
            res.status(400).send();
        }
      });
      
      app.get(`${versionedApiBasePath}/todoentry`, async (req: Request, res: Response): Promise<void> => {
        try {
            const postRes = await db.oneOrNone(`
                SELECT *
                FROM ${todoEntryTable}
                WHERE id=${req.query.entryId} AND userid=${req.query.userId};`
            );
            res.json(postRes);
        }
        catch (e: any) {
            logger.Error(e);
            res.status(400).send();
        }
    });

    app.post(`${versionedApiBasePath}/todoentry`, async (req: Request, res: Response): Promise<void> => {
        try {
            await db.none(`
                INSERT INTO ${todoEntryTable}(
                    userid,
                    entrycreation,
                    entryexpiration,
                    reminder,
                    title,
                    description,
                    creatorid,
                    assigneeid,
                    executorid,
                    taskcompleted)
                VALUES(
                    ${req.query.userId},
                    $$'${req.body.creationTimestamp}'$$,
                    $$'${req.body.expirationTimestamp}'$$,
                    $$'${req.body.reminderTimestamp}'$$,
                    '${req.body.title}',
                    $$'${req.body.todoDescription}'$$,
                    ${req.body.creatorId},
                    ${req.body.assigneeId},
                    ${req.body.executorId},
                    ${req.body.taskCompleted});`
            );
            res.json("Todo entry successfully added");
        }
        catch (e: any) {
            logger.Error(e);
            res.status(400).send();
        }
    });

    app.put(`${versionedApiBasePath}/todoentry`, async (req: Request, res: Response): Promise<void> => {
        try {
            await db.none(`
                UPDATE ${todoEntryTable}
                SET
                    entrycreation = $$'${req.body.creationTimestamp}'$$,
                    entryexpiration = $$'${req.body.expirationTimestamp}'$$,
                    reminder = $$'${req.body.reminderTimestamp}'$$,
                    title = '${req.body.title}',
                    description = $$'${req.body.todoDescription}'$$,
                    creatorid = ${req.body.creatorId},
                    assigneeid = ${req.body.assigneeId},
                    executorid = ${req.body.executorId},
                    taskcompleted = ${req.body.taskCompleted}
                WHERE id=${req.query.entryId} AND userid=${req.query.userId};`
            );
            res.json("Todo entry successfully updated");
        }
        catch (e: any) {
            logger.Error(e);
            res.status(400).send();
        }
    });

    app.delete(`${versionedApiBasePath}/todoentry`, async (req: Request, res: Response): Promise<void> => {
        try {
            await db.none(`
                DELETE FROM ${todoEntryTable}
                WHERE id=${req.query.entryId} AND userid=${req.query.userId};`
            );
            res.json("Todo entry successfully deleted");
        }
        catch (e: any) {
            logger.Error(e);
            res.status(400).send();
        }
    });
}

