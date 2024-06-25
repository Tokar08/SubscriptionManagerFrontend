import { ICategory } from './ICategory';

export interface ISubscription {
    subscriptionId: string;
    serviceName: string;
    amount: number;
    currency: string;
    nextPaymentDate: string;
    category: ICategory;
}
