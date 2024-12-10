import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class User extends Model {
    static associate(db) {
      
    }
  }

  User.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      lastname: {
        type: DataTypes.STRING({ length: 255 }),
        allowNull: false,
        unique: false,
        validate: {
          notEmpty: {
            msg: 'Le nom ne peut pas être vide.',
          },
        },
      },
      firstname: {
        type: DataTypes.STRING({ length: 255 }),
        allowNull: false,
        unique: false,
        validate: {
          notEmpty: {
            msg: 'Le prénom ne peut pas être vide.',
          },
        },
      },
      email: {
        type: DataTypes.STRING({ length: 255 }),
        allowNull: false,
        unique: false,
        validate: {
          notEmpty: {
            msg: "L'adresse e-mail ne peut pas être vide.",
          },
          isEmail: {
            msg: 'Veuillez fournir une adresse e-mail valide.',
          },
        },
      },
      role: {
        type: DataTypes.ENUM('student','professor','manager','admin'),
        allowNull: false,
        defaultValue: 'student',
      },
    },
    {
      sequelize: connection,
      tableName: 'User',
    },
  );

  return User;
}