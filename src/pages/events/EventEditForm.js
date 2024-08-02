import React, { useEffect, useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

import Upload from "../../assets/upload.jpg";

import styles from "../../styles/EventCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { Alert } from "react-bootstrap";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { axiosReq } from "../../api/axiosDefaults";

function EventEditForm() {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString().slice(0, 16);
  };

  const [errors, setErrors] = useState({});

  const [eventData, setEventData] = useState({
    id: "",
    what_title: "",
    what_content: "",
    where_place: "",
    where_address: "",
    when_start: "",
    when_end: "",
    intention: "",
    event_image: Upload,
    link: "",
  });

  const {
    what_title,
    what_content,
    where_place,
    where_address,
    when_start,
    when_end,
    intention,
    event_image,
    link,
  } = eventData;

  const [startInputValue, setStartInputValue] = useState(when_start);
  const [endInputValue, setEndInputValue] = useState(when_end);

  const imageInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/events/${id}`);
        const {
          is_owner,
          what_title,
          what_content,
          where_place,
          where_address,
          when_start,
          when_end,
          intention,
          event_image,
          link,
        } = data;
        if (is_owner) {
          setEventData({
            what_title: what_title || "",
            what_content: what_content || "",
            where_place: where_place || "",
            where_address: where_address || "",
            when_start: formatDate(when_start),
            when_end: formatDate(when_end),
            intention: intention || "",
            event_image: event_image || Upload,
            link: link || "",
          });
          setStartInputValue(formatDate(when_start));
          setEndInputValue(formatDate(when_end));
        } else {
          history.push(`/events/${id}`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    handleMount();
  }, [history, id]);

  const calculateNewEndDate = (startDate) => {
    const start = new Date(startDate);
    start.setHours(start.getHours() + 5);
    return start.toISOString().slice(0, 16);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "when_start") {
      setStartInputValue(value);
    } else if (name === "when_end") {
      setEndInputValue(value);
    } else {
      setEventData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleChangeImage = (event) => {
    // if there is a file, set the image to the file
    if (event.target.files[0]) {
      setEventData({
        ...eventData,
        event_image: URL.createObjectURL(event.target.files[0]),
      });
    } else {
      // if there is no file, set the image to the default image
      setEventData({
        ...eventData,
        event_image: Upload,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (
      !what_title.trim() ||
      !what_content.trim() ||
      !where_place.trim() ||
      !when_start.trim()
    ) {
      setErrors({
        non_field_errors: [
          "Title, Description, Place, and Start Date are required",
        ],
      });
      return;
    }

    let updatedEndDate = when_end;
    if (new Date(endInputValue) < new Date(startInputValue)) {
      updatedEndDate = calculateNewEndDate(startInputValue);
    }

    try {
      const formData = new FormData();
      formData.append("what_title", what_title);
      formData.append("what_content", what_content);
      formData.append("where_place", where_place);
      formData.append("where_address", where_address);
      formData.append("when_start", startInputValue);
      formData.append("when_end", updatedEndDate);
      formData.append("intention", intention);
      formData.append("link", link);
      if (imageInput.current.files[0]) {
        formData.append("event_image", imageInput.current.files[0]);
      }
      try {
        await axiosReq.put(`/events/${id}/`, formData);
        history.push(`/events/${id}/`);
      } catch (err) {
        console.error(err);
        if (err.response?.status !== 401) {
          setErrors(err.response?.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const textFields = (
    <div className='text-center OrangeBorder'>
      <h1 className={styles.Header}>add event</h1>

      <Form.Group controlId='WhatTitle'>
        <Form.Label className='d-none'>What? (title)</Form.Label>
        <Form.Control
          className={styles.Input}
          type='text'
          placeholder='What? (title)'
          name='what_title'
          value={what_title}
          onChange={handleChange}
        />
      </Form.Group>
      {errors &&
        errors.what_title?.map((message, idx) => (
          <Alert
            key={idx}
            variant='warning'>
            {message}
          </Alert>
        ))}

      <Form.Group controlId='WhatContent'>
        <Form.Label className='d-none'>What? (content)</Form.Label>
        <Form.Control
          className={styles.Input}
          as='textarea'
          rows={3}
          placeholder='What? (description)'
          name='what_content'
          value={what_content}
          onChange={handleChange}
        />
      </Form.Group>
      {errors &&
        errors.what_content?.map((message, idx) => (
          <Alert
            key={idx}
            variant='warning'>
            {message}
          </Alert>
        ))}

      <Form.Group controlId='WherePlace'>
        <Form.Label className='d-none'>Where? (place)</Form.Label>
        <Form.Control
          className={styles.Input}
          type='text'
          placeholder='Where? (place)'
          name='where_place'
          value={where_place}
          onChange={handleChange}
        />
      </Form.Group>
      {errors &&
        errors.where_place?.map((message, idx) => (
          <Alert
            key={idx}
            variant='warning'>
            {message}
          </Alert>
        ))}

      <Form.Group controlId='WhereAddress'>
        <Form.Label className='d-none'>Where? (address)</Form.Label>
        <Form.Control
          className={styles.Input}
          type='text'
          placeholder='Where? (address)'
          name='where_address'
          value={where_address}
          onChange={handleChange}
        />
      </Form.Group>
      {errors &&
        errors.where_address?.map((message, idx) => (
          <Alert
            key={idx}
            variant='warning'>
            {message}
          </Alert>
        ))}

      <Form.Group
        className={styles.Input}
        controlId='WhenStart'>
        <Form.Label className={styles.Label}>When? (start)</Form.Label>
        <Form.Control
          className={styles.Input}
          type='datetime-local'
          name='when_start'
          value={startInputValue}
          onChange={handleChange}
        />
      </Form.Group>
      {errors &&
        errors.when_start?.map((message, idx) => (
          <Alert
            key={idx}
            variant='warning'>
            {message}
          </Alert>
        ))}

      <Form.Group
        className={styles.Input}
        controlId='WhenEnd'>
        <Form.Label className={styles.Label}>When? (end)</Form.Label>
        <Form.Control
          className={styles.Input}
          type='datetime-local'
          name='when_end'
          value={endInputValue}
          onChange={handleChange}
        />
      </Form.Group>
      {errors &&
        errors.when_end?.map((message, idx) => (
          <Alert
            key={idx}
            variant='warning'>
            {message}
          </Alert>
        ))}

      <Form.Group controlId='Intention'>
        <Form.Label className='d-none'>Intention</Form.Label>
        <Form.Control
          className={styles.Input}
          type='text'
          placeholder='intention'
          name='intention'
          value={intention}
          onChange={handleChange}
        />
      </Form.Group>
      {errors &&
        errors.intention?.map((message, idx) => (
          <Alert
            key={idx}
            variant='warning'>
            {message}
          </Alert>
        ))}

      <Form.Group controlId='Link'>
        <Form.Label className='d-none'>Link</Form.Label>
        <Form.Control
          className={styles.Input}
          type='text'
          placeholder='link'
          name='link'
          value={link}
          onChange={handleChange}
        />
      </Form.Group>
      {errors &&
        errors.link?.map((message, idx) => (
          <Alert
            key={idx}
            variant='warning'>
            {message}
          </Alert>
        ))}

      <Button
        className={`${btnStyles.Button} ${btnStyles.Orange}`}
        onClick={() => history.goBack()}>
        cancel
      </Button>
      <Button
        className={`${btnStyles.Button} ${btnStyles.Orange} ${btnStyles.HalfWidth}`}
        type='submit'>
        update
      </Button>
      {errors &&
        errors.non_field_errors?.map((message, idx) => (
          <Alert
            key={idx}
            variant='warning'
            className='mt-3'>
            {message}
          </Alert>
        ))}
    </div>
  );

  return (
    <Form
      onSubmit={handleSubmit}
      className={`${styles.Form}`}>
      <Row>
        <Col
          className='py-2 p-0 p-md-2'
          md={7}
          lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}>
            <Form.Group className='text-center'>
              <figure>
                <Image
                  className={styles.Image}
                  src={event_image}
                />
              </figure>
              <Form.Label
                className={`${btnStyles.Button} ${btnStyles.Orange}`}
                htmlFor='image-upload'>
                {event_image ? "Change the image" : "Click to add an image"}
                <i className='fa-solid fa-cloud-arrow-up'></i>
                <Form.File
                  id='image-upload'
                  accept='image/*'
                  onChange={handleChangeImage}
                  hidden
                  ref={imageInput}
                />
              </Form.Label>
            </Form.Group>
            <div className='d-md-none'>{textFields}</div>
          </Container>
        </Col>
        <Col
          md={5}
          lg={4}
          className='d-none d-md-block p-0 p-md-2'>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}>
            {textFields}
          </Container>
        </Col>
      </Row>
    </Form>
  );
}

export default EventEditForm;
