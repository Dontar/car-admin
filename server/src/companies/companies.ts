import { getDB } from "../connection";
import rawSql, { in as $in, select } from 'sql-bricks-sqlite';
import { GetOneParams, GetOneResult, GetParams, GetResult, ICompany } from "../share/models";
import { isOne, prepareParams, stringIdsToArray } from "../share/utils";

export async function getCompanies(params: GetOneParams): Promise<GetOneResult<ICompany>>;
export async function getCompanies(params: Partial<GetParams>): Promise<GetResult<ICompany>>;
export async function getCompanies(params: Partial<GetParams> | GetOneParams): Promise<GetResult<ICompany> | GetOneResult<ICompany>> {
    const db = await getDB();

    let sql = select(
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
            sql = await prepareParams(params, sql);
        }
    }

    const { text, values } = sql.toParams();
    if (isOne(params)) {
        const row = await db.get<ICompany>(text, values);
        return {
            data: stringIdsToArray(row!)
        };
    } else {
        const rows = await db.all<ICompany[]>(text, values);
        return {
            data: stringIdsToArray(rows),
            total
        };
    }
}
