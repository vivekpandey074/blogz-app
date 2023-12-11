import { Button } from "bootstrap";
import React from "react";

export default function Like({ handleLike, likes, userId, canlikeflag }) {
  const LikeStatus = () => {
    if (likes?.length > 0) {
      return likes.find((id) => id === userId) ? (
        <>
          <i className="bi bi-hand-thumbs-up-fill"></i>
          &nbsp;{likes.length}
          {/* {likes.length === 1 ? " Like" : " Likes"} */}
        </>
      ) : (
        <>
          <i className="bi bi-hand-thumbs-up"></i>
          &nbsp;{likes.length}
          {/* {likes.length === 1 ? " Like" : " Likes"} */}
        </>
      );
    }

    return (
      <>
        <i className="bi bi-hand-thumbs-up"></i>
        {/* &nbsp;Like */}
      </>
    );
  };

  return (
    <span
      style={{
        float: "right",
        cursor: "pointer",
        marginTop: "-7px",
        marginLeft: "10px",
      }}
      onClick={userId && canlikeflag ? handleLike : null}
    >
      {!userId ? (
        <button
          className="btn btn-primary"
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          type="button"
          title="Login first to like this post."
        >
          <LikeStatus />
        </button>
      ) : (
        <button className="btn btn-primary">
          <LikeStatus />
        </button>
      )}
    </span>
  );
}
