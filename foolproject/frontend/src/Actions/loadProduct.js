import axios from 'axios';

// GET HEROES
export const getProduct = () => dispatch => {
    axios
        .get('/api/product/')
        .then(res => {
            dispatch({
                type: 'GET_PRODUCT',
                payload: res.data
            });
        })
        .catch(err => console.log(err));
}