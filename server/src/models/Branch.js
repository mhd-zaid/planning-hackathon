import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class Branch extends Model {
    static associate(db) {
        db.Branch.hasMany(db.Class, {
            foreignKey: 'branchId',
            as: 'classes',
        });
        db.Branch.hasMany(db.Subject, {
            foreignKey: 'branchId',
            as: 'subjects',
        });
    }
  }

  Branch.init(
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

    },
    {
      sequelize: connection,
      tableName: 'Branch',
    },
  );

  return Branch
}