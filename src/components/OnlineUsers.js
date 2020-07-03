import React from 'react';
import { Subscription } from 'react-apollo';
import moment from 'moment';
import gql from 'graphql-tag';

const fetchOnlineUsersSubscription = gql`
  subscription {
    users_online(order_by: {username: asc}) {
      user_id
      username
    }
  }
`;

class OnlineUsers extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      time: moment().subtract(10, 'seconds').format(),
      refetch: null
    }

    // var array = [1,2,3,4];
    // var array2 = [5,6];

    // var array3 = [...array, ...array2];
    //thenetninja
  }

  render() {
    return (
      <div className="onlineUsers">
        <Subscription
          subscription={fetchOnlineUsersSubscription}
        >
          {
            ({data, error, loading }) => {
              if (loading) {
                return null;
              }
              if (error) { return "Error loading online users"; }
              return (
                <div>
                 <p className="userListHeading"> Online Users ({!data.users_online ? 0 : data.users_online.length})</p>
                  <ul className="userList">
                    { 
                      data.users_online.map((u) => {
                        return <li key={u.id}>{u.username}</li>
                      })
                    }
                  </ul>
                </div>
              );
            }
          }
        </Subscription>
      </div>
    );
  }
};

export default OnlineUsers;
