import React from "react";
import "../style.scss";
import { Link } from "react-router-dom";

export default function Tags({ tags }) {
  return (
    <div>
      <div>
        <div className="blog-heading text-start py-2 mb-4">Tags</div>
        <div className="tags">
          {tags?.map((tag, index) => (
            <p className="tag" key={index}>
              <Link
                to={`/tag/${tag}`}
                style={{ textDecoration: "none", color: "black" }}
              >
                {"#"}
                {tag}
              </Link>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
