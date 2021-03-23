import { getDB } from '../connection';
import { Readable } from 'stream';
import { ISql, isSql } from './sql-tag';
import { stringIdsToArray } from './utils';

export type SqlStream<T> = NodeJS.ReadableStream & AsyncIterable<T>;

export function createSqlStream<T>(qry: string | ISql, ...params: unknown[]): SqlStream<T> {
    let dataSource: IterableIterator<T>;
    return new Readable({
        objectMode: true,
        read() {
            try {
                if (!dataSource) {
                    const db = getDB();
                    const stmt = db.prepare(isSql(qry) ? qry.text : qry);
                    const iterator = stmt.iterate(...(isSql(qry) ? qry.values : params));
                    dataSource = iterator;
                }
                const { value, done } = dataSource.next();
                this.push(!done ? stringIdsToArray(value) : null);
            } catch (e) {
                this.destroy(e);
            }
        }
    });
}
