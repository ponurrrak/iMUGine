import React from 'react';
import PropTypes from 'prop-types';

import Container from '@material-ui/core/Container';
import Toolbar from '@material-ui/core/Toolbar';

import styles from './MainLayout.module.scss';

import Header from '../Header/Header.js';

const Component = ({children}) => (
  <div className={styles.root}>
    <Header/>
    <Container>
      <Toolbar className={styles.toolbar}/>
      {children}
    </Container>
  </div>
);

Component.propTypes = {
  children: PropTypes.node,
};

export default Component;
