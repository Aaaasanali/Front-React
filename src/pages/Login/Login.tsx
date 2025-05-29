import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css'
import api from "../../api/axios";
export default function Login(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setError('')
        if (localStorage.getItem('token')) {
            navigate('/');
            return null;
        }
        try{
            const res = await api.get(`/users?username=${username}&password=${password}`)
            if(res.data.length===0){
                setError('Incorrect password or email');
                return;
            }
            localStorage.setItem('token', 'fake-jwt-token');
            navigate('/');
        }
        catch (err){
            setError('Login error');
            console.log(err)
        }
    }

    return (
        <div className="welcome-body">
            <div className="welcome-container">
                <h1 className="welcome-logo">Task Manager</h1>
                <div className="welcome-form-container">
                    <p className="welcome-message">Welcome back!</p>
                    <div className="welcome-form-body">
                        <h2 className="welcome-type">LogIn</h2>
                        <form onSubmit={handleSubmit} className="welcome-form">
                            <input className="welcome-form-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"></input>
                            <input className="welcome-form-input" type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"></input>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <button className="welcome-form-button" type='submit'>Login</button>
                        </form>
                        <p className="welcome-form-navigation">
                            New here? <a href="/register">Create account</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}