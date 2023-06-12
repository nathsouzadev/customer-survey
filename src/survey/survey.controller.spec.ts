import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from './survey.controller';
import { SurveyService } from './service/survey.service';
import { CustomerAnswerRepository } from '../customer/repository/customerAnswer.repository';
import { CustomerService } from '../customer/service/customer.service';
import { CustomerRepository } from '../customer/repository/customer.repository';
import { CustomerSurveyRepository } from '../customer/repository/customerSurvey.repository';
import { SurveyRepository } from './repository/survey.repository';
import { randomUUID } from 'crypto';
import { AppLogger } from '../utils/appLogger';

describe('SurveyController', () => {
  let controller: SurveyController;
  let mockSurveyService: SurveyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SurveyController],
      providers: [
        SurveyService,
        CustomerService,
        {
          provide: CustomerRepository,
          useValue: {},
        },
        {
          provide: CustomerAnswerRepository,
          useValue: {},
        },
        {
          provide: CustomerSurveyRepository,
          useValue: {},
        },
        {
          provide: SurveyRepository,
          useValue: {},
        },
        AppLogger,
      ],
    }).compile();

    controller = module.get<SurveyController>(SurveyController);
    mockSurveyService = module.get<SurveyService>(SurveyService);
  });

  it('should be return survey', async () => {
    const mockSurveyId = randomUUID();
    jest.spyOn(mockSurveyService, 'getSurvey').mockImplementation(() =>
      Promise.resolve({
        id: mockSurveyId,
        companyId: randomUUID(),
        name: 'Exampled Survey',
        title: 'Customer Experience',
        questions: [
          {
            id: 'question',
            surveyId: mockSurveyId,
            question: 'Como você avalia o nosso atendimento?',
            answers: [
              { label: 'bom', quantity: 3 },
              { label: 'regular', quantity: 2 },
              { label: 'ruim', quantity: 1 },
            ],
          },
        ],
      }),
    );

    const response = await controller.getSurvey(mockSurveyId);
    expect(response).toMatchObject({
      id: mockSurveyId,
      companyId: expect.any(String),
      name: 'Exampled Survey',
      title: 'Customer Experience',
      questions: [
        {
          id: 'question',
          surveyId: mockSurveyId,
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
