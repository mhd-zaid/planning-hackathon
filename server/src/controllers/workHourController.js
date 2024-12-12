import db from '../models/index.js';
import {uuidv4} from "uuidv7";
import { Op } from 'sequelize';
import { checkUUID } from '../utils/uuid.js';

const create = async(req, res) => {
    try {

      const workHours = req.body;

      const workHourSuccess = [];
      const workHourError = [];

      for(const workHour of workHours){
        const subjectClassId = workHour.subjectClassId;

        const subjectClassExist = await db.SubjectClass.findOne({
          where: {
            id: subjectClassId,
          },
        });

        if (!subjectClassExist) {
          workHourError.push({
            ...workHour,
            message: 'La classe n\'existe pas.'
        });
          continue;
        }

        const isOverlapping = await db.WorkHour.findOne({
          where: {
            [Op.and]: [
              { beginDate: { [Op.lt]: workHour.endDate } },  // Vérifie que l'heure de début de la nouvelle plage est avant la fin de l'existante
              { endDate: { [Op.gt]: workHour.beginDate } }   // Vérifie que l'heure de fin de la nouvelle plage est après le début de l'existante
            ],
          },
          include: [
            {
              model: db.SubjectClass,  // Jointure avec SubjectClass pour vérifier la relation avec le professeur
              as: 'subjectClass',
              where: {
                teacherId: workHour.teacherId,  // Filtre sur le teacherId du professeur pour récupérer ses horaires de travail
              },
            }
          ]
        });
        
        
  
        if(isOverlapping) {
          workHourError.push({
            ...workHour,
            message: 'Les horaires se chevauchent.'
          });
          continue;
        }
  
        const newWorkHour = await db.WorkHour.create({
          id: uuidv4(),
          beginDate: workHour.beginDate,
          endDate: workHour.endDate,
          subjectClassId,
        });

        workHourSuccess.push(newWorkHour);
      }

        
      return res.status(201).json({
        workHourSuccess,
        workHourError,
      });
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