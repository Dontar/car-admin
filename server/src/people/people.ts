import { getDB } from "../connection";
import rawSql, { in as $in, select } from 'sql-bricks-sqlite';
import { GetOneParams, GetOneResult, GetParams, GetResult, IPerson } from "../share/models";
import { isOne, prepareParams, stringIdsToArray } from "../share/utils";


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
