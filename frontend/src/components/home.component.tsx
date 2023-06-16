import { Component } from 'react';

import UserService from '../services/user.service';
import ErrorInterface from '../types/error.type';

type Props = {};

type State = {
  content: string;
  error: ErrorInterface;
}

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: '',
      error: {}
    };
  }

  componentDidMount() {
    UserService.getPublicContent().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({ error: error?.response?.data });
      }
    );
  }

  render() {
    const { error } = this.state;
    return (
      <div className='container'>
        <header>
          <h1 className='display-4'>{this.state.content}</h1>
        </header>
        {
          (error.message) &&
          <div className='alert alert-danger' role='alert'>
          {error.statusCode}: {error.message}
          </div>
        }
      </div>
    );
  }
}
