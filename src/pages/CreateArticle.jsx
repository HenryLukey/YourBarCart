import React, { useEffect, useState } from "react";
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { motion } from "framer-motion";
import { getDownloadURL, ref } from "firebase/storage";
import { useLocation, useNavigate } from "react-router-dom";
import { storage } from "../firebase-config";
import { ReactComponent as BackArrow } from "../icons/arrow-left.svg";
import RichTextEditor from "../components/RichTextEditor";
import RichImageEditor from "../components/RichImageEditor";

const CreateArticle = ({}) => {
    // Get the state from the current location from react router dom
    const {state} = useLocation();

    const initialValue = [];

    // Get access to react router dom's useNavigate
    const navigate = useNavigate();

    // Create a Slate editor object that won't change across renders.
    const [editor] = useState(() => withReact(createEditor()));

    // Navigate to home screen
    const returnToHome = () => {
        navigate("/");
    }

    return (
        <div>
            <h1 className="text-3xl font-black font-roboto py-4">Create an article</h1>
            <div className="flex flex-col justify-center py-8 space-y-4 pl-32">
                <div className="flex flex-col">
                    <label className="text-left mb-2">Title</label>
                    <input type="text" name="title" className="max-w-md" />
                </div>
                <div className="flex flex-col">
                    <label className="text-left mb-2">Deck</label>
                    <input type="text" name="deck" className="max-w-md" />
                </div>
                <div className="flex flex-col">
                    <label className="text-left mb-2">Tags</label>
                    <input type="text" name="tags" className="max-w-md" />
                </div>
                <div className="flex flex-col">
                    <label className="text-left mb-2">Main Image</label>
                    <input type="file" className="max-w-md" />
                </div>
                <br />
                <div className="bg-white max-wd-md">
                    <RichTextEditor />
                </div>
                <div className="flex flex-col">
                    <button className="bg-blue-500">Submit!</button>
                </div>
            </div>
        </div>
    );
}

export default CreateArticle;