declare module 'sql-bricks-sqlite' {
    import sql, { Statement } from 'sql-bricks'

    export interface SelectStatement extends Statement {
        limit(limit: number): SelectStatement;
        offset(offset: number): SelectStatement;
        // orReplace()
        // orAbort()
    }

    export = sql;
}