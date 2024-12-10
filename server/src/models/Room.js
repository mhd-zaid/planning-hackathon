import { Model, DataTypes } from 'sequelize';

export default function (connection) {
  class Room extends Model {
    static associate(db) {
        db.Room.hasMany(db.WorkHour, {
            foreignKey: 'roomId',
            as: 'workHours',
        });
    }
  }

  Room.init(
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
    },
    {
      sequelize: connection,
      tableName: 'Room',
    },
  );

  return Room;
}