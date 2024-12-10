import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class Availability extends Model {
    static associate(db) {
      db.Availability.belongsTo(db.User, {
        foreignKey: 'userId',
        as: 'teacher',
      });
    }
  }

  Availability.init(
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
      isFavorite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize: connection,
      tableName: 'Availability',
    },
  );

  return Availability;
}