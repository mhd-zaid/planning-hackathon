import OpenAI from 'openai';
import db from '../models/index.js';

const systemPrompt = "Ce qui suit est une demande de planification optimisée de cours sur une periode donnée. La planification doit être otpimisé selon la disponibiité des professeurs et il ne doit pas y avoir\
de chevauchement de cours, il doit prendre en compte les jours d'école ainsi que les horaires, il faut aussi prendre en compte le nombre d'heure de cours qui ont déja été planifié pour ne pas dépasser le quota\
d'heure de cours de la filière et de la matière. La réponse doit être uniquement au format json valide comme l'exemple qui suit: [\
{\
    preWorkHour: [\
        {\
        startDate:'',\
        endDate:'',\
        subjectClassId:'',\
        teacher:{\
            firstname:'',\
            lastname:'',\
        },\
        subject:{\
            name:'',\
            color:'',\
        },\
    ],\
    backlogHoursSubjectClass : [\
        {\
            subjectClassId:'',\
            nbHoursClassPlanified:'',\
            nbrHoursClassLeft:'',\
            nbrHoursClassTotal:'',\
        }\
    ],\
}\
]";

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
    let dataPrompt = "Voici les donnée à prendre compte: " + JSON.stringify(data);
    context.push({ role: 'user', content:  dataPrompt});
    const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
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