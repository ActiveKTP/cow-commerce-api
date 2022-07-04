import 'dotenv/config';
import { relationship, text, image } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';

export const ProductImage = list({
  fields: {
    image: image({ storage: 'my_S3_images' }),
    altText: text(),
    product: relationship({ ref: 'Product.photo' }),
  },
  ui: {
    isHidden: true,
    listView: {
      initialColumns: ['image', 'altText', 'product'],
    },
  },
});