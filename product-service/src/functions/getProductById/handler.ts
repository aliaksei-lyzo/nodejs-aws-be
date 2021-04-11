import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

import { productsListMock } from '../../libs/productsMock';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
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

    const product = productsListMock.find(({ id }) => id === productId);
    if (product) {
      return formatJSONResponse({
        success: true,
        response: {
          product,
        },
        event,
      });
    }

    return {
      statusCode: 404,
      body: JSON.stringify({
        success: false,
        message: `Product with id ${productId} not found`,
      }),
    };
  } catch(e) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: e,
        }),
      }
  }
 
}

export const main = middyfy(getProductById);
