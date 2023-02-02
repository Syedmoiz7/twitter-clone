import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from "axios";
import moment from 'moment/moment';
import { useEffect } from 'react';
import { useState, useContext } from 'react';
import './home.css'
import { GlobalContext } from '../context/Context';
import InfiniteScroll from 'react-infinite-scroller';
import { HiOutlineGif } from 'react-icons/hi2'
import { CgImage } from 'react-icons/cg'
import { BiPoll, BiSmile } from 'react-icons/bi'
import { GoLocation } from 'react-icons/go'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import {fa-solid fa-reply } from '@fortawesome/react-fontawesome'
// import { fa-solid fa-retweet} from '@fortawesome/react-fontawesome'
// import {fa solid fa-heart } from '@fortawesome/react-fontawesome'


function Home() {

    let { state, dispatch } = useContext(GlobalContext);

    const [tweets, setTweets] = useState([]);
    const [loadTweet, setLoadTweet] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editingTweet, setEditingTweet] = useState(null)
    const [preview, setPreview] = useState(null)
    const [eof, setEof] = useState(false)

    const getAllTweets = async () => {

        if (eof) return

        try {
            const response = await axios.get(`${state.baseUrl}/tweetFeed?page=${tweets.length}`)
            console.log("response: ", response.data);

            if (response.data.data.length === 0) setEof(true)

            setTweets((prev) => {

                // if (prev.length >= 10) {
                //     prev = prev.slice(5)
                // }
                return [...prev, ...response.data.data]
            })

        } catch (error) {
            console.log("error in getting tweets ", error);
        }
    }

    const deleteTweet = async (id) => {
        try {
            const response = await axios.delete(`${state.baseUrl}/tweet/${id}`)
            console.log("response: ", response.data);
            setLoadTweet(!loadTweet)

        } catch (error) {
            console.log("error in deleting tweets ", error);
        }
    }

    const editMode = (tweet) => {
        setIsEditMode(!isEditMode)
        setEditingTweet(tweet)

        editFormik.setFieldValue("tweetName", tweet.name)
        editFormik.setFieldValue("tweetPrice", tweet.price)
        editFormik.setFieldValue("tweetDescription", tweet.description)
    }

    useEffect(() => {
        getAllTweets()
    }, [loadTweet])

    let baseUrl = "";
    if (window.location.href.split(":")[0] === "http") {
        baseUrl = "http://localhost:5000";
    }

    const tweetValidationSchema = yup.object({
        tweetText: yup
            .string('Enter your tweet text')
            .required('tweet text is required')
            .min(3, "please enter more then 3 characters ")
            .max(140, "please enter within 140 characters ")
    })

    const myFormik = useFormik({
        initialValues: {
            tweetText: ''
        },
        validationSchema: tweetValidationSchema,
        onSubmit: (values) => {
            console.log("values: ", values);

            let fileInput = document.getElementById("picture");
            console.log("fileInput: ", fileInput.files[0]);

            let formData = new FormData();

            formData.append("myFile", fileInput.files[0])
            formData.append("text", values.tweetText)

            axios({
                method: 'post',
                url: `${state.baseUrl}/tweet`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(res => {
                    setLoadTweet(!loadTweet)
                    console.log("upload success: ", res.data);
                })
                .catch(err => {
                    console.log("error:", err);
                })
        },
    });

    const editFormik = useFormik({
        initialValues: {
            tweetText: ''
        },
        validationSchema: tweetValidationSchema,
        onSubmit: (values) => {
            console.log("values: ", values);

            axios.put(`${state.baseUrl}/tweet/${editingTweet._id}`, {
                text: values.tweetText
            })
                .then(response => {
                    console.log("response: ", response.data);
                    setLoadTweet(!loadTweet)
                })
                .catch(err => {
                    console.log("error: ", err);
                })
        },
    });

    return (
        <div className='main'>

            <h1>Home</h1>

            <div className="alignCenter">
                <div class="tweet-container">
                    <div class="tweet-header">
                        <img src="https://atd-blog.s3.us-east-2.amazonaws.com/wp-content/uploads/2022/04/16142811/cool-profile-pictures-for-tiktok-5-678x1024.webp" class="profile-image" />
                        <h3 class="username">@username</h3>
                    </div>

                    <form onSubmit={myFormik.handleSubmit}>
                        <div className="tweetInput">
                            <input
                                id="tweetText"
                                placeholder="What's happening?"
                                value={myFormik.values.tweetText}
                                onChange={myFormik.handleChange}
                                rows="5"
                                cols="50"
                            ></input>
                        </div>

                        <div className="preview">
                            <img width={410} src={preview} alt="" className='prevImage' />
                        </div>

                        <hr />

                        {
                            (myFormik.touched.tweetText && Boolean(myFormik.errors.tweetText)) ?
                                <span style={{ color: "red" }}>{myFormik.errors.tweetText}</span>
                                :
                                null
                        }
                        <br />




                        <div class="image-upload">
                            <div className="iconsContainer">
                                <label for="file-input">
                                    <CgImage className='icons' />
                                </label>
                                <HiOutlineGif className='icons' />
                                <BiPoll className='icons' />
                                <BiSmile className='icons' />
                                <GoLocation className='icons' />
                            </div>
                            <input type="file" accept='image/*' id="file-input"
                                onChange={(e) => {

                                    let url = URL.createObjectURL(e.currentTarget.files[0])
                                    console.log("url: ", url);

                                    setPreview(url)
                                }} />



                            <br />

                            <div className="tweetButton">
                                <button type="submit"> Tweet </button>
                            </div>
                        </div>



                    </form>

                    <div class="tweet-footer">
                        <p class="tweet-date">Jan 30, 2023</p>
                        <div class="tweet-actions">
                            <i class="fa fa-reply"></i>
                            <i class="fa fa-retweet"></i>
                            <i class="fa fa-heart"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tweet">

                <br />
                <br />

                <InfiniteScroll
                    pageStart={0}
                    loadMore={getAllTweets}
                    hasMore={!eof}
                    loader={<div className="loader" key={0}>Loading ...</div>}
                >

                    {tweets.map((eachTweet, i) => (
                        <div key={i} className="productCont">
                            <h2>{eachTweet?.owner?.firstName}</h2>
                            <div>{moment(eachTweet.createdOn).fromNow()}</div>
                            <p>{eachTweet?.text}</p>

                            <img src={eachTweet.imageUrl} alt="tweet image" />

                            <br />

                            <button onClick={() => {
                                deleteTweet(eachTweet._id)
                            }}>Delete</button>

                            <button onClick={() => {
                                editMode(eachTweet)
                            }}>Edit</button>

                            {(isEditMode && editingTweet._id === eachTweet._id) ?
                                <div>
                                    <form onSubmit={editFormik.handleSubmit}>
                                        <input
                                            id="tweetText"
                                            placeholder="Product Name"
                                            value={editFormik.values.tweetText}
                                            onChange={editFormik.handleChange}
                                        />
                                        {
                                            (editFormik.touched.tweetText && Boolean(editFormik.errors.tweetText)) ?
                                                <span style={{ color: "red" }}>{editFormik.errors.tweetText}</span>
                                                :
                                                null
                                        }

                                        <br />

                                        <input
                                            id="productPrice"
                                            placeholder="Product Price"
                                            value={editFormik.values.productPrice}
                                            onChange={editFormik.handleChange}
                                        />
                                        {
                                            (editFormik.touched.productPrice && Boolean(editFormik.errors.productPrice)) ?
                                                <span style={{ color: "red" }}>{editFormik.errors.productPrice}</span>
                                                :
                                                null
                                        }

                                        <br />

                                        <input
                                            id="productDescription"
                                            placeholder="Product Description"
                                            value={editFormik.values.productDescription}
                                            onChange={editFormik.handleChange}
                                        />
                                        {
                                            (editFormik.touched.productDescription && Boolean(editFormik.errors.productDescription)) ?
                                                <span style={{ color: "red" }}>{editFormik.errors.productDescription}</span>
                                                :
                                                null
                                        }

                                        <br />
                                        <button type="submit"> Submit </button>
                                    </form>
                                </div>
                                :
                                null}



                        </div>
                    ))}
                </InfiniteScroll>

            </div>
        </div>
    )
}

export default Home;