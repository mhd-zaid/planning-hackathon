import { v4 as uuidv4 } from 'uuid';

const branches = [
  {
    id: uuidv4(),
    name: 'Ingénierie du web',
    nbHoursQuota: 200,
  },
  {
    id: uuidv4(),
    name: 'Mobilité et objets connectés',
    nbHoursQuota: 300,
  },
  {
    id: uuidv4(),
    name: 'Marketing digital',
    nbHoursQuota: 150,
  },
];

export default branches;