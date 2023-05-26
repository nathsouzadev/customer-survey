export class Survey {
  id: string;
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

export class Answer {
  id: string;
  questionId: string;
  answer: string;
  label: string;

  constructor(body: {
    questionId: string,
    answer: string,
    label: string
  }){
    this.id = 'a'
    this.questionId = body.questionId
    this.answer = body.answer
    this.label = body.label
  }
}
