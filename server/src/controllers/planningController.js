import db from '../models/index.js';
import { checkUUID } from '../utils/uuid.js';
import { Op } from 'sequelize';
import PlanningService from "../service/planning-service.js";

const getPlanning = async (req, res) => {
  try {
    const classId = req.params.classId;

    const {start, end} = req.query;

    // if(!start || !end){
    //   return res.status(400).json("Date de début et de fin manquantes");
    // }
    if(!checkUUID(classId)){
      return res.status(400).json("Identifiant de classe invalide");
    }

    const planningService = new PlanningService();
    const datas = await getDataToGeneratePlanning(classId, start, end);
    console.log(datas);
    const response = await planningService.getOpenAICompletion(datas);
    res.status(200).send(response.choices[0].message.content);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getDataToGeneratePlanning = async (classId, startDate, endDate) => {
  const schoolClass = await db.School.findAll();
  const school = schoolClass?.[0]?.toJSON();

  const classOpeningDayInstances = await db.SchoolDayClass.findAll({
    where: {
      classId: classId
    }
  });
  const schoolDaysClass = classOpeningDayInstances.map(day => day.toJSON());

  const teachersId = [];
  const subjectClassId = [];

  const subjectClassInstances = await db.SubjectClass.findAll({
    where: {
      classId: classId
    },
    include: [
      {
        model: db.User,
        as: "teacher"
      },
      {
        model: db.Subject,
        as: "subject"
      }
    ]
  });

  const subjectClass = subjectClassInstances.map(subject => {
    const pureSubject = subject.toJSON();
    if (!teachersId.includes(pureSubject.teacher.id)) {
      teachersId.push(pureSubject.teacher.id);
    }
    subjectClassId.push(pureSubject.id);
    return pureSubject;
  });

  const workHourInstances = await db.WorkHour.findAll({
    where: {
      subjectClassId: {
        [Op.in]: subjectClassId,
      }
    }
  });
  const workHours = workHourInstances.map(workHour => workHour.toJSON());

  const availabilityInstances = await db.Availability.findAll({
    where: {
      userId: {
        [Op.in]: teachersId,
      }
    }
  });
  const availabilitiesTeacher = availabilityInstances.map(availability => availability.toJSON());

  return {
    workHours,
    availabilitiesTeacher,
    school,
    schoolDaysClass,
    subjectClass
  };
};

export default {getPlanning};
