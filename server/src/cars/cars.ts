import { getDB } from "../connection";
import rawSql, { in as $in, like, select } from 'sql-bricks-sqlite';
import { GetOneParams, GetOneResult, GetParams, GetResult, ICars } from "../share/models";
import { getSqlCount, isOne, prepareParams } from "../share/utils";

export async function getCars(params: GetOneParams): Promise<GetOneResult<ICars>>;
export async function getCars(params: Partial<GetParams>): Promise<GetResult<ICars>>;
export async function getCars(params: Partial<GetParams> | GetOneParams): Promise<GetResult<ICars> | GetOneResult<ICars>> {
    const db = await getDB();

    let sql = select(
        'v.id as id',
        'upper(v.rama) as rama',
        'v.dkn as dkn',
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
            if (params.filter) {
                const { dkn, ...filter } = params.filter;
                sql.where(like('dkn', rawSql(`'${dkn}%'`)));
                sql.where(filter);
                total = await getSqlCount(sql, db);
            }
            sql = await prepareParams(params, sql);
        }
    }

    const { text, values } = sql.toParams();
    if (isOne(params)) {
        const row = await db.get<ICars>(text, values);
        return {
            data: row!
        };
    } else {
        const rows = await db.all<ICars[]>(text, values);
        return {
            data: rows,
            total
        };
    }
}
