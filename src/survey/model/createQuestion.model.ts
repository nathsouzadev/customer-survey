export class CreateQuestionModel {
  surveyId: string;
  question: string;
  order: number;
  answers: Answer[];
}

class Answer {
  answer: string;
  label: string;
}
