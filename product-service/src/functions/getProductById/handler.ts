import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { successfulResponse, errorResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import logger from '@libs/logger';

import schema from './schema';

import { productsListMock, Product } from '../../libs/productsMock';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  logger.info(`Receiving event: ${JSON.stringify(event)}`);
  try {
    const productId = event?.pathParameters?.productId;

    if (!productId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Bad request - required parameter missing',
        }),
      };
    }

    // imitate DB request. Later this will be extracted to a separate service
    const productsList: Product[] = await new Promise((res) => {
      setTimeout(() => {
        res(productsListMock);
      }, 1000);
    })

    const product = productsList.find(({ id }) => id === productId);
    if (product) {
      return successfulResponse({
        product,
        event,
      });
    }

    return errorResponse(404, new Error(`Product with id ${productId} not found`));

  } catch(e) {
      return errorResponse(500, e);
  }
}

export const main = middyfy(getProductById);
