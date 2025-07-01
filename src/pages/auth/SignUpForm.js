import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../../styles/SignInUpForm.module.css';
import btnStyles from '../../styles/Button.module.css';
import appStyles from '../../App.module.css';

import {
  Form,
  Button,
  Image,
  Col,
  Row,
  Container,
  Alert,
} from 'react-bootstrap';
import axios from 'axios';
import { useRedirect } from '../../hooks/useRedirect';

const SignUpForm = () => {
  useRedirect('loggedOut');
  const [signUpData, setSignUpData] = useState({
    username: '',
    password1: '',
    password2: '',
  });

  const { username, password1, password2 } = signUpData;
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('dj-rest-auth/registration/', signUpData);
      navigate('/signin');
    } catch (err) {
      setError(err.response?.data);
    }
  };

  return (
    <>
      <Row className={styles.Row}>
        <Col
          className='py-auto p-md-2'
          md={6}>
          <Container className={`${appStyles.Content} p-4 `}>
            <p className='text-warning text-center pt-3'>
              öndëgö (pronounced "on the go" but cosy) is your helper for
              spontaneous meets with your friends.
            </p>
            <h1 className={styles.Header}>Sign up</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group
                controlId='username'
                className='d-flex flex-column align-items-center'>
                <Form.Label className='sr-only'>Username </Form.Label>
                <Form.Control
                  className={styles.Input}
                  placeholder='Username'
                  type='text'
                  name='username'
                  value={username}
                  onChange={handleChange}
                />
              </Form.Group>
              {error.username?.map((message, index) => (
                <Alert
                  variant='warning'
                  key={index}>
                  {message}
                </Alert>
              ))}
              <Form.Group
                controlId='password1'
                className='d-flex flex-column align-items-center'>
                <Form.Label className='sr-only'>Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  placeholder='Password'
                  type='password'
                  name='password1'
                  value={password1}
                  onChange={handleChange}
                />
              </Form.Group>
              {error.password1?.map((message, index) => (
                <Alert
                  variant='warning'
                  key={index}>
                  {message}
                </Alert>
              ))}
              <Form.Group
                controlId='password2'
                className='d-flex flex-column align-items-center'>
                <Form.Label className='sr-only'>Confirm Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  placeholder='Confirm Password'
                  type='password'
                  name='password2'
                  value={password2}
                  onChange={handleChange}
                />
                {error.password2?.map((message, index) => (
                  <Alert
                    variant='warning'
                    key={index}>
                    {message}
                  </Alert>
                ))}
                <Button
                  className={`${btnStyles.Button} ${btnStyles.Green} ${btnStyles.FullWidth}`}
                  type='submit'>
                  Sign up
                </Button>
                {error.non_field_errors?.map((message, index) => (
                  <Alert
                    variant='warning'
                    className='mt-3'
                    key={index}>
                    {message}
                  </Alert>
                ))}
              </Form.Group>
            </Form>
          </Container>
          <Container className={`mt-3 ${appStyles.Content}`}>
            <Link
              className={styles.Link}
              to='/signin'>
              Already have an account? <span>Sign in</span>
            </Link>
          </Container>
        </Col>
        <Col
          md={6}
          className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}>
          <Container className={`${appStyles.Content}`}>
            <Image
              src='https://res.cloudinary.com/drgepxrpe/image/upload/v1712698055/ondego_event_placeholder/ppumyfwefatzziuko1ru'
              width='100%'
              rounded
            />
          </Container>
        </Col>
      </Row>
    </>
  );
};

export default SignUpForm;
