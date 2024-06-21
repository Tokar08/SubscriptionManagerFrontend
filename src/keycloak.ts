import Keycloak, { KeycloakInstance, KeycloakOnLoad } from 'keycloak-js';

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

export const getKeycloak = () => {
    return keycloak;
};
export const getCategories = async () => {
    try {
        const response = await fetch('http://localhost:7878/api/v1/categories');
        if (!response.ok) throw new Error(`Ошибка: ${response.status}`);
        const data = await response.json();
        console.log('Данные категорий:', data);
        return data;
    } catch (error) {
        console.error('Не удалось получить категории:', error);
        throw error;
    }
};

export const getSubscriptions = async () => {
    try {
        const token = keycloak.token;
        console.log('Используемый токен:', token);

        const response = await fetch('http://localhost:7878/api/v1/subscriptions/all', {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Ошибка ответа сервера: ${response.status} - ${errorText}`);
            throw new Error(`Ошибка: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Данные подписок:', data);

        return data;
    } catch (error) {
        console.error('Не удалось получить подписки:', error);
        throw error;
    }
};
