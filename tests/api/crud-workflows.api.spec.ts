import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const USER_ID = Number(process.env.USER_ID ?? 1);

test.describe('FakeStore API CRUD Workflows', () => {
  test('POST/PUT/DELETE - Product CRUD workflow @master @regression @api', async ({ request }) => {
    const createPayload = RandomDataUtil.generateProductPayload();
    const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, {
      data: createPayload,
    });
    expect(createResponse.status(), 'Product workflow create should return HTTP 201').toBe(201);

    const createdProduct = await createResponse.json();
    expect(createdProduct.id).toEqual(expect.any(Number));
    expect(createdProduct).toMatchObject(createPayload);
    const productId = Number(createdProduct.id);

    const updateRoute = Routes.UPDATE_PRODUCT.replace('{id}', String(productId));
    const updatePayload = RandomDataUtil.generateUpdatedProductPayload();
    const updateResponse = await request.put(`${BASE_URL}${updateRoute}`, { data: updatePayload });
    expect(updateResponse.status(), 'Product workflow update should return HTTP 200').toBe(200);

    const updatedProduct = await updateResponse.json();
    expect(updatedProduct.id).toBe(productId);
    expect(updatedProduct).toMatchObject(updatePayload);

    const deleteRoute = Routes.DELETE_PRODUCT.replace('{id}', String(productId));
    const deleteResponse = await request.delete(`${BASE_URL}${deleteRoute}`);
    expect(deleteResponse.status(), 'Product workflow delete should return HTTP 200').toBe(200);
    expect((await deleteResponse.json()).id).toBe(productId);
  });

  test('POST/PUT/DELETE - User CRUD workflow @master @regression @api', async ({ request }) => {
    const createPayload = RandomDataUtil.generateUserPayload();
    const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, {
      data: createPayload,
    });
    expect(createResponse.status(), 'User workflow create should return HTTP 201').toBe(201);

    const createdUser = await createResponse.json();
    expect(createdUser.id).toEqual(expect.any(Number));
    expect(createdUser).toMatchObject(createPayload);
    const userId = Number(createdUser.id);

    const updateRoute = Routes.UPDATE_USER.replace('{id}', String(userId));
    const updatePayload = RandomDataUtil.generateUserUpdatePayload();
    const updateResponse = await request.put(`${BASE_URL}${updateRoute}`, { data: updatePayload });
    expect(updateResponse.status(), 'User workflow update should return HTTP 200').toBe(200);

    const updatedUser = await updateResponse.json();
    expect(updatedUser.id).toBe(userId);
    expect(updatedUser).toMatchObject(updatePayload);

    const deleteRoute = Routes.DELETE_USER.replace('{id}', String(userId));
    const deleteResponse = await request.delete(`${BASE_URL}${deleteRoute}`);
    expect(deleteResponse.status(), 'User workflow delete should return HTTP 200').toBe(200);
    expect((await deleteResponse.json()).id).toBe(userId);
  });

  test('POST/PUT/DELETE - Cart CRUD workflow @master @regression @api', async ({ request }) => {
    const createPayload = RandomDataUtil.generateCartPayload(USER_ID);
    const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, {
      data: createPayload,
    });
    expect(createResponse.status(), 'Cart workflow create should return HTTP 201').toBe(201);

    const createdCart = await createResponse.json();
    expect(createdCart.id).toEqual(expect.any(Number));
    expect(createdCart.userId).toBe(createPayload.userId);
    expect(createdCart.products).toEqual(createPayload.products);
    const cartId = Number(createdCart.id);

    const updateRoute = Routes.UPDATE_CART.replace('{id}', String(cartId));
    const updatePayload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
    updatePayload.products[0].productId = createdCart.products[0].productId;
    updatePayload.products[0].quantity = createdCart.products[0].quantity + 1;
    const updateResponse = await request.put(`${BASE_URL}${updateRoute}`, { data: updatePayload });
    expect(updateResponse.status(), 'Cart workflow update should return HTTP 200').toBe(200);

    const updatedCart = await updateResponse.json();
    expect(updatedCart.id).toBe(cartId);
    expect(updatedCart.userId).toBe(USER_ID);
    expect(updatedCart.products[0].quantity).toBe(updatePayload.products[0].quantity);

    const deleteRoute = Routes.DELETE_CART.replace('{id}', String(cartId));
    const deleteResponse = await request.delete(`${BASE_URL}${deleteRoute}`);
    expect(deleteResponse.status(), 'Cart workflow delete should return HTTP 200').toBe(200);
    expect((await deleteResponse.json()).id).toBe(cartId);
  });
});