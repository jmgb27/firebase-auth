import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const [name, setName] = useState("");
    const navigate = useNavigate();
    /**
     * FetchUserName() is an async function that fetches the user's name from the database and sets it
     * to the state variable name.
     */
    const fetchUserName = async () => {
        try {
            const q = query(
                collection(db, "users"),
                where("uid", "==", user?.uid)
            );
            const doc = await getDocs(q);
            const data = doc.docs[0].data();
            setName(data.name);
        } catch (err) {
            console.error(err);
            alert("An error occured while fetching user data");
        }
    };
    /* A hook that runs when the component mounts and when the user or loading state changes. */
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
        fetchUserName();
    }, [user, loading]);
    return (
        <div className="dashboard">
            <div className="dashboard__container">
                Logged in as
                <div>{name}</div>
                <div>{user?.email}</div>
                <button className="dashboard__btn" onClick={logout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
export default Dashboard;
