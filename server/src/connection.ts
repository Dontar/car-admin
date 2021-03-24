import Database from 'better-sqlite3';
import { migrate } from './share/models';
import { migrate as sqlMigrate} from './share/sql-migrate';

export class MyDatabase extends Database {
    migrate(config: migrate.MigrationParams = {}): Promise<void> {
        return sqlMigrate(this, config);
    }
}

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
