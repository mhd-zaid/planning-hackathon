import db from '../models/index.js';
import {uuidv4} from "uuidv7";


const getAll = async (req, res) => {
    try {
      const schoolDays = await db.SchoolDayClass.findAll({
        where: {
          classId: req.params.classId,
        },
      });

      return res.status(200).json(schoolDays);
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
      return res
        .status(500).error("Une erreur s'est produite");
    }
}

const create = async(req, res) => {
    try {
      const {schoolDays} = req.body;
      const schoolDaysErrors = [];

      const classExists = await db.Class.findOne({
        where: {
          id: req.params.classId,
        },
      });

        if (!classExists) {
            return res
            .status(404)
            .json({ message: 'La classe n\'existe pas.' });
        }

      // pour chaque school Day on check si ca ne genere pas de chevauchement // un autre school day existe sur la période pour la même classe
      // Si un school day existe on ne renvoie pas une erreur mais on renvoie un message avec les school days qui posent problème
      for (let i = 0; i < schoolDays.length; i++) {
        const schoolDay = schoolDays[i];
        const schoolDayExists = await db.SchoolDayClass.findOne({
          where: {
            classId: req.params.classId,
            date: schoolDay.date,
          },
        });

        if (schoolDayExists) {
          schoolDaysErrors.push(schoolDay);
        }
      }

        if (schoolDaysErrors.length > 0) {
            return res
            .status(400)
            .json({ message: 'Les jours d\'école suivants n\'ont pas été crées car ils existent déjà." :', schoolDaysErrors });
        }

        // Si tout est ok on crée les school days
        await Promise.all(
            schoolDays.map(schoolDay => {
                return db.SchoolDayClass.create({
                    id: uuidv4(),
                    classId: req.params.classId,
                    date: schoolDay.date,
                });
            }),
        );

        return res.status(201).json({ message: 'Les jours d\'école ont été créés avec succès.' });


    } catch (error) {
      console.error("Une erreur s'est produite :", error);
      return res
        .status(500).error("Une erreur s'est produite");
    }
}

export default {create, getAll}