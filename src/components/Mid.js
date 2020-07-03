import { ApolloConsumer } from 'react-apollo';
import Chat from './Chat';
import Login from './Login';
import React, { useState, useEffect } from 'react';
import '../App.css';
import {useAuth0} from "@auth0/auth0-react"

export default function Mid(props) {
    // const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ username, setUsername] = useState("");
    
    // console.log(props.userSub);
    // console.log(username);
    // console.log("~~~~~~~~~~");
  // set username
     return (
      <div className="app">
        {
          !isLoggedIn ? (
            <Login
              userId={props.userSub}
              userName={username}
              setUsername={setUsername}
              setIsLoggedIn={setIsLoggedIn}
            />
          ) : (
            <ApolloConsumer>
                {
                    (client) => {
                    return (
                        <Chat
                            userId={props.userSub}
                            username={username}
                            client={client}
                        />
                    );
                    }
                }
            </ApolloConsumer>
          )
        }
      </div>
    )
 
};


