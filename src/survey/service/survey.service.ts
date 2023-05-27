import { Injectable } from '@nestjs/common';
import { SurveyModel } from '../model/survey.model';
import { Answer, Survey } from '../dto/survey.dto';
import { fakeSurvey } from './survey';

const survey: Survey = fakeSurvey

const customers = [
  {
    phoneNumber: '5511999991111',
    answers: []
  },
  {
    phoneNumber: '5511999992222',
    answers: [{ id: 'h', questionId: 'question', answer: '1', label: 'bom' }]
  }
]

@Injectable()
export class SurveyService {
  getSurvey = (): SurveyModel => {
    const questions = []

    for(const question of survey.questions){
      const orderedAnswers = []
      for(const answer of question.answers){
        const listedAnswer = orderedAnswers.findIndex(
          (orderedAnswer) => orderedAnswer.label === answer.label,
        );
  
        if (listedAnswer === -1) {
          orderedAnswers.push({
            label: answer.label,
            quantity: 1,
          });
        } else {
          orderedAnswers[listedAnswer].quantity = orderedAnswers[listedAnswer].quantity + 1;
        }
      }

      question.answers = orderedAnswers
      questions.push(question)
    }

    return {
      ...survey,
      questions
    }
  };

  converSurveyToModel = (survey, orderedAnswer): SurveyModel => {
    const surveyResponse = Object.assign(survey);
    delete surveyResponse.questions[0].answers;
    surveyResponse.questions[0].answers = orderedAnswer;
    return surveyResponse;
  };

  addAnswerToSurvey = (userAnswer: {answer: string, customer: string}): {
    answerReceived: Answer,
    surveyLength: number,
    customerAnswers: number,
    nextQuestion: null | string
  } => {
    const labels = ['bom', 'regular', 'ruim'];

    const answer = new Answer({
      questionId: 'question',
      answer: userAnswer.answer,
      label: labels[Number(userAnswer.answer) - 1],
    });
    survey.questions[0].answers.push(answer);

    const customerIndex = customers.findIndex(customer => customer.phoneNumber === userAnswer.customer)

    return {
      answerReceived: answer,
      surveyLength: survey.questions.length,
      customerAnswers: customers[customerIndex].answers.length + 1,
      nextQuestion: survey.questions.length > customers[customerIndex].answers.length + 1 ? survey.questions[customers[customerIndex].answers.length + 1].question : null
    };
  };
}
