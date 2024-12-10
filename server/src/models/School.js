import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class School extends Model {
    static associate(db) {
    }
  }

  School.init(
    {
        id: { type: DataTypes.UUID, primaryKey: true },
        name: {
            type: DataTypes.STRING({ length: 255 }),
            allowNull: false,
            unique: false,
            validate: {
            notEmpty: {
                msg: 'Le nom ne peut pas être vide.',
            },
            },
        openingHour: {
          type: DataTypes.TIME,
          allowNull: false,
          unique: false,
          validate: {
            notEmpty: {
              msg: 'L\'heure d\'ouverture ne peut pas être vide.',
            },
          },
        },
        closingHour: {
          type: DataTypes.TIME,
          allowNull: false,
          unique: false,
          validate: {
            notEmpty: {
              msg: 'L\'heure de fermeture ne peut pas être vide.',
            },
          },
        },
      },
    },
    {
      sequelize: connection,
      tableName: 'School',
    },
  );

  return School;
}