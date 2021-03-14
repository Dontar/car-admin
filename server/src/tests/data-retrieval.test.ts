import { getCars, getCompanies, getPersons } from "../data-retrieval";
import { config } from 'dotenv';
config();

jest.setTimeout(5000 * 10);

describe('Test car data retrieval', () => {

    it('should get a car from db', async () => {
        const data = await getCars({
            id: 4601
        });
        expect(data).toBeDefined();
        expect(data).toMatchSnapshot();
    });

    it('should get 2 cars from db', async () => {
        const data = await getCars({
            ids: [4601, 4602]
        });
        expect(data.data?.length).toBe(2);
        expect(data).toMatchSnapshot();
    });

    it('should get cars from db with pagination', async () => {
        const data = await getCars({
            pagination: { page: 1, perPage: 2 }
        });
        expect(data.data?.length).toBe(2);
        expect(data).toMatchSnapshot();
    });

    it('should get cars from db with sorting', async () => {
        const data = await getCars({
            pagination: { page: 1, perPage: 2 },
            sort: { field: 'id', order: 'ASC' }
        });
        expect(data.data?.length).toBe(2);
        expect(data).toMatchSnapshot();
    });

});

describe('Test companies data retrieval', () => {

    it('should get a company from db', async () => {
        const data = await getCompanies({
            id: 9351
        });
        expect(data).toBeDefined();
        expect(data).toMatchSnapshot();
    });

    it('should get 2 companies from db', async () => {
        const data = await getCompanies({
            ids: [9351, 9851]
        });
        expect(data.data?.length).toBe(2);
        expect(data).toMatchSnapshot();
    });

    it('should get companies from db with pagination', async () => {
        const data = await getCompanies({
            pagination: { page: 1, perPage: 2 }
        });
        expect(data.data?.length).toBe(2);
        expect(data).toMatchSnapshot();
    });

    it('should get companies from db with sorting', async () => {
        const data = await getCompanies({
            pagination: { page: 1, perPage: 2 },
            sort: { field: 'id', order: 'ASC' }
        });
        expect(data.data?.length).toBe(2);
        expect(data).toMatchSnapshot();
    });
});

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