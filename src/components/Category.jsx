import React from "react";
import { Link } from "react-router-dom";

export default function Category({ catgBlogCount }) {
  return (
    <div className="wdiget">
      <div className="blog-heading text-start py-2 mb-4">Category</div>
      <div className="blog-heading text-start py-2 mb-4">
        <div className="link-widget">
          <ul>
            {catgBlogCount?.map((item, index) => (
              <li key={index}>
                <Link
                  to={`/category/${item.category}`}
                  style={{
                    textDecoration: "none",
                    float: "left",
                    color: "#777",
                  }}
                >
                  {item.category}
                  <span>{"(" + item.count + ")"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
