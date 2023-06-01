export class SurveyModel {
  id: string;
  companyId: string;
  name: string;
  title: string;
  questions: Question[];
}

class Question {
  id: string;
  surveyId: string;
  question: string;
  answers: Answer[];
}

class Answer {
  label: string;
  quantity: number;
}
