import { Component } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import AuthService from './services/auth.service';
import UserInterface from './types/user.type';

import Login from './components/login.component';
import Register from './components/register.component';
import Home from './components/home.component';
import Profile from './components/profile.component';
import User from './components/users.component';
import Logs from './components/logs.component';
import Accounts from './components/accounts.component';

import EventBus from './common/EventBus';
import AccountUsers from './components/account.users.component';

type Props = {};

type State = {
  currentUser: UserInterface
}

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: {},
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({ currentUser: user });
    }

    EventBus.on('logout', this.logOut);
  }

  componentWillUnmount() {
    EventBus.remove('logout', this.logOut);
  }

  logOut() {
    AuthService.logout();
    this.setState({
      currentUser: {},
    });
  }

  render() {
    const { currentUser, currentUser: { isAdmin } } = this.state;

    return (
      <div>
        <nav className='navbar navbar-expand navbar-dark bg-dark'>
          <Link to={'/'} className='navbar-brand'>
            mind teams challenge
          </Link>
          <div className='navbar-nav mr-auto'>
            <li className='nav-item'>
              <Link to={'/home'} className='nav-link'>
                Home
              </Link>
            </li>

            {isAdmin && (
              <li className='nav-item'>
                <Link to={'/accounts'} className='nav-link'>
                  Accounts
                </Link>
              </li>
            )}

            {isAdmin && (
              <li className='nav-item'>
                <Link to={'/users'} className='nav-link'>
                  Users
                </Link>
              </li>
            )}

            {isAdmin && (
              <li className='nav-item'>
                <Link to={'/logs'} className='nav-link'>
                  Logs
                </Link>
              </li>
            )}
          </div>

          {currentUser.email ? (
            <div className='navbar-nav ml-auto'>
              <li className='nav-item'>
                <Link to={'/profile'} className='nav-link'>
                  {currentUser.email}
                </Link>
              </li>
              <li className='nav-item'>
                <a href='/login' className='nav-link' onClick={this.logOut}>
                  Logout
                </a>
              </li>
            </div>
          ) : (
            <div className='navbar-nav ml-auto'>
              <li className='nav-item'>
                <Link to={'/login'} className='nav-link'>
                  Login
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className='container mt-3'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/home' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/users' element={<User />} />
            <Route path='/logs' element={<Logs />} />
            <Route path='/accounts' element={<Accounts />} />
            <Route path='/accounts/:id/users' element={<AccountUsers />} />
          </Routes>
        </div>

        { /*<AuthVerify logOut={this.logOut}/> */}
      </div>
    );
  }
}

export default App;