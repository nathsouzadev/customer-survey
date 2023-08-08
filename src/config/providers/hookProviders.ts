import { companyProviders } from './companyProviders';
import { customerProviders } from './customerProviders';
import { senderProviders } from './senderProviders';
import { surveyProviders } from './surveyProviders';

export const hookProviders = [
  ...customerProviders,
  ...surveyProviders,
  ...companyProviders,
  ...senderProviders,
];
