import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSurveyRequestDTO {
  @ApiProperty({
    example: '5e4e10f1-033a-4cf2-8521-c5d5b1ec2a00',
  })
  @IsNotEmpty({ message: 'Required field' })
  companyId: string;

  @ApiProperty({
    example: 'Survey',
  })
  @IsNotEmpty({ message: 'Required field' })
  name: string;

  @ApiProperty({
    example: 'Survey Title',
  })
  @IsNotEmpty({ message: 'Required field' })
  title: string;

  @ApiProperty({
    example: [
      {
        question: 'Question 1',
        order: 1,
        answers: [
          {
            answer: 'Bom',
            label: '1',
          },
          {
            answer: 'Regular',
            label: '2',
          },
          {
            answer: 'Ruim',
            label: '3',
          },
        ],
      },
      {
        question: 'Question 2',
        order: 2,
        answers: [
          {
            answer: 'Bom',
            label: '1',
          },
          {
            answer: 'Regular',
            label: '2',
          },
          {
            answer: 'Ruim',
            label: '3',
          },
        ],
      },
    ],
  })
  @IsNotEmpty({ message: 'Required field' })
  questions: Question[];
}

export class Question {
  question: string;
  order: number;
  answers: Answer[];
}

class Answer {
  answer: string;
  label: string;
}
