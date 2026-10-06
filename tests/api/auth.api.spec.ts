import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;

test.describe('FakeStore Authentication API Tests', () => {
  test('POST - Successful login @master @sanity @api', async ({ request }) => {
    const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
      data: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
      },
    });

    expect(response.status(), 'Successful login should return HTTP 201').toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('token');
    expect(typeof responseBody.token).toBe('string');
    expect(responseBody.token.length).toBeGreaterThan(0);
  });

  test('POST - Invalid login @master @regression @api', async ({ request }) => {
    const payload = RandomDataUtil.generateInvalidLoginPayload();
    const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, { data: payload });

    expect(response.status(), 'Invalid login should return HTTP 401').toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('username or password is incorrect');
  });
});