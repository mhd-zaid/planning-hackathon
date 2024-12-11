import { v4 as uuidv4 } from 'uuid';
import classesFixture from './class.js';
import subjectsFixture from './subject.js';
import usersFixture from './user.js';
import periodsFixture from './period.js';

const professors = usersFixture.filter(user => user.role === 'professor');

const subjectClassesFixture = [
  // Ingénierie du web - Classe 1
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Programmation web en PHP').id,
    classId: classesFixture.find(cls => cls.name === 'Ingénierie du web 1').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Développement web en JavaScript').id,
    classId: classesFixture.find(cls => cls.name === 'Ingénierie du web 1').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Conception de bases de données SQL').id,
    classId: classesFixture.find(cls => cls.name === 'Ingénierie du web 1').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },

  // Ingénierie du web - Classe 2
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Programmation web en PHP').id,
    classId: classesFixture.find(cls => cls.name === 'Ingénierie du web 2').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Développement web en JavaScript').id,
    classId: classesFixture.find(cls => cls.name === 'Ingénierie du web 2').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Conception de bases de données SQL').id,
    classId: classesFixture.find(cls => cls.name === 'Ingénierie du web 2').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },

  // Mobilité et objets connectés - Classe 1
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Programmation embarquée en C').id,
    classId: classesFixture.find(cls => cls.name === 'Mobilité et objets connectés 1').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Développement d’applications mobiles Android').id,
    classId: classesFixture.find(cls => cls.name === 'Mobilité et objets connectés 1').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Développement d’applications mobiles iOS (Swift)').id,
    classId: classesFixture.find(cls => cls.name === 'Mobilité et objets connectés 1').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },

  // Mobilité et objets connectés - Classe 2
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Programmation embarquée en C').id,
    classId: classesFixture.find(cls => cls.name === 'Mobilité et objets connectés 2').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Développement d’applications mobiles Android').id,
    classId: classesFixture.find(cls => cls.name === 'Mobilité et objets connectés 2').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Développement d’applications mobiles iOS (Swift)').id,
    classId: classesFixture.find(cls => cls.name === 'Mobilité et objets connectés 2').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },

  // Marketing digital - Classe 1
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Stratégie de marketing digital').id,
    classId: classesFixture.find(cls => cls.name === 'Marketing digital 1').id,
    teacherId: professors[0].id,  // Professeur 1
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Publicité en ligne (Google Ads, Facebook Ads)').id,
    classId: classesFixture.find(cls => cls.name === 'Marketing digital 1').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Analyse des données et Google Analytics').id,
    classId: classesFixture.find(cls => cls.name === 'Marketing digital 1').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },

  // Marketing digital - Classe 2
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Stratégie de marketing digital').id,
    classId: classesFixture.find(cls => cls.name === 'Marketing digital 2').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Publicité en ligne (Google Ads, Facebook Ads)').id,
    classId: classesFixture.find(cls => cls.name === 'Marketing digital 2').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },
  {
    id: uuidv4(),
    subjectId: subjectsFixture.find(subject => subject.name === 'Analyse des données et Google Analytics').id,
    classId: classesFixture.find(cls => cls.name === 'Marketing digital 2').id,
    periodId: periodsFixture.find(period => period.beginDate === '2024-09-02').id,
  },
];

export default subjectClassesFixture;
