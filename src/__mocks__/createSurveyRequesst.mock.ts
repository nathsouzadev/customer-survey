import { CreateSurveyRequestDTO } from '../survey/dto/createSurveyRequest.dto';

interface DataMockCreateSurveyRequest {
  companyId: string;
}

export const mockCreateSurveyRequest = (
  data: DataMockCreateSurveyRequest,
): CreateSurveyRequestDTO => ({
  companyId: data.companyId,
  name: 'Survey',
  title: 'Survey title',
  questions: [
    {
      question: 'Question 1',
      order: 1,
      answers: [
        {
          answer: 'Bom',
          label: '1',
        },
        {
          answer: 'Regular',
          label: '2',
        },
        {
          answer: 'Ruim',
          label: '3',
        },
      ],
    },
    {
      question: 'Question 2',
      order: 2,
      answers: [
        {
          answer: 'Bom',
          label: '1',
        },
        {
          answer: 'Regular',
          label: '2',
        },
        {
          answer: 'Ruim',
          label: '3',
        },
      ],
    },
  ],
});
