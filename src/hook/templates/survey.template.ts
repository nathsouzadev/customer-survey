import { TemplateData } from '../../client/wb/models/templateData.model';

interface TemplateBody {
  receiver: string;
  sender: string;
  company: string;
  phoneNumberId: string;
}

export const getSurveyTemplate = (
  templateBody: TemplateBody,
): TemplateData => ({
  receiver: templateBody.receiver,
  sender: templateBody.sender,
  type: 'template',
  template: 'survey',
  phoneNumberId: templateBody.phoneNumberId,
  parameters: [
    {
      type: 'text',
      text: templateBody.company,
    },
  ],
});
