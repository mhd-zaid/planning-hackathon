import db from '../models/index.js';
import { checkUUID } from '../utils/uuid.js';
import { Model, Op } from 'sequelize';
import PlanningService from "../service/planning-service.js";

const getPlanning = async (req, res) => {
  try {
    const classId = req.params.classId;

    const {start, end} = req.query;

    if(!start || !end){
      return res.status(400).json("Date de début et de fin manquantes");
    }
    if(!checkUUID(classId)){
      return res.status(400).json("Identifiant de classe invalide");
    }

    const planningService = new PlanningService();
    const datas = await getDataToGeneratePlanning(classId, start, end);
    // console.log(datas);
    const response = await planningService.getOpenAICompletion(datas);
    res.status(200).send(JSON.parse(response.choices[0].message.content));
    //return res.status(200).json(datas);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getDataToGeneratePlanning = async (classId, startDate, endDate) => {

  const classOpeningDayInstances = await db.SchoolDayClass.findAll({
    where: {
      classId: classId,
      date: {
        [Op.between]: [startDate, endDate]
      }
      
    },
    attributes: ['date']
  });

  const schoolDaysClass = classOpeningDayInstances.map(day => day.toJSON());

  const teachersId = [];
  const subjectClassId = [];

  const periodInstances = await db.Period.findOne({
    where: {
      beginDate: {
        [Op.lte]: startDate
      },
      endDate: {
        [Op.gte]: endDate
      }
    },
    attributes: ['id']
  });
  const subjectClassInstances = await db.SubjectClass.findAll({
    where: {
      classId: classId,
      periodId : periodInstances.id
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
          periodId: periodInstances.id,
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

const getBacklog = async (req, res) => {
  try {
    const classId = req.params.classId;

    if(!checkUUID(classId)){
      return res.status(400).json("Identifiant de classe invalide");
    }

    const classExist = await db.Class.findByPk(classId);
    if(!classExist){
      return res.status(404).json("Classe introuvable");
    }

    const backlogs = [];

    const periodInstances = await db.Period.findOne({
      where: {
        beginDate: {
          [Op.lte]: new Date()
        },
        endDate: {
          [Op.gte]: new Date()
        }
      },
      attributes: ['id']
    });

    const subjectClassInstances = await db.SubjectClass.findAll({
      where: {
        classId: classExist.id,
        periodId: periodInstances.id
      },
      attributes: ['id'],
      include: [
        {
          model: db.Subject,
          as: 'subject',
          attributes: ['name', 'nbHoursQuota']
        },
        {
          model: db.WorkHour,
          as: 'workHours',
          attributes: ['beginDate', 'endDate']
        }
      ],
    });

    for (const subjectClass of subjectClassInstances) {
      const subjectQuota = subjectClass.subject.nbHoursQuota;
      const subjectName = subjectClass.subject.name;
      let subjectHoursScheduled = 0;

      for (const workHour of subjectClass.workHours) {
        const beginDate = new Date(workHour.beginDate);
        const endDate = new Date(workHour.endDate);
        const diff = endDate - beginDate;
        const hours = diff / 1000 / 60 / 60;
        subjectHoursScheduled += hours;
      }
      backlogs.push({
        id: subjectClass.id,
        subjectName: subjectName,
        subjectQuota: subjectQuota,
        subjectHoursScheduled: subjectHoursScheduled,
        subjectRemainingHours: subjectQuota - subjectHoursScheduled
      });
    }

    return res.status(200).json(backlogs);

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}
  
export default {getPlanning, getBacklog};
