import React, { useState, useEffect } from 'react';
import MainNavbar from './components/MainNavbar';
import SubscriptionCard from './components/SubscriptionCard';
import CreateSubscriptionModal from './components/CreateSubscriptionModal';
import UpdateSubscriptionModal from './components/UpdateSubscriptionModal';
import { getSubscriptions, initKeycloak, deleteSubscription, getCategories, updateSubscription } from './auth/keycloak';
import { Pagination, Button, Input } from '@nextui-org/react';
import { ISubscription } from './interfaces/ISubscription';
import { SearchIcon } from "./icons/SearchIcon";

const App: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(() => {
        const savedPage = localStorage.getItem('currentPage');
        return savedPage ? parseInt(savedPage, 10) : 1;
    });
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
    const [selectedSubscription, setSelectedSubscription] = useState<ISubscription | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [searchText, setSearchText] = useState<string>('');

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
                setCategories(categoriesData.sort((a: { categoryName: string; }, b: { categoryName: any; }) =>
                    a.categoryName.localeCompare(b.categoryName)));
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

    const fetchData = async () => {
        try {
            await initKeycloak();
            const data = await getSubscriptions();
            setSubscriptions(data);
        } catch (error) {
            console.error('Failed to fetch subscriptions:', error);
        }
    };

    const storeCurrentPage = (page: number) => {
        localStorage.setItem('currentPage', page.toString());
        setCurrentPage(page);
    };

    const handleCreate = async () => {
        await fetchData();
    };

    const handleUpdate = async () => {
        try {
            if (!selectedSubscription) {
                console.error('No subscription selected for update.');
                return;
            }

            await updateSubscription(selectedSubscription.subscriptionId, selectedSubscription);
            await fetchData();
            setUpdateModalOpen(false);
        } catch (error) {
            console.error('Failed to update subscription:', error);
        }
    };

    const openUpdateModal = (subscription: ISubscription): Promise<void> => {
        return new Promise<void>((resolve) => {
            setSelectedSubscription(subscription);
            setUpdateModalOpen(true);
            resolve();
        });
    };

    useEffect(() => {
        const savedSearchText = localStorage.getItem('searchText');
        if (savedSearchText) {
            setSearchText(savedSearchText);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('searchText', searchText);
    }, [searchText]);

    const filteredSubscriptions = subscriptions.filter(subscription =>
        subscription.serviceName.toLowerCase().includes(searchText.toLowerCase())
    );

    if (subscriptions.length === 0) {
        return null;
    }

    const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

    const paginatedSubscriptions = filteredSubscriptions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="min-h-screen gradient-background">
            <MainNavbar/>
            <div className="container mx-auto py-8">
                <div className="flex justify-end mb-4">
                    <Button
                        variant="ghost"
                        color="success"
                        onClick={() => setModalOpen(true)}
                    >
                        Create new subscription
                    </Button>
                </div>

                <div className="flex justify-center mb-16 mt-0">
                    <Input
                        size="lg"
                        isClearable
                        radius="lg"
                        placeholder="Type to search subscription..."
                        className="text-lg max-w-xl w-full"
                        startContent={<SearchIcon/>}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onClear={() => setSearchText('')}
                    />
                </div>

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
                                onUpdate={() => openUpdateModal(subscription)}
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-8">
                    <Pagination
                        total={totalPages}
                        initialPage={currentPage}
                        onChange={(page) => {
                            storeCurrentPage(page);
                            setCurrentPage(page);
                        }}
                        showControls
                        color="secondary"
                    />
                </div>
            </div>

            <CreateSubscriptionModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onCreate={handleCreate}
                categories={categories}
            />

            {selectedSubscription && (
                <UpdateSubscriptionModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setUpdateModalOpen(false)}
                    onUpdate={handleUpdate}
                    categories={categories}
                    subscription={selectedSubscription}
                />
            )}
        </div>
    );
};

export default App;
