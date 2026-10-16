const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

let restaurantId;

beforeAll(async () => {
    const restaurant = await db.one(
        `INSERT INTO restaurants (name, cuisine, rating)
         VALUES ($1, $2, $3)
         RETURNING id`,
        ['Test Cafe', 'Test Cuisine', 4.5]
    );

    restaurantId = restaurant.id;
});

afterAll(async () => {
    await db.none(
        'DELETE FROM restaurants WHERE id = $1',
        [restaurantId]
    );

    await db.$pool.end();
});

describe('GET /api/restaurants', () => {
    it('returns 200 and includes the test restaurant', async () => {
        const res = await request(app).get('/api/restaurants');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(
            res.body.some(r => r.id === restaurantId)
        ).toBe(true);
    });
});

describe('GET /api/restaurants/:id/menu', () => {
    it('returns the restaurant and an empty menu', async () => {
        const res = await request(app)
            .get(`/api/restaurants/${restaurantId}/menu`);

        expect(res.status).toBe(200);
        expect(res.body.restaurant.id).toBe(restaurantId);
        expect(res.body.menuItems).toEqual([]);
    });

    it('returns 404 for a restaurant that does not exist', async () => {
        const res = await request(app)
            .get('/api/restaurants/999999/menu');

        expect(res.status).toBe(404);
    });
});