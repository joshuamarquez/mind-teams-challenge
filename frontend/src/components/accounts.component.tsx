import { Component } from 'react';

import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import EventBus from '../common/EventBus';
import ErrorInterface from '../types/error.type';
import AccountInterface from '../types/account.type';
import UserInterface from '../types/user.type';
import { Link } from 'react-router-dom';
import userService from '../services/user.service';

type Props = {};

type State = {
  currentUser: UserInterface;
  content: AccountInterface[];
  error: ErrorInterface,
  inputValue: string
}

export default class Accounts extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentUser: {},
      content: [],
      error: {},
      inputValue: ''
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
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({ currentUser: user });
    }

    UserService.getAccounts().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      this.handleError
    );
  }

  addAccount(e: any) {
    const { content, inputValue } = this.state;

    if (inputValue.length > 0) {
      userService.createAccount(inputValue).then(
        response => {
          content.push(response.data);
          this.setState({ content, inputValue: '' });
        },
        this.handleError
      );
    }
  }

  updateInputValue(evt: any) {
    const val = evt.target.value;

    this.setState({ inputValue: val });
  }

  render() {
    const { currentUser, content, error } = this.state;

    return (
      <div className='container'>
        <div className='row'>
          <div className='col'>
            <h1 className='display-4'>Accounts</h1>
          </div>
          <div className='col'></div>
          {currentUser.isAdmin &&
          <div className='col'>
            {currentUser.isAdmin && (
              <div className='input-group mb-3 justify-content-end'>
                <input
                  type='text'
                  value={this.state.inputValue}
                  onChange={evt => this.updateInputValue(evt)}
                  className='form-control'
                  placeholder='account name'
                  aria-label='account name'
                  aria-describedby='basic-addon2' />
                <div className='input-group-append'>
                  <button className='btn btn-dark' type='button' onClick={e => {this.addAccount(e)}}>add</button>
                </div>
              </div>
            )}
          </div>
          }
        </div>
        <div className='row'>
        {
          (content.length > 0) &&
          <div className='col'>
            <table className='table'>
              <thead className='thead-dark'>
                <tr>
                  <th scope='col'>ID</th>
                  <th scope='col'>Name</th>
                  <th scope='col'>Users</th>
                </tr>
              </thead>
              <tbody>
              {content.map(( item, index ) => {
                return (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    {currentUser.isAdmin &&
                    <td>
                      {currentUser.isAdmin && (
                        <Link to={`/accounts/${item.id}/users`} type='button' className='btn btn-link'>
                          View users
                        </Link>
                      )}
                    </td>
                    }
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>
        }
        </div>
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
