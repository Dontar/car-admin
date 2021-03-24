import { readdir, readFile,  } from 'fs/promises';
import * as path from 'path';
import { MyDatabase } from '../connection';
import { migrate } from './models';
import { async as Zip } from 'node-stream-zip';
import { streamToString } from '../tests/test-utils';
import { join } from 'path';

type MigrationFile = migrate.MigrationFile
type MigrationParams = migrate.MigrationParams

export async function readMigrations(migrationPath?: string): Promise<Array<MigrationFile>> {
    const migrationsPath = migrationPath || path.join(process.cwd(), 'migrations');
    const location = path.resolve(migrationsPath);

    return (await readdir(location)).reduce((a, file) => {
        const [filename, id, name] = file.match(/^(\d+).(.*?)\.sql|zip$/) ?? [];
        if (filename && id && name) {
            a.push({ id: Number(id), name, filename: join(location, filename) });
        }
        return a;
    }, [] as MigrationFile[]);
}

/**
 * Migrates database schema to the latest version
 */
export async function migrate(db: MyDatabase, config: MigrationParams = {}): Promise<void> {
    config.table = config.table || 'migrations';

    const { table } = config;
    const migrations = config.migrations
        ? config.migrations
        : await readMigrations(config.migrationsPath);

    // Create a database table for migrations meta data if it doesn't exist
    db.prepare(`
        CREATE TABLE IF NOT EXISTS "${table}" (
            id       INTEGER PRIMARY KEY,
            name     TEXT    NOT NULL,
            filename TEXT    NOT NULL
        )
    `).run();

    // Get the list of already applied migrations
    const dbMigrations: MigrationFile[] = db.prepare(
        `SELECT id, name, filename FROM "${table}" ORDER BY id ASC`
    ).all();

    const insertMigration = db.prepare(`INSERT INTO "${table}" (id, name, filename) VALUES (?, ?, ?)`);
    const addMigration = db.transaction(async (migration: MigrationFile) => {
        if (migration.filename.slice(-3) == 'zip') {
            const zip = new Zip({file: migration.filename});
            for (const [, entry] of Object.entries(await zip.entries(''))) {
                if (entry.name.slice(-3) == 'sql') {
                    const content = await streamToString(await zip.stream(entry.name));
                    db.exec(content);
                }
            }
        } else {
            const content = await readFile(migration.filename, 'utf8');
            db.exec(content);
        }
        insertMigration.run(
            migration.id,
            migration.name,
            migration.filename
        );
    });

    // Apply pending migrations
    const lastMigrationId = dbMigrations.length
        ? dbMigrations[dbMigrations.length - 1].id
        : 0;
    for (const migration of migrations) {
        if (migration.id > lastMigrationId) {
            await addMigration(migration);
        }
    }

}
