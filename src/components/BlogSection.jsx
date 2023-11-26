import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import { excerpt } from "../utility";
import "../style.scss";

export default function BlogSection({ blogs, user, handleDelete }) {
  return (
    <div>
      <div className="blog-heading text-start py-2 mb-4">Daily Blogs</div>
      {blogs?.map((item) => (
        <div className="row pb-4" key={item.id}>
          <div className="col-md-5">
            <div className="hover-blogs-img">
              <div className="blogs-img">
                <img src={item.imgUrl} alt={item.title} />
                <div></div>
              </div>
            </div>
          </div>
          <div className="col-md-7">
            <div className="text-start">
              <h6 className="category catg-color">{item.category}</h6>
              <span className="title py-2">{excerpt(item.title, 40)}</span>
              <span className="meta-info">
                <p className="author">{item.author}</p>-&nbsp;
                {item.timestamp.toDate().toDateString()}
              </span>
            </div>
            <div className="short-description text-start">
              {excerpt(item.description, 90)}
            </div>
            <Link to={`/detail/${item.id}`}>
              <button className="btn btn-read">Read More</button>
            </Link>
            {user?.uid && item.userId === user.uid && (
              <div style={{ float: "right" }}>
                <i
                  className="bi bi-trash"
                  style={{ margin: "5px", cursor: "pointer" }}
                  onClick={() => handleDelete(item.id)}
                ></i>
                <Link to={`/update/${item.id}`}>
                  <i
                    className="bi bi-pencil-square"
                    style={{ margin: "5px", cursor: "pointer" }}
                  ></i>
                </Link>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
