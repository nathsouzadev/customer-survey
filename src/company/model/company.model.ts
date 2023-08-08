export class CompanyModel {
  id: string;
  name: string;
  active: boolean;
  email: string;
  surveys?: Survey[];
  phoneNumbers?: PhoneCompany[];
}

class Survey {
  id: string;
  companyId: string;
  name: string;
  title: string;
}

class PhoneCompany {
  id: string;
  active: boolean;
  phoneNumber: string;
  companyId: string;
  metaId: string;
}
