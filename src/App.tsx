import React, { useEffect, useState } from 'react';
import MainNavbar from './components/MainNavbar';
import SubscriptionCard from '../src/components/SubscriptionCard';
import { getSubscriptions, initKeycloak } from './auth/keycloak';

interface Subscription {
    subscriptionId: string;
    userId: string;
    category: {
        categoryName: string;
    };
    serviceName: string;
    amount: number;
    currency: string;
    nextPaymentDate: string;
}

const App: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await initKeycloak();
                const data = await getSubscriptions();
                setSubscriptions(data);
            } catch (error) {
                console.error('Не удалось получить подписки:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="min-h-screen gradient-background">
            <MainNavbar />
            <div className="container mx-auto py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {subscriptions.map(subscription => (
                        <div key={subscription.subscriptionId} className="mx-auto text-center">
                            <SubscriptionCard
                                serviceName={subscription.serviceName}
                                amount={subscription.amount}
                                currency={subscription.currency}
                                nextPaymentDate={subscription.nextPaymentDate}
                                category={subscription.category}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

};

export default App;
