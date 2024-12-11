import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class Subject extends Model {
    static associate(db) {
        db.Subject.belongsTo(db.Branch, {
            foreignKey: 'branchId',
            as: 'branch',
        });
        db.Subject.hasMany(db.SubjectClass, {
            foreignKey: 'classId',
            as: 'subjectClasses',
        });

    }
  }

  Subject.init(
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
        },
        nbHoursQuota: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: false,
          validate: {
            notEmpty: {
              msg: 'Le quota d\'heures ne peut pas être vide.',
            },
          },
        },
        nbHoursQuotaExam: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
            validate: {
                notEmpty: {
                msg: 'Le quota d\'heures d\'examen ne peut pas être vide.',
                },
            },
        },
        color: { type: DataTypes.STRING },
    },
    {
      sequelize: connection,
      tableName: 'Subject',
    },
  );

  return Subject;
}