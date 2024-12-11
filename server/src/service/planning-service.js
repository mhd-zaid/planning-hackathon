import OpenAI from 'openai';

const systemPrompt = `
Based on the input data, generate a JSON object strictly in the following format. Do not include any text before or after the JSON object. 

### Expected JSON Output Format:
[
  {
    "preWorkHour": [
      {
        "startDate": "",
        "endDate": "",
        "subjectClassId": "",
        "teacher": {
          "firstname": "",
          "lastname": ""
        },
        "subject": {
          "name": "",
          "color": ""
        }
      }
    ],
    "backlogHoursSubjectClass": [
      {
        "subjectClassId": "",
        "nbHoursClassPlanified": "",
        "nbrHoursClassLeft": "",
        "nbrHoursClassTotal": ""
      }
    ]
  }
]

### Input Data:
- **workHours**: List of time slots where teachers are not available. No lesson should be scheduled for the teacher concerned if it corresponds to an available slot in this list.
- **availabilitiesTeacher**: Array of objects indicating the availability of teachers.
- **school**: Object providing school information.
- **schoolDaysClass**: Array of objects indicating school working days.
- **subjectClass**: Array of objects defining classes, their associated teachers, and subjects.

### Constraints:
1. A teacher must be available during the planned time slot (from availabilitiesTeacher).
2. A teacher cannot have overlapping courses during the planned time slot (from workHours).
3. Courses must be scheduled during school opening hours and on school working days (from schoolDaysClass).

### Notes:
1. The 'nbHoursClassPlanified' field should represent the total number of hours scheduled for the given 'subjectClassId'.
2. The 'nbrHoursClassLeft' field should represent the remaining hours to schedule for the given 'subjectClassId'.
3. The 'nbrHoursClassTotal' field should represent the total hours initially required for the given 'subjectClassId'.
4. The backlog hours should have all subjects for the class.

Use the input data to generate a JSON object strictly in the format specified above.
`;

class PlanningService {
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async getOpenAICompletion(data) {
    const context = [];

    context.push({
        role: 'system',
        content: systemPrompt,
      });
    const dataPrompt = "Input Data : " + JSON.stringify(data);
    context.push({ role: 'user', content:  dataPrompt});
    const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: context,
        temperature: 0.2,
        frequency_penalty: 0,
        presence_penalty: 0,
        n: 1,
      });
    return completion;
  }
}

export default PlanningService;