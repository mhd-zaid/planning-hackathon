import { Sequelize } from 'sequelize';

const connection = new Sequelize(process.env.DATABASE_URL, {
    logging: false, // Désactive les logs Sequelize
});

export default connection;