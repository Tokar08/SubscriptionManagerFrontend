import React, { useEffect, useState } from 'react';
import MainNavbar from './components/MainNavbar';
import SubscriptionCard from './components/SubscriptionCard';
import CreateSubscriptionModal from './components/CreateSubscriptionModal';
import { getSubscriptions, initKeycloak, deleteSubscription, getCategories } from './auth/keycloak';
import { Pagination, Button } from '@nextui-org/react';

interface Subscription {
    subscriptionId: string;
    userId: string;
    category: {
        categoryId: string;
        categoryName: string;
    };
    serviceName: string;
    amount: number;
    currency: string;
    nextPaymentDate: string;
}

const App: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [categories, setCategories] = useState<any[]>([]);

    const itemsPerPage = 9;

    useEffect(() => {
        const fetchData = async () => {
            try {
                await initKeycloak();
                const data = await getSubscriptions();
                setSubscriptions(data);
            } catch (error) {
                console.error('Failed to fetch subscriptions:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                setCategories(categoriesData);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleDelete = async (subscriptionId: string) => {
        try {
            await deleteSubscription(subscriptionId);
            setSubscriptions(subscriptions.filter(sub => sub.subscriptionId !== subscriptionId));
        } catch (error) {
            console.error('Failed to delete subscription:', error);
        }
    };

    const handleCreate = () => {
        fetchData();
    };

    const fetchData = async () => {
        try {
            await initKeycloak();
            const data = await getSubscriptions();
            setSubscriptions(data);
        } catch (error) {
            console.error('Failed to fetch subscriptions:', error);
        }
    };

    const totalPages = Math.ceil(subscriptions.length / itemsPerPage);

    const paginatedSubscriptions = subscriptions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="min-h-screen gradient-background">
            <MainNavbar />
            <div className="container mx-auto py-8">
                <Button
                    isIconOnly
                    color="primary"
                    onClick={() => setModalOpen(true)}
                >+</Button>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {paginatedSubscriptions.map(subscription => (
                        <div key={subscription.subscriptionId} className="mx-auto text-center">
                            <SubscriptionCard
                                subscriptionId={subscription.subscriptionId}
                                serviceName={subscription.serviceName}
                                amount={subscription.amount}
                                currency={subscription.currency}
                                nextPaymentDate={subscription.nextPaymentDate}
                                category={subscription.category}
                                onDelete={handleDelete}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-8">
                    <Pagination
                        showControls
                        total={totalPages}
                        initialPage={1}
                        color="secondary"
                        onChange={page => setCurrentPage(page)}
                    />
                </div>
            </div>
            <CreateSubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onCreate={handleCreate}
                categories={categories}
            />
        </div>
    );
};

export default App;