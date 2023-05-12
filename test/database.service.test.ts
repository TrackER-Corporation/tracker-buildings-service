import { describe, expect, it } from "vitest";
import * as mongoDB from 'mongodb';
import { collections, connectToDatabase } from "../db/services/database.service";


describe('connectToDatabase', () => {
    it('should connect to the database and set up the buildings collection', async () => {

        // Connect to the database
        await connectToDatabase();

        // Check that the buildings collection has been set up
        expect(collections.buildings).toBeInstanceOf(mongoDB.Collection);
    });
});