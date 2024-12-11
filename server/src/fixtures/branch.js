import { v4 as uuidv4 } from 'uuid';

const branches = [
  {
    id: uuidv4(),
    name: 'Ingénierie du web',
    nbHoursQuota: 110,
  },
  {
    id: uuidv4(),
    name: 'Mobilité et objets connectés',
    nbHoursQuota: 190,
  },
  {
    id: uuidv4(),
    name: 'Marketing digital',
    nbHoursQuota: 90,
  },
];

export default branches;