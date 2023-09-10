const dotenv = require('dotenv');

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else if (process.env.NODE_ENV === 'staging') {
  dotenv.config({ path: '.env.staging' });
} else if(process.env.NODE_ENV==='development') {
  dotenv.config({ path: '.env.development' });
}
