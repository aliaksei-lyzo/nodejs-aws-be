import { getAllProducts } from '../handler';
import * as utils from 'aws-lambda-test-utils';

describe('Test getAllProducts lambda', () => {
  it('should return products list', async () => {
    expect(await getAllProducts(utils.mockEventCreator.createAPIGatewayEvent(), utils.mockContextCreator({}, () => {}), () => {})).toMatchSnapshot();
  });
});
