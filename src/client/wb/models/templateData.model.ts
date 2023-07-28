export interface TemplateData {
  receiver: string;
  sender: string;
  type: string;
  phoneNumberId: string;
  template: string;
  parameters: Parameter[];
}

interface Parameter {
  type: string;
  text: string;
}
