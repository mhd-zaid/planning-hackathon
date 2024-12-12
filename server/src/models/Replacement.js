import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class Replacement extends Model {
    static associate(db) {
        db.Replacement.belongsTo(db.User, {
            foreignKey: 'teacherId',
            as: 'teacher',
        });
        db.Replacement.belongsTo(db.Unavailability, {
            foreignKey: 'unavailabilityId',
            as: 'unavailability',
        });

        db.Replacement.belongsTo(db.SubjectClass, {
          foreignKey: 'subjectClassId',
          as: 'subjectClass',
        });
    }
  }

  Replacement.init(
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
      tableName: 'Replacement',
    },
  );

  return Replacement;
}