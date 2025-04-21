import type { Express, Request, Response } from "express";
import pgPromise, { IMain } from "pg-promise";

export default function setupRouting(app: Express, db: pgPromise.IDatabase<{}>, apiBasePath: string): void {
    const versionedApiBasePath: string = `${apiBasePath}/v1`;
    const todoEntryTable: string = "todoentries"

    app.get(`${versionedApiBasePath}/todoentries/:userId`, async (req: Request, res: Response): Promise<void> => {
        const postRes = await db.manyOrNone(`
          SELECT *
          FROM ${todoEntryTable}
          WHERE userid=${req.params.userId};`
        );
        res.json(postRes);
      });
      
      app.get(`${versionedApiBasePath}/todoentry`, async (req: Request, res: Response): Promise<void> => {
        const postRes = await db.one(`
            SELECT *
            FROM ${todoEntryTable}
            WHERE id=${req.query.entryId} AND userid=${req.query.userId};`
        );
        res.json(postRes);
    });

    app.post(`${versionedApiBasePath}/todoentry`, async (req: Request, res: Response): Promise<void> => {
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
                ${req.body.taskCompleted}
                );`
            );
        res.json("Todo entry successfully added");
    });

    app.put(`${versionedApiBasePath}/todoentry`, async (req: Request, res: Response): Promise<void> => {
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
    });

    app.delete(`${versionedApiBasePath}/todoentry`, async (req: Request, res: Response): Promise<void> => {
        await db.none(`
            DELETE FROM ${todoEntryTable}
            WHERE id=${req.query.entryId} AND userid=${req.query.userId};`
        );

        res.json("Todo entry successfully deleted");
    });
}

