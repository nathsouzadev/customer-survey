import { QuickReplyReceived } from '../hook/models/messageData.model';

interface MockReceivedMessageData {
  sender: string;
  receiver: string;
  message: string;
}

export const mockQuickReplyReceived = (
  data: MockReceivedMessageData,
): QuickReplyReceived => ({
  messaging_product: 'whatsapp',
  metadata: {
    display_phone_number: data.receiver,
    phone_number_id: data.receiver,
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
      context: {
        from: data.receiver,
        id: 'wamid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjU1MzE4NTYxRjk5NzI1MkEyBcA=',
      },
      timestamp: Date.now(),
      button: {
        text: data.message,
        payload: data.message,
      },
      type: 'button',
    },
  ],
});
