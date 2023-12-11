import React from "react";
import Card from "./Card";

export default function RelatedBlogs({ blogs, id }) {
  return (
    <div>
      <div className="blog-heading text-start pt-3 py-2 mb-4">
        Related Blogs
      </div>
      <div className="col-md-12 text-left justify-content-center">
        <div className="row gx-5">
          {blogs.length === 1 && (
            <h5 className="text-center">No related blog with current blog</h5>
          )}
          {blogs
            ?.filter((blogs) => blogs.id !== id)
            .map((item) => (
              <Card key={item.id} {...item} />
            ))}
        </div>
      </div>
    </div>
  );
}
