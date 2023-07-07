import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateWaitingCompanyRequestDTO {
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
    example: '11999991234',
  })
  @IsNotEmpty({ message: 'Required field' })
  phoneNumber: string;

  @ApiProperty({
    example: 'Company',
  })
  @IsNotEmpty({ message: 'Required field' })
  companyName: string;
}
