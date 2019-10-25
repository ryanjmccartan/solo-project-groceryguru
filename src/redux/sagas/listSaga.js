import {put, takeEvery} from 'redux-saga/effects';
import axios from 'axios';

function* postList(action) {
    console.log(action.payload);
    try{
        yield axios.post('/meal/list', action.payload);
        yield getList();
    }catch (error) {
        console.log('error with posting list', error)
    }
}

function* postIngredientsFromList(action){
    console.log('posting from list', action.payload)
    try{
        yield axios.post('meal/fromlist', action.payload);

    }catch(error) {
        console.log('error with posting new ingredients', error);
    }
}

// GET specific list
function* getListByID(action){
    try{
        const response = yield axios.get('/meal/list/' + action.payload);
        yield put({type: 'SET_SINGLE_LIST', payload: response.data});
        console.log('getList', response.data);
    }catch (error) {
        console.log('error with getting list', error);
    }
}

function* getList(){
    try{
        const response = yield axios.get('/meal/list');
        yield put({type: 'SET_LIST', payload: response.data});
        console.log('getList', response.data);
    }catch (error) {
        console.log('error with getting list', error);
    }
}

// function* postMealID(action){
//     try{

//         // yield put({type: "SET_MEAL_ID", payload: action.payload})
//     }catch(err){
//         console.log(err);  
//     }
// }

function* listSaga() {
    yield takeEvery('POST_LIST', postList)
    yield takeEvery('GET_LIST', getList)
    yield takeEvery('GET_LIST_BY_ID', getListByID)
    yield takeEvery('POST_INGREDIENTS_FROM_LIST', postIngredientsFromList)
    // yield takeEvery("POST_MEAL_ID", postMealID)
}

export default listSaga;