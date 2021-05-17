const AWS = require('aws-sdk');
const AWSMock = require('aws-sdk-mock');

const { importProductsFile } = require('../handler');
const mock = require('../test.json');

describe('import service', () => {
  it('should correctly handle importing products file', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getSignedUrl', (a, b, callback) => callback(null, 'mockSignedUrl'));
    expect(await importProductsFile(mock)).toEqual({
      statusCode: 200,
      body: 'mockSignedUrl',
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  });

  it('should correctly handle absense of required params while importing products file', async () => {
    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getSignedUrl', (a, b, callback) => callback(null, 'mockSignedUrl'));
    expect(await importProductsFile()).toEqual({
      statusCode: 400,
      body: "{\"success\":false,\"error\":\"{\\\"stack\\\":\\\"TypeError: Cannot read property 'queryStringParameters' of undefined\\\\n    at importProductsFile (D:\\\\\\\\TRAINING PROJECTS\\\\\\\\nodejs-aws-be\\\\\\\\import-service\\\\\\\\handler.js:7:30)\\\\n    at Object.<anonymous> (D:\\\\\\\\TRAINING PROJECTS\\\\\\\\nodejs-aws-be\\\\\\\\import-service\\\\\\\\__tests__\\\\\\\\handler.test.js:23:18)\\\\n    at Object.asyncJestTest (D:\\\\\\\\TRAINING PROJECTS\\\\\\\\nodejs-aws-be\\\\\\\\import-service\\\\\\\\node_modules\\\\\\\\jest-jasmine2\\\\\\\\build\\\\\\\\jasmineAsyncInstall.js:106:37)\\\\n    at D:\\\\\\\\TRAINING PROJECTS\\\\\\\\nodejs-aws-be\\\\\\\\import-service\\\\\\\\node_modules\\\\\\\\jest-jasmine2\\\\\\\\build\\\\\\\\queueRunner.js:45:12\\\\n    at new Promise (<anonymous>)\\\\n    at mapper (D:\\\\\\\\TRAINING PROJECTS\\\\\\\\nodejs-aws-be\\\\\\\\import-service\\\\\\\\node_modules\\\\\\\\jest-jasmine2\\\\\\\\build\\\\\\\\queueRunner.js:28:19)\\\\n    at D:\\\\\\\\TRAINING PROJECTS\\\\\\\\nodejs-aws-be\\\\\\\\import-service\\\\\\\\node_modules\\\\\\\\jest-jasmine2\\\\\\\\build\\\\\\\\queueRunner.js:75:41\\\\n    at processTicksAndRejections (internal/process/task_queues.js:93:5)\\\",\\\"message\\\":\\\"Cannot read property 'queryStringParameters' of undefined\\\"}\"}",
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  })
});