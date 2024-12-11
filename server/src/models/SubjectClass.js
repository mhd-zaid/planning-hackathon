import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class SubjectClass extends Model {
    static associate(db) {
        db.SubjectClass.belongsTo(db.Subject, {
            foreignKey: 'subjectId',
            as: 'subject',
        });
        db.SubjectClass.belongsTo(db.Class, {
            foreignKey: 'classId',
            as: 'class',
        });
        db.SubjectClass.belongsTo(db.User, {
            foreignKey: 'teacherId',
            as: 'teacher',
        });
        db.SubjectClass.belongsTo(db.Period, {
            foreignKey: 'periodId',
            as: 'period',
        });
        db.SubjectClass.hasMany(db.Room, {
            foreignKey: 'roomId',
            as: 'rooms',
        });
    }
  }

  SubjectClass.init(
    {
        id: { type: DataTypes.UUID, primaryKey: true },
    },
    {
      sequelize: connection,
      tableName: 'SubjectClass',
    },
  );

  return SubjectClass
}