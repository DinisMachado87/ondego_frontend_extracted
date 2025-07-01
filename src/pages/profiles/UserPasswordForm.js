import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Container, Alert } from 'react-bootstrap';
import { axiosReq } from '../../api/axiosDefaults';
import styles from '../../styles/ProfileEditForm.module.css';
import appStyles from '../../App.module.css';
import btnStyles from '../../styles/Button.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useCurrentUser } from '../../contexts/CurrentUserContext';

function UserPasswordForm() {
  const [errors, setErrors] = useState({});
  const [passwordData, setPasswordData] = useState({
    new_password1: '',
    new_password2: '',
  });
  const { new_password1, new_password2 } = passwordData;

  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = useCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      if (currentUser?.profile_id?.toString() !== id) {
        navigate('/');
      }
    };

    handleMount();
  }, [currentUser, navigate, id]);

  const handleChange = (event) => {
    setPasswordData({
      ...passwordData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosReq.post('/dj-rest-auth/password/change/', passwordData);
      navigate(-1);
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  const textFields = (
    <>
      <Form.Group>
        <Form.Label>New Password</Form.Label>
        <Form.Control
          type='password'
          value={new_password1}
          onChange={handleChange}
          name='new_password1'
        />
      </Form.Group>
      {errors?.new_password1?.map((message, idx) => (
        <Alert
          variant='warning'
          key={idx}>
          {message}
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Confirm New Password</Form.Label>
        <Form.Control
          type='password'
          value={new_password2}
          onChange={handleChange}
          name='new_password2'
        />
      </Form.Group>
      {errors?.new_password2?.map((message, idx) => (
        <Alert
          variant='warning'
          key={idx}>
          {message}
        </Alert>
      ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => navigate(-1)}>
        cancel
      </Button>
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        type='submit'>
        save
      </Button>
    </>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col
          className='py-2 p-0 p-md-2 text-center'
          md={7}
          lg={6}>
          <Container className={appStyles.Content}>
            <Form.Group>
              {currentUser?.profile_image && (
                <>
                  <figure>
                    <img
                      src={currentUser.profile_image}
                      alt='Profile'
                    />
                  </figure>
                </>
              )}
            </Form.Group>
            <div className='d-md-none'>{textFields}</div>
          </Container>
        </Col>
        <Col
          md={5}
          lg={6}
          className='d-none d-md-block p-0 p-md-2'>
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default UserPasswordForm;
