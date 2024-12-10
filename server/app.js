import express from 'express';
import sequelize from './src/config/sequelize.js';
import router from './src/config/router.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(
  cors(
    {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  ),
);

// router
router(app, express);

// Sequelize
try {
  sequelize.authenticate().then(console.log('Connected to postgres'));
} catch (e) {
  console.error(`Error connecting to postgres: ${e}`);
}

export default app;