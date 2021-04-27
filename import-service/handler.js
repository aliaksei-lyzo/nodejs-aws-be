module.exports = {
  importProductsFile: async function(event) {
    console.log('EVENT', event);
    try {
      const AWS = require('aws-sdk');
      const BUCKET = 'speedworks-products';

      const filename = event.queryStringParameters.name;
      console.log('filename', filename)
      if (!filename) throw new Error('Missing required parameter');
      const s3 = new AWS.S3({ region: 'eu-west-1' });
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
  },

  importFileParser: async function(event) {
    console.log('EVENT', JSON.stringify(event));
    try {
      const AWS = require('aws-sdk');
      const csv = require('csv-parser');
      const BUCKET = 'speedworks-products';

      const s3 = new AWS.S3({ region: 'eu-west-1' });
      const record = event.Records[0];

      const products = [];
      console.log(`record`, record);
      const csvStream = s3.getObject({ Bucket: BUCKET, Key: record.s3.object.key })
      .createReadStream();
      console.log('csvStream', JSON.stringify(csvStream));
      await new Promise((res) => {
        csvStream
        .on('error', (err) => {
          console.log('Error in stream');
          console.log(JSON.stringify(err));
         })
        .pipe(csv())
        .on('data', product => {
          products.push(product);
        })
        .on('end', async () => {
          console.log('Parsed successfully');
          console.log(products);
          res('okay');
        })
      });

      console.log('Moving file to parsed');
      await s3.copyObject({
        Bucket: BUCKET,
        CopySource: `/${BUCKET}/${record.s3.object.key}`,
        Key: record.s3.object.key.replace('uploaded', 'parsed')
      }).promise();

      console.log('Deleting file from uploaded');
      await s3.deleteObject({
        Bucket: BUCKET,
        Key: record.s3.object.key,
      }).promise();

      console.log('All done!');
      return 200
    } catch (e) {
      console.log('ERROR', JSON.stringify(e, Object.getOwnPropertyNames(e)));
      return 500;
    }
    
  }

}