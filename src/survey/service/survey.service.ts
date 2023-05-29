import { Injectable } from '@nestjs/common';
import { SurveyModel } from '../model/survey.model';
import { Survey } from '../dto/survey.dto';
import { fakeSurvey } from './survey';
import { CustomerService } from '../../customer/customer.service';
import { randomUUID } from 'crypto';
import { CustomerAnswer } from '@prisma/client';
import { CustomerSurveyModel } from '../../customer/model/customerSurvey.model';
import { SurveyRepository } from '../repository/survey.repository';
import { SurveyResults } from '../model/surveyResult';

const survey: Survey = fakeSurvey;

@Injectable()
export class SurveyService {
  constructor(
    private readonly surveyRepository: SurveyRepository,
    private readonly customerService: CustomerService
  ) {}
  getSurvey = async(): Promise<SurveyModel> => {
    const survey = await this.surveyRepository.getSurveyById('29551fe2-3059-44d9-ab1a-f5318368b88f')

    const questions = []

    for (const question of survey.questions) {
      const orderedAnswers = [];
      for (const customerAnswer of question.customerAnswers) {
        const listedAnswer = orderedAnswers.findIndex(
          (orderedAnswer) => orderedAnswer.label === customerAnswer.answer,
        );

        if (listedAnswer === -1) {
          orderedAnswers.push({
            label: customerAnswer.answer,
            quantity: 1,
          });
        } else {
          orderedAnswers[listedAnswer].quantity =
            orderedAnswers[listedAnswer].quantity + 1;
        }
      }

      question.customerAnswers = orderedAnswers;
      questions.push(question);
    }
  
    return {
      ...survey,
      questions
    }
  };

  addAnswerToSurvey = async (userAnswer: {
    answer: string;
    customer: string;
  }): Promise<{
    answerReceived: CustomerAnswer;
    nextQuestion: null | string;
  }> => {
    const {
      customerId,
      survey: {
        questions
      }
    }: CustomerSurveyModel = await this.customerService.getSurvey(
      userAnswer.customer,
    );

    const customerAnswers =
      await this.customerService.getCustomerAnswersToSurvey({
        customerId,
        questionsId: questions.map((question) => question.id),
      });

    const labels = questions[customerAnswers.length].answers.map(
      (answer) => answer.label,
    );

    const answer = await this.customerService.saveCustomerAnswer({
      id: randomUUID(),
      customerId: customerId,
      questionId: questions[customerAnswers.length].id,
      answer: labels[Number(userAnswer.answer) - 1],
    });

    return {
      answerReceived: answer,
      nextQuestion:
        questions.length > customerAnswers.length + 1
          ? questions[customerAnswers.length + 1].question
          : null,
    };
  };
}
