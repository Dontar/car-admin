import { createSqlStream, SqlStream } from './SqlStream';
import { createHash } from 'crypto';
import { insertSql } from './sql-tag-insert';

/************
 * Interface
 ************/

export interface ISql<T = unknown> {
    readonly text: string;
    readonly values: Array<unknown>;
    readonly stream: SqlStream<T>;
    readonly where: IWhere | undefined;
    readonly hash: string;
    append(qry: ISql<unknown> | IWhere | string): void;

    readonly type: 'sql'
}

export type WhereParams =
    | [object: Record<string, unknown>]
    | [field: string | ISql | IWhere]
    | [field: string | ISql | IWhere, value: unknown];

export interface IWhere {
    readonly text: string;
    readonly values: unknown[];
    addWhere: boolean;

    and(...args: WhereParams): this;
    or(...args: WhereParams): this;

    readonly type: 'where';
}

export function sql<T = unknown>(str: TemplateStringsArray, ...args: unknown[]): ISql<T> {
    return new Sql(str, ...args);
}

export function where(...params: WhereParams | []): IWhere {
    return new Where(...params);
}

export function tag(...params: WhereParams | []): IWhere {
    const where = new Where(...params);
    where.addWhere = false;
    return where;
}

export function isSql(obj: unknown): obj is ISql {
    return obj !== undefined && (obj as ISql).type === 'sql';
}

export function isWhere(obj: unknown): obj is IWhere {
    return obj !== undefined && (obj as IWhere).type === 'where';
}

export function isSqlOrWhere(obj: unknown): obj is ISql | IWhere {
    return isSql(obj) || isWhere(obj);
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace sql {
    export const insert = insertSql;
}

/*************
 * Internals
 *************/

class Where implements IWhere {

    public type: 'where' = 'where';
    public addWhere = true;
    public get text() {
        const result: string[] = [];
        for (const [idx, [op, field, val]] of this.whereExpressions.entries()) {
            let expression = idx > 0 ? `${op} ` : '';
            expression += `(${field}`;
            if (val !== undefined) {
                if (isSqlOrWhere(val)) {
                    if (isWhere(val)) {
                        val.addWhere = false;
                    }
                    expression += val.text;
                } else {
                    expression += Array.isArray(val) ? `(${'?, '.repeat(val.length - 1)}?)` : '?';
                }
            }
            expression += ')';
            result.push(expression);
        }

        if (this.addWhere && result.length > 0) {
            result.unshift('WHERE');
        }

        return result.join(' ');
    }
    public get values() {
        return this.whereExpressions.flatMap(([, , val]) => {
            if (isSqlOrWhere(val)) {
                return val.values;
            }
            return val;

        }).filter(i => i !== undefined);
    }

    public and = this._add.bind(this, 'and');
    public or = this._add.bind(this, 'or');

    private whereExpressions: [op: 'and' | 'or', field: string | ISql | IWhere, val: unknown][] = [];

    constructor(...params: WhereParams | []) {
        if (params.length) {
            this._add('and', ...params);
        }
    }

    private _add(op: 'and' | 'or', ...args: WhereParams) {
        const [field, value] = args;
        if (typeof field == 'string' || isSqlOrWhere(field)) {
            this.whereExpressions.push([op, field, value]);
        } else {
            this.whereExpressions = this.whereExpressions.concat(Object.entries(field).map(e => [op, ...e]));
        }
        return this;
    }
}

class Sql<T = unknown> implements ISql<T> {
    type: 'sql' = 'sql';

    private additionalSql: (ISql<unknown> | IWhere | string)[] = [];

    private args: unknown[];
    constructor(private str: TemplateStringsArray, ...args: unknown[]) {
        this.args = args;
    }

    get text() {
        let result = '';
        for (const [idx, val] of this.args.entries()) {
            result += this.str[idx];
            if (isSqlOrWhere(val)) {
                result += val.text;
            } else if (Array.isArray(val)) {
                result += `(${'?, '.repeat(val.length - 1)}?)`;
            } else {
                result += '?';
            }
        }
        result += this.str[this.str.length - 1];
        for (const val of this.additionalSql) {
            if (isSqlOrWhere(val)) {
                result += '\n' + val.text;
            } else {
                result += '\n' + val;
            }
        }
        return result;
    }
    get values() {
        return this.args
            .flatMap(val => isSqlOrWhere(val) ? val.values : val)
            .concat(this.additionalSql.flatMap(i => isSqlOrWhere(i) ? i.values : undefined))
            .filter(i => i !== undefined);
    }
    get stream(): SqlStream<T> {
        return createSqlStream(this) as SqlStream<T>;
    }
    get where(): IWhere | undefined {
        return [...this.args, ...this.additionalSql].find(i => isWhere(i)) as IWhere | undefined;
    }
    get hash() {
        return createHash('sha256').update(JSON.stringify(this), 'utf8').digest('hex');
    }
    append(qry: ISql<unknown> | IWhere | string) {
        this.additionalSql.push(qry);
    }
    toJSON() {
        const { text, values } = this;
        return { text, values };
    }
}
