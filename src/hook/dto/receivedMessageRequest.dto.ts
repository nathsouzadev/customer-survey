import { ApiProperty } from '@nestjs/swagger';

export class ReceivedMessageRequestDTO {
  @ApiProperty({
    example: 'whatsapp_business_account',
  })
  object: 'whatsapp_business_account';

  @ApiProperty({
    example: [
      {
        id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '5511988885555',
                phone_number_id: 'PHONE_NUMBER_ID',
              },
              contacts: [
                {
                  profile: {
                    name: 'NAME',
                  },
                  wa_id: '5511988885555',
                },
              ],
              messages: [
                {
                  from: '5511988885550',
                  id: 'wamid.HBgNNTUxMTk5MDExNjU1NRUCABEYEjU1MzE4NTYxRjk5NzI1MkEyRgA=',
                  timestamp: 1687764143,
                  text: {
                    body: 'MESSAGE_BODY',
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
  })
  entry: [
    {
      id: string;
      changes: [
        {
          value: {
            messaging_product: 'whatsapp';
            metadata: {
              display_phone_number: string;
              phone_number_id: string;
            };
            contacts: [
              {
                profile: {
                  name: string;
                };
                wa_id: string;
              },
            ];
            messages: [
              {
                from: string;
                id: string;
                timestamp: Date;
                text: {
                  body: string;
                };
                type: string;
              },
            ];
          };
          field: string;
        },
      ];
    },
  ];
}
