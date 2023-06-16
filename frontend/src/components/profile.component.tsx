import { Component } from 'react';
import { Navigate } from 'react-router-dom';
import UserService from '../services/user.service';
import UserInterface from '../types/user.type';
import EventBus from '../common/EventBus';
import ErrorInterface from '../types/error.type';

type Props = {};

type State = {
  redirect: string | null,
  userReady: boolean,
  content: UserInterface & { access_token: string },
  error: ErrorInterface
}

export default class Profile extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      content: { access_token: '' },
      error: {}
    };

    this.handleError = this.handleError.bind(this);
  }

  handleError(error: any) {
    this.setState({ error: error?.response?.data });

    if (error?.response?.data?.statusCode === 401) {
      EventBus.dispatch('logout');
    }
  }

  componentDidMount() {
    UserService.getProfile().then(
      response => {
        if (!response.data) this.setState({ redirect: '/home' });

        this.setState({
          content: response.data,
          userReady: true
        });
      },
      this.handleError
    );
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }

    const { content, error } = this.state;

    return (
      <div className='container'>
        {(this.state.userReady && !error.message) ?
          <div>
            <header>
              <h1 className='display-4'><strong>{content.name}</strong> Profile</h1>
            </header>
            <p>
              <strong>Id:</strong>{' '}
              {content.id}
            </p>
            <p>
              <strong>Name:</strong>{' '}
              {content.name}
            </p>
            <p>
              <strong>Email:</strong>{' '}
              {content.email}
            </p>
            <p>
              <strong>Role:</strong>{' '}
              {content.role}
            </p>
            <p>
              <strong>Account:</strong>{' '}
              {content.account?.name || '?'}
            </p>
          </div> : null}
        {(!this.state.userReady && error.message) &&
          <div className='alert alert-danger' role='alert'>
          {error.statusCode}: {error.message}
          </div>
          }
      </div>
    );
  }
}
