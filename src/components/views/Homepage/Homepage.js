import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { getProducts, getProductsStatus, fetchProducts } from '../../../redux/productsRedux.js';

import styles from './Homepage.module.scss';

import Loading from '../../features/Loading/Loading.js';

const Component = ({ allProducts, loadingStatus, loadAllProducts }) => {

  useEffect(() => {
    loadAllProducts();
  }, [loadAllProducts]);

  if(loadingStatus.active){
    return (
      <Loading/>
    );
  } else if(loadingStatus.error) {
    return (
      <Loading errorMessage={loadingStatus.error}/>
    );
  } else {
    return (
      <Paper className={styles.root}>
        <List>
          {allProducts.map(product => (
            <ListItem
              key={product._id}
              button={true}
              component={Link}
              to={'/product/' + product._id}
            >
              <ListItemText
                primary={product.title}
                secondary={product.description}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }
};

Component.propTypes = {
  allProducts: PropTypes.array,
  loadingStatus: PropTypes.object,
  loadAllProducts: PropTypes.func,
};

const mapStateToProps = state => ({
  allProducts: getProducts(state),
  loadingStatus: getProductsStatus(state),
});

const mapDispatchToProps = dispatch => ({
  loadAllProducts: () => dispatch(fetchProducts()),
});

const ComponentContainer = connect(mapStateToProps, mapDispatchToProps)(Component);

export default ComponentContainer;
