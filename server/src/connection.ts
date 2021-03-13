import { Database as SQ3Database, Statement } from 'sqlite3';
import { Database, open } from 'sqlite';

let db: Promise<Database<SQ3Database, Statement>> | undefined = undefined;

export function getDB(): Promise<Database<SQ3Database, Statement>> {
    if (!db) {
        db = open({
            filename: '/data/CarDB.db',
            driver: SQ3Database
        });

    }
    return db!;
}