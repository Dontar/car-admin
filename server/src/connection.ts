import { Database as SQ3Database, Statement as SQ3Statement } from 'sqlite3';
import { Database, open } from 'sqlite';

export type Connection = Database<SQ3Database, SQ3Statement>;

export function getDB(): Promise<Connection> {
    if (!getDB.db) {
        getDB.db = open({
            filename: process.env.DB_PATH!,
            driver: SQ3Database
        });
    }
    return getDB.db;
}

export namespace getDB {
    export let db: Promise<Connection> | undefined = undefined;
}
