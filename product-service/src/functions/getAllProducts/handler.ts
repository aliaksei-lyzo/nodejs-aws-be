import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { successfulResponse, errorResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import logger from '@libs/logger';

import schema from './schema';

import { productsListMock } from '../../libs/productsMock';

const getAllProducts: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  logger.info(`Receiving event: ${JSON.stringify(event)}`);
  // imitate DB request. Later this will be extracted to a separate service
  try {
    const productsList = await new Promise((res) => {
      setTimeout(() => {
        res(productsListMock);
      }, 1000);
    })
    
    return successfulResponse({
      products: productsList,
      event,
    });
  } catch(e) {
    return errorResponse(500, e);
  }
}

export const main = middyfy(getAllProducts);
