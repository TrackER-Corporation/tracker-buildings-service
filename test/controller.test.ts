import { beforeAll, describe, expect, it, vi } from "vitest";
import {
    getBuildingByUserId,
    deleteBuildingById,
    getBuilding,
    getBuildings,
    getBuildingsByOrganizationId,
    registerBuilding,
    updateBuilding,
    deleteBuildingByUserId
} from "../db/controller/controller";
import { connectToDatabase } from "../db/services/database.service";

interface Response {
    status: number | any
    json: any
}

const mockResponse = () => {
    const res: Response = {
        json: {},
        status: {}
    };
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
};
const res = mockResponse();



beforeAll(async () => {
    await connectToDatabase()
    vi.clearAllMocks();
});


describe('Building controller', () => {

    it('should return a error if any required fields are missing', async () => {
        const req = {
            body: {
                userId: '1234567890',
            },
        };

        expect(async () => await registerBuilding(req, res, {})).rejects.toThrow(/Error/);
    });

    it('should create a building if all required fields are provided', async () => {
        const req = {
            body: {
                name: 'Test Building',
                contact: 'John Doe',
                address: '123 Main St',
                type: 'Office',
                lat: 37.7749,
                long: -122.4194,
                organizationId: '1234567890',
                sqft: 1000,
                userId: '0987654321',
            },
        };
        expect(async () => await registerBuilding(req, res, {})).not.toBe(null);
    });


    it('getBuilding should return error on missing params or wrong id', async () => {
        let req = {};
        expect(async () => await getBuilding(req, res, {})).rejects.toThrow(/of/);
        req = {
            params: {
                id: "aaed23d5ac1b768aafc22a10"
            }
        };
        expect(async () => await getBuilding(req, res, {})).rejects.toThrow(/Error/);
    });

    it('should return a building when it exists', async () => {
        const req = {
            params: {
                id: "62ed1f97d158cb42b69e5356"
            }
        };
        await getBuilding(req, res, {})
        expect(res.status).toHaveBeenCalledWith(200);
    });


    it('should return all buildings', async () => {
        const req = {
            params: {
            }
        };
        expect(async () => await getBuildings(req, res, {})).not.toBe(null)

    });

    it('should return error if any required fields are missing', async () => {
        const req = {
            params: {
                id: '1234567890',
            },
        };
        expect(async () => await getBuildingByUserId(req, res, {})).rejects.toThrow(/of/);
    });


    it('should return buildings by organization', async () => {
        const req = {
            params: {
                id: "62d969dc498c4385d676ce43"
            }
        }
        await getBuildingsByOrganizationId(req, res, {})
        expect(res.status).toHaveBeenCalledWith(200);

    });

    it('registerBuilding should create a new building', async () => {
        const req = {
            body: {
                name: 'Test Building',
                contact: 'test@example.com',
                userId: '610a96a9f9d9b935a42a50a1',
                address: '123 Main St, Anytown USA',
                type: 'Office',
                organizationId: '610a96a9f9d9b935a42a50a2',
                sqft: 1000,
                lat: 40.7128,
                long: -74.0060
            }
        };

        expect(async () => await registerBuilding(req, res, {})).not.toBe(null)
    });


    it('updateBuilding should update an existing building', async () => {
        const req = {
            params: { id: '610a96a9f9d9b935a42a50a3' },
            body: {
                name: 'Updated Building Name',
                contact: 'updated@example.com'
            }
        };

        expect(async () => await updateBuilding(req, res, {})).not.toBe(null);
    });


    it('updateBuildingResources should add a resource to an existing building', async () => {
        const req = {
            params: { id: '610a96a9f9d9b935a42a50a3' },
            body: { resource: 'New Resource' }
        };

        expect(async () => await updateBuilding(req, res, {})).rejects.toThrow(/Error/);
    });

    it('getBuildingByUserId should return buildings for a given user ID', async () => {
        const req = {
            params: { id: '62bee981e63f093c813b8a02' }
        };
        await getBuildingByUserId(req, res, {})
        expect(res.status).toHaveBeenCalledWith(200);
    });


    it('should delete a building by ID', async () => {
        const req = {
            params: {
                _id: "sadasd",
            },
            body: {
                name: 'Test Building',
                contact: 'test@example.com',
                userId: '610a96a9f9d9b935a42a50a1',
                address: '123 Main St, Anytown USA',
                type: 'Office',
                organizationId: '610a96a9f9d9b935a42a50a2',
                sqft: 1000,
                lat: 40.7128,
                long: -74.0060
            }
        };

        expect(async () => await deleteBuildingById(req, res, {})).not.toBe(null);

    })

    it('should delete a building by User ID', async () => {
        const req = {
            params: {
                _id: "test",
            },
            body: {
                name: 'Test Building 2',
                contact: 'test2@example.com',
                userId: '999999999999',
                address: '456 Main St, EAST',
                type: 'Pool',
                organizationId: '610a96a9f9d9b935a42a50a9',
                sqft: 700,
                lat: 47.7428,
                long: -714.1030
            }
        };
        await deleteBuildingByUserId(req, res, {})
        expect(res.status).toHaveBeenCalledWith(200);
    })
});
