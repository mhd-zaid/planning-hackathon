import userRoutes from '../routes/user.js';

export default (app, express) => {  
  app.use('/api/users', userRoutes(express.Router()));
};