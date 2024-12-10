import userRoutes from '../routes/user.js';
import roomRoutes from '../routes/room.js';

export default (app, express) => {  
  app.use('/api/users', userRoutes(express.Router()));
  app.use('/api/rooms', roomRoutes(express.Router()));
};