import { Injectable } from '@nestjs/common';
import { SurveyModel } from '../model/survey.model';
import { Survey } from '../dto/survey.dto';
import { fakeSurvey } from './survey';
import { CustomerService } from '../../customer/customer.service';
import { randomUUID } from 'crypto';
import { CustomerAnswer } from '@prisma/client';

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
    answerReceived: CustomerAnswer;
    nextQuestion: null | string;
  }> => {
    const mySurvey: any = await this.customerService.getSurvey(
      userAnswer.customer,
    );
    console.log('SURVEY', mySurvey);

    const labels = mySurvey.survey.questions[0].answers.map(
      (answer) => answer.label,
    );
    const customerAnswers =
      await this.customerService.getCustomerAnswersToSurvey({
        customerId: mySurvey.customerId,
        questionsId: mySurvey.survey.questions.map((question) => question.id),
      });

    const answer = await this.customerService.saveCustomerAnswer({
      id: randomUUID(),
      customerId: mySurvey.customerId,
      questionId: mySurvey.survey.questions[customerAnswers.length].id,
      answer: labels[Number(userAnswer.answer) - 1],
    });

    return {
      answerReceived: answer,
      nextQuestion:
        survey.questions.length > customerAnswers.length + 1
          ? mySurvey.survey.questions[customerAnswers.length + 1].question
          : null,
    };
  };
}
