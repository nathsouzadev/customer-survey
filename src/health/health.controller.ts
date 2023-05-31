import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly healtCheckService: HealthCheckService,
    private typeOrmHealthIndicator: TypeOrmHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  async health() {
    return this.healtCheckService.check([
      () => this.typeOrmHealthIndicator.pingCheck('database')
    ])
  }
}
