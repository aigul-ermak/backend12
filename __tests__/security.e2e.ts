
import request from 'supertest'
import dotenv from 'dotenv'
import {app} from "../src/app";
dotenv.config()


describe('POST /auth/login rate limiting', () => {



    it('returns 429 after more than 5 requests in 10 seconds, then 401 after waiting', async () => {
        // Send 6 requests in quick succession to trigger rate limiting
        for (let i = 0; i < 6; i++) {
            const response = await request(app)
                .post('/auth/login')
                .send({ loginOrEmail: 'nonexistent@example.com', password: 'test' });
            if (i < 5) {
                expect(response.status).toBeLessThanOrEqual(429);
            } else {
                expect(response.status).toBe(429);
            }
        }

        await new Promise(resolve => setTimeout(resolve, 11000));

        const followUpResponse = await request(app)
            .post('/auth/login')
            .send({ loginOrEmail: 'nonexistent@example.com', password: 'test' });

        expect(followUpResponse.status).toBe(401);
    });
});
