import connection from '../config/sequelize.js';
// Fixtures
import { faker } from '@faker-js/faker';
import {uuidv4} from "uuidv7";
import usersFixture from "./user.js";

const loadUsers = async () => {
  const model = (await import('../models/User.js')).default(connection);
  try {
    await Promise.all(
      usersFixture.map(user => model.create(user)),
    );
    const nbUsers = 5;
    for (let i = 0; i < nbUsers; i++) {
      const userName = faker.internet.userName();
      await model.create({
        id: uuidv4(),
        lastname: faker.name.lastName(),
        firstname: faker.name.firstName(),
        email: `${userName}@mail.fr`,
        role: 'professor',
      });
    }
    console.log('Users loaded');
  } catch (err) {
    console.error(err);
  }

}

const main = async () => {
  try {
    await loadUsers();
  } catch (error) {
    console.error(error);
  } finally {
    connection.close();
  }
};

main();