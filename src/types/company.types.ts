export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo?: string;
  industry?: string;
  size?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyMember {
  id: string;
  userId: string;
  companyId: string;
  role: string;
  joinedAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface CompanySettings {
  allowGuestUploads: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  storageQuota: number;
  customBranding?: {
    logo?: string;
    colors?: {
      primary?: string;
      secondary?: string;
    };
  };
  notifications?: {
    email?: boolean;
    push?: boolean;
    webhook?: string;
  };
  security?: {
    requireApproval: boolean;
    passwordProtected: boolean;
    expirationDays?: number;
  };
}

export interface CreateCompanyData {
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
}

export interface UpdateCompanyData extends Partial<CreateCompanyData> {}