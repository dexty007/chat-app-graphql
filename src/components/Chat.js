import React from 'react';
import { Subscription } from 'react-apollo';
import gql from 'graphql-tag';
import ChatWrapper from './ChatWrapper';

const subscribeToNewMessages = gql`
subscription{
  users_message(limit: 1, order_by: {id: desc}) {
    id
    username
    text
    timestamp
  }
}
`;

const emitOnlineEvent = gql`
mutation ($userId: String!) {
  update_users(
    where: {
      user_id: {
        _eq: $userId
      }
    }, 
    _set: {
      last_seen: "now()"
    }
    ) {
    affected_rows
  }
}
`;

class Chat extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      username: props.username,
      usesrId: props.userId,
      refetch: null
    };
  }

  // set refetch function (coming from child <Query> component) using callback
  setRefetch = (refetch) => {
    this.setState({
      ...this.state,
      refetch
    })
  }


  async componentDidMount() {
    // Emit and event saying the user is online every 5 seconds
    setInterval(
      async () => {
        await this.props.client.mutate({
          mutation: emitOnlineEvent,
          variables: {
            userId: this.props.userId
          }
        });
      },
      3000 
    );
  }

  /*
    Subscription is used only for event notification
    No data is bound to the subscription component
    As soon as an event occurs, the refetch() of the child component is called
  */
  render () {
    // console.log(userId);
    // console.log(username);
    const { refetch, username } = this.state;
    return (
      <div>
        <Subscription
          subscription={subscribeToNewMessages}
        >
          {
            ({data, error, loading}) => {
              if (error || (data && data.message === null)) {
                console.error(error || `Unexpected response: ${data}`);
                return "Error";
              }
              if (refetch) {
                refetch();
              }
              return null;
            }
          }
        </Subscription>
        <ChatWrapper
          refetch={refetch}
          setRefetch={this.setRefetch}
          userId={this.props.userId}
          username={username}
        />
      </div>
    );
  }
};

export default Chat;
