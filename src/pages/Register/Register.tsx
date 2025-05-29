import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios"
export default function Register(){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
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
            const res = await api.get(`/users?email=${username}`)
            if (res.data.length>0){
                setError('User with such email already exists');
                return;
            }
            
            const newUser = {username, password}
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
        <div id="body">
            <div id="container">
                <h2>Registration</h2>
                <form onSubmit={handleSubmit}>
                    <input type='email' value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"></input>
                    <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"></input>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type='submit'>Create account</button>
                </form>
                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
}