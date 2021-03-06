import { GET_ERRORS , SET_CURRENT_USER} from './type'
import setAuthToken from '../utils/setAuthToken'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

//Register user
export const registerUser = (userData,history) => dispatch => {
    
    axios
    .post('/api/users/register',userData)
    .then(res=>
       history.push('/')
      
        )
    .catch(err=>
        dispatch({
            type:GET_ERRORS,
            payload:err.response.data
        })
        );
};

// Login - Get user token
export const loginUser = userData => dispatch =>{
    axios.post('/api/users/login' , userData)
    .then(res =>
        {
            //save to local storage
            const {token} = res.data;
            //Set token to ocal storage
            localStorage.setItem('jwtToken', token);

            //set token to auth header
            setAuthToken(token);
            //Decode token to get user data

            const decoded = jwt_decode(token);
            //set current user
            dispatch(setCurrentUser(decoded));

        })
    .catch(err => dispatch({
        type:GET_ERRORS,
        payload:err.response.data
    }))
}

//set logged in user

export const setCurrentUser = (decoded) =>{
    return{
        type : SET_CURRENT_USER,
        payload : decoded
    }
}