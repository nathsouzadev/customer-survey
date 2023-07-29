export interface CustomerRegisteredModel {
  id: string;
  active: boolean;
  customerId: string;
  surveyId: string;
  customer: Customer;
}

interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  companyId: string;
  answers: Answer[];
}

interface Answer {
  id: string;
  customerId: string;
  questionId: string;
  answer: string;
}
