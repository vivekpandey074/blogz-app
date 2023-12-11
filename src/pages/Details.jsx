import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
  orderBy,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import RelatedBlogs from "../components/RelatedBlogs";
import Tags from "../components/Tags";
import { isEmpty } from "lodash";
import UserComments from "../components/UserComments";
import CommentBox from "../components/CommentBox";
import Like from "../components/Like";
import FeaturedBlogs from "../components/FeaturedBlogs";
import Dislike from "../components/Dislike";

export default function Details({ setActive, user }) {
  const userId = user?.uid;
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState([]);
  const [likes, setLikes] = useState([]);
  const [Dislikes, setDislikes] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [refreshflag, setRefreshflag] = useState(0);

  useEffect(() => {
    const getRecentBlogs = async () => {
      const blogRef = collection(db, "blogs");
      const recentBlogs = query(
        blogRef,
        orderBy("timestamp", "desc"),
        limit(5)
      );
      const docSnapshot = await getDocs(recentBlogs);
      setRecentBlogs(
        docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    getRecentBlogs();
  }, []);

  useEffect(() => {
    id && getBlogDetail();
  }, [id]);

  const getBlogDetail = async () => {
    const blogsRef = collection(db, "blogs");
    const docRef = doc(db, "blogs", id);
    const blogDetail = await getDoc(docRef).catch(() => {
      toast.error("Error occured while fetching blogs!!");
    });
    setBlog(blogDetail.data());

    const relatedBlogsQuery = query(
      blogsRef,
      where("tags", "array-contains-any", blogDetail.data().tags, limit(3))
    );

    setComments(blogDetail.data().comments ? blogDetail.data().comments : []);

    setLikes(blogDetail.data().likes ? blogDetail.data().likes : []);

    setDislikes(blogDetail.data().Dislikes ? blogDetail.data().Dislikes : []);

    const relatedBlogsSnapshot = await getDocs(relatedBlogsQuery);

    const relatedBlogs = [];
    relatedBlogsSnapshot.forEach((doc) => {
      relatedBlogs.push({ id: doc.id, ...doc.data() });
    });
    setRelatedBlogs(relatedBlogs);
    setActive(null);
    setLoading(false);
  };

  useEffect(() => {
    if (refreshflag !== 0) {
      updateDoc(doc(db, "blogs", id), {
        ...blog,
        Dislikes,
        likes,
        timestamp: serverTimestamp(),
      });
    }
    setRefreshflag((prev) => prev + 1);
  }, [Dislikes, likes]);

  const handleComment = async (e) => {
    e.preventDefault();
    comments.push({
      createdAt: Timestamp.fromDate(new Date()),
      userId,
      name: user?.displayName,
      body: userComment,
    });
    await updateDoc(doc(db, "blogs", id), {
      ...blog,
      comments,
      timestamp: serverTimestamp(),
    });

    setComments(comments);
    setUserComment("");
  };

  const handleLike = async () => {
    if (userId) {
      if (blog?.likes) {
        const index = likes.findIndex((id) => id === userId);
        if (index === -1) {
          likes.push(userId);

          setLikes((likes) => [...new Set(likes)]);
        } else {
          let x = likes.filter((id) => id !== userId);

          setLikes(x);
        }
      }

      // await updateDoc(doc(db, "blogs", id), {
      //   ...blog,
      //   likes,
      //   timestamp: serverTimestamp(),
      // });
    }
  };

  const handleDislike = async () => {
    if (userId) {
      if (blog?.Dislikes) {
        const index = Dislikes.findIndex((id) => id === userId);
        if (index === -1) {
          Dislikes.push(userId);
          setDislikes([...new Set(Dislikes)]);
        } else {
          let x = Dislikes.filter((id) => id !== userId);

          setDislikes(x);
        }
      }

      // await updateDoc(doc(db, "blogs", id), {
      //   ...blog,
      //   Dislikes,
      //   timestamp: serverTimestamp(),
      // });
    }
  };
  if (loading) return <Spinner />;

  return (
    <div className="single">
      <div
        className="blog-title-box"
        style={{ backgroundImage: `url('${blog?.imgUrl}')` }}
      >
        <div className="overlay"></div>
        <div className="blog-title">
          <span>{blog?.timestamp?.toDate().toDateString()}</span>
          <h2>{blog?.title}</h2>
        </div>
      </div>
      <div className="container-fluid pb-4 pt-4 padding blog-single-content">
        <div className="container padding">
          <div className="row mx-0">
            <div className="col-md-8">
              <span className="meta-info text-start">
                By <p className="author">{blog?.author}</p>-&nbsp;
                {blog?.timestamp?.toDate().toDateString()}
                <Like
                  handleLike={handleLike}
                  likes={likes}
                  userId={userId}
                  canlikeflag={!Dislikes.includes(userId)}
                />
                <Dislike
                  handleDislike={handleDislike}
                  Dislikes={Dislikes}
                  userId={userId}
                  candislikeflag={!likes.includes(userId)}
                />
              </span>
              <p className="text-start">{blog?.description}</p>
              <br />
              <div className="custombox">
                <div className="scroll">
                  <h4 className="small-title">
                    {"(" + comments?.length + ")"} Comments
                  </h4>
                  {isEmpty(comments) ? (
                    <UserComments msg={"No comments yet."} />
                  ) : (
                    <>
                      {comments?.map((comment, index) => (
                        <UserComments key={index} {...comment} />
                      ))}
                    </>
                  )}
                </div>
              </div>
              <CommentBox
                userId={userId}
                userComment={userComment}
                setUserComment={setUserComment}
                handleComment={handleComment}
              />
            </div>

            <div className="col-md-3">
              <div className="text-start">
                <Tags tags={blog?.tags} />
              </div>
              <FeaturedBlogs blogs={recentBlogs} title={"Recent blogs"} />
            </div>
          </div>
        </div>
        <RelatedBlogs id={id} blogs={relatedBlogs} />
      </div>
    </div>
  );
}
