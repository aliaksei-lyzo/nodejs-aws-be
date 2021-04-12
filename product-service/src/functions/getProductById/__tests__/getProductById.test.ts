import { getProductById } from '../handler';
import * as utils from 'aws-lambda-test-utils';

describe('Test getAllProducts lambda', () => {
  it('should return products list', async () => {
    const event = utils.mockEventCreator.createAPIGatewayEvent({ pathParameters: { productId: '7567ec4b-b10c-48c5-9345-fc73c48a80aa' } });
    const context = utils.mockContextCreator({}, () => {});
    expect(await getProductById(event, context, () => {})).toMatchSnapshot();
  });
});
