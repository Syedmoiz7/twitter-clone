import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from "axios";
import { useEffect } from 'react';
import { useState, useContext } from 'react';
import './index.css'
import { GlobalContext } from '../context/Context';
import { Routes, Route, Link, Navigate } from "react-router-dom";





function Profile() {

    let { state, dispatch } = useContext(GlobalContext);

    const [tweets, setTweets] = useState([]);
    const [loadTweet, setLoadTweet] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editingTweet, setEditingTweet] = useState(null)

    const getAllTweets = async () => {
        try {
            const response = await axios.get(`${state.baseUrl}/tweets`)
            console.log("response: ", response.data);
            setTweets(response.data.data)

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

            axios.post(`${state.baseUrl}/tweet`, {
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
            <div className='changePassword'>
                <button><Link to={'/change-password'}>Change Password</Link></button>
            </div>

            <form onSubmit={myFormik.handleSubmit}>
                <textarea
                    id="tweetText"
                    placeholder="What's in your mind"
                    value={myFormik.values.tweetText}
                    onChange={myFormik.handleChange}
                    rows="5"
                    cols="50"
                ></textarea>
                {
                    (myFormik.touched.tweetText && Boolean(myFormik.errors.tweetText)) ?
                        <span style={{ color: "red" }}>{myFormik.errors.tweetText}</span>
                        :
                        null
                }
                <br />

                <button type="submit"> Tweet </button>
            </form>

            <br />
            <br />

            <div>
                {tweets.map((eachTweet, i) => (
                    <div key={i} className="productCont">
                        <h2>{eachTweet?.owner?.firstName}</h2>
                        <h5>{eachTweet?.text}</h5>

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
            </div>




        </div>
    )
}

export default Profile;