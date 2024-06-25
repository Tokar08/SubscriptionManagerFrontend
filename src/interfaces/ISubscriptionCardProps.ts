import { ICategory } from './ICategory';

export interface ISubscriptionCardProps {
    subscriptionId: string;
    serviceName: string;
    amount: number;
    currency: string;
    nextPaymentDate: string;
    category: ICategory;
    onDelete: (subscriptionId: string) => Promise<void>;
    onUpdate: () => Promise<void>;
}
