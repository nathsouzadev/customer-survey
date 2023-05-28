import { Injectable } from '@nestjs/common';
import { SurveyModel } from '../model/survey.model';
import { Answer, Survey } from '../dto/survey.dto';
import { fakeSurvey } from './survey';
import { CustomerService } from '../../customer/customer.service';

const survey: Survey = fakeSurvey;

@Injectable()
export class SurveyService {
  constructor(private readonly customerService: CustomerService) {}
  getSurvey = (): SurveyModel => {
    const questions = [];

    for (const question of survey.questions) {
      const orderedAnswers = [];
      for (const answer of question.answers) {
        const listedAnswer = orderedAnswers.findIndex(
          (orderedAnswer) => orderedAnswer.label === answer.label,
        );

        if (listedAnswer === -1) {
          orderedAnswers.push({
            label: answer.label,
            quantity: 1,
          });
        } else {
          orderedAnswers[listedAnswer].quantity =
            orderedAnswers[listedAnswer].quantity + 1;
        }
      }

      question.answers = orderedAnswers;
      questions.push(question);
    }

    return {
      ...survey,
      questions,
    };
  };

  addAnswerToSurvey = async (userAnswer: {
    answer: string;
    customer: string;
  }): Promise<{
    answerReceived: Answer;
    nextQuestion: null | string;
  }> => {
    const labels = ['bom', 'regular', 'ruim'];

    const answer = new Answer({
      questionId: 'question',
      answer: userAnswer.answer,
      label: labels[Number(userAnswer.answer) - 1],
    });

    const response = await this.customerService.saveCustomerAnswer({
      ...userAnswer,
      answer: labels[Number(userAnswer.answer) - 1],
    });

    return {
      answerReceived: answer,
      nextQuestion:
        survey.questions.length > response.totalAnswers
          ? survey.questions[response.totalAnswers].question
          : null,
    };
  };
}
