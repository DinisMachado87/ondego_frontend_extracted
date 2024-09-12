import React, { useState } from "react";
import axios from "axios";

import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";

import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";

function SignInForm() {
  const setCurrentUser = useSetCurrentUser();
  useRedirect("loggedOut");

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;

  const [errors, setErrors] = useState({});

  const history = useHistory();
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      history.push("/");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <>
      <Row className={styles.Row}>
        <Col md={4}>
          <Container className={`${appStyles.Content}`}>
            <p className='text-warning text-center pt-3'>
              öndëgö (pronounced "on the go" but cosy) is your helper for
              spontaneous meets with your friends.
            </p>
            <p className='text-warning text-center pt-3'>
              To test the app log in with:
              <br />
              Username: Test // Password: 12345Test
            </p>
            <h1 className={styles.Header}>Sign in</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group
                controlId='username'
                className='d-flex flex-column align-items-center'>
                <Form.Label className='text-warning'>Username</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Test'
                  name='username'
                  className={styles.Input}
                  value={username}
                  onChange={handleChange}
                />
              </Form.Group>
              {errors.username?.map((message, idx) => (
                <Alert
                  key={idx}
                  variant='warning'>
                  {message}
                </Alert>
              ))}

              <Form.Group
                controlId='password'
                className='d-flex flex-column align-items-center'>
                <Form.Label className='text-warning'>Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='12345Test'
                  name='password'
                  className={styles.Input}
                  value={password}
                  onChange={handleChange}
                />
              {errors.password?.map((message, idx) => (
                <Alert
                key={idx}
                variant='warning'>
                  {message}
                </Alert>
              ))}
              <Button
                className={`${btnStyles.Button} ${btnStyles.Green} ${btnStyles.FullWidth}`}
                type='submit'>
                Sign in
              </Button>
              {errors.non_field_errors?.map((message, idx) => (
                <Alert
                key={idx}
                variant='warning'
                className='pt-3'>
                  {message}
                </Alert>
              ))}
              </Form.Group>
            </Form>
          </Container>
          <Container className={`pt-3 ${appStyles.Content}`}>
            <Link
              className={styles.Link}
              to='/signup'>
              Don't have an account? <span>Sign up now!</span>
            </Link>
          </Container>
        </Col>
        <Col
          md={8}
          className={`py-auto d-none d-md-block p-2`}>
          <Container className={`mt-3 ${appStyles.Content}`}>
            <Image
              className={`px-3`}
              src={
                'https://res.cloudinary.com/drgepxrpe/image/upload/v1712698055/ondego_event_placeholder/ppumyfwefatzziuko1ru'
              }
              width='100%'
              rounded
            />
          </Container>
        </Col>
      </Row>
    </>
  );
}

export default SignInForm;
