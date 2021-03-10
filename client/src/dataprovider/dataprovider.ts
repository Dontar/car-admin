import { DataProvider } from "ra-core";

export const dataProvider: DataProvider = {
    async getList(resources, params) {
        return {
            data: [],
            total: 0
        };
    },
    async getMany(resources, params) {},
    async getManyReference(resources, params) {},
    async getOne(resources, params) {},
    async create(resources, params) {},
    async update(resources, params) {},
    async updateMany(resources, params) {},
    async delete(resources, params) {},
    async deleteMany(resources, params) {}
};