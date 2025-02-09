export interface CustomerSurveyModel {
  id: string;
  active: boolean;
  customerId: string;
  surveyId: string;
  survey: SurveyModel;
}

interface SurveyModel {
  id: string;
  name: string;
  title: string;
  companyId: string;
  questions: QuestionModel[];
}

export interface QuestionModel {
  id: string;
  surveyId: string;
  question: string;
  order: number;
  answers: Answer[];
}

export interface Answer {
  id: string;
  questionId: string;
  answer: string;
  label: string;
}
