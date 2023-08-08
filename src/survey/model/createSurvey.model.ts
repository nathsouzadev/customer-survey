export class CreateSurveyModel {
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
  id: string;
  questionId: string;
  answer: string;
  label: string;
}
