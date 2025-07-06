import RouterComponent from './routes/RouterComponent';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchLocationsEnum } from './features/enums/enumsSlice';

const App = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchLocationsEnum());
    }, [dispatch]);

    return (
        <RouterComponent />
    );
};

export default App;
