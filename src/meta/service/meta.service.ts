import { Injectable } from '@nestjs/common';

@Injectable()
export class MetaService {
  findAll() {
    return `This action returns all meta`;
  }
}
