import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";
import logger from '@libs/logger';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const successfulResponse = (response: Record<string, unknown>) => {
  logger.info(`Successful response: ${JSON.stringify(response)}`)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      success: true,
      response,
    }),
  }
};

export const errorResponse = (statusCode: number, error: Error) => {
  logger.info(`Error response: ${JSON.stringify(error)}`);
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      success: false,
      errorMessage: error.message,
    })
  }
};
