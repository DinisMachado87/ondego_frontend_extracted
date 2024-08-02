import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Row, Col, Alert, Container } from "react-bootstrap";
import { useHistory } from "react-router";
import btnStyles from "../../styles/Button.module.css";
import styles from "../../styles/ProfileEditForm.module.css";
import { axiosReq } from "../../api/axiosDefaults";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import {
  useCurrentUser,
  useSetCurrentUser,
} from "../../contexts/CurrentUserContext";

const ProfileEditForm = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const { id } = useParams();
  const history = useHistory();
  const [success, setSuccess] = useState("");

  const imageFile = useRef();

  const [profileData, setProfileData] = useState({
    name: "",
    feeling: "",
    would_like_to: "",
    image: "",
  });

  const { name, feeling, would_like_to } = profileData;

  const [errors, setErrors] = useState({});

  /** Fetch the profile data of the current user and set the profileData state
   */
  useEffect(() => {
    const handleMount = async () => {
      if (currentUser?.profile_id?.toString() === id) {
        try {
          const { data } = await axiosReq.get(`/profiles/${id}/`);
          const {
            name = data.name || "",
            feeling = data.feeling || "",
            would_like_to = data.would_like_to || "",
            image = data.image || "",
          } = data;
          setProfileData({ name, feeling, would_like_to, image });
        } catch (err) {
          console.log(err);
        }
      }
    };

    handleMount();
  }, [currentUser, id, history]);

  const handleChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("feeling", feeling);
    formData.append("would_like_to", would_like_to);

    if (imageFile?.current?.files[0]) {
      formData.append("image", imageFile?.current?.files[0]);
    }

    try {
      const { data } = await axiosReq.put(`/profiles/${id}/`, formData);
      setCurrentUser((currentUser) => ({
        ...currentUser,
        image: data.image,
      }));
      // update the state with the new profile data
      setProfileData(data);
      // Set the success message
      setSuccess("Profile updated successfully!");
      // Clear any previous errors
      setErrors({});
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data);
      // Clear the success message
      setSuccess("");
    }
  };

  return (
    <Container className={`${styles.Container}`}>
      <Form
        onSubmit={handleSubmit}
        className={`${styles.Form} px-3`}>
        <Row>
          <Col className='my-2 mx-auto'>
            <Form.Group>
              <Row
                className={`d-flex justify-content-center`}>
                <Col className='d-flex justify-content-center align-items-center'>
                  <img
                    className={styles.Image}
                    src={profileData.image}
                    alt='profile'
                  />
                </Col>
              </Row>
              <Row>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Orange} mx-auto`}
                  htmlFor='image'>
                  Change profile image
                  <Form.File
                    hidden
                    id='image'
                    accept='image/*'
                    type='file'
                    ref={imageFile}
                    onChange={(e) => {
                      if (e.target.files.length) {
                        setProfileData({
                          ...profileData,
                          image: URL.createObjectURL(e.target.files[0]),
                        });
                      } else {
                        setProfileData({
                          ...profileData,
                          image: profileData.image,
                        });
                      }
                    }}
                  />
                </Form.Label>
              </Row>
              <Row>
                {errors?.image?.map((message, idx) => (
                  <Alert
                    key={idx}
                    variant='Warning'>
                    {message}
                  </Alert>
                ))}
              </Row>
            </Form.Group>
          </Col>
        </Row>

        <Row className='justify-content-center no-gutters'>
          <Col className='my-2 col-12'>
            <Row className='my-2'>
              <Col xs={12}>
                <Row className={styles.Input}>
                  <Col xs={3}>
                    <Form.Label
                      className={`${styles.Label} ${styles.Header} p-2`}>
                      Name
                    </Form.Label>
                  </Col>
                  <Col xs={9}>
                    <Form.Control
                      type='text'
                      value={name}
                      onChange={handleChange}
                      name='name'
                      className={`${styles.Input} m-1`}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className='my-2'>
              <Col xs={12}>
                <Row className={styles.Input}>
                  <Col xs={3}>
                    <Form.Label
                      className={`${styles.Label} ${styles.Header} p-2`}>
                      Feeling
                    </Form.Label>
                  </Col>
                  <Col xs={9}>
                    <Form.Control
                      type='text'
                      value={feeling}
                      onChange={handleChange}
                      name='feeling'
                      className={`${styles.Input} m-1`}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className='my-2'>
              <Col xs={12}>
                <Row className={styles.Input}>
                  <Col xs={3}>
                    <Form.Label
                      className={`${styles.Label} ${styles.Header} p-2`}>
                      Would Like To
                    </Form.Label>
                  </Col>
                  <Col xs={9}>
                    <Form.Control
                      type='text'
                      value={would_like_to}
                      onChange={handleChange}
                      name='would_like_to'
                      className={`${styles.Input} m-1`}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className='my-2'>
              <Col xs={12}>
                <Row className={styles.Input}>
                  <Col>
                    {success && (
                      <Alert
                        className={`${styles.Label} m-3`}
                        variant='success'>
                        {success}
                      </Alert>
                    )}
                    {errors &&
                      Object.keys(errors).map((key) => (
                        <Alert
                          className={`${styles.Label} m-3`}
                          variant='danger'>
                          {errors[key]}
                        </Alert>
                      ))}
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col>
                <Row>
                  <Col className='text-center'>
                    <Button
                      className={`${btnStyles.Button} ${btnStyles.Orange}`}
                      onClick={() => history.goBack()}>
                      Cancel
                    </Button>
                    <Button
                      className={`${btnStyles.Button} ${btnStyles.Orange}`}
                      type='submit'>
                      Save
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default ProfileEditForm;
