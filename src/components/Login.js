import React from 'react';
import '../App.css';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag'
import {useAuth0} from "@auth0/auth0-react"


const addUser = gql`
mutation ($user_id: String!, $user_name: String!) {
  insert_users(objects: {user_id: $user_id, username: $user_name}, on_conflict: {constraint: users_pkey, update_columns: username, where: {user_id: {_eq: $user_id}, _and: {username: {_eq: $user_name}}}}) {
    affected_rows
    returning {
      username
    }
  }
}

`;

// const checkUser = gql`
// mutation ($userName: String!) {
//   update_user(
//     _set: {
//       username: $userName}, 
//     where: {
//       username: {
//         _eq: $userName}
//     }
//   ) {
//     affected_rows
//     returning {
//       id
//     }
//   }
// }
// `;

const LoginComponent = (props) => {
  
  // console.log(userId);
  // console.log(userName);

  return (
    <div className="loginWrapper">
      <h2 className="loginHeading"> ChatBox </h2>
      <div className="login">
        
        <Mutation
          mutation={addUser}
          variables={{
            user_id: props.userId,
            user_name: props.userName
          }}
          onCompleted={(data) => {
            if(data.insert_users.returning.length != 0 )
            {
              props.setUsername(data.insert_users.returning[0].username);
              props.setIsLoggedIn(true);
            }
          }}
          onError={() => {
            props.setUsername('');
          }}
        >
          {
            (insert_user, { data, error, loading}) => {
              if (loading) { return "Loading"; }
              let errorMessage = "";
              let flag=0;
              console.log("data", data);
              if(data) {
                if(data.insert_users.returning.length == 0 ) {
                  flag=1;
                  errorMessage = <div className="errorMessage"> Wrong username </div>;
                }else{
                  flag = 0;
                }
              }else{
                flag = 0;
              }
              console.log("errorMessage", errorMessage);
              errorMessage = error ? 
                  <div className="errorMessage"> Try again with a different username </div> :
                  null;
              return (
                <div>
                  {
                    flag==1 ?
                      <div className="errorMessage"> Wrong username </div>
                    :null
                  }
                  { errorMessage }
                  <form>
                    <input
                      type="text"
                      id="username"
                      className="loginTextbox"
                      placeholder="Username"
                      autoFocus={true}
                      value={props.userName}
                      onChange={(e) => props.setUsername(e.target.value)}
                    />
                    <br></br>
                    <br></br>
                    <br></br>
                    <button
                      className="loginButton"
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        if (props.userName.match(/^[a-z0-9_-]{3,15}$/g)) {
                          //console.log(props.password);
                          insert_user();
                        } else {
                          alert("Invalid username/password. Spaces and special characters not allowed. Please try again");
                        }
                      }}
                    >
                    Login
                    </button>
                  </form>
                </div>
              );
            }
          }
        </Mutation>
      </div>
    </div>
  );
};

export default LoginComponent;
