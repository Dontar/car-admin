import rawSql, { select } from 'sql-bricks-sqlite';
import { Connection } from '../connection';
import { GetOneParams, GetParams } from "./models";

export function isOne(params: any): params is GetOneParams {
    return params.id !== null && params.id !== undefined;
}

export async function getSqlCount(sql: rawSql.SelectStatement, db: Connection) {
    const qry = select('COUNT(*) as total').from(sql).toString();
    return (await db.get(qry))!.total;
}

export async function prepareParams(params: Partial<GetParams>, sql: rawSql.SelectStatement) {
    // let total: number | undefined = undefined;

    if (params.target) {
        sql.where(params.target, rawSql(params.id));
    }

    if (params.sort) {
        const { field, order } = params.sort;
        sql.orderBy(field + ' ' + order);
    }

    if (params.pagination) {
        const { page, perPage } = params.pagination;
        sql.limit(perPage);
        sql.offset((page - 1) * perPage);
    }

    return sql;
}

export function stringIdsToArray<T>(obj: T): T;
export function stringIdsToArray<T>(obj: T | T[]): T | T[] {

    function transform<T>(obj: T): T {
        Object.keys(obj).forEach(field => {
            if (field.substr(field.length - 4) === '_ids') {
                if (typeof (<any>obj)[field] === 'string') {
                    const val: string = (<any>obj)[field];
                    (<any>obj)[field] = val.split(',').map(i => Number(i));
                }
            }
        });
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(obj => transform(obj));
    } else {
        return transform(obj);
    }
}
