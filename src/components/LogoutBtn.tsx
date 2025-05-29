import { useNavigate } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import './LogoutBtn.css'
export default function LogoutBtn(){
    const navigate = useNavigate()

    const handleLogOut = () => {
        if (!window.confirm('You sure you want to logout?')) return;
        localStorage.removeItem('token');
        navigate('/login')
    }

    return(
        <button onClick={handleLogOut} id="logout-btn"><LogoutIcon fontSize="inherit" /></button>
    );
}