import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from './survey.controller';
import { SurveyService } from './service/survey.service';
import { CustomerAnswerService } from '../customerAnswer/customerAnswer.service';
import { CustomerAnswerRepository } from '../customerAnswer/repository/customerAnswer.repository';
import { CustomerService } from '../customer/customer.service';
import { CustomerRepository } from '../customer/repository/customer.repository';

describe('SurveyController', () => {
  let controller: SurveyController;
  let mockSurveyService: SurveyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyController],
      providers: [
        SurveyService,
        CustomerAnswerService,
        {
          provide: CustomerAnswerRepository,
          useValue: {},
        },
        CustomerService,
        {
          provide: CustomerRepository,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<SurveyController>(SurveyController);
    mockSurveyService = module.get<SurveyService>(SurveyService);
  });

  it('should be return survey', () => {
    jest.spyOn(mockSurveyService, 'getSurvey').mockImplementation(() => ({
      id: 'survey',
      name: 'Exampled Survey',
      title: 'Customer Experience',
      questions: [
        {
          id: 'question',
          surveyId: 'survey',
          question: 'Como você avalia o nosso atendimento?',
          answers: [
            { label: 'bom', quantity: 3 },
            { label: 'regular', quantity: 2 },
            { label: 'ruim', quantity: 1 },
          ],
        },
      ],
    }));
    expect(controller.getSurvey()).toMatchObject({
      id: 'survey',
      name: 'Exampled Survey',
      title: 'Customer Experience',
      questions: [
        {
          id: 'question',
          surveyId: 'survey',
          question: 'Como você avalia o nosso atendimento?',
          answers: [
            { label: 'bom', quantity: 3 },
            { label: 'regular', quantity: 2 },
            { label: 'ruim', quantity: 1 },
          ],
        },
      ],
    });
  });
});
