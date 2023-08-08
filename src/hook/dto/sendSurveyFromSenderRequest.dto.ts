import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendSurveyFromSenderRequestDTO {
  @ApiProperty({
    example: '5e4e10f1-033a-4cf2-8521-c5d5b1ec2a00',
  })
  @IsNotEmpty({ message: 'Required field' })
  companyId: string;

  @ApiProperty({
    example: 'sender@company.com',
  })
  @IsNotEmpty({ message: 'Required field' })
  email: string;

  @ApiProperty({
    example: '11999991111',
  })
  @IsNotEmpty({ message: 'Required field' })
  phoneNumber: string;
}
