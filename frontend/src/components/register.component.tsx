import { Component } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import AuthService from '../services/auth.service';
import ErrorInterface from '../types/error.type';
import { Navigate } from 'react-router-dom';

type Props = {};

type State = {
  name: string,
  email: string,
  password: string,
  successful: boolean,
  error: ErrorInterface,
  redirect: string | null
};

export default class Register extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);

    this.state = {
      name: '',
      email: '',
      password: '',
      successful: false,
      error: {},
      redirect: null
    };
  }

  validationSchema() {
    return Yup.object().shape({
      name: Yup.string()
        .test(
          'len',
          'The name must be between 3 and 20 characters.',
          (val: any) =>
            val &&
            val.toString().length >= 3 &&
            val.toString().length <= 20
        )
        .required('This field is required!'),
      email: Yup.string()
        .email('This is not a valid email.')
        .required('This field is required!'),
      password: Yup.string()
        .test(
          'len',
          'The password must be between 6 and 40 characters.',
          (val: any) =>
            val &&
            val.toString().length >= 6 &&
            val.toString().length <= 40
        )
        .required('This field is required!'),
    });
  }

  handleRegister(formValue: { name: string; email: string; password: string, role: string }) {
    const { name, email, password, role } = formValue;

    this.setState({
      error: {},
      successful: false
    });

    console.log(formValue);

    AuthService.register(
      name,
      email,
      password,
      role
    ).then((r) => {
      this.setState({
        successful: true
      });
    },
      error => {
        this.setState({
          error: error?.response?.data,
          successful: false,
        });
      }
    );
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) {
      this.setState({ redirect: '/home' });
    };
  }

  render() {
    if (this.state.redirect) {
      return <Navigate to={this.state.redirect} />
    }

    const { successful, error } = this.state;

    const initialValues = {
      name: '',
      email: '',
      password: '',
      role: 'admin'
    };

    return (
      <div className='col-md-12'>
        <div className='card card-container'>
          <Formik
            initialValues={initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleRegister}
          >
            <Form>
              {!successful && (
                <div>
                  <div className='form-group'>
                    <label htmlFor='name'> Name </label>
                    <Field name='name' type='text' className='form-control' />
                    <ErrorMessage
                      name='name'
                      component='div'
                      className='alert alert-danger'
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='email'> Email </label>
                    <Field name='email' type='email' className='form-control' />
                    <ErrorMessage
                      name='email'
                      component='div'
                      className='alert alert-danger'
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='role'> Role </label>
                    <Field as='select' name='role' className='form-control'>
                      <option value='admin'>Admin</option>
                      <option value='user'>Regular</option>
                    </Field>

                    <ErrorMessage
                      name='role'
                      component='div'
                      className='alert alert-danger'
                    />
                  </div>

                  <div className='form-group'>
                    <label htmlFor='password'> Password </label>
                    <Field
                      name='password'
                      type='password'
                      className='form-control'
                    />
                    <ErrorMessage
                      name='password'
                      component='div'
                      className='alert alert-danger'
                    />
                  </div>

                  <div className='form-group'>
                    <button type='submit' className='btn btn-primary btn-block'>Sign Up</button>
                  </div>
                </div>
              )}

              {(error.message || successful) && (
                <div className='form-group'>
                  <div
                    className={
                      successful ? 'alert alert-success' : 'alert alert-danger'
                    }
                    role='alert'
                  >
                    {error.message || 'user successfully signed up'}
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
