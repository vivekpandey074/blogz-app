import React, { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [btnvisibility, setBtnVisibilty] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 200) {
      setBtnVisibilty(true);
    } else {
      setBtnVisibilty(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  });

  return (
    <div>
      {btnvisibility && (
        <span className="scroll-to-top" onClick={scrollTop}>
          <i className="bi bi-arrow-up-circle-fill"></i>
        </span>
      )}
    </div>
  );
}
