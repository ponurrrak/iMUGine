import React from 'react';
import { NavLink } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';

import styles from './Header.module.scss';

const Component = () => {

  return (
    <div className={styles.root}>
      <AppBar>
        <Container maxWidth='lg'>
          <Toolbar disableGutters>
            <nav className={styles.nav}>
              <Button
                className={styles.link}
                activeClassName={styles.active}
                exact
                component={NavLink}
                to='/'
              >
                Home
              </Button>
              <Button
                className={styles.link}
                activeClassName={styles.active}
                exact
                component={NavLink}
                to='/cart'
              >
                Cart
              </Button>
            </nav>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default Component;
