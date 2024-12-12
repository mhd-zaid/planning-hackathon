import db from '../models/index.js';
import {uuidv4} from "uuidv7";
import { checkUUID } from '../utils/uuid.js';

const create = async(req, res) => {
    try {

      const workHour = req.body;
      const subjectClassId = req.params.subjectClassId;

      if(!checkUUID(subjectClassId)) {
        return res
          .status(400)
          .json({ message: 'Cet intervenant n\'enseigne pas ce cours.' });
      }

      const subjectClassExists = await db.SubjectClass.findOne({
        where: {
          id: subjectClassId,
        },
      });

      if (!subjectClassExists) {
          return res
          .status(404)
          .json({ message: 'Ce cours pour cet intervenant n\'existe pas.' });
      }        

      const newWorkHour = await db.WorkHour.create({
        id: uuidv4(),
        beginDate: workHour.beginDate,
        endDate: workHour.endDate,
        subjectClassId,
      });

        
      return res.status(201).json(newWorkHour);
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
      return res
        .status(500).error("Une erreur s'est produite");
    }
}

const deleteWorkHour = async(req, res) => {
    try {
      const workHourId = req.params.id;

      if(!checkUUID(workHourId)) {
        return res
          .status(400)
          .json({ message: 'Cet horaire n\'existe pas.' });
      }

      const workHour = await db.WorkHour.findOne({
        where: {
          id: workHourId,
        },
      });

      if (!workHour) {
          return res
          .status(404)
          .json({ message: 'Cet horaire n\'existe pas.' });
      }

      await db.WorkHour.destroy({
        where: {
          id: workHourId,
        },
      });

      return res.status(204).json();
    }
    catch (error) {
      console.error("Une erreur s'est produite :", error);
      return res
        .status(500).error("Une erreur s'est produite");
}
}

const getWorkHoursByUser = async(req, res)  => {
  
  try {
    const userId = req.params.userId;

    if(!checkUUID(userId)) {
      return res
        .status(400)
        .json({ message: 'Cet utilisateur n\'existe pas.' });
    }

    const user = await db.User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
        return res
        .status(404)
        .json({ message: 'Cet utilisateur n\'existe pas.' });
    }

    const workHours = await db.WorkHour.findAll({
      attributes: ['beginDate', 'endDate'],
      include: [
        {
          model: db.SubjectClass,
          as: 'subjectClass',
          where: {
            teacherId: userId,
          },
          attributes: ['id'],
        },
      ],
    });

    return res.status(200).json(workHours);
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
    return res
      .status(500).error("Une erreur s'est produite");
  }
}

export default {create, deleteWorkHour, getWorkHoursByUser};