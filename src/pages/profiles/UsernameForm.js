import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  Button,
  Row,
  Col,
  Container,
  Alert,
  Image,
} from 'react-bootstrap';
import Asset from '../../components/Asset';
import { axiosReq } from '../../api/axiosDefaults';
import styles from '../../styles/ProfileEditForm.module.css';
import appStyles from '../../App.module.css';
import btnStyles from '../../styles/Button.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useCurrentUser,
  useSetCurrentUser,
} from '../../contexts/CurrentUserContext';

function UsernameForm() {
  const [errors, setErrors] = useState({});
  const [usernameData, setUsernameData] = useState({
    username: '',
  });
  const { username } = usernameData;

  const imageInput = useRef();
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();

  useEffect(() => {
    const handleMount = async () => {
      if (currentUser?.profile_id?.toString() === id) {
        try {
          const { data } = await axiosReq.get(`/profiles/${id}/`);
          const { username } = data;
          setUsernameData({ username });
        } catch (err) {
          console.log(err);
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    handleMount();
  }, [currentUser, navigate, id]);

  const handleChange = (event) => {
    setUsernameData({
      ...usernameData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosReq.put(`/profiles/${id}/`, usernameData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        username: username,
      }));
      navigate(-1);
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
    }
  };

  const textFields = (
    <>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control
          type='text'
          value={username}
          onChange={handleChange}
          name='username'
        />
      </Form.Group>
      {errors?.username?.map((message, idx) => (
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
                    <Image
                      src={currentUser.profile_image}
                      fluid
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

export default UsernameForm;
