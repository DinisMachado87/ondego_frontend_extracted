import React from "react";
import { Spinner } from "react-bootstrap";
import styles from "../styles/Asset.module.css";

const Asset = ({ spinner, src, message }) => {
  return (
    <div className={`${styles.Asset} p-4`}>
      {message && <p className='mt-4'>{message}</p>}{" "}
      {spinner && <Spinner animation='border' />}
      {src && (
        <img
          className={styles.AssetImage}
          src={src}
          alt='placeholder'
        />
      )}
    </div>
  );
};

export default Asset;
