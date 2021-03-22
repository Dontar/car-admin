import { config } from 'dotenv';
import { IPerson } from '../share/models';
import { createSqlStream } from '../share/SqlStream';
config();

jest.setTimeout(5000 * 10);

describe('Test Sql & Json Streams', () => {

    it('Sql Stream returns correct result', async () => {
        const sql = 'SELECT * FROM CLIENTS LIMIT 5';
        const stream = createSqlStream<IPerson>(sql);
        const result = [];
        for await (const row of stream) {
            result.push(row);
        }
        expect(result).toMatchSnapshot();
    });

});
