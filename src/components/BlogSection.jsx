import FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";
import { excerpt } from "../utility";
import "../style.scss";

export default function BlogSection({
  user,
  handleDelete,
  id,
  title,
  description,
  userId,
  timestamp,
  category,
  imgUrl,
  author,
  comments,
  likes,
  Dislikes,
}) {
  let popularity =
    Dislikes.length > 0 && likes.length > 0
      ? likes.length / (Dislikes.length + likes.length)
      : 1;

  return (
    <div>
      <div className="row pb-4" key={id}>
        <div className="col-md-5">
          <div className="hover-blogs-img">
            <div className="blogs-img">
              <img src={imgUrl} alt={title} />
              <div></div>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="text-start">
            <h6 className="category catg-color">{category}</h6>
            <h6 className="category catg-color" style={{ marginLeft: "5px" }}>
              {"Like Ratio: " + popularity * 100 + "%"}
            </h6>
            <h6 className="category catg-color" style={{ marginLeft: "5px" }}>
              <i className="bi bi-bar-chart-fill"></i>{" "}
              {comments?.length * 100 +
                likes?.length * 50 +
                Dislikes?.length * 10}
            </h6>
            <span className="title py-2">{excerpt(title, 40)}</span>
            <span className="meta-info">
              <p className="author">{author}</p>-&nbsp;
              {timestamp?.toDate().toDateString()}
            </span>
          </div>
          <div className="short-description text-start">
            {excerpt(description, 90)}
          </div>
          <Link to={`/detail/${id}`}>
            <button className="btn btn-read">Read More</button>
          </Link>
          {user?.uid && userId === user.uid && (
            <div style={{ float: "right" }}>
              <i
                className="bi bi-trash"
                style={{ margin: "5px", cursor: "pointer" }}
                onClick={() => handleDelete(id)}
              ></i>
              <Link to={`/update/${id}`}>
                <i
                  className="bi bi-pencil-square"
                  style={{ margin: "5px", cursor: "pointer" }}
                ></i>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
