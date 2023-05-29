export class SurveyResults {
  id: string;
  name: string;
  title: string;
  questions: Question[];
}

class Question {
  id: string;
  surveyId: string;
  question: string;
  order: number
  customerAnswers: CustomerAnswer[]
}

class CustomerAnswer {
  id: string
  customerId: string
  answer: string
  questionId: string
}
