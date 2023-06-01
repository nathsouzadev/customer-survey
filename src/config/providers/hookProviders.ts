import { customerProviders } from './customerProviders';
import { surveyProviders } from './surveyProviders';

export const hookProviders = [...customerProviders, ...surveyProviders];
