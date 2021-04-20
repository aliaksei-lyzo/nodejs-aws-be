import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { successfulResponse, errorResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import logger from '@libs/logger';

import schema from './schema';

import { getDbClient } from '@libs/pgClient';
import { queryAllProducts } from '../../services/product.service';

export const getAllProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  logger.info(`Receiving event: ${JSON.stringify(event)}`);
  try {
    const db = getDbClient();
    const productsList = await queryAllProducts(db);
    return successfulResponse({
      products: productsList,
      event,
    });
  } catch(e) {
    return errorResponse(500, e);
  }
}

export const main = middyfy(getAllProducts);
