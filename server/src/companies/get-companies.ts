import { GetOneParams, GetParams } from '../share/models';
import { getSqlCount, isOne, processGetManyRefs, processPaginationAndSort } from '../share/utils';
import { createJsonStream } from '../share/json-stream';
import { sql, where } from '../share/sql-tag';

export function getCompanies(params: Partial<GetParams> | GetOneParams): NodeJS.ReadableStream {

    const qry = sql/* sql */`
        select
            c.id as id,
            c.client_name as client_name,
            c.egn as bulstat,
            c.representative as representative,
            c.phone as phone,
            c.mobile as mobile,
            c.region_name as region_name,
            c.minucipality_name as municipality_name,
            c.city as city,
            c.postcode as postcode,
            c.street_name as street_name,
            c.street_no as street_no,
            c.blok as blok,
            c.vhod as vhod,
            c.apartment as apartment,
            c.floor as "floor",
            json_group_array(vc.vehicle_id) as car_ids
        from clients c
        left join vc on	(vc.client_id = c.id)
        ${where('c.client_type = 2')}
        group by c.id
    `;

    let total = 78689;
    if (isOne(params)) {
        qry.where?.and({ 'id = ': params.id });
    } else {
        if (params.ids) {
            qry.where?.and('id in ', params.ids);
        } else {
            if (processGetManyRefs(params, qry)) {
                total = getSqlCount(qry);
            }
            processPaginationAndSort(params, qry);
        }
    }

    return qry.stream.pipe(createJsonStream(
        isOne(params)
            ? { prefix: '{ "data": ', postfix: '}' }
            : {
                prefix: '{ "data": [',
                postfix: `] ${!params.ids ? `, "total": ${total} ` : ''}}`
            }
    ));
}
