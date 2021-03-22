import { getDB } from '../connection';
import { GetManyReferenceParams, GetOneParams, GetParams } from './models';
import { ISql, sql } from './sql-tag';

export function isOne(params: unknown): params is GetOneParams {
    function isDefined(val: unknown) {
        return val !== null && val !== undefined;
    }
    return isDefined((<GetOneParams>params).id) && !isDefined((<GetManyReferenceParams>params).target);
}

export function getSqlCount(qry: ISql): number {
    const { text, values, hash } = sql`select COUNT(*) as total from(${qry})`;
    let total = 0;
    return getSqlCount.countCache.get(hash) ??
        getSqlCount.countCache.set(hash, total = (getDB().prepare(text).get(values) ?? { total: 0 }).total), total;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace getSqlCount {
    export const countCache = new Map<string, number>();
}

export function processGetManyRefs(params: Partial<GetParams>, qry: ISql): boolean {
    if (params.target) {
        qry.where?.and(params.target + ' = ', params.id);
        return true;
    }
    return false;
}

export function processPaginationAndSort(params: Partial<GetParams>, qry: ISql): {
    sort: boolean;
    pagination: boolean;
} {
    // let total: number | undefined = undefined;
    const result = { sort: false, pagination: false };
    if (params.sort) {
        const { field, order } = params.sort;
        qry.append(`order by ${field} ${order}`);
        result.sort = true;
    }

    if (params.pagination) {
        const { page, perPage } = params.pagination;
        qry.append(sql`limit ${perPage}`);
        qry.append(sql`offset ${(page - 1) * perPage}`);
        result.pagination = true;
    }
    return result;
}

export function stringIdsToArray<T>(obj: T): T;
export function stringIdsToArray<T>(obj: T | T[]): T | T[] {
    type Obj = Record<string, unknown>;

    function transform(obj: Obj) {
        for (const field of Object.keys(obj).filter(field => field.substr(- 4) === '_ids')) {
            const val = obj[field];
            if (typeof val === 'string' && /^\{|\[/.test(val[0])) {
                try {
                    obj[field] = val != '[null]' ? JSON.parse(val) : [];
                } catch (e) {
                    obj[field] = val;
                }
            }
        }
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(obj => transform(obj as Obj) as T);
    } else {
        return transform(obj as Obj) as T;
    }
}
