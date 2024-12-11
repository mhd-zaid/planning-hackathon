import db from '../models/index.js';
import { checkUUID } from '../utils/uuid.js';
import { Op } from 'sequelize';
import PlanningService from "../service/planning-service.js";

const getPlanning = async (req, res) => {
  try {
    const planningService = new PlanningService();
    const response = await planningService.getOpenAICompletion({"Test": "Test"});
    res.status(200).send(response.choices[0].message);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const generatePlanning = async(req, res) => {
  const classId = req.params.classId;

  const {start, end} = req.query;

  if(!start || !end){
    return res.status(400).json("Date de début et de fin manquantes");
  }
  if(!checkUUID(classId)){
    return res.status(400).json("Identifiant de classe invalide");
  }

  const schoolClass = await db.School.findAll();
  const school = schoolClass?.[0];

  const classOpeningDay = await db.SchoolDayClass.findAll({
    where: {
      classId: classId
    }
  });

  // Il faut connaitre les professeurs pour cette classe
  // => sélectionner tous les subjectClass pour avoir la list edes intervenants

  const teachersId = [];
  const subjectClassId = [];

  const subjectClass = await db.SubjectClass.findAll({
    where: {
      classId: classId
    },
    include: [
      {
        model: db.User,
        as: "teacher"
      }
    ]
  });

  for(const subject of subjectClass){
    if (!teachersId.includes(subject.teacher.id)) teachersId.push(subject.teacher.id);
    subjectClassId.push(subject.id);
  }
  
  //Récupération de toutes les workHours
  const workHours = await db.WorkHour.findAll({
    where: {
      subjectClassId: {
        [Op.in]: subjectClassId,
      }
    }
  });

  //Récupération de toutes les disponibilités
  const availabilitiesTeacher = await db.Availability.findAll({
    where: {
      userId: {
        [Op.in]: teachersId,
      }
    }
  });
  

  return res.status(200).json({
    workHours,
    availabilitiesTeacher,
    school,
    classOpeningDay
  });

}
export default {getPlanning, generatePlanning};
