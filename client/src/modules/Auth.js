class Auth {

    /**
     * Authenticate a user. Save the user data in session Storage
     *
     * @param {string} userData
     * @param {string} accessToken
     */
    static authenticateUser(userData, accessToken) {
        sessionStorage.setItem('userData', JSON.stringify(userData));
        sessionStorage.setItem('accessToken', accessToken);

    }

    /**
     * Check if a user is authenticated - check if a token is saved in session Storage
     *
     * @returns {boolean}
     */
    static isUserAuthenticated() {
        return sessionStorage.getItem('accessToken') !== null;

    }


    static getUserData() {
        return JSON.parse(sessionStorage.getItem('userData'));
    }

    /**
     * Deauthenticate a user. Remove a token from session Storage.
     *
     */
    static deauthenticateUser() {
        sessionStorage.removeItem('userData');
        sessionStorage.removeItem('accessToken');
    }
}

export default Auth;
