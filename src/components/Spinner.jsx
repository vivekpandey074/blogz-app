import React from "react";
import "../style.scss";

export default function Spinner() {
  return (
    <div className="container-fluid">
      <div className="container col-12 text-center">
        <div className="spinner-border text-primary mt-5 spinner" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
}
