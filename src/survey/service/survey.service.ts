import { Injectable } from '@nestjs/common';
import { SurveyModel } from '../model/survey.model';
import { Answer, Survey } from '../dto/survey.dto';

const survey: Survey = {
  id: 'survey',
  name: 'Exampled Survey',
  title: 'Customer Experience',
  questions: [
    { 
      id: 'question',
      surveyId: 'survey',
      question: 'Como você avalia o nosso atendimento?',
      answers: [
        { id: 'a', questionId: 'question', answer: '1', label: 'bom' },
        { id: 'b', questionId: 'question', answer: '1', label: 'bom' },
        { id: 'c', questionId: 'question', answer: '1', label: 'bom' },
        { id: 'd', questionId: 'question', answer: '2', label: 'regular' },
        { id: 'e', questionId: 'question', answer: '2', label: 'regular' },
        { id: 'f', questionId: 'question', answer: '3', label: 'ruim' }
      ]
    }
  ]
}

@Injectable()
export class SurveyService {
  getSurvey = (): SurveyModel => {
    let orderedAnswers = []
    survey.questions[0].answers.forEach(answer => {
      const listedAnswer = orderedAnswers.findIndex(orderedAnswer => orderedAnswer.label === answer.label)

      if(listedAnswer === -1) {
        orderedAnswers.push({
          label: answer.label,
          quantity: 1
        })
      } else {
        orderedAnswers[listedAnswer].quantity += 1
      }
    })

    return this.converSurveyToModel(survey, orderedAnswers)
  }

  converSurveyToModel = (survey, orderedAnswer): SurveyModel => {
    const surveyResponse = Object.assign(survey)
    delete surveyResponse.questions[0].answers
    surveyResponse.questions[0].answers = orderedAnswer
    return surveyResponse
  }

  addAnswerToSurvey = (userAnswer: string): Answer => {
    const labels = ['bom', 'regular', 'ruim']

    const answer = new Answer({
      questionId: 'question',
      answer: userAnswer,
      label: labels[Number(userAnswer) - 1]
    })
    survey.questions[0].answers.push(answer)
    
    return answer
  }
}
