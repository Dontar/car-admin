import { getDB } from "./connection";
import rawSql, { in as $in, select } from 'sql-bricks-sqlite';
import { GetOneParams, GetOneResult, GetParams, GetResult, ICars, ICompany, IPerson } from "./share/models";

export async function getCars(params: GetOneParams): Promise<GetOneResult<ICars>>;
export async function getCars(params: Partial<GetParams>): Promise<GetResult<ICars>>;
export async function getCars(params: Partial<GetParams> | GetOneParams): Promise<GetResult<ICars> | GetOneResult<ICars>> {
    const db = await getDB();

    const sql = select(
        'v.id as id',
        'upper(v.rama) as rama',
        'v.dkn as dkm',
        'vm.name as mark_name',
        'vmd.name as model_name',
        'v.produce_year as produce_year',
        'max(vc.client_id) as company_id',
        'max(vc.client_id) as person_id'
    ).from('vehicles v')
        .join('vehicle_mark vm', { 'vm.ID': 'v.MARK_ID' })
        .join('vehicle_model vmd', { 'vmd.ID': 'v.MODEL_ID' })
        .leftJoin('vc', { 'vc.VEHICLE_ID': 'v.ID' })
        .groupBy('v.ID');

    let total: number | undefined = 1376287;
    if (isOne(params)) {
        sql.where({ 'v.id': params.id });
    } else {
        if (params.ids) {
            sql.where($in('v.id', ...params.ids));
        } else {
            /* total = */ await prepareParams(params, sql, db);
        }
    }

    const { text, values } = sql.toParams();
    if (isOne(params)) {
        const row = await db.get<ICars>(text, values);
        return {
            data: row!
        }
    } else {
        const rows = await db.all<ICars[]>(text, values);
        return {
            data: rows,
            total
        }
    }
}

export async function getPersons(params: GetOneParams): Promise<GetOneResult<IPerson>>;
export async function getPersons(params: Partial<GetParams>): Promise<GetResult<IPerson>>;
export async function getPersons(params: Partial<GetParams> | GetOneParams): Promise<GetResult<IPerson> | GetOneResult<IPerson>> {
    const db = await getDB();

    const sql = select(
        'c.ID as id',
        'c.CLIENT_NAME as client_name',
        'c.EGN as egn',
        'c.REPRESENTATIVE as representative',
        'c.PHONE as phone',
        'c.MOBILE as mobile',
        'c.REGION_NAME as region_name',
        'c.MINUCIPALITY_NAME as municipality_name',
        'c.CITY as city',
        'c.POSTCODE as postcode',
        'c.STREET_NAME as street_name',
        'c.STREET_NO as street_no',
        'c.BLOK as blok',
        'c.VHOD as vhod',
        'c.APARTMENT as apartment',
        'c.FLOOR as floor',
        'group_concat(vc.VEHICLE_ID) as car_ids'
    ).from('clients c')
        .leftJoin('vc', { 'vc.CLIENT_ID': 'c.ID' })
        .where('c.CLIENT_TYPE', rawSql(1))
        .groupBy('c.ID');

    let total: number | undefined = 1030889;
    if (isOne(params)) {
        sql.where({ 'c.id': params.id });
    } else {
        if (params.ids) {
            sql.where($in('c.id', ...params.ids));
        } else {
            /* total = */ await prepareParams(params, sql, db);
        }
    }

    const { text, values } = sql.toParams();
    if (isOne(params)) {
        const row = await db.get<IPerson>(text, values);
        return {
            data: stringIdsToArray(row!)
        };
    } else {
        const rows = await db.all<IPerson[]>(text, values);
        return {
            data: stringIdsToArray(rows),
            total
        };
    }
}

export async function getCompanies(params: GetOneParams): Promise<GetOneResult<ICompany>>;
export async function getCompanies(params: Partial<GetParams>): Promise<GetResult<ICompany>>;
export async function getCompanies(params: Partial<GetParams> | GetOneParams): Promise<GetResult<ICompany> | GetOneResult<ICompany>> {
    const db = await getDB();

    const sql = select(
        'c.ID as id',
        'c.CLIENT_NAME as client_name',
        'c.EGN as bulstat',
        'c.REPRESENTATIVE as representative',
        'c.PHONE as phone',
        'c.MOBILE as mobile',
        'c.REGION_NAME as region_name',
        'c.MINUCIPALITY_NAME as municipality_name',
        'c.CITY as city',
        'c.POSTCODE as postcode',
        'c.STREET_NAME as street_name',
        'c.STREET_NO as street_no',
        'c.BLOK as blok',
        'c.VHOD as vhod',
        'c.APARTMENT as apartment',
        'c.FLOOR as floor',
        'group_concat(vc.VEHICLE_ID) as car_ids'
    ).from('clients c')
        .leftJoin('vc', { 'vc.CLIENT_ID': 'c.ID' })
        .where('c.CLIENT_TYPE', rawSql(2))
        .groupBy('c.ID');

    let total: number | undefined = 78689;
    if (isOne(params)) {
        sql.where({ 'c.id': params.id });
    } else {
        if (params.ids) {
            sql.where($in('c.id', ...params.ids));
        } else {
            /* total = */ await prepareParams(params, sql, db);
        }
    }

    const { text, values } = sql.toParams();
    if (isOne(params)) {
        const row = await db.get<ICompany>(text, values);
        return {
            data: stringIdsToArray(row!)
        }
    } else {
        const rows = await db.all<ICompany[]>(text, values);
        return {
            data: stringIdsToArray(rows),
            total
        }
    }
}

function isOne(params: any): params is GetOneParams {
    return params.id !== null && params.id !== undefined;
}

async function prepareParams(params: Partial<GetParams>, sql: rawSql.SelectStatement, db: any) {
    let total: number | undefined = undefined;
    // const { text, values } = select('COUNT(*) as total').from(sql).toParams();
    // total = (await db.get(text, values))!.total;

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

    return total;
}

function stringIdsToArray<T>(obj: T): T;
function stringIdsToArray<T>(obj: T | T[]): T | T[] {

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