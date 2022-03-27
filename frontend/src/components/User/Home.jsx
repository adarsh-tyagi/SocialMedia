import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { homePosts } from "../../features/postSlice";
import { TiSocialInstagram } from "react-icons/ti";
import { Link } from "react-router-dom";
import Loader from "../Loader/Loader";
import PostCard from "../Posts/PostCard";

const Home = () => {
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const {
    loading: postLoading,
    homePosts: homePost,
    numOfPosts,
    postPerPage,
  } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(homePosts(page));
  }, [dispatch, page]);

  return (
    <Fragment>
      {loading || postLoading ? (
        <Loader />
      ) : isAuthenticated ? (
        <div className="home">
          <div className="home__posts">
            {homePost.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
            <div>
              {page > 1 ? (
                <button onClick={() => setPage((page) => page - 1)}>
                  Previous
                </button>
              ) : (
                ""
              )}
              {numOfPosts < postPerPage ? (
                ""
              ) : (
                <button onClick={() => setPage((page) => page + 1)}>
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="home__msg">
          <div>
            <p>Share your emotions in picture with the world</p>
            <div>
              <TiSocialInstagram />
              <p>Photogram</p>
            </div>
            <Link to="/signin">Sign In</Link>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Home;
