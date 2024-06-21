import React, { useEffect, useState } from 'react';
import { getCategories, getSubscriptions, initKeycloak } from './keycloak';

const App: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [subscriptions, setSubscriptions] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await initKeycloak();

                const categoriesData = await getCategories();
                setCategories(categoriesData);

                const subscriptionsData = await getSubscriptions();
                setSubscriptions(subscriptionsData);
            } catch (error) {
                console.error('Ошибка при получении данных:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Категории</h1>
            <ul>
                {categories.map(category => (
                    <li key={category.categoryId}>{category.categoryName}</li>
                ))}
            </ul>

            <h1>Подписки</h1>
            <ul>
                {subscriptions.map(subscription => (
                    <li key={subscription.subscriptionId}>{subscription.serviceName}</li>
                ))}
            </ul>
        </div>
    );
};

export default App;
