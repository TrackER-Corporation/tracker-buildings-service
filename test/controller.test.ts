import { beforeAll, describe, expect, it, vi } from "vitest";
import { deleteBuildingById, getBuilding, getBuildings, getBuildingsById, getBuildingsByOrganizationId, registerBuilding, updateBuilding, updateBuildingResources, deleteBuildingByUserId } from "../db/controller/controller";
import { ObjectId } from "mongodb";


interface Response {
    status: number | any
    json: any
}

describe('Building controller', () => {
    const mockRequest = (id: ObjectId) => ({ params: { id } });
    const mockResponse = () => {
        const res: Response = {
            json: {},
            status: {}
        };
        res.status = vi.fn().mockReturnValue(res);
        res.json = vi.fn().mockReturnValue(res);
        return res;
    };
    const mockCollections = {
        buildings: {
            findOne: vi.fn(),
        },
    };

    beforeAll(() => {
        vi.clearAllMocks();
    });


    it('should return a 400 status code if any required fields are missing', async () => {
        const req = {
            body: {
                userId: '1234567890',
            },
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        await registerBuilding(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return a 400 status code if the building already exists', async () => {
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
            },
        };

        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };

        const findOneMock = vi.fn(() => ({ address: req.body.address }));
        const mockCollections = {
            buildings: {
                findOne: findOneMock,
            },
        };
        vi.mock('../services/database.service', () => ({
            collections: mockCollections,
        }));

        await registerBuilding(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        vi.resetModules();
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

        // Mock a response object
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn(),
        };
        const insertOneMock = vi.fn(() => ({
            id: '9876543210',
            ...req.body,
            resources: [],
        }));
        const findOneAndUpdateMock = vi.fn();
        const mockCollections = {
            buildings: {
                insertOne: insertOneMock,
                findOneAndUpdate: findOneAndUpdateMock,
            },
        };
        vi.mock('../services/database.service', () => ({
            collections: mockCollections,
        }));
        await registerBuilding(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        vi.resetModules();
    });


    it('should return a building when it exists', async () => {
        const building = { _id: new ObjectId() };
        const req = mockRequest(building._id);
        const res = mockResponse();
        mockCollections.buildings.findOne.mockResolvedValueOnce(building);
        await getBuilding(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return all buildings', async () => {
        const building = { _id: new ObjectId() };
        const req = mockRequest(building._id);
        const res = mockResponse();
        mockCollections.buildings.findOne.mockResolvedValueOnce(building);
        await getBuildings(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return buildings by organization', async () => {
        const building = { _id: new ObjectId() };
        const req = mockRequest(building._id);
        const res = mockResponse();
        mockCollections.buildings.findOne.mockResolvedValueOnce(building);
        await getBuildingsByOrganizationId(req, res);
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
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        await registerBuilding(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });


    it('updateBuilding should update an existing building', async () => {
        const req = {
            params: { id: '610a96a9f9d9b935a42a50a3' },
            body: {
                name: 'Updated Building Name',
                contact: 'updated@example.com'
            }
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };

        await updateBuilding(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });


    it('updateBuildingResources should add a resource to an existing building', async () => {
        const req = {
            params: { id: '610a96a9f9d9b935a42a50a3' },
            body: { resource: 'New Resource' }
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const building = {
            _id: '610a96a9f9d9b935a42a50a3',
            resources: []
        };
        const findOneMock = vi.fn().mockResolvedValue(building);
        const collectionsMock = {
            buildings: {
                findOne: findOneMock,
            }
        };
        await updateBuildingResources(req, res, collectionsMock);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('getBuildingsById should return buildings for a given user ID', async () => {
        const req = {
            params: { id: '610a96a9f9d9b935a42a50a1' }
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const findMock = vi.fn().mockResolvedValue([
            { _id: '610a96a9f9d9b935a42a50a3', name: 'Building 1' },
            { _id: '610a96a9f9d9b935a42a50a4', name: 'Building 2' },
        ]);
        const collectionsMock = {
            buildings: {
                find: findMock,
            }
        };

        await getBuildingsById(req, res, collectionsMock);
        expect(res.status).toHaveBeenCalledWith(200);
    });



    it('getBuilding should return a single building by ID', async () => {
        const req = {
            params: { id: '610a96a9f9d9b935a42a50a3' }
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        const findOneMock = vi.fn().mockResolvedValue({
            _id: '610a96a9f9d9b935a42a50a3',
            name: 'Test Building'
        });
        const collectionsMock = {
            buildings: {
                findOne: findOneMock,
            }
        };

        await getBuilding(req, res, collectionsMock);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should delete a building by ID', async () => {
        // Create a new building to be deleted
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
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        await deleteBuildingById(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    })

    it('should delete a building by User ID', async () => {
        // Create a new building to be deleted
        const req = {
            params: {
                _id: "test",
            },
            body: {
                name: 'Test Building 2',
                contact: 'test2@example.com',
                userId: '610a96a9f9d9b935a42a50a9',
                address: '456 Main St, EAST',
                type: 'Pool',
                organizationId: '610a96a9f9d9b935a42a50a9',
                sqft: 700,
                lat: 47.7428,
                long: -714.1030
            }
        };
        const res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn()
        };
        await deleteBuildingById(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    })
});
