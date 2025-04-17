import pgPromise from "pg-promise";
import type { IDatabase } from "pg-promise";

const dbConnection = {
    host: process.env.TODO_DB_HOST,
    port: process.env.TODO_DB_PORT,
    database: process.env.TODO_DB_NAME,
    user: process.env.TODO_DB_USER,
    password: process.env.TODO_DB_PASS,
    max: process.env.TODO_DB_MAX_CONNECTIONS
};

const dbInitialTesterConnection = {
    host: process.env.TODO_DB_HOST,
    port: process.env.TODO_DB_PORT,
    database: process.env.TODO_DB_ADMIN_NAME,
    user: process.env.TODO_DB_ADMIN_USER,
    password: process.env.TODO_DB_ADMIN_PASS,
    max: process.env.TODO_DB_MAX_CONNECTIONS
};

export default async function connectToDb() {
    const pgpToCheckDbExistence = pgPromise({});
    const pgp = pgPromise({});
    const todoEntriesDb: IDatabase<{}> = pgp(dbConnection);

    if (await createDbIfFirstRun(pgpToCheckDbExistence(dbInitialTesterConnection)))
    {
        await todoEntriesDb.none(`
            CREATE TABLE todoentries (
                id BIGSERIAL PRIMARY KEY,
                userid bigint,
                entrycreation timestamp,
                entryexpiration timestamp,
                reminder timestamp,
                title varchar(50),
                description text,
                creatorid bigint,
                assigneeid bigint,
                executorid bigint,
                taskcompleted boolean);`
        );
    }
    return todoEntriesDb;
}

async function createDbIfFirstRun(db: IDatabase<{}>): Promise<boolean> {
    const dbQuery = await db.oneOrNone(`
        SELECT datname
        FROM pg_database
        WHERE datname = '${dbConnection.database}';`
      );

      // the database and user doesn't exist, create them
      if (!dbQuery) {
        await db.none(`
            CREATE USER ${dbConnection.user}
            WITH CREATEDB LOGIN PASSWORD '${dbConnection.password}';`
        );

        await db.none(`
            CREATE DATABASE ${dbConnection.database}
            WITH OWNER ${dbConnection.user};`
        );

        await db.none(`
            GRANT SELECT, INSERT, UPDATE, DELETE
            ON ALL TABLES
            IN SCHEMA public
            TO ${dbConnection.user};`
        );

        await db.none(`
            GRANT SELECT ON ALL SEQUENCES
            IN SCHEMA public
            TO ${dbConnection.user};`
        );
        return true;
      }
      return false;
}