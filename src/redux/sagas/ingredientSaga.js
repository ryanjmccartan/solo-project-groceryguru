import {put, takeEvery} from 'redux-saga/effects';
import axios from 'axios';

// GET ingredients for specific meal
function* getIngredient(action) {
    try{
        const response = yield axios.get('/meal/' + action.payload);
        console.log('this is getIngredient', response.data);
        yield put({type: 'SET_INGREDIENT', payload: response.data});
    }catch (error) {
        console.log('error with getting ingredient', error);
    }
}

function* getIngredientsByID(action) {
    try{
        const response = yield axios.get(`/meal/list/ingredients/${action.payload}`);
        yield put({type: 'SET_LIST_INGREDIENTS', payload: response.data});
        console.log('list ingredients', response.data);
    }catch(error) {
        console.log('error with getting list ingredients', error)
    }
}; 

function* deleteIngredient(action) {
    try{
        yield axios.delete(`/meal/list/ingredient/${action.payload}`);
        yield put({type: 'GET_INGREDIENTS_BY_ID', payload: action.payload.id})
    }catch(error) {
        console.log('error with deleting ingredient', error);
    }
}


function* ingredientSaga() {
    yield takeEvery('GET_INGREDIENT', getIngredient)
    yield takeEvery('DELETE_INGREDIENT', deleteIngredient)
    yield takeEvery('GET_INGREDIENTS_BY_ID', getIngredientsByID)

}

export default ingredientSaga