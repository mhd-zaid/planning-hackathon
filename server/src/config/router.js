import userRoutes from '../routes/user.js';
import roomRoutes from '../routes/room.js';
import schoolDayRoutes from '../routes/schoolDays.js';
import branchRoutes from '../routes/branch.js';

export default (app, express) => {  
  app.use('/api/users', userRoutes(express.Router()));
  app.use('/api/rooms', roomRoutes(express.Router()));
  app.use('/api/school-days', schoolDayRoutes(express.Router()));
  app.use('/api/branches', branchRoutes(express.Router()));
};