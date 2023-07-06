import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateSenderRequestDTO {
  @ApiProperty({
    example: 'Sender',
  })
  @IsNotEmpty({ message: 'Required field' })
  name: string;

  @ApiProperty({
    example: 'sender@company.com',
  })
  @IsNotEmpty({ message: 'Required field' })
  @IsEmail({}, { message: 'Inform a valid email' })
  email: string;

  @ApiProperty({
    example: '5e4e10f1-033a-4cf2-8521-c5d5b1ec2a00',
  })
  @IsNotEmpty({ message: 'Required field' })
  companyId: string;
}
