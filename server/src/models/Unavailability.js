import { Model, DataTypes } from "sequelize";

export default function (connection) {
  class Unavailability extends Model {
    static associate(db) {
      db.Unavailability.belongsTo(db.User, {
        foreignKey: "userId",
        as: "teacher",
      });
      db.Unavailability.belongsTo(db.SubjectClass, {
        foreignKey: "subjectClassId",
        as: "subjectClass",
      });
    }
  }

  Unavailability.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "La date ne peut pas être vide.",
          },
        },
      },
    },
    {
      sequelize: connection,
      tableName: "Unavailability",
    }
  );

  return Unavailability;
}
