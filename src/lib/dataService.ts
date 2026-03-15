// localStorage-based data service

const SITE_SETTINGS_KEY = 'tesla_site_settings';
const PAYMENT_SUBMISSIONS_KEY = 'tesla_payment_submissions';

export interface SiteSettingsRecord {
  id: string;
  [key: string]: string;
}

export interface PaymentSubmissionRecord {
  id: string;
  created_date: string;
  [key: string]: string;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export const SiteSettings = {
  list(): SiteSettingsRecord[] {
    try {
      const data = localStorage.getItem(SITE_SETTINGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  create(data: Record<string, string>): SiteSettingsRecord {
    const record: SiteSettingsRecord = { id: generateId(), ...data };
    const records = SiteSettings.list();
    records.push(record);
    localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(records));
    return record;
  },

  update(id: string, data: Record<string, string>): SiteSettingsRecord {
    const records = SiteSettings.list();
    const idx = records.findIndex(r => r.id === id);
    if (idx >= 0) {
      records[idx] = { ...records[idx], ...data };
      localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(records));
      return records[idx];
    }
    return SiteSettings.create(data);
  },
};

export const PaymentSubmission = {
  list(): PaymentSubmissionRecord[] {
    try {
      const data = localStorage.getItem(PAYMENT_SUBMISSIONS_KEY);
      const records: PaymentSubmissionRecord[] = data ? JSON.parse(data) : [];
      return records.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
    } catch {
      return [];
    }
  },

  create(data: Record<string, string>): PaymentSubmissionRecord {
    const record: PaymentSubmissionRecord = {
      id: generateId(),
      created_date: new Date().toISOString(),
      ...data,
    };
    const records = PaymentSubmission.list();
    records.push(record);
    localStorage.setItem(PAYMENT_SUBMISSIONS_KEY, JSON.stringify(records));
    return record;
  },

  update(id: string, data: Record<string, string>): PaymentSubmissionRecord | null {
    const rawData = localStorage.getItem(PAYMENT_SUBMISSIONS_KEY);
    const records: PaymentSubmissionRecord[] = rawData ? JSON.parse(rawData) : [];
    const idx = records.findIndex(r => r.id === id);
    if (idx >= 0) {
      records[idx] = { ...records[idx], ...data };
      localStorage.setItem(PAYMENT_SUBMISSIONS_KEY, JSON.stringify(records));
      return records[idx];
    }
    return null;
  },
};

// File upload - converts to base64 data URL (works without any backend)
export async function uploadFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
