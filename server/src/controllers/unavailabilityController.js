import db from "../models/index.js";
import { uuidv4 } from "uuidv7";

const getAll = async (req, res) => {
  try {
    const unavailabilities = await db.Unavailability.findAll({
      where: {
        userId: req.params.userId,
      },
    });

    const userExist = await db.User.findOne({
      where: {
        id: req.params.userId,
      },
    });

    if (!userExist) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    return res.status(200).json(unavailabilities);
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    return res.status(500).json({ error: "Une erreur s'est produite" });
  }
};

const createAbsence = async (req, res) => {
  try {
    const userExist = await db.User.findOne({
      where: {
        id: req.params.userId,
      },
    });

    if (!userExist) {
      return res.status(404).json({ message: "L'utilisateur n'existe pas" });
    }

    const subjectClassExist = await db.SubjectClass.findOne({
      where: {
        id: req.body.subjectClassId,
      },
    });

    if (!subjectClassExist) {
      return res.status(404).json({ message: "La classe n'existe pas" });
    }

    const absence = await db.Unavailability.create({
      id: uuidv4(),
      date: req.body.date,
      userId: req.params.userId,
      subjectClassId: req.body.subjectClassId,
    });

    await db.WorkHours.destroy({
      where: {
        userId: req.params.userId,
        date: req.body.date,
      },
    });

    return res.status(201).json(absence);
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    return res.status(500).json({ error: "Une erreur s'est produite" });
  }
};

const update = async (req, res) => {};

const deleteUnavailability = async (req, res) => {};

export default { createAbsence, update, deleteUnavailability, getAll };
