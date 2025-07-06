import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from '../features/events/eventsSlice';
import usersReducer from '../features/users/usersSlice';
import authReducer from '../features/auth/authSlice';
import firmReducer from '../features/firm/firmsSlice';
import projectReducer from '../features/project/projectSlice';
import categoryReducer from '../features/categories/categoriesSlice';
import enumReducer from '../features/enums/enumsSlice';

const store = configureStore({
    reducer: {
        events: eventsReducer,
        users: usersReducer,
        auth: authReducer,
        firm: firmReducer,
        project: projectReducer,
        categories: categoryReducer,
        enums: enumReducer,
    },
});

export default store;
