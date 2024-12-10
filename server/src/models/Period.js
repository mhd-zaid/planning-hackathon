import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class Period extends Model {
    static associate(db) {
      db.Period.hasMany(db.SubjectClass, {
        foreignKey: 'periodId',
        as: 'subjectClasses',
      });
    }
  }

  Period.init(
    {
        id: { type: DataTypes.UUID, primaryKey: true },
        beginDate: {
            type: DataTypes.DATE,
            allowNull: false,
            unique: false,
            validate: {
            notEmpty: {
                msg: 'La date de début ne peut pas être vide.',
            },
            },
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
          unique: false,
          validate: {
            notEmpty: {
              msg: 'La date de fin ne peut pas être vide.',
            },
          },
        }
    },
    {
      sequelize: connection,
      tableName: 'Period',
    },
  );

  return Period
}