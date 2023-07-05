interface MessageData {
  messaging_product: 'whatsapp';
  metadata: {
    display_phone_number: string;
    phone_number_id: string;
  };
}

export interface MessageReceived extends MessageData {
  contacts: Array<{
    profile: {
      name: string;
    };
    wa_id: string;
  }>;
  messages: Array<{
    from: string;
    id: string;
    timestamp: number;
    text: {
      body: string;
    };
    type: string;
  }>;
}

export interface UpdateStatus extends MessageData {
  statuses: Array<{
    id: string;
    status: string;
    timestamp: number;
    recipient_id: string;
    conversation: {
      id: string;
      expiration_timestamp: string;
      origin: {
        type: string;
      };
    };
    pricing: {
      billable: boolean;
      pricing_model: string;
      category: string;
    };
  }>;
}
