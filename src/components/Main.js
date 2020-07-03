import { ApolloConsumer, ApolloProvider } from 'react-apollo';
import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import Mid from './Mid';
import '../App.css';
import LoginBtn from './Loginbtn'
import {useAuth0} from "@auth0/auth0-react"
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

//const GRAPHQL_ENDPOINT = "https://check-chat.herokuapp.com/v1/graphql/";
const GRAPHQL_ENDPOINT = "https://check-chat.herokuapp.com/v1/graphql";
// const httpurl = "https://check-chat.herokuapp.com/v1/graphql/";

export default function Main(props) {
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [ accessToken, setAccessToken ] = useState("");

  if (!isAuthenticated)
    return <LoginBtn/>

    

    // Make WebSocketLink with appropriate url
    const mkWsLink = (uri) => {
      const splitUri = uri.split('//');
      const subClient = new SubscriptionClient(
        'wss://' + splitUri[1],
        { reconnect: true }
      );
      return new WebSocketLink(subClient);
    }
    
    // Makle HttpLink
    const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT });
    const wsLink = mkWsLink(GRAPHQL_ENDPOINT);
    const link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      httpLink
    );
    
    // Instantiate client
    const client = new ApolloClient({
      link,
      cache: new InMemoryCache({
        addTypename: false
      })
    })
    

  // console.log(user.sub);
  // console.log(user.sub);
  // console.log(user.sub);
  return (
    <div className="app">
      <ApolloProvider client={client}>
        <Mid
          userSub={user.sub}
        />
      </ApolloProvider>
    </div>
  )
};


