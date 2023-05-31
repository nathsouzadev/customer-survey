import { HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    process.env.npm_package_version = '0.0.1';
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn().mockImplementation(() => Promise.resolve({
              status: 'ok',
              info: {
                database: {
                  status: 'up'
                }
              },
              error: {},
              details: {
                database: {
                  status: 'up'
                }
              }
            }))
          },
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: {}
        }
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be send a message with app status', async() => {
    const response = await controller.health();
    expect(response).toMatchObject({
      status: 'ok',
      info: {
        database: {
          status: 'up'
        }
      },
      error: {},
      details: {
        database: {
          status: 'up'
        }
      }
    });
  });
});
