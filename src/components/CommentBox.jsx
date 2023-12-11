import React from "react";
import { useNavigate } from "react-router-dom";

export default function CommentBox({
  userId,
  userComment,
  setUserComment,
  handleComment,
}) {
  const navigate = useNavigate();

  return (
    <>
      <form className="row blog-form">
        <div className="col-12 py-3">
          <textarea
            rows="4"
            value={userComment}
            placeholder="Type your comment here."
            onChange={(e) => setUserComment(e.target.value)}
            className="form-control description"
          ></textarea>
        </div>
      </form>
      {!userId ? (
        <>
          <h5>Please Login/Register to continue</h5>
          <button className="btn btn-success" onClick={() => navigate("/auth")}>
            Login
          </button>
        </>
      ) : (
        <>
          <button
            className="btn btn-primary"
            type="submit"
            onClick={handleComment}
          >
            Post Comment
          </button>
        </>
      )}
    </>
  );
}
