import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import App from './App';
import theme from './theme';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
  ApolloLink,
  from,
} from '@apollo/client';
import { AUTH } from './utils';
import { assoc } from 'ramda';

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }) => {
    const token = localStorage.getItem(AUTH.token);
    return { headers: token ? assoc('authorization', token, headers) : headers };
  });
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: `http://localhost:4000`,
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  //uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </ApolloProvider>
  </React.StrictMode>
);
