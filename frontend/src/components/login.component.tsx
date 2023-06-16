import { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import AuthService from '../services/auth.service';
import ErrorInterface from '../types/error.type';

type Props = {};

type State = {
  redirect: string | null,
  email: string,
  password: string,
  loading: boolean,
  error: ErrorInterface
};

export default class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);

    this.state = {
      redirect: null,
      email: '',
      password: '',
      loading: false,
      error: {}
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
      this.setState({ redirect: '/profile' });
    };
  }

  componentWillUnmount() {
    window.location.reload();
  }

  validationSchema() {
    return Yup.object().shape({
      email: Yup.string().required('This field is required!'),
      password: Yup.string().required('This field is required!'),
    });
  }

  handleLogin(formValue: { email: string; password: string }) {
    const { email, password } = formValue;

    this.setState({
      error: {},
      loading: true
    });


    AuthService.login(email, password).then(
      () => {
        this.setState({
          redirect: '/profile'
        });
      },
      error => {
        this.setState({
          loading: false,
          error: error?.response?.data
        });
      }
    );
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }

    const { loading, error } = this.state;

    const initialValues = {
      email: '',
      password: '',
    };

    return (
      <div className='col-md-12'>
        <div className='card card-container'>
          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleLogin}
          >
            <Form>
              <div className='form-group'>
                <label htmlFor='email'>Email</label>
                <Field name='email' type='text' className='form-control' />
                <ErrorMessage
                  name='email'
                  component='div'
                  className='alert alert-danger'
                />
              </div>

              <div className='form-group'>
                <label htmlFor='password'>Password</label>
                <Field name='password' type='password' className='form-control' />
                <ErrorMessage
                  name='password'
                  component='div'
                  className='alert alert-danger'
                />
              </div>

              <div className='form-group'>
                <button type='submit' className='btn btn-primary btn-block' disabled={loading}>
                  {loading && (
                    <span className='spinner-border spinner-border-sm'></span>
                  )}
                  <span>Login</span>
                </button>
              </div>

              {error.message && (
                <div className='form-group'>
                  <div className='alert alert-danger' role='alert'>
                    {error.message}
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    );
  }
}
