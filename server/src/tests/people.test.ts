import { config } from 'dotenv';
import { getPersons } from "../people/people";
config();

describe('Test persons data retrieval', () => {

    it('should get a person from db', async () => {
        const data = await getPersons({
            id: 9219
        });
        expect(data).toBeDefined();
        expect(data).toMatchSnapshot();
    });

    it('should get 2 persons from db', async () => {
        const data = await getPersons({
            ids: [9219, 9451]
        });
        expect(data.data?.length).toBe(2);
        expect(data).toMatchSnapshot();
    });

    it('should get persons from db with pagination', async () => {
        const data = await getPersons({
            pagination: { page: 1, perPage: 2 }
        });
        expect(data.data?.length).toBe(2);
        expect(data).toMatchSnapshot();
    });

    it('should get persons from db with sorting', async () => {
        const data = await getPersons({
            pagination: { page: 1, perPage: 2 },
            sort: { field: 'id', order: 'ASC' }
        });
        expect(data.data?.length).toBe(2);
        expect(data).toMatchSnapshot();
    });
});
