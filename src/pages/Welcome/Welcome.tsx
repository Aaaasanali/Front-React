import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Login from "./Login/Login";
import Register from "./Register/Register";
import './Welcome.css';
import { useRef, useEffect, useState } from "react";

export function Welcome() {
    const { type } = useParams();
    const location = useLocation();
    const prevPath = useRef<string|null>(null);
    const [exitting, setExiting] = useState(false);
    const [reloaded, setReloaded] = useState(false);
    useEffect(() => {
        prevPath.current = location.pathname;
    }, [location.pathname]);

    const shouldAnimate = (prevPath.current && prevPath.current !== "/welcome/login" && prevPath.current !== "/welcome/register")
    return (
        <div className="welcome-body">
            <div className="welcome-container">
                <motion.div
                    initial={shouldAnimate ? { x: -600 } : false}
                    animate={{ x: 0 }}
                    exit = {exitting ?  { x: -800 }: undefined}
                    transition={shouldAnimate ? { duration: 1.5 } : undefined}        
                >
                    <h1 className="welcome-logo">Task Manager</h1>
                </motion.div>
                <motion.div initial={{ x: 600 }} animate={{ x: 0 }} exit={{ x: 600}} transition={{ duration: 1, ease: "easeInOut" }}>
                    {type === 'login' ? <Login triggerExit={() => setExiting(true)}/> : <Register triggerExit={() => setExiting(true)}/>}
                </motion.div>
            </div>
        </div>
    );
}