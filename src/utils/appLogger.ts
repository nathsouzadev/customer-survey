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
          requestData: Object.keys(requestData).includes('WaId')
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
    const maskedWaid = this.mask(data.WaId);
    return {
      ...data,
      WaId: maskedWaid,
      ProfileName: this.mask(data.ProfileName),
      From: `whatsapp:+${maskedWaid}`,
      To: `whatsapp:+${this.mask(data.To.slice(10))}`,
    };
  };
}
