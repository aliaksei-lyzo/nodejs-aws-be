const AWS = require('aws-sdk');

module.exports = {
  importProductsFile: async function(event) {
    console.log('EVENT', event);
    try {
      const filename = event.queryStringParameters.name;
      console.log('filename', filename)
      if (!filename) throw new Error('Missing required parameter');
      const s3 = new AWS.S3({ region: 'eu-west-1' });
      const BUCKET = 'speedworks-products';
      const catalogPath = `uploaded/${filename}`;
      
      const params = {
        Bucket: BUCKET,
        Key: catalogPath,
        Expires: 60,
        ContentType: 'text/csv',
      };
      
      const signedUrl = await s3.getSignedUrlPromise('putObject', params);

      return {
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: signedUrl,
      };

    } catch (error) {
      console.log('ERROR', error)
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          success: false,
          error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
        })
      }
    }
  }

}