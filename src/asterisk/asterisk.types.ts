export interface AsteriskRequestBody {
  user: string;
  client: string;
}

export interface IAsteriskService {
  processingCommands: (data: any) => Promise<void>;
}

export type BadFields = Partial<Record<'user' | 'client', string>>;

export interface AsteriskResponse {
  ok: true;
  user: string;
  client: string;
}
