import { ReceivedMessageRequestDTO } from '../hook/dto/receivedMessageRequest.dto';

interface MockReceivedMessageData {
  sender: string;
  receiver: string;
  message: string;
  type: 'message' | 'status' | 'quickReply';
  phoneNumberId?: string;
}

const messageTypes = {
  message: (data: MockReceivedMessageData) => ({
    contacts: [
      {
        profile: {
          name: 'NAME',
        },
        wa_id: data.receiver,
      },
    ],
    messages: [
      {
        from: data.sender,
        id: 'wamid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjU1MzE4NTYxRjk5NzI1MkEyRgA=',
        timestamp: Date.now(),
        text: {
          body: data.message,
        },
        type: 'text',
      },
    ],
  }),
  status: (data: MockReceivedMessageData) => ({
    statuses: [
      {
        id: 'wamid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjU1MzE4NTYxRjk5NzI1MkEyRgA=',
        status: 'sent',
        timestamp: Date.now(),
        recipient_id: data.receiver,
        conversation: {
          id: 'CONVERSATION_ID',
          expiration_timestamp: 'CONVERSATION_EXPIRATION_TIMESTAMP',
          origin: {
            type: 'user_initiated',
          },
        },
        pricing: {
          billable: true,
          pricing_model: 'CBP',
          category: 'user_initiated',
        },
      },
    ],
  }),
  quickReply: (data: MockReceivedMessageData) => ({
    contacts: [
      {
        profile: {
          name: 'NAME',
        },
        wa_id: data.receiver,
      },
    ],
    messages: [
      {
        context: {
          from: data.receiver,
          id: 'wamid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjgxNEZEMzk4MjQ4MTQyQ0I0BQA=',
        },
        from: data.sender,
        id: 'wamid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjU1MzE4NTYxRjk5NzI1MkEyRgA=',
        timestamp: Date.now(),
        type: 'button',
        button: {
          payload: data.message,
          text: data.message,
        },
      },
    ],
  }),
};

export const mockReceivedMessageFromMeta = (
  data: MockReceivedMessageData,
): ReceivedMessageRequestDTO => ({
  object: 'whatsapp_business_account',
  entry: [
    {
      id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
      changes: [
        {
          value: {
            messaging_product: 'whatsapp',
            metadata: Object.keys(data).includes('phoneNumberId')
              ? {
                  display_phone_number: data.receiver,
                  phone_number_id: data.phoneNumberId,
                }
              : {
                  display_phone_number: data.receiver,
                  phone_number_id: '123456378901234',
                },
            ...messageTypes[data.type](data),
          },
          field: 'messages',
        },
      ],
    },
  ],
});
