import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class Class extends Model {
    static associate(db) {
        db.Class.belongsTo(db.Branch, {
            foreignKey: 'branchId',
            as: 'branch',
        });
        db.Class.hasMany(db.SchoolDayClass, {
            foreignKey: 'classId',
            as: 'schoolDayClasses',
        });
        db.Class.belongsToMany(db.User, {
            through: 'Student_Class',
            foreignKey: 'classId',
            as: 'students',
        });
        db.Class.hasMany(db.SubjectClass, {
            foreignKey: 'classId',
            as: 'subjectClasses',
        });
    }
  }

  Class.init(
    {
        id: { type: DataTypes.UUID, primaryKey: true },
    },
    {
      sequelize: connection,
      tableName: 'Class',
    },
  );

  return Class
}