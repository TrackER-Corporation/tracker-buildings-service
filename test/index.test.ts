import { describe, expect, it } from "vitest";
import app from "../index"
import request from 'supertest';

describe('index test', () => {
    it('should respond with a JSON object containing a message', async () => {
        const response = await request(app.app).get('/');
        expect(response.statusCode).toBe(200);
    });
});