import React, { useEffect, useRef, useState } from "react";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import "../style.scss";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Navigate, useNavigate, useParams } from "react-router-dom";

const initialState = {
  title: "",
  tags: [],
  trending: "no",
  category: "",
  description: "",
};

const categoryOptions = [
  "Fashsion",
  "Technology",
  "Food",
  "Politics",
  "Sports",
  "Business",
];

export default function AddEditBlog({ user, setActive }) {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const { title, tags, trending, category, description } = form;
  const toastId = React.useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // toast.info("Upload " + Math.round(progress) + "% done");
          setProgress(progress);
          if (toastId.current === null) {
            toastId.current = toast(
              "Upload " + Math.round(progress) + "% done",
              { autoClose: false }
            );
          } else {
            toast.update(toastId.current, {
              render: "Upload " + Math.round(progress) + "% done",
              autoClose: progress == 100 ? 3000 : false,
              type: progress == 100 ? toast.TYPE.SUCCESS : toast.TYPE.INFO,
            });
          }

          // switch (snapshot.state) {
          //   case "paused":
          //     toast.info("Upload is paused");
          //     break;

          //   case "running":
          //     toast.info("Upload is running");
          //     break;
          //   default:
          //     break;
          // }
        },
        (error) => {
          toast.error(error);
          toastId.current = null;
        },

        () => {
          toastId.current = null;
          getDownloadURL(uploadTask.snapshot.ref).then((downloadurl) => {
            setForm((prev) => ({ ...prev, imgUrl: downloadurl }));
          });
        }
      );
    };

    file && uploadFile();
  }, [file]);

  useEffect(() => {
    id && getBlogDetail();
  }, [id]);

  const getBlogDetail = async () => {
    const docRef = doc(db, "blogs", id);
    const snapshot = await getDoc(docRef).catch(() => {
      toast.error("Error occured while fetching database!.");
    });
    setForm({ ...snapshot.data() });
    setActive(null);
  };

  const handleChange = function (e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handletrending = function (e) {
    setForm({ ...form, trending: e.target.value });
  };

  const handleTags = function (tags) {
    setForm({ ...form, tags });
  };

  const onCategoryChange = function (e) {
    setForm({ ...form, category: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category && tags && title && file && description && trending) {
      //logic for creating first time
      if (!id) {
        try {
          await addDoc(collection(db, "blogs"), {
            ...form,
            timestamp: serverTimestamp(),
            author: user?.displayName,
            userId: user?.uid,
          });

          toast.success("Blog Uploaded succesfully!!", { autoClose: 1000 });
          navigate("/");
        } catch (err) {
          toast.error("Error in uploading data to server!!");
        }
      }
      //logic for update
      else {
        try {
          await updateDoc(doc(db, "blogs", id), {
            ...form,
            timestamp: serverTimestamp(),
            author: user?.displayName,
            userId: user?.uid,
          });

          toast.success("Blog Updates succesfully!!", { autoClose: 1000 });
          navigate("/");
        } catch (err) {
          toast.error("Error in uploading data to server!!");
        }
      }
    } else {
      toast.error("All fields are mandatory!");
    }
  };

  return user?.uid ? (
    <div>
      <div className="container-fluid mb-4">
        <div className="container">
          <div className="col-12">
            <div className="text-center heading py-2">
              {id ? "Update Blog" : "Create Blog"}
            </div>
          </div>
          <div className="row h-100 justify-content-center align-items-center">
            <div className="col-10 col-md-8 col-lg-6">
              <form className="row blog-form" onSubmit={handleSubmit}>
                <div className="col-12 py-3">
                  <input
                    type="text"
                    className="form-control input-text-box"
                    placeholder="Title"
                    name="title"
                    value={title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-12 py-3">
                  <ReactTagInput
                    tags={tags}
                    placeholder="Tags"
                    onChange={handleTags}
                    required
                  />
                </div>
                <div className="col-12 py-3">
                  <p className="trending">Is it trending?</p>
                  <div className="form-check-inline mx-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      value="yes"
                      name="radioOption"
                      checked={trending === "yes"}
                      onChange={handletrending}
                    />
                    <lable htmlFor="radioOption" className="form-check-label">
                      Yes &nbsp;
                    </lable>
                  </div>

                  <div className="form-check-inline mx-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      value="no"
                      name="radioOption"
                      checked={trending === "no"}
                      onChange={handletrending}
                    />
                    <lable htmlFor="radioOption" className="form-check-label">
                      No
                    </lable>
                  </div>
                </div>
                <div className="col-12 py-3">
                  <select
                    value={category}
                    onChange={onCategoryChange}
                    className="catg-dropdown"
                    required
                  >
                    <option>Please select category </option>
                    {categoryOptions.map((option, index) => (
                      <option value={option || ""} key={index}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 py-3">
                  <textarea
                    className="form-control description-box"
                    placeholder="Description"
                    value={description}
                    name="description"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                </div>
                <div className="col-12 py-3 text-center">
                  <button
                    type="submit"
                    className="btn btn-add"
                    disabled={progress !== null && progress < 100}
                  >
                    {id ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="container row  justify-content-center mt-4 mb-4">
      Please login first to create to new blog ;)
    </div>
  );
}
