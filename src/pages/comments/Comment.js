import React, { useState } from 'react'
import styles from "../../styles/Comment.module.css";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import Avatar from '../../components/Avatar';
import { Col, Media, Row } from 'react-bootstrap';
import { MoreDropdown } from '../../components/MoreDropdown';
import CommentEditForm from "./CommentEditForm";
import { axiosReq } from '../../api/axiosDefaults';
import { useCurrentUser } from "../../contexts/CurrentUserContext";


const Comment = (props) => {
  const {
    id,
    owner,
    message,
    updated_at,
    profile_image,
    profile_id,
    setComments,
    setEvent,
  } = props;
  
    const [showEditForm, setShowEditForm] = useState(false);
    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;
  
  const handleDelete = () => {
    try {
      axiosReq.delete(`/comments/${id}/`);
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
      setEvent((prevEvent) => ({
        ...prevEvent,
        comments_count: prevEvent.comments_count - 1,
      }));
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.filter((comment) => comment.id !== id),
      }));
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <div>
      <Media className={styles.Comment}>
        <Media.Body className='m-1'>
          {is_owner ? (
            <Row className='p-1'>
              <Col className='col-1'>
                <MoreDropdown
                  handleDelete={handleDelete}
                  handleEdit={() => setShowEditForm(true)}
                />
              </Col>
              <Link
                to={`/profiles/${profile_id}`}
                className='col-2'>
                <Avatar src={profile_image} />
              </Link>
              {showEditForm ? (
                <CommentEditForm
                  id={id}
                  profile_id={profile_id}
                  content={message}
                  profileImage={profile_image}
                  setComments={setComments}
                  setShowEditForm={setShowEditForm}
                />
              ) : (
                <Col className='col-9 mt-2'>
                  <p className='mt-1'>
                    {owner}: {message}
                    <span className={styles.UpdatedAt}>
                      {"  "}
                      {updated_at}
                    </span>{" "}
                  </p>
                </Col>
              )}
            </Row>
          ) : (
            <Row className='p-2'>
              <Col className='col-9 p-2 d-flex justify-content-end'>
                <p className='text-right mt-1'>
                  <span className={styles.UpdatedAt}>{updated_at}</span>
                  {"  "}
                  {message}
                </p>
              </Col>
              <Col className='col-2 d-flex justify-content-end'>
                <Link
                  to={`/profiles/${profile_id}`}
                  className='content-right'>
                  <Avatar src={profile_image} />
                </Link>
              </Col>
            </Row>
          )}
        </Media.Body>
      </Media>
    </div>
  );
}

export default Comment
