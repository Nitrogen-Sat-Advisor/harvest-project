import Keycloak from 'keycloak-js';

const keycloak = Keycloak({
    realm: 'harvest',
    url: 'http://localhost:8000/auth',
    clientId: 'harvest'
});

const init = (): void => {
    const token = localStorage.getItem('token') || undefined;
    keycloak.init({ token }).then((isAuthenticated) => {
        if (!isAuthenticated && token) {
            localStorage.removeItem('token');
        }
    });
};

const login = (): void => {
    const resp = keycloak.login({ prompt: 'login' });
    resp.then(() => {
        if (keycloak.token) {
            localStorage.setItem('token', keycloak.token);
        }
    }).catch(console.error);
};

export default {
    init,
    login
};
