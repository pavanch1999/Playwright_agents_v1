import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const USER_ID = Number(process.env.USER_ID ?? 1);
const LIMIT = Number(process.env.LIMIT ?? 3);

type UserResponse = {
  id: number;
  email: string;
  username: string;
  name: { firstname: string; lastname: string };
  address: { city: string; street: string; zipcode: string; geolocation: { lat: string; long: string } };
  phone: string;
};

test.describe('FakeStore Users API Tests', () => {
  test('GET - All users @master @sanity @api', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);
    expect(response.status(), 'All users should return HTTP 200').toBe(200);

    const users = (await response.json()) as UserResponse[];
    expect(Array.isArray(users)).toBe(true);
    expect(users.length, 'At least one user should be returned').toBeGreaterThan(0);
    expect(users[0].id).toEqual(expect.any(Number));
    expect(users[0].email).toEqual(expect.any(String));
    expect(users[0].name.firstname).toEqual(expect.any(String));
  });

  test('GET - User by ID @master @sanity @api', async ({ request }) => {
    const route = Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'User lookup should return HTTP 200').toBe(200);

    const user = (await response.json()) as UserResponse;
    expect(user.id).toBe(USER_ID);
    expect(user.email).toEqual(expect.any(String));
    expect(user.username).toEqual(expect.any(String));
    expect(user.name.firstname).toEqual(expect.any(String));
    expect(user.name.lastname).toEqual(expect.any(String));
  });

  test('GET - Users with limit @master @regression @api', async ({ request }) => {
    const route = Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'Limited users should return HTTP 200').toBe(200);

    const users = (await response.json()) as UserResponse[];
    expect(Array.isArray(users)).toBe(true);
    expect(users.length, 'Returned user count should match the limit').toBe(LIMIT);
  });

  test('GET - Users sorted ascending @master @regression @api', async ({ request }) => {
    const route = Routes.GET_USERS_SORTED.replace('{order}', 'asc');
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'Ascending user sort should return HTTP 200').toBe(200);

    const users = (await response.json()) as UserResponse[];
    const userIds = users.map((user) => user.id);
    expect(userIds.length).toBeGreaterThan(0);
    expect(userIds).toEqual([...userIds].sort((first, second) => first - second));
  });

  test('GET - Users sorted descending @master @regression @api', async ({ request }) => {
    const route = Routes.GET_USERS_SORTED.replace('{order}', 'desc');
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'Descending user sort should return HTTP 200').toBe(200);

    const users = (await response.json()) as UserResponse[];
    const userIds = users.map((user) => user.id);
    expect(userIds.length).toBeGreaterThan(0);
    expect(userIds).toEqual([...userIds].sort((first, second) => second - first));
  });

  test('POST - Create user @master @regression @api', async ({ request }) => {
    const payload = RandomDataUtil.generateUserPayload();
    const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });
    expect(response.status(), 'User creation should return HTTP 201').toBe(201);

    const createdUser = await response.json();
    expect(createdUser.id).toEqual(expect.any(Number));
    expect(createdUser).toMatchObject(payload);
  });

  test('PUT - Update user @master @regression @api', async ({ request }) => {
    const route = Routes.UPDATE_USER.replace('{id}', String(USER_ID));
    const payload = RandomDataUtil.generateUserUpdatePayload();
    const response = await request.put(`${BASE_URL}${route}`, { data: payload });
    expect(response.status(), 'User update should return HTTP 200').toBe(200);

    const updatedUser = await response.json();
    expect(updatedUser.id).toBe(USER_ID);
    expect(updatedUser).toMatchObject(payload);
  });

  test('DELETE - User @master @regression @api', async ({ request }) => {
    const route = Routes.DELETE_USER.replace('{id}', String(USER_ID));
    const response = await request.delete(`${BASE_URL}${route}`);
    expect(response.status(), 'User deletion should return HTTP 200').toBe(200);

    const deletedUser = await response.json();
    expect(deletedUser.id).toBe(USER_ID);
  });
});