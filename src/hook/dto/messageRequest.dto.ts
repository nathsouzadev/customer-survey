import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MessageRequest {
  MediaContentType0?: string;

  @ApiProperty({
    example: 'SMba82e029e2ba3f080b2d49c0c0328eff',
  })
  @IsNotEmpty({ message: 'Required field' })
  SmsMessageSid: string;

  @ApiProperty({
    example: '0',
  })
  @IsNotEmpty({ message: 'Required field' })
  NumMedia: string;

  @ApiProperty({
    example: 'Ada Lovelace',
  })
  @IsNotEmpty({ message: 'Required field' })
  ProfileName: string;

  @ApiProperty({
    example: 'SMba83e029e2ba3f080b2d49c0c03',
  })
  @IsNotEmpty({ message: 'Required field' })
  SmsSid: string;

  @ApiProperty({
    example: '5511988885555',
  })
  @IsNotEmpty({ message: 'Required field' })
  WaId: string;

  @ApiProperty({
    example: 'received',
  })
  @IsNotEmpty({ message: 'Required field' })
  SmsStatus: string;

  @ApiProperty({
    example: 'Message content',
  })
  @IsNotEmpty({ message: 'Required field' })
  Body: string;

  @ApiProperty({
    example: 'whatsapp:+12345678900',
  })
  @IsNotEmpty({ message: 'Required field' })
  To: string;

  @ApiProperty({
    example: '1',
  })
  @IsNotEmpty({ message: 'Required field' })
  NumSegments: string;

  @ApiProperty({
    example: '0',
  })
  @IsNotEmpty({ message: 'Required field' })
  ReferralNumMedia: string;

  @ApiProperty({
    example: 'SMba83e029e2ba3f080b2d49c0c03',
  })
  @IsNotEmpty({ message: 'Required field' })
  MessageSid: string;

  @ApiProperty({
    example: '50M34c01quertacggd9876',
  })
  @IsNotEmpty({ message: 'Required field' })
  AccountSid: string;

  @ApiProperty({
    example: 'whatsapp:+5511988885555',
  })
  @IsNotEmpty({ message: 'Required field' })
  From: string;

  MediaUrl0?: string;

  @ApiProperty({
    example: '2010-04-01',
  })
  @IsNotEmpty({ message: 'Required field' })
  ApiVersion: string;
}
