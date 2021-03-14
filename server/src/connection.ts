import { Database as SQ3Database, Statement as SQ3Statement } from 'sqlite3';
import { Database, open } from 'sqlite';

let db: Promise<Database<SQ3Database, SQ3Statement>> | undefined = undefined;

export function getDB(): Promise<Database<SQ3Database, SQ3Statement>> {
    if (!db) {
        db = open({
            filename: process.env.DB_PATH!,
            driver: SQ3Database
        });

    }
    return db!;
}