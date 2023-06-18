export interface SendSurveyModel {
  surveySent: {
    surveyId: string;
    status: string;
    totalCustomers: number;
  };
}
