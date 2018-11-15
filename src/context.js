import React from 'react';

const { Provider, Consumer } = React.createContext();

const withContext = Component => {
  return props => (
    <Consumer>{value => <Component {...value} {...props} />}</Consumer>
  )
}

export { Provider, Consumer, withContext };
