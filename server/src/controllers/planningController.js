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
    // console.log(datas);
    const response = await planningService.getOpenAICompletion(datas);
    res.status(200).send(response.choices[0].message.content);
    // return res.status(200).json(datas);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getDataToGeneratePlanning = async (classId, startDate, endDate) => {

  // Récupérer les school day class between start and end date
  const classOpeningDayInstances = await db.SchoolDayClass.findAll({
    where: {
      classId: classId
    },
    attributes: ['date']
  });

  const schoolDaysClass = classOpeningDayInstances.map(day => day.toJSON());

  const teachersId = [];
  const subjectClassId = [];

  // Récupérer les subject class between start and end date
  // on doit récupérer les subject class par rapport au mois courant et checker quel période est associé
  // Mois de janvier => je recupere les subjectclass qui ont la période sur le mois de janvier
  const subjectClassInstances = await db.SubjectClass.findAll({
    where: {
      classId: classId
    },
    attributes: ['id'],
    include: [
      {
        model: db.User,
        as: "teacher",
        attributes: ['firstname', 'lastname', 'id']
      },
      {
        model: db.Subject,
        as: "subject",
        attributes: ['name', 'nbHoursQuota', 'nbHoursQuotaExam', 'color']
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

  // Pour les workHours il faut tout récupérer pour la période donnée (s1, s2)
  const workHourInstances = await db.WorkHour.findAll({
    attributes: ['beginDate', 'endDate'],
    include: [
      {
        model: db.SubjectClass,
        as: 'subjectClass',
        where: {
          teacherId: {
            [Op.in]: teachersId, // Filtrer par les IDs des enseignants
          },
        },
        attributes: ['id'],
        include: [
          {
            model: db.User,
            as: 'teacher',
            attributes: ['firstname', 'lastname', 'id'],
          },
        ],
      },
    ],
  });
  const unavailabilityHours = workHourInstances.map(workHour => workHour.toJSON());

  const availabilityInstances = await db.Availability.findAll({
    where: {
      userId: {
        [Op.in]: teachersId,
      }
    },
    attributes: [
      'beginDate',
      'endDate',
      ['userId', 'teacherId']
    ], 
   });
  const availabilitiesTeacher = availabilityInstances.map(availability => availability.toJSON());

  return {
    unavailabilityHours,
    availabilitiesTeacher,
    schoolDaysClass,
    subjectClass
  };
};

export default {getPlanning};
