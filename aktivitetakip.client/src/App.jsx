import { Provider } from 'react-redux';
import store from './app/store';
import RouterComponent from './routes/RouterComponent';

const App = () => {
    return (
        <Provider store={store}>
            <RouterComponent />
        </Provider>
    );
};

export default App;
