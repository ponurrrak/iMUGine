import Axios from 'axios';
import settings from '../settings';

/* selectors */
export const getCurrentProduct = ({currentProduct}) => currentProduct.data;
export const getCurrentProductStatus = ({currentProduct}) => currentProduct.loading;

/* action name creator */
const reducerName = 'currentProduct';
const createActionName = name => `app/${reducerName}/${name}`;

/* action types */
const FETCH_START = createActionName('FETCH_START');
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS');
const FETCH_ERROR = createActionName('FETCH_ERROR');
const CLEAR_DATA = createActionName('CLEAR_DATA');

/* action creators */
export const fetchStarted = payload => ({ payload, type: FETCH_START });
export const fetchSuccess = payload => ({ payload, type: FETCH_SUCCESS });
export const fetchError = payload => ({ payload, type: FETCH_ERROR });
export const clearData = payload => ({ payload, type: CLEAR_DATA });

/* thunk creators */
export const fetchCurrentProduct = productId => {
  return (dispatch, getState) => {
    dispatch(fetchStarted());
    Axios
      .get(`${settings.api.url}/${settings.api.endpoints.product}/${productId}`)
      .then(res => {
        dispatch(fetchSuccess(res.data));
      })
      .catch(err => {
        dispatch(fetchError((err.response && err.response.data && err.response.data.message) || err.message || true));
      });
  };
};

/* reducer */
export const reducer = (statePart = {}, action = {}) => {
  switch (action.type) {
    case FETCH_START: {
      return {
        ...statePart,
        loading: {
          active: true,
          error: false,
        },
      };
    }
    case FETCH_SUCCESS: {
      return {
        loading: {
          active: false,
          error: false,
        },
        data: action.payload,
      };
    }
    case FETCH_ERROR: {
      return {
        ...statePart,
        loading: {
          active: false,
          error: action.payload,
        },
      };
    }
    case CLEAR_DATA: {
      return {
        loading: {
          active: false,
          error: false,
        },
        data: {},
      };
    }
    default:
      return statePart;
  }
};
