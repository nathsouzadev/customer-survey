import { ConsoleLogger, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IncomingHttpHeaders } from 'http';
import { deepCopy } from './deepCopy';

interface DataLogger {
  headers?: IncomingHttpHeaders;
  requestData?: any;
  message: string;
}

@Injectable()
export class AppLogger extends ConsoleLogger {
  logger = (data: DataLogger, context: string) => {
    if (Object.keys(data).includes('headers')) {
      global.correlationId = data.headers['x-correlation-id'] ?? randomUUID();
    }

    const { message, requestData } = data;

    if (requestData) {
      this.log(
        JSON.stringify({
          correlationId: global.correlationId,
          requestData: Object.keys(requestData).includes('entry') && Object.keys(requestData.entry[0].changes[0].value).includes('messages')
            ? this.maskPersonalInfoReceived(deepCopy(requestData))
            : requestData,
          message,
        }),
        context,
      );

      return;
    }

    this.log(
      JSON.stringify({ correlationId: global.correlationId, message }),
      context,
    );
  };

  errors = (error: string, context: string) => {
    this.error(
      JSON.stringify({ correlationId: global.correlationId, error }),
      context,
    );
  };

  private mask = (info: string): string =>
    '*'.repeat(info.length - 4) + info.substring(info.length - 4);

  private maskPersonalInfoReceived = (data: any): any => {
    console.log(data.entry[0].changes);
    const maskedReceiver = this.mask(
      data.entry[0].changes[0].value.metadata.display_phone_number,
    );
    const maskedSender = this.mask(
      data.entry[0].changes[0].value.messages[0].from,
    );
    return {
      ...data,
      entry: [
        {
          ...data.entry[0],
          changes: [
            {
              ...data.entry[0].changes[0],
              value: {
                ...data.entry[0].changes[0].value,
                metadata: {
                  ...data.entry[0].changes[0].value.metadata,
                  display_phone_number: maskedReceiver,
                },
                contacts: [
                  {
                    ...data.entry[0].changes[0].value.contacts[0],
                    wa_id: maskedReceiver,
                  },
                ],
                messages: [
                  {
                    ...data.entry[0].changes[0].value.messages[0],
                    from: maskedSender,
                  },
                ],
              },
            },
          ],
        },
      ],
    };
  };
}
