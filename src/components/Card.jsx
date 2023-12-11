import React from "react";
import { excerpt } from "../utility";
import { Link } from "react-router-dom";

export default function Card({
  title,
  description,
  imgUrl,
  id,
  likes,
  Dislikes,
  comments,
}) {
  return (
    <div className="col-sm-6 col-lg-4 mb-5">
      <div className="related-content card text-decoration-none overflow-hidden h-100">
        <img className="related-img card-img-top" src={imgUrl} alt={title} />
        <div className="related-body card-body p-4">
          <h5 className="title text-start py-2">{title}</h5>
          <p className="short-description text-start">
            {excerpt(description, 40)}
          </p>
          <div className="d-flex justify-content-between">
            <Link
              to={`/detail/${id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <span className="text-primary">Read More</span>
            </Link>
            <i className="bi bi-hand-thumbs-up">{" " + likes.length}</i>
            <i className="bi bi-hand-thumbs-down">{" " + Dislikes.length}</i>
            <i className=" bi bi-chat-left-dots">{" " + comments.length}</i>
          </div>

          {/* Showing like and comment here */}
        </div>
      </div>
    </div>
  );
}
