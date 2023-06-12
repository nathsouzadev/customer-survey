import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDTO {
  @ApiProperty({
    example: 'company@email.com',
  })
  email: string;

  @ApiProperty({
    example: 'password',
  })
  password: string;
}
