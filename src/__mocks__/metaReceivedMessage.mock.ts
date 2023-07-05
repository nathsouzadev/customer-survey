import { ReceivedMessageRequestDTO } from '../hook/dto/receivedMessageRequest.dto';

interface MockReceivedMessageData {
  sender: string;
  receiver: string;
  message: string;
  type: 'message' | 'update';
}

export const mockReceivedMessageFromMeta = (
  data: MockReceivedMessageData,
): ReceivedMessageRequestDTO => ({
  object: 'whatsapp_business_account',
  entry: [
    {
      id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
      changes: [
        {
          value:
            data.type === 'message'
              ? {
                  messaging_product: 'whatsapp',
                  metadata: {
                    display_phone_number: data.receiver,
                    phone_number_id: '123456378901234',
                  },
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
                }
              : {
                  messaging_product: 'whatsapp',
                  metadata: {
                    display_phone_number: data.receiver,
                    phone_number_id: '123456378901234',
                  },
                  statuses: [
                    {
                      id: 'wamid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjU1MzE4NTYxRjk5NzI1MkEyRgA=',
                      status: 'sent',
                      timestamp: Date.now(),
                      recipient_id: data.receiver,
                      conversation: {
                        id: 'CONVERSATION_ID',
                        expiration_timestamp:
                          'CONVERSATION_EXPIRATION_TIMESTAMP',
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
                },
          field: 'messages',
        },
      ],
    },
  ],
});
