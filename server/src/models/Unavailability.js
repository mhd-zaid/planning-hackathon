import { Model, DataTypes } from 'sequelize';

export default function (connection) {
    class Unavailability extends Model {
        static associate(db) {
            db.UnAvailability.belongsTo(db.User, {
                foreignKey: 'userId',
                as: 'teacher',
            });
            db.UnAvailability.belongsTo(db.WorkHour, {
                foreignKey: 'userId',
                as: 'workHour',
            });
        }
    }

    Unavailability.init(
        {
            id: { type: DataTypes.UUID, primaryKey: true },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
                unique: false,
                validate: {
                    notEmpty: {
                        msg: 'La date ne peut pas être vide.',
                    },
                },
            },
            start: {
                type: DataTypes.TIME,
                allowNull: false,
                unique: false,
                validate: {
                    notEmpty: {
                        msg: 'L\'heure de début ne peut pas être vide.',
                    },
                },
            },
            end: {
                type: DataTypes.TIME,
                allowNull: false,
                unique: false,
                validate: {
                    notEmpty: {
                        msg: 'L\'heure de fin ne peut pas être vide.',
                    },
                },
            },
        },
        {
            sequelize: connection,
            tableName: 'Unavailability',
        },
    );

    return Unavailability;
}