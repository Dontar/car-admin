import { getDB } from "./connection";
import { select } from 'sql-bricks-sqlite';
import { ICars, ICompanies, IPersons } from "./share/models";

export async function getCars() {
    const db = await getDB();

    const sql = select(
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
        .groupBy('v.ID')
        .limit(100)
        .offset(0);

    const { text, values } = sql.toParams();
    const rows = await db.all<ICars[]>(text, values);
    return rows;
}

export async function getPersons() {
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
        'group_concat(VC.VEHICLE_ID) as vehicle_ids'
    ).from('CLIENTS c')
        .leftJoin('VC', { 'VC.CLIENT_ID': 'c.ID' })
        .where('c.CLIENT_TYPE', 1)
        .groupBy('c.ID')
        .limit(100)
        .offset(0);

    const { text, values } = sql.toParams();
    const rows = await db.all<IPersons[]>(text, values);
    return rows;
}

export async function getCompanies() {
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
        'group_concat(VC.VEHICLE_ID) as vehicle_ids'
    ).from('CLIENTS c')
        .leftJoin('VC', { 'VC.CLIENT_ID': 'c.ID' })
        .where('c.CLIENT_TYPE', 2)
        .groupBy('c.ID')
        .limit(100)
        .offset(0);

    const { text, values } = sql.toParams();
    const rows = await db.all<ICompanies[]>(text, values);
    return rows;
}
