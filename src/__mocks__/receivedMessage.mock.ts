import { MessageModel } from '../model/message.model';

interface MockReceivedMessage {
  body: string;
  profileName: string,
  to: string,
  waId: string,
  smsSid: string,
  accountSid: string
}

export const mockReceivedMessage = (data: MockReceivedMessage): MessageModel => ({
  SmsMessageSid: 'SMba82e029e2ba3f080b2d49c0c0328eff',
  NumMedia: '0',
  ProfileName: data.profileName,
  SmsSid: data.smsSid,
  WaId: data.waId,
  SmsStatus: 'received',
  Body: data.body,
  To: data.to,
  NumSegments: '1',
  ReferralNumMedia: '0',
  MessageSid: data.smsSid,
  AccountSid: data.accountSid,
  From: `whatsapp:+${data.waId}`,
  ApiVersion: '2010-04-01',
});
