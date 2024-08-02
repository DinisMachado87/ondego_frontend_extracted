import React from "react";
import styles from "../styles/Avatar.module.css";

const Avatar = ({ src, height = 45, text, profile_id }) => {
  return (
      <span>
        <img
          className={styles.Avatar}
          src={src}
          height={height}
          width={height}
          alt='avatar'
        />
        {text && (
          <span className={styles.Text}>
            <span>{text}</span>
          </span>
        )}
      </span>
  );
};

export default Avatar;
