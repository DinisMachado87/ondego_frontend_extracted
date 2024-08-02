import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../styles/MoreDropdown.module.css";
import { useHistory } from "react-router";
import btnStyles from "../styles/Button.module.css";


const ThreeDots = React.forwardRef(({ onClick }, ref) => (
  <i
    className='fas fa-ellipsis-v'
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  />
));

export const MoreDropdown = ({ handleEdit, handleDelete }) => {
  return (
    <Dropdown
      className='ml-auto '
      drop='left'>
      <Dropdown.Toggle as={ThreeDots} />
      <Dropdown.Menu
        className={`${styles.Backcolor} text-center`}
        popperConfig={{ strategy: "fixed" }}>
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={handleEdit}
          aria-label='edit'>
          <span>
            <i className='fas fa-edit' />
          </span>
        </Dropdown.Item>
        <Dropdown.Item
          className={styles.DropdownItem}
          onClick={handleDelete}
          aria-label='delete'>
          <span>
            {" "}
            <i className='fas fa-trash-alt' />
          </span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    type='button'
    className={`${btnStyles.Button} ${btnStyles.Orange}`}
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}>
    {children}
  </button>
));

export function ProfileEditDropdown({ id }) {
  const history = useHistory();
  return (
    <Dropdown
      className={`ml-auto px-3`}
      drop='left'>
      <Dropdown.Toggle as={CustomToggle}>
        Edit account password and username
      </Dropdown.Toggle>
      <Dropdown.Menu className={`${styles.Backcolor} text-center p-3`}>
        <Dropdown.Item
          className={`${styles.DropdownItem} d-block`}
          onClick={() => history.push(`/profiles/${id}/edit/username`)}
          aria-label='edit-username'>
          <span>
            {" "}
            <i className='far fa-id-card' /> change username
          </span>
        </Dropdown.Item>
        <Dropdown.Item
          className={`${styles.DropdownItem} d-block`}
          onClick={() => history.push(`/profiles/${id}/edit/password`)}
          aria-label='edit-password'>
          <span>
            {" "}
            <i className='fas fa-key' /> change password
          </span>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}