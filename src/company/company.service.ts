import { Injectable } from '@nestjs/common';

@Injectable()
export class CompanyService {
  findAll() {
    return `This action returns all company`;
  }
}
