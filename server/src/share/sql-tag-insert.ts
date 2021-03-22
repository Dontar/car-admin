import { ISql, sql } from './sql-tag';

export function insertSql(table: string, fields: Record<string, unknown>): ISql {
    const values: unknown[] = [];
    const fieldsToString = Object.entries(fields).reduce((a, [key, value], idx) => {
        a += idx > 0 ? ', ' + key : key;
        values.push(value);
        return a;
    }, '');

    const result: unknown = [
        `insert into ${table} (${fieldsToString}) values (`,
        ...Array.from(', '.repeat(values.length - 1)),
        ')'
    ] as const;
    return sql(result as TemplateStringsArray, ...values);
}
