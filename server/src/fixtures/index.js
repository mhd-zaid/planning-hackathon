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

async function loadRooms() {
  const roomsData = [];
  for (let i = 1; i <= 10; i++) {
      roomsData.push({
          id: uuidv4(),
          name: `A${i.toString().padStart(2, '0')}`,
      });
      roomsData.push({
          id: uuidv4(),
          name: `B${i.toString().padStart(2, '0')}`,
      });
  }

  const model = (await import('../models/Room.js')).default(connection);

  // Insérer les données dans la base de données
  await model.bulkCreate(roomsData);

  console.log('20 salles ont été créées avec succès.');
}


const main = async () => {
  try {
    await loadUsers();
    await loadRooms();
  } catch (error) {
    console.error(error);
  } finally {
    connection.close();
  }
};

main();