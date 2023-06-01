import { Injectable } from '@nestjs/common';
import { SurveyModel } from '../model/survey.model';
import { CustomerService } from '../../customer/customer.service';
import { randomUUID } from 'crypto';
import { CustomerAnswer } from '@prisma/client';
import { CustomerSurveyModel } from '../../customer/model/customerSurvey.model';
import { SurveyRepository } from '../repository/survey.repository';

@Injectable()
export class SurveyService {
  constructor(
    private readonly surveyRepository: SurveyRepository,
    private readonly customerService: CustomerService,
  ) {}
  getSurvey = async (surveyId: string): Promise<SurveyModel> => {
    const survey = await this.surveyRepository.getSurveyById(surveyId);

    const surveyData: SurveyModel = {
      id: survey.id,
      companyId: survey.companyId,
      name: survey.name,
      title: survey.title,
      questions: [],
    };

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

      surveyData.questions.push({
        id: question.id,
        surveyId: question.surveyId,
        question: question.question,
        answers: orderedAnswers,
      });
    }

    return surveyData;
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
      survey: { questions },
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

    const nextQuestion =
      questions.length > customerAnswers.length + 1
        ? `${
            questions[customerAnswers.length + 1].question
          } \n${this.getOptions(questions[customerAnswers.length + 1].answers)}`
        : null;

    console.log(nextQuestion);

    return {
      answerReceived: answer,
      nextQuestion,
    };
  };

  getOptions = (options) => {
    let option;

    options.forEach((answer, index) => {
      index === 0
        ? (option = `${answer.answer} - ${answer.label}`)
        : (option = option + `\n${answer.answer} - ${answer.label}`);
    });

    return option;
  };
}
