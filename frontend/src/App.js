import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";

// import Socket

import { AppContext, socket } from "./Context/appContext";

// import components
import Navigation from "./Components/Navigation";

// import pages
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import Chat from "./pages/Chat";

const App = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState([]);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [privateMemberMsg, setPrivateMemberMsg] = useState({});
  const [newMessages, setNewMessages] = useState({});
  const { user } = useSelector((state) => state.user);
  return (
    <>
      <AppContext.Provider
        value={{
          socket,
          currentRoom,
          setCurrentRoom,
          members,
          setMembers,
          messages,
          setMessages,
          privateMemberMsg,
          setPrivateMemberMsg,
          rooms,
          setRooms,
          newMessages,
          setNewMessages,
        }}
      >
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          {!user && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </AppContext.Provider>
    </>
  );
};

export default App;
