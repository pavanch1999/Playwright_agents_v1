import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
const LIMIT = Number(process.env.LIMIT ?? 3);

type ProductResponse = {
  id: number;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
};

test.describe('FakeStore Products API Tests', () => {
  test('GET - All products @master @sanity @api', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);
    expect(response.status(), 'All products should return HTTP 200').toBe(200);

    const products = (await response.json()) as ProductResponse[];
    expect(Array.isArray(products), 'Products response should be an array').toBe(true);
    expect(products.length, 'At least one product should be returned').toBeGreaterThan(0);
    expect(products[0]).toEqual(expect.objectContaining({
      id: expect.any(Number),
      title: expect.any(String),
      price: expect.any(Number),
      category: expect.any(String),
      image: expect.any(String),
    }));
  });

  test('GET - Product by ID @master @sanity @api', async ({ request }) => {
    const route = Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'Product lookup should return HTTP 200').toBe(200);

    const product = (await response.json()) as ProductResponse;
    expect(product.id).toBe(PRODUCT_ID);
    expect(product.title).toEqual(expect.any(String));
    expect(product.price).toEqual(expect.any(Number));
    expect(product.category).toEqual(expect.any(String));
    expect(product.image).toEqual(expect.any(String));
  });

  test('GET - Products with limit @master @regression @api', async ({ request }) => {
    const route = Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT));
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'Limited products should return HTTP 200').toBe(200);

    const products = (await response.json()) as ProductResponse[];
    expect(Array.isArray(products)).toBe(true);
    expect(products.length, 'Returned product count should match the limit').toBe(LIMIT);
  });

  test('GET - Products sorted ascending @master @regression @api', async ({ request }) => {
    const route = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc');
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'Ascending product sort should return HTTP 200').toBe(200);

    const products = (await response.json()) as ProductResponse[];
    const productIds = products.map((product) => product.id);
    expect(productIds.length).toBeGreaterThan(0);
    expect(productIds).toEqual([...productIds].sort((first, second) => first - second));
  });

  test('GET - Products sorted descending @master @regression @api', async ({ request }) => {
    const route = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc');
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'Descending product sort should return HTTP 200').toBe(200);

    const products = (await response.json()) as ProductResponse[];
    const productIds = products.map((product) => product.id);
    expect(productIds.length).toBeGreaterThan(0);
    expect(productIds).toEqual([...productIds].sort((first, second) => second - first));
  });

  test('GET - All product categories @master @sanity @api', async ({ request }) => {
    const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);
    expect(response.status(), 'Product categories should return HTTP 200').toBe(200);

    const categories = (await response.json()) as string[];
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length, 'At least one category should be returned').toBeGreaterThan(0);
  });

  test('GET - Products by category @master @regression @api', async ({ request }) => {
    const category = 'electronics';
    const route = Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', category);
    const response = await request.get(`${BASE_URL}${route}`);
    expect(response.status(), 'Category products should return HTTP 200').toBe(200);

    const products = (await response.json()) as ProductResponse[];
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((product) => product.category === category)).toBe(true);
  });

  test('POST - Create product @master @regression @api', async ({ request }) => {
    const payload = RandomDataUtil.generateProductPayload();
    const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });
    expect(response.status(), 'Product creation should return HTTP 201').toBe(201);

    const createdProduct = await response.json();
    expect(createdProduct.id).toEqual(expect.any(Number));
    expect(createdProduct).toMatchObject(payload);
  });

  test('PUT - Update product @master @regression @api', async ({ request }) => {
    const route = Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID));
    const payload = RandomDataUtil.generateUpdatedProductPayload();
    const response = await request.put(`${BASE_URL}${route}`, { data: payload });
    expect(response.status(), 'Product update should return HTTP 200').toBe(200);

    const updatedProduct = await response.json();
    expect(updatedProduct.id).toBe(PRODUCT_ID);
    expect(updatedProduct).toMatchObject(payload);
  });

  test('DELETE - Product @master @regression @api', async ({ request }) => {
    const route = Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID));
    const response = await request.delete(`${BASE_URL}${route}`);
    expect(response.status(), 'Product deletion should return HTTP 200').toBe(200);

    const deletedProduct = await response.json();
    expect(deletedProduct.id).toBe(PRODUCT_ID);
  });
});