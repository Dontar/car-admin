import { GetOneParams, GetParams } from '../share/models';
import { getSqlCount, isOne, processGetManyRefs, processPaginationAndSort } from '../share/utils';
import { createJsonStream } from '../share/JsonStream';
import { ISql, sql, where } from '../share/sql-tag';

export function getCars(params: Partial<GetParams> | GetOneParams): NodeJS.ReadableStream {

    const qry = sql/* sql */`
        SELECT
            v.id as id,
            upper(v.rama) as rama,
            v.dkn as dkn,
            vm.name as mark_name,
            vmd.name as model_name,
            v.produce_year as produce_year,
            max(vc.client_id) as company_id,
            max(vc.client_id) as person_id
        from vehicles v
        join vehicle_mark vm on (vm.id = v.mark_id)
        join vehicle_model vmd on (vmd.id = v.model_id)
        left join vc on (vc.vehicle_id = v.id)
        ${where()}
        group by v.id
    `;

    let total = 1376287;
    if (isOne(params)) {
        qry.where?.and({ 'v.id = ': params.id });
    } else {
        if (params.ids) {
            qry.where?.and({ 'v.id in ': params.ids });
        } else {
            const hasRef = processGetManyRefs(params, qry);
            const hasFilter = processCarFilter(params, qry);
            if (hasRef || hasFilter) {
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

function processCarFilter(params: Partial<GetParams>, sql: ISql) {
    if (params.filter) {
        const { dkn, ...filter } = params.filter as { dkn: string, [x: string]: unknown };
        sql.where?.and('dkn like ', `${dkn.toUpperCase()}%`);

        sql.where?.and(Object.entries(filter).reduce(
            (a, [field, val]) => (a[field + ' = '] = val, a),
            {} as typeof filter
        ));
        return true;
    }
    return false;
}
