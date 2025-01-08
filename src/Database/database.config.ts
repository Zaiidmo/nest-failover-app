import * as mongoose from 'mongoose';

const primaryDbUri = process.env.PRIMARY_DATABASE;
const secondaryDbUri = process.env.SECONDARY_DATABASE;

// Connect to the primary DB first
mongoose.connect(primaryDbUri)
  .then(() => console.log('Connected to Primary Database'))
  .catch((err) => console.error('Error connecting to Primary Database', err));

// Optionally, attempt to connect to secondary if primary fails
mongoose.connect(secondaryDbUri)
  .then(() => console.log('Connected to Secondary Database'))
  .catch((err) => console.error('Error connecting to Secondary Database', err));
