import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const CART_ID = Number(process.env.CART_ID ?? 1);
const USER_ID = Number(process.env.USER_ID ?? 1);
const LIMIT = Number(process.env.LIMIT ?? 3);
const START_DATE = process.env.START_DATE ?? '';
const END_DATE = process.env.END_DATE ?? '';

type CartResponse = {
  id: number;
  userId: number;
  date: string;
  products: { productId: number; quantity: number }[];
};

test.describe('FakeStore Carts API Tests', () => {
  test('GET - All carts @master @sanity @api', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);
    expect(response.status(), 'All carts should return HTTP 200').toBe(200);

    const carts = (await response.json()) as CartResponse[];
    expect(Array.isArray(carts)).toBe(true);
    expect(carts.length, 'At least one cart should be returned').toBeGreaterThan(0);
    expect(carts[0].id).toEqual(expect.any(Number));
    expect(carts[0].userId).toEqual(expect.any(Number));
    expect(Array.isArray(carts[0].products)).toBe(true);
  });

  test('GET - Cart by ID @master @sanity @api', async ({ request }) => {
    const route = Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'Cart lookup should return HTTP 200').toBe(200);

    const cart = (await response.json()) as CartResponse;
    expect(cart.id).toBe(CART_ID);
    expect(cart.userId).toEqual(expect.any(Number));
    expect(Array.isArray(cart.products)).toBe(true);
  });

  test('GET - Carts within configured date range @master @regression @api', async ({ request }) => {
    expect(START_DATE, 'START_DATE must be configured in .env').toBeTruthy();
    expect(END_DATE, 'END_DATE must be configured in .env').toBeTruthy();
    const route = Routes.GET_CARTS_BY_DATE_RANGE
      .replace('{startdate}', encodeURIComponent(START_DATE))
      .replace('{enddate}', encodeURIComponent(END_DATE));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'Date-filtered carts should return HTTP 200').toBe(200);

    const carts = (await response.json()) as CartResponse[];
    expect(Array.isArray(carts)).toBe(true);
    const startTime = new Date(START_DATE).getTime();
    const endTime = new Date(`${END_DATE}T23:59:59.999Z`).getTime();
    expect(carts.every((cart) => {
      const cartTime = new Date(cart.date).getTime();
      return cartTime >= startTime && cartTime <= endTime;
    }), 'Every returned cart date should be inside the configured range').toBe(true);
  });

  test('GET - Carts for user @master @regression @api', async ({ request }) => {
    const route = Routes.GET_USER_CART.replace('{userId}', String(USER_ID));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'User carts should return HTTP 200').toBe(200);

    const carts = (await response.json()) as CartResponse[];
    expect(Array.isArray(carts)).toBe(true);
    expect(carts.every((cart) => cart.userId === USER_ID), 'Every returned cart should belong to the requested user').toBe(true);
  });

  test('GET - Carts with limit @master @regression @api', async ({ request }) => {
    const route = Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'Limited carts should return HTTP 200').toBe(200);

    const carts = (await response.json()) as CartResponse[];
    expect(Array.isArray(carts)).toBe(true);
    expect(carts.length, 'Returned cart count should match the limit').toBe(LIMIT);
  });

  test('GET - Carts sorted ascending @master @regression @api', async ({ request }) => {
    const route = Routes.GET_CARTS_SORTED.replace('{order}', 'asc');
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'Ascending cart sort should return HTTP 200').toBe(200);

    const carts = (await response.json()) as CartResponse[];
    const cartIds = carts.map((cart) => cart.id);
    expect(cartIds.length).toBeGreaterThan(0);
    expect(cartIds).toEqual([...cartIds].sort((first, second) => first - second));
  });

  test('GET - Carts sorted descending @master @regression @api', async ({ request }) => {
    const route = Routes.GET_CARTS_SORTED.replace('{order}', 'desc');
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'Descending cart sort should return HTTP 200').toBe(200);

    const carts = (await response.json()) as CartResponse[];
    const cartIds = carts.map((cart) => cart.id);
    expect(cartIds.length).toBeGreaterThan(0);
    expect(cartIds).toEqual([...cartIds].sort((first, second) => second - first));
  });

  test('POST - Create cart @master @regression @api', async ({ request }) => {
    const payload = RandomDataUtil.generateCartPayload(USER_ID);
    const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });
    expect(response.status(), 'Cart creation should return HTTP 201').toBe(201);

    const createdCart = await response.json();
    expect(createdCart.id).toEqual(expect.any(Number));
    expect(createdCart.userId).toBe(payload.userId);
    expect(createdCart.products).toEqual(payload.products);
  });

  test('PUT - Update cart @master @regression @api', async ({ request }) => {
    const route = Routes.UPDATE_CART.replace('{id}', String(CART_ID));
    const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
    const response = await request.put(`${BASE_URL}${route}`, { data: payload });
    expect(response.status(), 'Cart update should return HTTP 200').toBe(200);

    const updatedCart = await response.json();
    expect(updatedCart.id).toBe(CART_ID);
    expect(updatedCart.userId).toBe(payload.userId);
    expect(updatedCart.products).toEqual(payload.products);
  });

  test('DELETE - Cart @master @regression @api', async ({ request }) => {
    const route = Routes.DELETE_CART.replace('{id}', String(CART_ID));
    const response = await request.delete(`${BASE_URL}${route}`);
    expect(response.status(), 'Cart deletion should return HTTP 200').toBe(200);

    const deletedCart = await response.json();
    expect(deletedCart.id).toBe(CART_ID);
  });
});