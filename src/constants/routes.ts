export enum AppRoute {
    LANDING = '/',
    HOME = '/courses',
    LOGIN = '/login',
    SIGNUP = '/signup',
    PROFILE = '/profile',
    COMPLETE_PROFILE = '/complete',
    RATING = '/courses/:id/ratings',
    SWAGGER = '/docs',
    COURSE = '/courses/:id',
    FORUM = '/forums/:id',
    NOTIFICATIONS = '/notifications',
    NOTIFICATION = '/notifications/:id',
    NOT_FOUND = '*'
}