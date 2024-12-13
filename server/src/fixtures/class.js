import { v4 as uuidv4 } from 'uuid';

const classesFixture = [
  {
    id: uuidv4(),
    name: 'Ingénierie du web 1',
    branch: 'Ingénierie du web',
    student: true,
  },
  {
    id: uuidv4(),
    name: 'Ingénierie du web 2',
    branch: 'Ingénierie du web',
    student: false,
  },
  {
    id: uuidv4(),
    name: 'Mobilité et objets connectés 1',
    branch: 'Mobilité et objets connectés',
    student: false,
  },
  {
    id: uuidv4(),
    name: 'Mobilité et objets connectés 2',
    branch: 'Mobilité et objets connectés',
    student: false,
  },
  {
    id: uuidv4(),
    name: 'Marketing digital 1',
    branch: 'Marketing digital',
    student: false,
  },
  {
    id: uuidv4(),
    name: 'Marketing digital 2',
    branch: 'Marketing digital',
    student: false,
  },
];

export default classesFixture;