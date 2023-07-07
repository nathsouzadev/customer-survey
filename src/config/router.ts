import { WaitingListModule } from '../waitingList/waitingList.module';
import { AuthModule } from '../auth/auth.module';
import { CompanyModule } from '../company/company.module';
import { CustomerModule } from '../customer/customer.module';
import { HookModule } from '../hook/hook.module';
import { SenderModule } from '../sender/sender.module';
import { SurveyModule } from '../survey/survey.module';

export const router = [
  {
    path: 'meta',
    module: HookModule,
  },
  {
    path: 'login',
    module: AuthModule,
  },
  {
    path: 'company',
    module: CompanyModule,
    children: [
      {
        path: 'survey',
        module: SurveyModule,
      },
      {
        path: 'customer',
        module: CustomerModule,
      },
      {
        path: 'sender',
        module: SenderModule,
      },
    ],
  },
  {
    path: 'waiting-list',
    module: WaitingListModule,
  },
];
