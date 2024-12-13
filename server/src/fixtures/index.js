import connection from '../config/sequelize.js';
// Fixtures
import { faker } from '@faker-js/faker';
import {uuidv4} from "uuidv7";
import usersFixture from "./user.js";
import schoolFixture from './school.js';
import branchesFixture from './branch.js';
import subjectsFixture from './subject.js';
import classesFixture from './class.js';
import periodsFixture from './period.js';
import subjectClassesFixture from './subjectClass.js';
import db from '../models/index.js';
import { col } from 'sequelize';

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
const loadSchool = async () => {
  const model = (await import('../models/School.js')).default(connection);
  try {
    await Promise.all(
      schoolFixture.map(school => model.create(school)),
    );
    console.log('School loaded');
  } catch (err) {
    console.error(err);
  }
};

const loadBranches = async () => {
  const model = (await import('../models/Branch.js')).default(connection);
  try {
    await Promise.all(
      branchesFixture.map(branch => model.create(branch)),
    );
    console.log('Branches loaded');
  } catch (err) {
    console.error(err);
  }
}

const loadSubjects = async () => {
  const model = db.Subject;
  const branchModel = db.Branch;
  try {
    const branches = await branchModel.findAll();
    await Promise.all(
      subjectsFixture.map(subject => {
        const branch = branches.find(branch => branch.name === subject.branch);
        return model.create({
          id: subject.id,
          name: subject.name,
          nbHoursQuota: subject.nbHoursQuota,
          nbHoursQuotaExam: subject.nbHoursQuotaExam,
          color: subject.color,
          branchId: branch.id,
        });
      }),
    );
    console.log('Subjects loaded');
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

const loadClasses = async () => {
  const model = db.Class;
  const branchModel = db.Branch;
  try {
    const branches = await db.Branch.findAll();
    await Promise.all(
      classesFixture.map(classData => {
        const branch = branches.find(branch => branch.name === classData.branch);
        model.create({
          id: classData.id,
          name: classData.name,
          branchId: branch.id,
        });
        if (classData.student == true) {
          db.User.create({
              id: uuidv4(),
              lastname: 'Mouhamad',
              firstname: 'Zaid',
              email: 'zaid@mail.fr',
              role: 'student',
              classId: classData.id,
            });
          }
      }
      ));
    console.log('Classes loaded');
  } catch (err) {
    console.error(err);
  }
}

const loadPeriods = async () => {
  const model = db.Period;
  try {
    await Promise.all(
      periodsFixture.map(period => model.create(period)),
    );
    console.log('Periods loaded');
  } catch (err) {
    console.error(err);
  }
}

const loadSubjectClasses = async () => {
  const subjectClassModel = db.SubjectClass;
  const subjectModel = db.Subject;
  const classModel = db.Class;
  const userModel = db.User;
  const periodModel = db.Period;

  try {
    // Récupérer les matières, les classes, les professeurs et les périodes
    const subjects = await subjectModel.findAll();
    const classes = await classModel.findAll();
    const professors = await userModel.findAll({ where: { role: 'professor' } });
    const periods = await periodModel.findAll();

    // Associer les professeurs aux matières et aux classes de manière cohérente
    let indexProfessor = 0;  // Point de départ des professeurs (Cyclique)

    // Remplir les SubjectClass
    const subjectClassesData = [];
    subjects.forEach(subject => {
      const subjectClassesForThisSubject = classes.filter(cls => cls.branchId === subject.branchId);

      // Répartir les professeurs parmi les classes de cette matière
      subjectClassesForThisSubject.forEach(cls => {
        subjectClassesData.push({
          id: uuidv4(),
          subjectId: subject.id,
          classId: cls.id,
          teacherId: professors[indexProfessor % professors.length].id,
          periodId: periods[0].id, 
        });
        indexProfessor++;
      });
    });

    // Insertion dans la table SubjectClass
    await subjectClassModel.bulkCreate(subjectClassesData);
    console.log('SubjectClasses loaded');
  } catch (err) {
    console.error(err);
  }
};

const main = async () => {
  try {
    await connection.sync({ force: true });
    await loadUsers();
    await loadRooms();
    await loadSchool();
    await loadBranches();
    await loadSubjects();
    await loadClasses();
    await loadPeriods();
    await loadSubjectClasses();
  } catch (error) {
    console.error(error);
  } finally {
    connection.close();
  }
};

main();