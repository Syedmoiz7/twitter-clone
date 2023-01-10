import './index.css';
import { Routes, Route, Link, Navigate } from "react-router-dom";

import { GlobalContext } from '../context/Context';
import { useContext } from "react";
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

import Home from "./home";
import About from "./about";
import Gallery from "./gallery";
import Login from "./login"
import Signup from "./signup"
import { get } from 'mongoose';




function Render() {

  let { state, dispatch } = useContext(GlobalContext);

  console.log("state: ", state);

  const logutHandler = async () => {


    try {
      let response = await axios.post(`${state.baseUrl}/logout`,
        {}, {
        withCredentials: true
      })

      dispatch({
        type: "USER_LOGOUT"
      })

    } catch (error) {
      console.log("error: ", error);
    }

  }

  useEffect(() => {

    const getProfile = async () => {

      try {
        let response = await axios.get(`${state.baseUrl}/profile`, {
          withCredentials: true
        })

        dispatch({
          type: "USER_LOGIN",
          payload: response.data
        })
      } catch (error) {

        console.log("error: ", error);
        dispatch({
          type: "USER_LOGOUT"
        })
      }


    }
    getProfile()
  }, []);

  useEffect(() => {
    
    // Add a request interceptor
    axios.interceptors.request.use(function (config) {
      // Do something before request is sent
      config.withCredentials = true
      return config;
    }, function (error) {
      // Do something with request error
      return Promise.reject(error);
    });

    // Add a response interceptor
    axios.interceptors.response.use(function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    }, function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error

      if (error.response.status === 401) {
        dispatch({
          type: "USER_LOGOUT"
        })
      } 
      return Promise.reject(error);
    });
  }, [])


  return (

    <div className="App">

      {
        (state.isLogin === true) ?
          <div className='navbar'>
            <ul>
              <li> <Link to={'/'}>Home</Link></li>
              <li> <Link to={'/gallery'}>Gallery</Link></li>
              <li> <Link to={'/about'}>About</Link></li>
              <li> <Link to={'/profile'}>Profile</Link></li>
            </ul>
            <div> {state?.user?.firstName} <button onClick={logutHandler}>Logout</button></div>
          </div>
          :
          null
      }

      {
        (state.isLogin === false) ?
          // <ul>
          //   <li> <Link to={'/'}>Login</Link></li>
          //   <li> <Link to={'/signup'}>Signup</Link></li>
          // </ul>
          ""
          :
          null
      }


      {(state.isLogin === true) ?

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="*" element={
            <Navigate to="/" replace={true} />
          } />
        </Routes>
        :
        null
      }

      {(state.isLogin === false) ?
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
        :
        null
      }

      {(state.isLogin === null) ?
        <div>
          loading
        </div>
        :
        null
      }


    </div>
  );
}

export default Render;





















