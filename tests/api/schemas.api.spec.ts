import Ajv from 'ajv';
import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path';
import { Routes } from '../../api/endpoints/routes';
import { DataProvider } from '../../utils/DataReader';

dotenv.config();

const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
const PRODUCT_ID = Number(process.env.PRODUCT_ID ?? 1);
const USER_ID = Number(process.env.USER_ID ?? 1);
const CART_ID = Number(process.env.CART_ID ?? 1);
const ajv = new Ajv({ allErrors: true });

test.describe('FakeStore API Schema Validation', () => {
  test('GET - Validate product response schema @master @regression @api', async ({ request }) => {
    const productRoute = Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID));
    const response = await request.get(`${BASE_URL}${productRoute}`);
    expect(response.status(), 'Product lookup should return HTTP 200').toBe(200);

    const product = await response.json();
    const schemaPath = path.resolve(process.cwd(), 'api/schemas/product_api_schema.json');
    const productSchema = DataProvider.readJson(schemaPath);
    const validateProduct = ajv.compile(productSchema);
    const isValid = validateProduct(product);
    expect(isValid, `Product schema errors: ${JSON.stringify(validateProduct.errors)}`).toBe(true);
  });

  test('GET - Validate user response schema @master @regression @api', async ({ request }) => {
    const userRoute = Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID));
    const response = await request.get(`${BASE_URL}${userRoute}`);
    expect(response.status(), 'User lookup should return HTTP 200').toBe(200);

    const user = await response.json();
    const schemaPath = path.resolve(process.cwd(), 'api/schemas/user_api_schema.json');
    const userSchema = DataProvider.readJson(schemaPath);
    const validateUser = ajv.compile(userSchema);
    const isValid = validateUser(user);
    expect(isValid, `User schema errors: ${JSON.stringify(validateUser.errors)}`).toBe(true);
  });

  test('GET - Validate cart response schema @master @regression @api', async ({ request }) => {
    const cartRoute = Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID));
    const response = await request.get(`${BASE_URL}${cartRoute}`);
    expect(response.status(), 'Cart lookup should return HTTP 200').toBe(200);

    const cart = await response.json();
    const schemaPath = path.resolve(process.cwd(), 'api/schemas/cart_api_schema.json');
    const cartSchema = DataProvider.readJson(schemaPath);
    const validateCart = ajv.compile(cartSchema);
    const isValid = validateCart(cart);
    expect(isValid, `Cart schema errors: ${JSON.stringify(validateCart.errors)}`).toBe(true);
  });
});