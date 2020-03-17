import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './Reducers/rootReducer';

const initialState = {
	things:[],
	balance : 1000,
	pivandrii: [
		{id: '3', title:'guinnes', price:300},
		{id: '4', title: 'krushowice', price:250},
		{id: '5', title: 'bud', price:250},
		{id: '6', title:'garage', price:200},
		{id: '7', title: 'Балтика', price:100},
		{id: '8', title: 'Жигулевское', price:150},
	],
	token: localStorage.getItem('token'),
    isAuthenticated: null,
    isLoading: false,
    user: null,
    totalPrice: 0
};

const middleware = [thunk]

const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;