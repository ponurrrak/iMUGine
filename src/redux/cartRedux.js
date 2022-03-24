import Axios from 'axios';
import settings from '../settings';

/* selectors */
export const getCart = ({cart}) => cart.data;
export const getCartStatus = ({cart}) => cart.loading;

/* action name creator */
const reducerName = 'cart';
const createActionName = name => `app/${reducerName}/${name}`;

/* action types */
const FETCH_START = createActionName('FETCH_START');
const FETCH_SUCCESS = createActionName('FETCH_SUCCESS');
const FETCH_ERROR = createActionName('FETCH_ERROR');

/* action creators */
export const fetchStarted = payload => ({ payload, type: FETCH_START });
export const fetchSuccess = payload => ({ payload, type: FETCH_SUCCESS });
export const fetchError = payload => ({ payload, type: FETCH_ERROR });

/* thunks */
const prepareCartForRedux = payload => {
  const products = payload.products.map(cartItem => ({
    ...cartItem,
    count: Number(cartItem.count),
  }));
  return ({
    ...payload,
    products,
  });
};

const prepareCartItemForRedux = (payload, state) => {
  let newItem = true;
  const dataToReturn = {
    ...state,
    products: [],
  };
  payload = {
    ...payload,
    count: Number(payload.count),
  };
  state.products.forEach(cartItem => {
    if(cartItem.product === payload.product) {
      newItem = false;
      if(payload.count > 0){
        dataToReturn.products.push(payload);
      }
    } else {
      dataToReturn.products.push({...cartItem});
    }
  });
  if(newItem) {
    dataToReturn.products.push(payload);
  }
  return dataToReturn;
};

const prepareCartStatusForRedux = (payload, state) => {
  return ({
    products: state.products.map(cartItem => ({
      ...cartItem,
    })),
    closed: payload.closed,
  });
};

const processCart = (method, endpoint, requestBody, callback) => {
  return async (dispatch, getState) => {
    dispatch(fetchStarted());
    let res;
    try {
      if(requestBody) {
        res = await Axios[method](`${settings.api.url}/${endpoint}`, requestBody);
      } else {
        res = await Axios[method](`${settings.api.url}/${endpoint}`);
      }
      const data = callback(res.data, getCart(getState()));
      dispatch(fetchSuccess(data));
    } catch(err) {
      dispatch(fetchError((err.response && err.response.data && err.response.data.message) || err.message || true));
    }
  };
};

export const fetchCart = () => (
  processCart('get', settings.api.endpoints.cart, null, prepareCartForRedux)
);

export const initCart = cartItem => (
  processCart('post', settings.api.endpoints.cart, cartItem, prepareCartItemForRedux)
);

export const changeCart = cartItem => (
  processCart('put', settings.api.endpoints.cart, cartItem, prepareCartItemForRedux)
);

export const fetchCartStatus = () => (
  processCart('get', settings.api.endpoints.cartStatus, null, prepareCartStatusForRedux)
);

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
    default:
      return statePart;
  }
};
