import Database from 'better-sqlite3';

export class MyDatabase extends Database { }

export function getDB(): MyDatabase {
    if (!db) {
        db = new MyDatabase(process.env.DB_PATH ?? ':memory:', {
            verbose: process.env.DEBUG ? console.log : undefined
        });
        db.pragma('journal_mode=WAL');
    }
    return db as MyDatabase;
}

let db: MyDatabase | undefined = undefined;
