import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCompanyRequestDTO {
  @ApiProperty({
    example: 'Company',
  })
  @IsNotEmpty({ message: 'Required field' })
  name: string;

  @ApiProperty({
    example: 'company@email.com',
  })
  @IsNotEmpty({ message: 'Required field' })
  @IsEmail({}, { message: 'Inform a valid email' })
  email: string;

  @ApiProperty({
    example: 'password',
  })
  @IsNotEmpty({ message: 'Required field' })
  password: string;
}
