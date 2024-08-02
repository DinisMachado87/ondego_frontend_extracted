import React, { useState } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/EventCommentCreateForm.module.css";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import TextareaAutosize from "react-textarea-autosize";

function EventCommentCreateForm(props) {
  const { event, setEvent, setComments, profileImage, profile_id } = props;
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Message cannot be empty");
      return;
    }
    try {
      const { data } = await axiosRes.post(`/comments/`,{
        message,
        event: event.id,
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: [data, ...prevComments.results],
      }));
      setEvent((prevEvent) => ({
        ...prevEvent,
        comments_count: prevEvent.comments_count + 1,
      }));
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form
      className={`${styles.Form} p-2 m-3`}
      onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <Link to={`/profiles/${profile_id} col2`}>
            <Avatar src={profileImage} />
          </Link>
          <TextareaAutosize
            className={`${styles.Form} col-8 p-3`}
            placeholder='my comment...'
            value={message}
            onChange={ handleChange }
            minRows={ 1 }
          />
          <button
            className={`${styles.Button} btn col-2`}
            disabled={!message.trim()}
            type='submit'>
            Post
          </button>
        </InputGroup>
      </Form.Group>
    </Form>
  );
}

export default EventCommentCreateForm;
