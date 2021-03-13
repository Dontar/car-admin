import { getDB } from "./connection";
import rawSql, { in as $in, select } from 'sql-bricks-sqlite';
import { GetOneParams, GetOneResult, GetParams, GetResult, ICars, ICompany, IPerson } from "./share/models";

export async function getCars(params: GetOneParams): Promise<GetOneResult<ICars>>;
export async function getCars(params: Partial<GetParams>): Promise<GetResult<ICars>>;
export async function getCars(params: Partial<GetParams> | GetOneParams): Promise<GetResult<ICars> | GetOneResult<ICars>> {
    const db = await getDB();

    const sql = select().from(select(
        'v.ID as id',
        'upper(v.RAMA) as rama',
        'v.DKN as dkm',
        'vm.NAME as mark_name',
        'vmd.NAME as model_name',
        'v.PRODUCE_YEAR as produce_year',
        'MAX(VC.CLIENT_ID) as client_id'
    ).from('VEHICLES v')
        .join('VEHICLE_MARK vm', { 'vm.ID': 'v.MARK_ID' })
        .join('VEHICLE_MODEL vmd', { 'vmd.ID': 'v.MODEL_ID' })
        .leftJoin('VC', { 'VC.VEHICLE_ID': 'v.ID' })
        .groupBy('v.ID'));

    let total = 0;
    if (isOne(params)) {
        sql.where({ 'id': params.id });
    } else {
        total = await prepareParams(params, sql, db);
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

    const sql = select().from(select(
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
        'group_concat(VC.VEHICLE_ID) as vehicle_ids'
    ).from('CLIENTS c')
        .leftJoin('VC', { 'VC.CLIENT_ID': 'c.ID' })
        .where('c.CLIENT_TYPE', rawSql(1))
        .groupBy('c.ID'));

    let total = 0;
    if (isOne(params)) {
        sql.where({ 'id': params.id });
    } else {
        total = await prepareParams(params, sql, db);
    }

    const { text, values } = sql.toParams();
    if (isOne(params)) {
        const row = await db.get<IPerson>(text, values);
        return {
            data: row!
        };
    } else {
        const rows = await db.all<IPerson[]>(text, values);
        return {
            data: rows,
            total
        };
    }
}

export async function getCompanies(params: GetOneParams): Promise<GetOneResult<ICompany>>;
export async function getCompanies(params: Partial<GetParams>): Promise<GetResult<ICompany>>;
export async function getCompanies(params: Partial<GetParams> | GetOneParams): Promise<GetResult<ICompany> | GetOneResult<ICompany>> {
    const db = await getDB();

    const sql = select().from(select(
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
        'group_concat(VC.VEHICLE_ID) as vehicle_ids'
    ).from('CLIENTS c')
        .leftJoin('VC', { 'VC.CLIENT_ID': 'c.ID' })
        .where('c.CLIENT_TYPE', rawSql(2))
        .groupBy('c.ID'));

    let total = 0;
    if (isOne(params)) {
        sql.where({ 'id': params.id });
    } else {
        total = await prepareParams(params, sql, db);
    }

    const { text, values } = sql.toParams();
    if (isOne(params)) {
        const row = await db.get<ICompany>(text, values);
        return {
            data: row!
        }
    } else {
        const rows = await db.all<ICompany[]>(text, values);
        return {
            data: rows,
            total
        }
    }
}

function isOne(params: any): params is GetOneParams {
    return params.id !== null && params.id !== undefined;
}

async function prepareParams(params: Partial<GetParams>, sql: rawSql.SelectStatement, db: any) {
    if (params.ids) {
        sql.where($in('id', ...params.ids));
    }

    const { text, values } = select('COUNT(*) as total').from(sql).toParams();
    const { total } = (await db.get(text, values))!;

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

