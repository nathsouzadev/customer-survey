import { MessageReceived } from '../hook/models/messageData.model';

interface MockReceivedMessageData {
  sender: string;
  receiver: string;
  message: string;
  phoneNumberId: string;
  name?: string;
}

export const mockReceivedMessage = (
  data: MockReceivedMessageData,
): MessageReceived => ({
  messaging_product: 'whatsapp',
  metadata: {
    display_phone_number: data.receiver,
    phone_number_id: data.phoneNumberId,
  },
  contacts: [
    {
      profile: {
        name: data.name ?? 'NAME',
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
});
