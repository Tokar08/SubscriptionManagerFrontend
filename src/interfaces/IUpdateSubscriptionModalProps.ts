import {ICategory} from "./ICategory";
import {ISubscription} from "./ISubscription";

export interface UpdateSubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
    categories: ICategory[];
    subscription: ISubscription | null;
}