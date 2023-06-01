import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateCompanyRequestDTO {
  @IsNotEmpty({ message: 'Required field' })
  name: string;

  @IsNotEmpty({ message: 'Required field' })
  @IsEmail({}, { message: 'Inform a valid email' })
  email: string;
}
