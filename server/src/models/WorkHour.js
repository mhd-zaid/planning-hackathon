import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class WorkHour extends Model {
    static associate(db) {
        db.WorkHour.belongsTo(db.SubjectClass, {
            foreignKey: 'subjectClassId',
            as: 'subjectClass',
        });
        db.WorkHour.belongsTo(db.Room, {
            foreignKey: 'roomId',
            as: 'room',
        });

        db.WorkHour.belongsTo(db.SchoolDayClass, {
            foreignKey: 'schoolDayClassId',
            as: 'schoolDayClass',
            onDelete: 'CASCADE',
        })
    }
  }

  WorkHour.init(
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
      tableName: 'WorkHour',
    },
  );

  return WorkHour;
}