import type { AWS } from '@serverless/typescript';
import dotenv from 'dotenv';

import getAllProducts from '@functions/getAllProducts';
import getProductById from '@functions/getProductById';
import postProduct from '@functions/postProduct';

const envVars = dotenv.config({ path: '.env' }).parsed;

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      ...envVars,
    },
    lambdaHashingVersion: '20201221',
    httpApi: {
      cors: true
    }
  },
  // import the function via paths
  functions: { getAllProducts, getProductById, postProduct },
};

module.exports = serverlessConfiguration;
