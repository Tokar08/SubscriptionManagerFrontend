import Keycloak, { KeycloakInstance, KeycloakOnLoad } from 'keycloak-js';
import axios from 'axios';

const initOptions = {
    url: 'http://localhost:8081',
    realm: 'subscription-manager',
    clientId: 'subscription-manager',
    onLoad: 'login-required' as KeycloakOnLoad
};

const keycloak: KeycloakInstance = new Keycloak(initOptions);

export const initKeycloak = () => {
    return new Promise((resolve, reject) => {
        keycloak.init({
            onLoad: 'login-required',
        }).then((authenticated) => {
            if (authenticated) {
                console.log("Аутентификация успешна");
                console.log("Используемый токен:", keycloak.token);
                resolve(keycloak);
            } else {
                reject(new Error('Аутентификация не удалась'));
            }
        }).catch((error) => {
            reject(error);
        });
    });
};

export const getKeycloak = () => keycloak;

export const getCategories = async () => {
    try {
        const response = await fetch('http://localhost:7878/api/v1/categories');
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        console.log('Categories data:', data);
        return data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw error;
    }
};

export const getSubscriptions = async () => {
    try {
        const token = keycloak.token;
        console.log('Used token:', token);

        const response = await fetch('http://localhost:7878/api/v1/subscriptions', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Server response error: ${response.status} - ${errorText}`);
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Subscriptions data:', data);

        return data;
    } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
        throw error;
    }
};

export const createSubscription = async (subscription: any) => {
    try {
        const token = keycloak.token;

        if (!token) {
            throw new Error('Keycloak token is missing.');
        }

        console.log('Отправка запроса на создание подписки с данными:', JSON.stringify(subscription, null, 2));

        const response = await axios.post('http://localhost:7878/api/v1/subscriptions', subscription, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Подписка успешно создана', response.data);
        return true;
    } catch (error: any) {
        if (error.response) {
            console.error('Ошибка сервера:', error.response.data);
        } else {
            console.error('Ошибка запроса:', error.message);
        }
        throw error;
    }
};

export const updateSubscription = async (subscriptionId: string, updatedSubscription: any) => {
    try {
        const token = keycloak.token;

        if (!token) {
            throw new Error('Keycloak token is missing.');
        }

        console.log('Отправка запроса на обновление подписки с данными:', JSON.stringify(updatedSubscription, null, 2));

        const response = await axios.put(`http://localhost:7878/api/v1/subscriptions/${subscriptionId}`, updatedSubscription, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Подписка успешно обновлена', response.data);
        return true;
    } catch (error: any) {
        if (error.response) {
            console.error('Ошибка сервера:', error.response.data);
        } else {
            console.error('Ошибка запроса:', error.message);
        }
        throw error;
    }
};

export const deleteSubscription = async (subscriptionId: string) => {
    try {
        const token = keycloak.token;
        console.log('Used token:', token);

        const response = await fetch(`http://localhost:7878/api/v1/subscriptions/${subscriptionId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Server response error: ${response.status} - ${errorText}`);
            throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        console.log('Subscription successfully deleted');
        return true;
    } catch (error) {
        console.error('Failed to delete subscription:', error);
        throw error;
    }
};
