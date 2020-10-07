import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import NewPost from "./NewPost";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";

import { auth, db } from "./firebase";
import { Button, Input } from "@material-ui/core";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([]);
  const [openSignUpModal, setOpenSignUpModal] = useState(false);
  const [openSignInModal, setOpenSignInModal] = useState(false);
  const [openNewPostModal, setNewPostModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user logged in
        console.log("AUTH USER", authUser);
        setUser(authUser);
        if (authUser.displayName) {
          // we already have a username
        } else {
          //  we don't have a username
          return authUser.updateProfile({ displayName: username });
        }
      } else {
        // user logged out
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, []);

  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignUpModal(false);
  };

  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));
    setOpenSignInModal(false);
  };

  return (
    <div className="App">
      <Modal open={openSignUpModal} onClose={() => setOpenSignUpModal(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              />
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>
              Sign Up
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignInModal} onClose={() => setOpenSignInModal(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
              />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      <Modal open={openNewPostModal} onClose={() => setNewPostModal(false)}>
        <div style={modalStyle} className={classes.paper}>
          {user?.displayName && (
            <NewPost
              setNewPostModal={setNewPostModal}
              username={user.displayName}
            />
          )}
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />
        {user ? (
          <div className="app__loggedinContainer">
            <Button onClick={() => setNewPostModal(true)}>
              Create New Post{" "}
            </Button>
            <Button onClick={() => auth.signOut()}>Logout</Button>
          </div>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignInModal(true)}>Sign In</Button>
            <Button onClick={() => setOpenSignUpModal(true)}>Sign Up</Button>
          </div>
        )}
      </div>
      {user ? (
        <div className="app__posts">
          {posts.map(({ id, post }) => (
            <Post
              postId={id}
              key={id}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
              user={user}
            />
          ))}
        </div>
      ) : (
        <div className="app__infoMessage">
          <h2>
            Instagram Clone App (Made By{" "}
            <a href="http://ahadzai.com/" target="_blank">
              Ahad Zai
            </a>
            )
          </h2>
          <br />
          <h3>Description: </h3>
          <p>
            This project mimics the functionality of a popular social media
            site, Instagram.
            <br />
            You can add new posts, view other people's posts and comment on each
            other's posts.
            <br />
            This project was created using HTML, CSS, JavaScript and React. With
            Firebase as the backend. <br />
            <br />
            Source Code:{" "}
            <a
              href="https://github.com/AhadKhan98/Instagram-Clone-ReactJS"
              target="_blank"
            >
              View On GitHub
            </a>
            <br />
            <br />
            <strong>Note</strong>: This app does not sync or affect your actual
            Instagram posts, it only mimics the functionality.
            <br />
            It also does not have features such as following users. All the
            posts are displayed to everyone that signed up on this app.
          </p>
          <br />
          <h3>Instructions: </h3>
          <p>
            <ol>
              <li>Login/Sign up using the buttons above.</li>
              <li>You will be able to see all of the existing posts.</li>
              <li>
                Add a new post by clicking on the 'Create New Post' at the top.
              </li>
              <li>
                You can add comments to other's posts and they will show up in
                real-time.
              </li>
            </ol>
          </p>
          <br />
          <h4>Please login/signup in order to view or create posts</h4>
        </div>
      )}
    </div>
  );
}

export default App;
