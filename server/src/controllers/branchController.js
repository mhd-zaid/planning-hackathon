    import db from '../models/index.js';

const getAll = async(req, res) => {
    try {
      const branches = await db.Branch.findAll(
        {
          include: [
            {
              model: db.Subject,
              as: 'subjects',
              attributes: ['id', 'name', 'nbHoursQuota', 'nbHoursQuotaExam'],
            },
            {
                model: db.Class,
                as: 'classes',
                attributes: ['id'],
            }
          ],
        }
      );
      return res.status(200).json(branches);
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
      return res
        .status(500).error("Une erreur s'est produite");
    }
}

export default {getAll}