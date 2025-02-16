import pgPromise from "pg-promise";
import type { IDatabase } from "pg-promise";
import type { Client } from "pg";

const dbConnection = {
    host: process.env.POST_DB_HOST,
    port: process.env.POST_DB_PORT,
    database: process.env.POST_DB_NAME,
    user: process.env.POST_DB_USER,
    password: process.env.POST_DB_PASS,
    max: process.env.POST_DB_MAX_CONNECTIONS
};

const dbInitialTesterConnection = {
    host: process.env.POST_DB_HOST,
    port: process.env.POST_DB_PORT,
    database: "postgres",
    user: "postgres",
    password: "3jq*.p2*grT-",
    max: process.env.POST_DB_MAX_CONNECTIONS
};

export default function connectToDb() {
    const pgpToCheckDbExistence = pgPromise({});

    createDbIfDoesNotExist(pgpToCheckDbExistence(dbInitialTesterConnection));

    const pgp = pgPromise({});
    return pgp(dbConnection);
}

async function createDbIfDoesNotExist(db: IDatabase<{}>): Promise<void> {
    const dbQuery = await db.oneOrNone(`
        SELECT 1
        FROM pg_database
        WHERE datname = '${dbConnection.database}';`
      );

      // the database doesn't exist, make one and create table
      if (dbQuery.length == 0) {
        db.none(`
            CREATE USER ${dbConnection.user}
            WITH CREATEDB LOGIN PASSWORD '${dbConnection.password}';`
        );

        db.none(`
            GRANT SELECT, INSERT, UPDATE, DELETE
            ON ALL tables
            IN schema public
            TO ${dbConnection.user};`
        );

        db.none(`
            GRANT SELECT ON ALL SEQUENCES
            IN SCHEMA public
            TO ${dbConnection.user};`
        );
        
        db.none(`
            CREATE DATABASE ${dbConnection.database}
            WITH OWNER ${dbConnection.user};`
        );

        db.none(`
            CREATE TABLE todoentries (
                id bigint PRIMARY KEY,
                userid bigint,
                entrycreation date,
                entryexpiration date,
                reminder date,
                description text,
                creator bigint,
                assignee bigint,
                executor bigint,
                taskcompleted boolean);`
        );
      }
}