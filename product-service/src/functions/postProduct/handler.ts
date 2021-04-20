import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { successfulResponse, errorResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import logger from '@libs/logger';

import schema from './schema';

import { getDbClient } from '@libs/pgClient';
import { queryAddProduct } from '../../services/product.service';

import { Product } from '../../types';

export const postProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  logger.info(`Receiving event: ${JSON.stringify(event)}`);
  const product = event.body.product;
  const number = event.body.number || 0;
  if (!product || !product.title || !product.price) return errorResponse(400, new Error('missing required product parameters'));
  try {
    const db = getDbClient();
    const newProduct: Product = await queryAddProduct(db, product, number);
    return successfulResponse({
      product: newProduct,
      event,
    });
  } catch(e) {
    return errorResponse(500, e);
  }
}

export const main = middyfy(postProduct);
