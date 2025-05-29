import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"
import './Register.css'
export default function Register(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (localStorage.getItem('token')) {
            navigate('/');
            return null;
        }
        try{
            console.log('Registering:', username, password);
            const res = await api.get(`/users?username=${username}`)
            if (res.data.length>0){
                setError('User with such username already exists');
                return;
            }
            
            const newUser = {username, password, firstname, lastname}
            await api.post(`/users`, newUser)
            localStorage.setItem('token', 'fake-jwt-token');
            navigate('/');
        }
        catch (err){
            setError('Ошибка регистрации');
            console.error(err);
        }
    }

    return (
        <div className="welcome-body">
            <div className="welcome-container">
                <h1 className="welcome-logo">Task Manager</h1>
                <div className="welcome-form-container">
                    <p className="welcome-message">Welcome!</p>
                    <div className="welcome-form-body">
                        <h2 className="welcome-type">Register</h2>
                        <form onSubmit={handleSubmit} className="welcome-form-registration">
                            <input className="welcome-form-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"></input>
                            <input className="welcome-form-input" type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"></input>
                            <input className="welcome-form-input" value={firstname} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name"></input>
                            <input className="welcome-form-input" value={lastname} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name"></input>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                            <button className="welcome-form-button-registration" type='submit'>Create account</button>
                        </form>
                        <p className="welcome-form-navigation">
                            Already have an account? <a href="/login">Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}