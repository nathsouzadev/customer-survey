import { IsNotEmpty } from 'class-validator';

export class MessageRequest {
  MediaContentType0?: string;

  @IsNotEmpty({ message: 'Required field' })
  SmsMessageSid: string;

  @IsNotEmpty({ message: 'Required field' })
  NumMedia: string;

  @IsNotEmpty({ message: 'Required field' })
  ProfileName: string;

  @IsNotEmpty({ message: 'Required field' })
  SmsSid: string;

  @IsNotEmpty({ message: 'Required field' })
  WaId: string;

  @IsNotEmpty({ message: 'Required field' })
  SmsStatus: string;

  @IsNotEmpty({ message: 'Required field' })
  Body: string;

  @IsNotEmpty({ message: 'Required field' })
  To: string;

  @IsNotEmpty({ message: 'Required field' })
  NumSegments: string;

  @IsNotEmpty({ message: 'Required field' })
  ReferralNumMedia: string;

  @IsNotEmpty({ message: 'Required field' })
  MessageSid: string;

  @IsNotEmpty({ message: 'Required field' })
  AccountSid: string;

  @IsNotEmpty({ message: 'Required field' })
  From: string;

  MediaUrl0?: string;

  @IsNotEmpty({ message: 'Required field' })
  ApiVersion: string;
}
