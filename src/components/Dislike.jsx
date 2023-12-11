import { Button } from "bootstrap";
import React from "react";

export default function Dislike({
  handleDislike,
  Dislikes,
  userId,
  candislikeflag,
}) {
  const DislikeStatus = () => {
    if (Dislikes?.length > 0) {
      return Dislikes.find((id) => id === userId) ? (
        <>
          <i className="bi bi-hand-thumbs-down-fill"></i>
          &nbsp;{Dislikes.length}
          {/* {Dislikes.length === 1 ? " Dislike" : " Dislikes"} */}
        </>
      ) : (
        <>
          <i className="bi bi-hand-thumbs-down"></i>
          &nbsp;{Dislikes.length}
          {/* {Dislikes.length === 1 ? " Dislike" : " Dislikes"} */}
        </>
      );
    }

    return (
      <>
        <i className="bi bi-hand-thumbs-down"></i>
        {/* &nbsp;Dislike */}
      </>
    );
  };

  return (
    <span
      style={{
        float: "right",
        cursor: "pointer",
        marginTop: "-7px",
      }}
      onClick={userId && candislikeflag ? handleDislike : null}
    >
      {!userId ? (
        <button
          className="btn btn-danger"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          type="button"
          title="Login first to dislike this post."
        >
          <DislikeStatus />
        </button>
      ) : (
        <button className="btn btn-danger">
          <DislikeStatus />
        </button>
      )}
    </span>
  );
}
