import { describe, expect, it } from "vitest";
import * as mongoDB from 'mongodb';
import { collections, connectToDatabase } from "../db/services/database.service";


describe('connectToDatabase', () => {
    it('should connect to the database and set up the buildings collection', async () => {

        // Connect to the database
        await connectToDatabase();

        // Check that the buildings collection has been set up
        expect(collections.buildings).toBeInstanceOf(mongoDB.Collection);

        // Check that the connection was successful by inserting a new building
        const building = {
            name: 'Test Building',
            contact: 'test@example.com',
            address: '123 Main St, Anytown USA',
            type: 'Office',
            organizationId: '610a96a9f9d9b935a42a50a2',
            sqft: 1000,
            lat: 40.7128,
            long: -74.0060,
            resources: []
        };

        const result = await collections.buildings?.insertOne(building);
        expect(result?.acknowledged).toBe(true);

        // Clean up by deleting the test building
        await collections.buildings?.deleteOne({ _id: result?.insertedId });
    });
});