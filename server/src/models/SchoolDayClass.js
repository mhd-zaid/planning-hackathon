import { Model, DataTypes } from "sequelize";

export default function (connection) {
  class SchoolDayClass extends Model {
    static associate(db) {
      db.SchoolDayClass.belongsTo(db.Class, {
        foreignKey: "classId",
        as: "class",
      });

      db.SchoolDayClass.hasMany(db.WorkHour, {
        foreignKey: "schoolDayClassId",
        as: "workHours",
        onDelete: "CASCADE",
      });
    }
  }

  SchoolDayClass.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: false,
        validate: {
          notEmpty: {
            msg: "La date ne peut pas être vide.",
          },
        },
      },
    },
    {
      sequelize: connection,
      tableName: "SchoolDayClass",
    }
  );

  return SchoolDayClass;
}
