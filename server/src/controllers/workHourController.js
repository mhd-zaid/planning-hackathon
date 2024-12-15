import db from "../models/index.js";
import { uuidv4 } from "uuidv7";
import { Op } from "sequelize";
import { checkUUID } from "../utils/uuid.js";
import planningController from "./planningController.js";

const create = async (req, res) => {
  try {
    const workHours = req.body;

    const workHourSuccess = [];
    const workHourError = [];

    for (const workHour of workHours) {
      const subjectClassId = workHour.subjectClassId;

      const subjectClassExist = await db.SubjectClass.findOne({
        where: {
          id: subjectClassId,
        },
      });

      if (!subjectClassExist) {
        workHourError.push({
          ...workHour,
          message: "La classe n'existe pas.",
        });
        continue;
      }

      const isOverlapping = await db.WorkHour.findOne({
        where: {
          [Op.and]: [
            { beginDate: { [Op.lt]: workHour.endDate } },
            { endDate: { [Op.gt]: workHour.beginDate } },
          ],
        },
        include: [
          {
            model: db.SubjectClass,
            as: "subjectClass",
            where: {
              teacherId: subjectClassExist.teacherId,
            },
          },
        ],
      });

      if (isOverlapping) {
        workHourError.push({
          ...workHour,
          message: "Les horaires se chevauchent.",
        });
        continue;
      }

      const dateWorkHour = new Date(workHour.beginDate);
      const schoolDayClass = await db.SchoolDayClass.findOne({
        where: {
          date: dateWorkHour,
          classId: subjectClassExist.classId,
        },
      });

      if (!schoolDayClass) {
        workHourError.push({
          ...workHour,
          message: "La date de classe n'existe pas.",
        });
        continue;
      }

      const rooms = await db.Room.findAll();
      const workHours = await db.WorkHour.findAll({
        where: {
          [Op.and]: [
            { beginDate: { [Op.lte]: workHour.endDate } },
            { endDate: { [Op.gte]: workHour.beginDate } },
          ],
        },
      });

      const availableRooms = rooms.filter((room) => {
        const isAvailable = workHours.every((workHour) => {
          return workHour.roomId !== room.id;
        });

        return isAvailable;
      });

      const newWorkHour = await db.WorkHour.create({
        id: uuidv4(),
        beginDate: workHour.beginDate,
        endDate: workHour.endDate,
        subjectClassId,
        schoolDayClassId: schoolDayClass.id,
        roomId: availableRooms[0].id,
      });

      workHourSuccess.push(newWorkHour);
    }

    return res.status(201).json({
      workHourSuccess,
      workHourError,
    });
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    return res.status(500).error("Une erreur s'est produite");
  }
};

const deleteWorkHour = async (req, res) => {
  try {
    const workHourId = req.params.id;

    const isUnavailable = req.query.isUnavailable;

    if (!checkUUID(workHourId)) {
      return res.status(400).json({ message: "Cet horaire n'existe pas." });
    }

    const workHour = await db.WorkHour.findOne({
      where: {
        id: workHourId,
      },
      include: [
        {
          model: db.SubjectClass,
          as: "subjectClass",
        },
      ],
    });

    if (!workHour) {
      return res.status(404).json({ message: "Cet horaire n'existe pas." });
    }

    await db.WorkHour.destroy({
      where: {
        id: workHourId,
      },
    });

    //create absence
    if (isUnavailable) {
      const unavailability = await db.Unavailability.create({
        id: uuidv4(),
        date: workHour.beginDate,
        userId: workHour.subjectClass.teacherId,
        subjectClassId: workHour.subjectClassId,
      });

      // Étape 1 : Récupérer toutes les `subjectClass` de la classe
      let subjectClasses = await db.SubjectClass.findAll({
        where: {
          classId: workHour.subjectClass.classId,
          teacherId: { [Op.ne]: workHour.subjectClass.teacherId },
        },
        include: [
          {
            model: db.Subject,
            as: "subject",
            attributes: ["name", "nbHoursQuota"],
          },
          {
            model: db.WorkHour,
            as: "workHours",
            attributes: ["beginDate", "endDate"],
          },
        ],
      });

      const backlogs = planningController.calculateBacklog(subjectClasses);

      // Filtrage progressif des `subjectClass`
      for (const subjectClass of [...subjectClasses]) {
        const teacherId = subjectClass.teacherId;

        // Si le subjectClass a déjà atteint son quota d'heures, exclure la `subjectClass`
        const subjectRemainingHours = backlogs.find(
          (b) => b.id === subjectClass.id
        ).subjectRemainingHours;
        if (subjectRemainingHours <= 0) {
          subjectClasses = subjectClasses.filter(
            (sc) => sc.id !== subjectClass.id
          );
          continue;
        }

        // Étape 2 : Vérifier si l'enseignant est disponible pour les heures
        const availability = await db.Availability.findOne({
          where: {
            userId: teacherId,
            beginDate: { [Op.lte]: workHour.beginDate },
            endDate: { [Op.gte]: workHour.endDate },
          },
        });

        if (!availability) {
          // Si indisponible, exclure la `subjectClass`
          subjectClasses = subjectClasses.filter(
            (sc) => sc.id !== subjectClass.id
          );
          continue;
        }

        // Étape 3 : Vérifier si l'enseignant a des heures de travail dans cet intervalle
        const workHourInstances = await db.WorkHour.findAll({
          where: {
            subjectClassId: subjectClass.id,
            beginDate: { [Op.gte]: workHour.beginDate },
            endDate: { [Op.lte]: workHour.endDate },
          },
        });

        if (workHourInstances.length > 0) {
          // Si des heures existent, exclure la `subjectClass`
          subjectClasses = subjectClasses.filter(
            (sc) => sc.id !== subjectClass.id
          );
          continue;
        }
      }

      // Étape 4 : Créer des remplacements pour les `subjectClass` restants
      for (const subjectClass of subjectClasses) {
        await db.Replacement.create({
          id: uuidv4(),
          beginDate: workHour.beginDate,
          endDate: workHour.endDate,
          teacherId: subjectClass.teacherId,
          unavailabilityId: unavailability.id,
          subjectClassId: subjectClass.id,
          schoolDayClassId: workHour.schoolDayClassId,
        });
      }
    }
    return res.status(204).json();
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    return res.status(500).error("Une erreur s'est produite");
  }
};

const getWorkHoursByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!checkUUID(userId)) {
      return res.status(400).json({ message: "Cet utilisateur n'existe pas." });
    }

    const user = await db.User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Cet utilisateur n'existe pas." });
    }

    const workHours = await db.WorkHour.findAll({
      attributes: ["beginDate", "endDate", "id"],
      include: [
        {
          model: db.SubjectClass,
          as: "subjectClass",
          where: {
            teacherId: userId,
          },
          attributes: ["id"],
          include: [
            {
              model: db.Subject,
              as: "subject",
            },
          ],
        },
      ],
    });

    return res.status(200).json(workHours);
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    return res.status(500).error("Une erreur s'est produite");
  }
};

const getWorkHoursByClass = async (req, res) => {
  try {
    const classId = req.params.classId;

    if (!checkUUID(classId)) {
      return res.status(400).json({ message: "Cette classe n'existe pas." });
    }

    const subjectClasses = await db.SubjectClass.findAll({
      where: {
        classId,
      },
    });

    const subjectClassIds = subjectClasses.map(
      (subjectClass) => subjectClass.id
    );

    const workHours = await db.WorkHour.findAll({
      attributes: ["beginDate", "endDate"],
      include: [
        {
          model: db.SubjectClass,
          as: "subjectClass",
          where: {
            id: {
              [Op.in]: subjectClassIds,
            },
          },
          attributes: ["id"],
          include: [
            {
              model: db.Subject,
              as: "subject",
            },
          ],
        },
      ],
    });

    return res.status(200).json(workHours);
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    return res.status(500).error("Une erreur s'est produite");
  }
};

export default {
  create,
  deleteWorkHour,
  getWorkHoursByUser,
  getWorkHoursByClass,
};
