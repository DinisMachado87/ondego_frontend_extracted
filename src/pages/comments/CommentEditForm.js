import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";

import styles from "../../styles/EventCommentCreateForm.module.css";

import TextareaAutosize from "react-textarea-autosize";
import { InputGroup } from "react-bootstrap";

function CommentEditForm(props) {
  const { id, content, setShowEditForm, setComments } = props;

  const [formContent, setFormContent] = useState(content);

  const handleChange = (event) => {
    setFormContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axiosRes.put(`/comments/${id}/`, {
        content: formContent.trim(),
      });
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? {
                ...comment,
                content: formContent.trim(),
                updated_at: "now",
              }
            : comment;
        }),
      }));
      setShowEditForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Form
      className={`${styles.Form} m-3`}
      onSubmit={handleSubmit}>
      <Form.Group>
        <InputGroup>
          <TextareaAutosize
            className={`${styles.Form} col-8 p-3`}
            as='textarea'
            value={formContent}
            onChange={handleChange}
            rows={2}
          />
          <button
            className={`${styles.Button} btn col-1`}
            disabled={!formContent.trim()}
            onClick={() => setShowEditForm(false)}
            type='button'>
            cancel
          </button>
          <button
            className={`${styles.Button} btn col-1`}
            disabled={!formContent.trim()}
            type='submit'>
            save
          </button>
        </InputGroup>
      </Form.Group>
    </Form>
  );
}

export default CommentEditForm;
