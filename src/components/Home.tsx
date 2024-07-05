import React, { useState, useEffect, ChangeEvent } from 'react';
import MainNavbar from './MainNavbar';
import SubscriptionCard from './SubscriptionCard';
import CreateSubscriptionModal from './CreateSubscriptionModal';
import UpdateSubscriptionModal from './UpdateSubscriptionModal';
import { getSubscriptions, initKeycloak, deleteSubscription, getCategories, updateSubscription } from '../auth/keycloak';
import { Pagination, Button, Input, Select, SelectItem } from '@nextui-org/react';
import { ISubscription } from '../interfaces/ISubscription';
import { SearchIcon } from "../icons/SearchIcon";
import { AddSubIcon } from "../icons/AddSubIcon";
import { ICategory } from "../interfaces/ICategory";

const Home: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(() => {
        const savedPage = localStorage.getItem('currentPage');
        return savedPage ? parseInt(savedPage, 10) : 1;
    });
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
    const [selectedSubscription, setSelectedSubscription] = useState<ISubscription | null>(null);
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [searchText, setSearchText] = useState<string>(() => {
        const savedSearchText = localStorage.getItem('searchText');
        return savedSearchText ? savedSearchText : '';
    });
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(() => {
        const savedCategory = localStorage.getItem('selectedCategory');
        return savedCategory ? savedCategory : undefined;
    });

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
                setCategories(categoriesData.sort((a: ICategory, b: ICategory) =>
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

    const storeCurrentPage = (page: number) => {
        localStorage.setItem('currentPage', page.toString());
        setCurrentPage(page);
    };

    const handleCreate = async () => {
        setSubscriptions(await getSubscriptions());
    };

    const handleUpdate = async () => {
        try {
            if (!selectedSubscription) {
                console.error('No subscription selected for update.');
                return;
            }
            setSubscriptions(await getSubscriptions());
            await updateSubscription(selectedSubscription.subscriptionId, selectedSubscription);
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
        localStorage.setItem('searchText', searchText);
    }, [searchText]);

    useEffect(() => {
        if (selectedCategory) {
            localStorage.setItem('selectedCategory', selectedCategory);
        } else {
            localStorage.removeItem('selectedCategory');
        }
    }, [selectedCategory]);

    const filteredSubscriptions = subscriptions.filter(subscription => {
        const matchesSearchText = subscription.serviceName.toLowerCase().includes(searchText.toLowerCase());
        const matchesCategory = selectedCategory ? subscription.category.categoryId === selectedCategory : true;

        return matchesSearchText && matchesCategory;
    });

    if (subscriptions.length === 0) {
        return null;
    }

    const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);
    const paginatedSubscriptions = filteredSubscriptions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="min-h-screen gradient-background">
            <MainNavbar />
            <div className="container mx-auto py-8">
                <div
                    className="flex flex-col md:flex-row justify-between items-center mb-10 mt-5 space-y-4 md:space-y-0 md:space-x-4">
                    <Select
                        placeholder="Sort subscriptions by..."
                        size="lg"
                        fullWidth={false}
                        className="w-full md:w-80"
                        value={selectedCategory || ''}
                        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                            setSelectedCategory(event.target.value);
                        }}
                    >
                        {categories.map(category => (
                            <SelectItem key={category.categoryId} value={category.categoryId} className="dark">
                                {category.categoryName}
                            </SelectItem>
                        ))}
                    </Select>

                    <Input
                        size="lg"
                        isClearable
                        radius="lg"
                        placeholder="Enter to search for subscription..."
                        className="text-lg w-full max-w-md pl-0"
                        startContent={<SearchIcon />}
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                        }}
                        onClear={() => {
                            setSearchText('');
                        }}
                    />

                    <Button
                        variant="ghost"
                        color="success"
                        size="lg"
                        onClick={() => setModalOpen(true)}
                        startContent={<AddSubIcon />}
                        className="w-full md:w-auto"
                    >
                        Create a new subscription
                    </Button>
                </div>

                <hr />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
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
                <hr />
                <div className="flex justify-center mt-8">
                    <Pagination
                        total={totalPages}
                        initialPage={currentPage}
                        onChange={(page) => {
                            storeCurrentPage(page);
                            setCurrentPage(page);
                        }}
                        showControls
                        color="warning"
                        className="dark"
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

export default Home;