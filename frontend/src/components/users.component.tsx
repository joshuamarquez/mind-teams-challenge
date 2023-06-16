import { Component } from 'react';

import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import EventBus from '../common/EventBus';
import ErrorInterface from '../types/error.type';
import UserInterface from '../types/user.type';
import { Link } from 'react-router-dom';

type Props = {};

type State = {
  currentUser: UserInterface;
  content: UserInterface[];
  error: ErrorInterface
}

export default class User extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentUser: {},
      content: [],
      error: {}
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({ currentUser: user });
    }

    UserService.getUsers().then(
      response => {
        this.setState({
          content: response.data
        });
      },
      error => {
        this.setState({ error: error?.response?.data });

        if (error?.response?.data?.statusCode === 401) {
          EventBus.dispatch('logout');
        }
      }
    );
  }

  render() {
    const { currentUser, content, error } = this.state;

    return (
      <div className='container'>
        <div className='row'>
          <div className="col">
            <h1 className='display-4'>Users</h1>
          </div>
          {currentUser.isAdmin &&
          <div className="col">
            {currentUser.isAdmin && (
              <Link to={'/register'} type="button" style={{float: 'right'}} className="btn btn-dark">
                Add User
              </Link>
            )}
          </div>
          }
        </div>
        <div className='row'>
        {
          (content.length > 0) &&
          <div className="col">
            <table className='table'>
              <thead className='thead-dark'>
                <tr>
                  <th scope='col'>ID</th>
                  <th scope='col'>Name</th>
                  <th scope='col'>Email</th>
                  <th scope='col'>Role</th>
                  <th scope='col'>Account</th>
                </tr>
              </thead>
              <tbody>
              {content.map(( item, index ) => {
                return (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td>{item.account?.name}</td>
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
