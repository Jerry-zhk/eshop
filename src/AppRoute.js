import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from 'prop-types';

const AppRoute = ({
  component: Component,
  redirectTo,
  authorized,
  ...rest
}) => {
  return (
    <Route {...rest} render={
      props =>
        authorized === true ?
          (
            <Component {...props} {...rest} />
          ) :
          (
            <Redirect to={redirectTo} />
          )
    }
    />
  )
}

AppRoute.propTypes = {
  authorized: PropTypes.bool.isRequired,
  redirectTo: PropTypes.string
};

AppRoute.defaultProps = {
  authorized: true,
}



export default AppRoute

