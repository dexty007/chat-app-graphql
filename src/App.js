import React, { useState, useEffect } from 'react';
import Main from './components/Main';
import './App.css' ;
import ReactDOM from 'react-dom';
import {Auth0Provider} from "@auth0/auth0-react"

const App = () => {

  return (
  <Auth0Provider
    domain="graphql-chat.us.auth0.com"
    clientId="9QjHQwWEUekr7mhHuRpV24YtrFv1jL3y"
  >
    <Main/>
  </Auth0Provider>
  )
}

export default App;
