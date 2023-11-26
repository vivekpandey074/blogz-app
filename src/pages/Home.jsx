import { useEffect, useState } from "react";
import BlogSection from "../components/BlogSection";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import Tags from "../components/Tags";
import MostPopular from "../components/MostPopular";
import Trending from "../components/Trending";

export default function Home({ user }) {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [trendBlogs, setTrendBlogs] = useState([]);

  const getTrendingBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const trendQuery = query(blogRef, where("trending", "==", "yes"));
    const querySnapshot = await getDocs(trendQuery);
    let trendBlogs = [];
    querySnapshot.forEach((doc) => {
      trendBlogs.push({ id: doc.id, ...doc.data() });
    });
    setTrendBlogs(trendBlogs);
  };

  useEffect(() => {
    getTrendingBlogs();

    const unsub = onSnapshot(
      collection(db, "blogs"),
      (snapshot) => {
        let list = [];
        let tags = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
          tags.push(...doc.get("tags"));
        });
        const uniqueTags = [...new Set(tags)];
        setTags(uniqueTags);
        setBlogs(list);
        setLoading(false);
      },
      (error) => {
        toast.error(error);
      }
    );

    return () => {
      unsub();
      getTrendingBlogs();
    };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("This will permanently delete the blog.Are you sure?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "blogs", id)).catch(() => {
          toast.error(
            "Error occured while deleting.Try again after some time!"
          );
        });
        toast.success("Blog deleted successfully");
        setLoading(false);
      } catch (err) {
        toast.error(err);
      }
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="container-fluid pb-4 pt-4 padding">
        <div className="container padding">
          <div className="row mx-0">
            <Trending blogs={trendBlogs} />
            <div className="col-md-8">
              <BlogSection
                blogs={blogs}
                user={user}
                handleDelete={handleDelete}
              />
            </div>
            <div className="col-md-3">
              <Tags tags={tags} />
              <MostPopular blogs={blogs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
