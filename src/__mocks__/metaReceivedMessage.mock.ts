import { ReceivedMessageRequestDTO } from '../hook/dto/receivedMessageRequest.dto';

interface MockReceivedMessageData {
  sender: string;
  receiver: string;
  message: string;
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
          value: {
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
          },
          field: 'messages',
        },
      ],
    },
  ],
});
