import { readdir, readFile } from 'fs/promises';
import * as path from 'path';
import { MyDatabase } from '../connection';
import { migrate } from './models';

type MigrationFile = migrate.MigrationFile
type MigrationParams = migrate.MigrationParams
type MigrationData = migrate.MigrationData

export async function readMigrations(migrationPath?: string): Promise<Array<MigrationData>> {
    const migrationsPath = migrationPath || path.join(process.cwd(), 'migrations');
    const location = path.resolve(migrationsPath);

    const migrationFiles = (await readdir(location)).reduce((a, file) => {
        const [filename, id, name] = file.match(/^(\d+).(.*?)\.sql$/) ?? [];
        if (filename) {
            a.push({ id: Number(id), name, filename });
        }
        return a;
    }, [] as MigrationFile[]);

    if (!migrationFiles.length) {
        throw new Error(`No migration files found in '${location}'.`);
    }

    // Get the list of migrations, for example:
    //   { id: 1, name: 'initial', filename: '001-initial.sql', up: ..., down: ... }
    //   { id: 2, name: 'feature', filename: '002-feature.sql', up: ..., down: ... }
    return Promise.all(
        migrationFiles.map(migration =>
            readFile(path.join(location, migration.filename), 'utf8').then(data => {
                const [up, down] = data.split(/^--\s+?down\b/im);
                return {
                    ...migration,
                    up: up.replace(/^-- .*?$/gm, '').trim(),
                    down: down ? down.trim() : ''
                };
            })));
}

/**
 * Migrates database schema to the latest version
 */
export async function migrate(db: MyDatabase, config: MigrationParams = {}): Promise<void> {
    config.force = config.force || false;
    config.table = config.table || 'migrations';

    const { force, table } = config;
    const migrations = config.migrations
        ? config.migrations
        : await readMigrations(config.migrationsPath);

    // Create a database table for migrations meta data if it doesn't exist
    db.prepare(`
        CREATE TABLE IF NOT EXISTS "${table}" (
            id   INTEGER PRIMARY KEY,
            name TEXT    NOT NULL,
            up   BLOB    NOT NULL,
            down BLOB    NOT NULL
        )
    `).run();

    // Get the list of already applied migrations
    let dbMigrations: migrate.MigrationData[] = db.prepare(
        `SELECT id, name, up, down FROM "${table}" ORDER BY id ASC`
    ).all();

    const deleteMigration = db.prepare(`DELETE FROM "${table}" WHERE id = ?`);
    const undoMigration = db.transaction((migration) => {
        db.exec(migration.down);
        deleteMigration.run(migration.id);
        dbMigrations = dbMigrations.filter(x => x.id !== migration.id);
    });

    // Undo migrations that exist only in the database but not in files,
    // also undo the last migration if the `force` option is enabled.
    const lastMigration = migrations[migrations.length - 1];
    for (const migration of dbMigrations.slice().reverse()) {
        if (existsOnlyInDb(migration)) {
            undoMigration(migration);
        } else {
            break;
        }
    }

    const insertMigration = db.prepare(`INSERT INTO "${table}" (id, name, up, down) VALUES (?, ?, ?, ?)`);
    const addMigration = db.transaction((migration: migrate.MigrationData) => {
        db.exec(migration.up);
        insertMigration.run(
            migration.id,
            migration.name,
            migration.up,
            migration.down
        );
    });

    // Apply pending migrations
    const lastMigrationId = dbMigrations.length
        ? dbMigrations[dbMigrations.length - 1].id
        : 0;
    for (const migration of migrations) {
        if (migration.id > lastMigrationId) {
            addMigration(migration);
        }
    }

    function existsOnlyInDb(migration: migrate.MigrationData) {
        return !migrations.some(x => x.id === migration.id) ||
            (force && migration.id === lastMigration.id);
    }
}
