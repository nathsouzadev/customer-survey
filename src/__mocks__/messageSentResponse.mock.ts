import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

interface MockMessageSentResponse {
  body: string;
  from: string;
  to: string;
  accountSid: string;
  sid: string;
}

export const mockMessageSentRespose = (
  info: MockMessageSentResponse,
): Partial<MessageInstance> => ({
  body: info.body,
  numSegments: '1',
  direction: 'outbound-api',
  from: info.from,
  to: info.to,
  dateUpdated: new Date('2023-05-25T22:04:01.000Z'),
  price: null,
  errorMessage: null,
  uri: `/2010-04-01/Accounts/${info.accountSid}/Messages/${info.sid}.json`,
  accountSid: info.accountSid,
  numMedia: '0',
  status: 'queued',
  messagingServiceSid: null,
  sid: info.sid,
  dateSent: null,
  dateCreated: new Date('2023-05-25T22:04:01.000Z'),
  errorCode: null,
  priceUnit: null,
  apiVersion: '2010-04-01',
  subresourceUris: {
    media: `/2010-04-01/Accounts/${info.accountSid}/Messages/${info.sid}/Media.json`,
  },
});
