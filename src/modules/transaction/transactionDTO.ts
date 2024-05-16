export interface ITransactionDTO {
  value: number;
  type: string;
  description?: string;
  clientId: number;
}