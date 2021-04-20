import { Client } from 'pg';
import { Product } from '../types';

export const queryAllProducts = async (db: Client): Promise<Product[] | []>  => {
  await db.connect();
  const result = await db.query(`select products.*, inventory.number from products left join inventory on products.id = inventory.product_id`);
  await db.end();
  return result.rows;
};

export const queryProductById = async (db: Client, productId): Promise<Product> => {
  await db.connect();
  const result = await db.query(`select products.*, inventory.number from products left join inventory on products.id = inventory.product_id where products.id = '${productId}'`);
  await db.end();
  return result.rows[0];
}

export const queryAddProduct = async (db: Client, product: Product, number = 0) => {
  const { title, description, price } = product;
  await db.connect();
  const result = await db.query(`
    insert into products (title, description, price) values ('${title}', '${description}', '${price}') returning *
  `);
  const newProduct = result.rows[0];
  if (!newProduct) {
    await db.end();
    throw new Error('failed to create product');
  } 
  try {
    await db.query(`
      insert into inventory (product_id, number) values ('${newProduct.id}', ${number})
  ` );
  } catch (e) {
    await db.query(`
      delete from products where id = ${newProduct.id}
    `);
    await db.end();
    throw new Error(`failed to create inventory for product ${JSON.stringify(product)}, rolled back`);
  }
  newProduct.number = number;
  await db.end();
  return newProduct;
}
