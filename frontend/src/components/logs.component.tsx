import { Component } from 'react';
import Moment from 'moment';

import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import EventBus from '../common/EventBus';
import ErrorInterface from '../types/error.type';
import LogInterface from '../types/logs.type';
import UserInterface from '../types/user.type';

type Props = {};

type State = {
  currentUser: UserInterface;
  content: LogInterface[];
  error: ErrorInterface;
  accountInputValue: string;
  userInputValue: string;
  startDateInputValue: string;
  endDateInputValue: string;
  searchTimeout: any;
}

export default class Logs extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentUser: {},
      content: [],
      error: {},
      accountInputValue: '',
      userInputValue: '',
      startDateInputValue: '',
      endDateInputValue: '',
      searchTimeout: 0
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

    UserService.getLogs().then(
      response => {
        this.setState({ content: response.data });
      },
      this.handleError
    );
  }

  onChange() {
    if (this.state.searchTimeout) clearTimeout(this.state.searchTimeout);

    this.setState({
      searchTimeout: setTimeout(() => {
        const {
          userInputValue,
          accountInputValue,
          startDateInputValue,
          endDateInputValue
        } = this.state;

        console.log({ startDateInputValue, endDateInputValue });

        UserService.getLogs({
          userName: userInputValue,
          accountName: accountInputValue,
          startDate: startDateInputValue ? startDateInputValue + ' 00:00:00' : undefined,
          endDate: endDateInputValue ? endDateInputValue + ' 23:59:59' : undefined
        }).then(
          response => {
            this.setState({ content: response.data });
          },
          this.handleError
        );
      }, 300)
    });
  }

  render() {
    const { currentUser, content, error } = this.state;
    const dateFormat = 'dddd, MMMM Do YYYY, h:mm:ss a';

    Moment.locale('en');

    return (
      <div className='container'>
        <div className='row'>
          <div className="col-2">
            <h1 className='display-4'>Logs</h1>
          </div>
          {currentUser.isAdmin &&
          <div className='col-3'>
            <div className='input-group mb-3 justify-content-end'>
                <div className="input-group-prepend">
                  <span className="input-group-text" id="from">from</span>
                </div>
                <input
                  type='date'
                  value={this.state.startDateInputValue}
                  onChange={evt => {
                    this.setState({ startDateInputValue: evt.target.value });
                    this.onChange()
                  }}
                  className='form-control'
                  aria-describedby='from' />
              </div>
          </div>
          }
          {currentUser.isAdmin &&
          <div className='col-3'>
            <div className='input-group mb-3 justify-content-end'>
                <div className="input-group-prepend">
                  <span className="input-group-text" id="to">to</span>
                </div>
                <input
                  type='date'
                  value={this.state.endDateInputValue}
                  onChange={evt => {
                    this.setState({ endDateInputValue: evt.target.value });
                    this.onChange()
                  }}
                  className='form-control'
                  aria-describedby='to' />
              </div>
          </div>
          }
          {currentUser.isAdmin &&
          <div className='col-4'>
            <div className='input-group mb-3 justify-content-end'>
              <input
                type='text'
                value={this.state.userInputValue}
                onChange={evt => {
                  this.setState({ userInputValue: evt.target.value });
                  this.onChange()
                }}
                className='form-control'
                placeholder='user name'
                aria-label='user name' />
              <input
                type='text'
                value={this.state.accountInputValue}
                onChange={evt => {
                  this.setState({ accountInputValue: evt.target.value });
                  this.onChange()
                }}
                className='form-control'
                placeholder='account name'
                aria-label='account name' />
            </div>
          </div>
          }
        </div>
        {
          (content.length > 0) &&
          <div className='row'>
            <div className="col">
              <table className='table'>
                <thead className='thead-dark'>
                  <tr>
                    <th scope='col'>ID</th>
                    <th scope='col'>User</th>
                    <th scope='col'>Account</th>
                    <th scope='col'>Start Date</th>
                    <th scope='col'>End Date</th>
                  </tr>
                </thead>
                <tbody>
                {content.map(( item, index ) => {
                  return (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td>{item.user.email}</td>
                      <td>{item.account.name}</td>
                      <td>{Moment(item.startDate).format(dateFormat)}</td>
                      <td>{item.endDate ? Moment(item.endDate).format(dateFormat) : '-'}</td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          </div>
        }
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
