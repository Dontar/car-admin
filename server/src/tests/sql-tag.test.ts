import { config } from 'dotenv';
import { sql, where } from '../share/sql-tag';

config();

describe('Test sql-tag', () => {
    it('Create simple SQL query', () => {
        const qry = sql/* sql */`
            SELECT
                ID, RAMA, DKN, VEHICLE_TYPE, ENGINE_SIZE, VEHICLE_HP, HP, PRODUCE_YEAR,
                ALARM, VEHICLE_LOAD, DOORS, ENGINE_NO, SEATS, FIRST_REGISTRATION_DATE,
                OTHER_MARK, OTHER_MODEL, IMMOBILIZER, DKN_TYPE, DKN_FROM, DKN_TO
            FROM
                VEHICLES
            limit 10
        `;
        expect(typeof qry.text == 'string').toBeTruthy();
    });

    it('Create simple SQL query with params', () => {
        const qry = sql/* sql */`
            SELECT
                ID, RAMA, DKN, VEHICLE_TYPE, ENGINE_SIZE, VEHICLE_HP, HP, PRODUCE_YEAR,
                ALARM, VEHICLE_LOAD, DOORS, ENGINE_NO, SEATS, FIRST_REGISTRATION_DATE,
                OTHER_MARK, OTHER_MODEL, IMMOBILIZER, DKN_TYPE, DKN_FROM, DKN_TO
            FROM
                VEHICLES
            where DKN_TYPE = ${1}
            limit ${10}
        `;
        expect(typeof qry.text == 'string').toBeTruthy();
        expect(qry.values.length).toBe(2);
    });

    it('Create simple SQL query with nested ISql', () => {
        const qry = sql/* sql */`
            SELECT
                ID, RAMA, DKN, VEHICLE_TYPE, ENGINE_SIZE, VEHICLE_HP, HP, PRODUCE_YEAR,
                ALARM, VEHICLE_LOAD, DOORS, ENGINE_NO, SEATS, FIRST_REGISTRATION_DATE,
                OTHER_MARK, OTHER_MODEL, IMMOBILIZER, DKN_TYPE, DKN_FROM, DKN_TO
            FROM
                VEHICLES
            where DKN_TYPE = ${1}
            limit ${10}
        `;
        const wrapSql = sql`select * from (${qry})`;
        expect(typeof wrapSql.text == 'string').toBeTruthy();
        expect(wrapSql.values.length).toBe(2);
    });

    it('Create simple SQL query with nested ISql and parameters', () => {
        const qry = sql/* sql */`
            SELECT
                ID, RAMA, DKN, VEHICLE_TYPE, ENGINE_SIZE, VEHICLE_HP, HP, PRODUCE_YEAR,
                ALARM, VEHICLE_LOAD, DOORS, ENGINE_NO, SEATS, FIRST_REGISTRATION_DATE,
                OTHER_MARK, OTHER_MODEL, IMMOBILIZER, DKN_TYPE, DKN_FROM, DKN_TO
            FROM
                VEHICLES
            where DKN_TYPE = ${1}
            limit ${10}
        `;
        const wrapSql = sql/* sql */`select * from (${qry}) limit ${15}`;
        expect(typeof wrapSql.text == 'string').toBeTruthy();
        expect(wrapSql.values.length).toBe(3);
    });

    it('Create simple SQL query with string additions', () => {
        const qry = sql/* sql */`
            SELECT
                ID, RAMA, DKN, VEHICLE_TYPE, ENGINE_SIZE, VEHICLE_HP, HP, PRODUCE_YEAR,
                ALARM, VEHICLE_LOAD, DOORS, ENGINE_NO, SEATS, FIRST_REGISTRATION_DATE,
                OTHER_MARK, OTHER_MODEL, IMMOBILIZER, DKN_TYPE, DKN_FROM, DKN_TO
            FROM
                VEHICLES
            where DKN_TYPE = ${1}
        `;
        qry.append('order by id');
        expect(typeof qry.text == 'string').toBeTruthy();
        expect(qry.values.length).toBe(1);
    });

    it('Create simple SQL query with ISql additions', () => {
        const qry = sql/* sql */`
            SELECT
                ID, RAMA, DKN, VEHICLE_TYPE, ENGINE_SIZE, VEHICLE_HP, HP, PRODUCE_YEAR,
                ALARM, VEHICLE_LOAD, DOORS, ENGINE_NO, SEATS, FIRST_REGISTRATION_DATE,
                OTHER_MARK, OTHER_MODEL, IMMOBILIZER, DKN_TYPE, DKN_FROM, DKN_TO
            FROM
                VEHICLES
            where DKN_TYPE = ${1}
        `;
        qry.append(sql/* sql */`limit ${10}`);
        expect(typeof qry.text == 'string').toBeTruthy();
        expect(qry.values.length).toBe(2);
    });

    it('Create simple SQL query with IWhere additions', () => {
        const qry = sql/* sql */`
            SELECT
                ID, RAMA, DKN, VEHICLE_TYPE, ENGINE_SIZE, VEHICLE_HP, HP, PRODUCE_YEAR,
                ALARM, VEHICLE_LOAD, DOORS, ENGINE_NO, SEATS, FIRST_REGISTRATION_DATE,
                OTHER_MARK, OTHER_MODEL, IMMOBILIZER, DKN_TYPE, DKN_FROM, DKN_TO
            FROM
                VEHICLES
            ${where('DKN_TYPE = ', 1)}
            limit ${5}
        `;
        const { text, values, where: w } = qry;
        expect(w).toBeDefined();
        expect(typeof text == 'string').toBeTruthy();
        expect(values.length).toBe(2);
    });

    it('Create simple Where query with one param', () => {
        const qry = where('DKN_TYPE = ', 1);
        const { text, values } = qry;
        expect(text).toBe('WHERE (DKN_TYPE = ?)');
        expect(values.length).toBe(1);
        expect(values[0]).toBe(1);
    });

    it('Utility placeholder for quick tests', async () => {
        const qry = sql/* sql */`
            select
                c.id as id,
                group_concat(vc.vehicle_id) as car_ids
            from CLIENTS c
            left join vc on (vc.client_id = c.id)
            WHERE (c.client_type = 2) and (c.id = 9351)
            group by c.id
        `.stream;
        const data = [];
        for await (const row of qry) {
            data.push(row);
        }
        expect(data.length).toBeGreaterThan(0);
    });
});
