import { Component } from 'react';

import UserService from '../services/user.service';
import AuthService from '../services/auth.service';
import EventBus from '../common/EventBus';
import ErrorInterface from '../types/error.type';
import UserInterface from '../types/user.type';
import withRouter from '../common/withRouter';
import AccountInterface from '../types/account.type';
import { Typeahead } from 'react-bootstrap-typeahead';
import { Option } from 'react-bootstrap-typeahead/types/types';
import userService from '../services/user.service';

type Props = {
  router: { params: { id: undefined } }
};

type State = {
  currentUser: UserInterface;
  account: AccountInterface;
  content: UserInterface[];
  error: ErrorInterface;
  selected: Option[];
  users: UserInterface[];
  emails: Option[];
}

export default withRouter(class AccountUsers extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      currentUser: {},
      account: {},
      content: [],
      error: {},
      selected: [],
      users: [],
      emails: []
    };

    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.router.params;
    const accountId = Number(id);

    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({ currentUser: user });
    }

    UserService.getAccount(accountId).then(
      response => {
        this.setState({ account: response.data });
      },
      this.handleError
    );

    UserService.getUsersFromAccount(accountId).then(
      response => {
        this.setState({ content: response.data });

        UserService.getUsers().then(
          getUsersResponse => {
            const usersFiltered = getUsersResponse.data.filter((u: any) => !response.data.map((i: any) => i.email).includes(u.email))

            this.setState({ users: usersFiltered });
            this.setState({ emails: usersFiltered.map((i: any) => ({ id: i.id, email: i.email })) })
          },
          this.handleError
        );
      },
      this.handleError
    );
  }

  handleError(error: any) {
    this.setState({ error: error?.response?.data });

    if (error?.response?.data?.statusCode === 401) {
      EventBus.dispatch('logout');
    }
  }

  addToAccount(e: any) {
    const { account, content, users } = this.state;
    const userSelected = JSON.parse(JSON.stringify(this.state.selected[0]));

    userService.addToAccount(userSelected.id, Number(account.id)).then(
      response => {
        if (response.status === 201) {
          const user: UserInterface = users.find((u: UserInterface) => u.id === userSelected.id)!;
          content.push(user);

          const newUsers = users.filter((u: UserInterface) => u.id !== userSelected.id);
          const newEmails = newUsers.map((i: any) => ({ id: i.id, email: i.email }));

          this.setState({ content, users: newUsers,  emails: newEmails, selected: [] });
        }
      },
      this.handleError
    );
  }

  render() {
    const { currentUser, account, content, error } = this.state;

    return (
      <div className='container'>
        <div className='row'>
          <div className='col'>
            <h1 className='display-4'>
              <small className='text-muted'></small><strong> {account.name} </strong><small className='text-muted'> users</small>
            </h1>
          </div>
          {currentUser.isAdmin &&
          <div className='col'>
            {currentUser.isAdmin && (
              <div className='input-group mb-3 justify-content-end'>
                <Typeahead
                  id='typeahead-emails'
                  placeholder='type user email'
                  labelKey='email'
                  onChange={(selected) => {
                    this.setState({selected});
                  }}
                  options={this.state.emails}
                  selected={this.state.selected}
                />
                <div className='input-group-append'>
                  <button className='btn btn-dark' type='button' onClick={e => {this.addToAccount(e)}}>add</button>
                </div>
              </div>
            )}
          </div>
          }
        </div>
        {
          (content.length > 0) &&
          <div className='row'>
            <div className='col'>
              <table className='table'>
                <thead className='thead-dark'>
                  <tr>
                    <th scope='col'>ID</th>
                    <th scope='col'>Name</th>
                    <th scope='col'>Email</th>
                    <th scope='col'>Role</th>
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
})
