import { config } from 'dotenv';
import { getCars } from "../cars/cars";
config();

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

    it('should get cars from db with filter', async () => {
        const data = await getCars({
            filter: { dkn: 'СА' },
            pagination: { page: 1, perPage: 2 },
            sort: { field: 'id', order: 'ASC' }
        });
        expect(data.data?.length).toBe(2);
        expect(data).toMatchSnapshot();
    });

});
