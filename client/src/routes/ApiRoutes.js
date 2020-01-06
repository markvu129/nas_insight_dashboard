let endPoint = "https://api.hearusnowproject.org/v1/";

let apiRoutes = {};

apiRoutes.signup = endPoint + "auth/register";
apiRoutes.login = endPoint + "auth/login";
apiRoutes.contact = endPoint + 'contact-form';

export default apiRoutes;
