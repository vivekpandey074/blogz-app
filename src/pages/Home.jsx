import { useEffect, useState } from "react";
import BlogSection from "../components/BlogSection";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import Tags from "../components/Tags";
import Trending from "../components/Trending";
import Search from "../components/Search";
import { isEmpty, isNull } from "lodash";
import { useLocation } from "react-router-dom";
import Category from "../components/Category";
import FeaturedBlogs from "../components/FeaturedBlogs";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Home({ user }) {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [trendBlogs, setTrendBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const queryString = useQuery();
  const searchQuery = queryString.get("searchQuery");
  const [totalBlogs, setTotalBlogs] = useState([]);
  const [mostengagment, setMostEngagement] = useState([]);

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
        setTotalBlogs(list);
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
  const getBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const blogsQuery = query(blogRef, orderBy("likes", "desc"));
    const docSnapshot = await getDocs(blogRef);
    const sortedSnapshot = await getDocs(blogsQuery);

    setMostEngagement(
      sortedSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
    setBlogs(docSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setSearch(value);
  };

  useEffect(() => {
    if (!isNull(searchQuery)) {
      searchBlogs();
    } else {
      getBlogs();
    }
  }, [searchQuery]);

  const searchBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const searchTitle = query(
      blogRef,
      where("title", ">=", searchQuery),
      where("title", "<=", searchQuery + "\uf8ff")
    );

    const searchTagQuery = query(
      blogRef,
      where("tags", "array-contains", searchQuery)
    );

    const titleSnapshot = await getDocs(searchTitle);
    const tagSnapshot = await getDocs(searchTagQuery);

    let searchTitleBlogs = [];
    let searchTagBlogs = [];

    titleSnapshot.forEach((doc) => {
      searchTitleBlogs.push({ id: doc.id, ...doc.data() });
    });

    tagSnapshot.forEach((doc) => {
      searchTagBlogs.push({ id: doc.id, ...doc.data() });
    });

    const combinedSearchBlogs = searchTitleBlogs.concat(searchTagBlogs);

    setBlogs(combinedSearchBlogs);
  };

  //Category Count

  const counts = totalBlogs?.reduce((prevValue, currentValue) => {
    let name = currentValue.category;
    if (!prevValue.hasOwnProperty(name)) {
      prevValue[name] = 0;
    }

    prevValue[name]++;
    // delete prevValue["undefined"];
    return prevValue;
  }, {});

  const categoryCount = Object.keys(counts).map((k) => {
    return {
      category: k,
      count: counts[k],
    };
  });

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="container-fluid pb-4 pt-4 padding">
        <div className="container padding">
          <div className="row mx-0">
            <Trending blogs={trendBlogs} />
            <div className="col-md-8">
              <div className="blog-heading text-start py-2 mb-4">
                Daily Blogs
              </div>

              {blogs.length === 0 && location.pathname !== "/" && (
                <>
                  <h4>
                    No blogs found for the search query:{" "}
                    <strong>{searchQuery}</strong>
                  </h4>
                </>
              )}
              {blogs?.map((blog) => (
                <BlogSection
                  key={blog.id}
                  user={user}
                  handleDelete={handleDelete}
                  {...blog}
                />
              ))}
            </div>
            <div className="col-md-3">
              <Search search={search} handleChange={handleChange} />
              <Tags tags={tags} />
              <FeaturedBlogs blogs={mostengagment} title={"Most Popular"} />
              <Category catgBlogCount={categoryCount} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
