import { col } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

const subjectsFixture = [
    {
        id: uuidv4(),
        name: 'Programmation web en PHP',
        nbHoursQuota: 40,
        nbHoursQuotaExam: 5,
        color: "#FF5733",
        branch: 'Ingénierie du web',
    },
    {
        id: uuidv4(),
        name: 'Développement web en JavaScript',
        nbHoursQuota: 50,
        nbHoursQuotaExam: 10,
        color: '#33FF57',
        branch: 'Ingénierie du web',
    },
    {
        id: uuidv4(),
        name: 'Conception de bases de données SQL',
        nbHoursQuota: 20,
        nbHoursQuotaExam: 5,
        color: '#5733FF',
        branch: 'Ingénierie du web',
    },
    {
        id: uuidv4(),
        name: 'Programmation embarquée en C',
        nbHoursQuota: 50,
        nbHoursQuotaExam: 5,
        color: '#F1C40F',
        branch: 'Mobilité et objets connectés',
    },
    {
        id: uuidv4(),
        name: 'Développement d’applications mobiles Android',
        nbHoursQuota: 70,
        nbHoursQuotaExam: 10,
        color: '#9B59B6',
        branch: 'Mobilité et objets connectés',
    },
    {
        id: uuidv4(),
        name: 'Développement d’applications mobiles iOS (Swift)',
        nbHoursQuota: 70,
        nbHoursQuotaExam: 10,
        color: '#E74C3C',
        branch: 'Mobilité et objets connectés',
    },
    {
        id: uuidv4(),
        name: 'Stratégie de marketing digital',
        nbHoursQuota: 40,
        nbHoursQuotaExam: 5,
        color: '#1ABC9C',
        branch: 'Marketing digital',
    },
    {
        id: uuidv4(),
        name: 'Publicité en ligne (Google Ads, Facebook Ads)',
        nbHoursQuota: 40,
        nbHoursQuotaExam: 5,
        color: '#34495E',
        branch: 'Marketing digital',
    },
    {
        id: uuidv4(),
        name: 'Analyse des données et Google Analytics',
        nbHoursQuota: 10,
        nbHoursQuotaExam: 3,
        color: '#F39C12',
        branch: 'Marketing digital',
    }
];

export default subjectsFixture;