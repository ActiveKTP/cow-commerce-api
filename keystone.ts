/*
Welcome to Keystone! This file is what keystone uses to start the app.

It looks at the default export, and expects a Keystone config object.

You can find all the config options in our docs here: https://keystonejs.com/docs/apis/config
*/

import { config } from '@keystone-6/core';

// Look in the schema file for how we define our lists, and how users interact with them through graphql or the Admin UI
//import { lists } from './schema';
import { User } from './schemas/User';
import { Post } from './schemas/Post';
import { Tag } from './schemas/Tag';
import { Task } from './schemas/Task';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';

// Keystone auth is configured separately - check out the basic auth setup we are importing from our auth file.
import { withAuth, session } from './auth';

import dotenv from 'dotenv';
import { Cow } from './schemas/cow';
import { Breed } from './schemas/Breed';
import { CowBreed } from './schemas/CowBreed';
import { Farm } from './schemas/Farm';
import { CowPrice } from './schemas/CowPrice';

import { Mating } from './schemas/Mating';
import { Deworming } from './schemas/Deworming';
import { PregnancyCheck } from './schemas/PregnancyCheck';
import { Abortion } from './schemas/Abortion';
import { Calving } from './schemas/Calving';
import { Calve } from './schemas/Calve';
import { SemenBeef } from './schemas/Semen';

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME ?? ''
const region = process.env.AWS_BUCKET_REGION ?? ''
const accessKeyId = process.env.AWS_ACCESS_KEY ?? ''
const secretAccessKey = process.env.AWS_SECRET_KEY ?? ''

export default withAuth(
  // Using the config function helps typescript guide you to the available options.
  config({
    // the db sets the database provider - we're using sqlite for the fastest startup experience
    db: {
      provider: 'postgresql',
      url: 'postgres://postgres:admin!23@localhost:5432/keystonedb',
    },
    storage: {
      my_S3_images: {
        kind: 's3',
        type: 'image',
        bucketName,
        region,
        accessKeyId,
        secretAccessKey,
        signed: { expiry: 5000 },
        forcePathStyle: true,
      },
    },
    // This config allows us to set up features of the Admin UI https://keystonejs.com/docs/apis/config#ui
    ui: {
      // For our starter, we check that someone has session data before letting them see the Admin UI.
      isAccessAllowed: (context) => !!context.session?.data,
    },
    lists: {
      User,
      Farm,
      Cow,
      Breed,
      CowBreed,
      CowPrice,
      SemenBeef,
      Mating,
      PregnancyCheck,
      Abortion,
      Calving,
      Calve,
      Deworming,
      //Post,
      //Tag
    },
    session,
  })
);
