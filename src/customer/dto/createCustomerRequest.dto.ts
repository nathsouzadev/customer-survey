import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCustomerRequestDTO {
  @ApiProperty({
    example: 'Customer',
  })
  @IsNotEmpty({ message: 'Required field' })
  name: string;

  @ApiProperty({
    example: '5511999992224',
  })
  @IsNotEmpty({ message: 'Required field' })
  phoneNumber: string;

  @ApiProperty({
    example: '5e4e10f1-033a-4cf2-8521-c5d5b1ec2a00',
  })
  @IsNotEmpty({ message: 'Required field' })
  companyId: string;
}
