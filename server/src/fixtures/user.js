import { v4 as uuidv4 } from 'uuid';

const usersFixture = [
  {
    id: uuidv4(),
    lastname: 'Mouhamad',
    firstname: 'Zaid',
    email: 'zaid@mail.fr',
    role: 'student',
  },
  {
    id: uuidv4(),
    lastname: 'Zeknine',
    firstname: 'Jugurtha',
    email: 'jug@mail.fr',
    role: 'professor',
  },
  {
    id: uuidv4(),
    lastname: 'John',
    firstname: 'Doe',
    email: 'doe@mail.fr',
    role: 'manager',
  }
];

export default usersFixture;