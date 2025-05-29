import { useEffect, useState } from "react";
import { completeTask, createTask, deleteTask, fetchTasks, Task, updateTask } from "../../api/tastks";
import { replace } from "react-router-dom";
import './Home.css'

import DeleteIcon from '@mui/icons-material/Delete';
import CompleteIcon from '@mui/icons-material/Check';
import RestoreIcon from '@mui/icons-material/RestartAlt';
import CancelIcon from '@mui/icons-material/Cancel';

import LogoutBtn from "../../components/LogoutBtn";

export default function Home(){
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTitle, setNewTitle] = useState('')
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingTitle, setEditingTitle] = useState('');
    useEffect(() => {
        fetchTasks().then(setTasks).catch(console.error);
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if(!newTitle.trim())
            return;

        const newTask = await createTask(newTitle)
        setTasks([...tasks, newTask])
        setNewTitle('')
    }

    const handleComplete = async (id: number, completed: boolean) => {
        const updatedTask = await completeTask(id, completed)
        setTasks(tasks => tasks.map(task =>
            task.id === updatedTask.id ? updatedTask : task
        ));
    }

    const handleDelete = async (id: number) => {
        await deleteTask(id)
        setTasks(tasks.filter(task => task.id !== id));
    }

    const handleUpdate = async (e: React.FormEvent) =>{
        e.preventDefault();
        if(!editingTitle.trim()) return;
        const updatedTask = await updateTask(editingId, {title:editingTitle})
        setTasks(tasks.map(t => (editingId === t.id ? updatedTask : t)))
        setEditingId(null);
    }

    return (
        <div id="home-body">
            <div id="home-header">
                <h1 id="home-logo">Task Manager</h1>
                <div id="home-logout-btn">
                    <LogoutBtn />
                </div>
            </div>
            
            <form onSubmit={handleCreate} id="home-form">
                <input className="home-form-input" placeholder="New Task" value={newTitle} onChange={e => (setNewTitle(e.target.value))} maxLength={30}></input>
                <button id="home-form-button" type="submit">OK</button>
            </form>
            <div id="home-tasks-container">
                <div className="home-tasks-list-container">
                    <h2 className="home-tasks-list-header">To be Done</h2>
                    <hr />
                    <ul className="home-tasks-list">
                        {tasks.filter(task => !task.completed).map(task => (

                            <li className="home-tasks-list-item" key={task.id} onDoubleClick={e => setEditingId(task.id)}>
                            
                                {editingId === task.id ? (
                                    <form className="home-tasks-list-item-button-container" onSubmit={e => handleUpdate}>
                                        <input className="home-form-input" value={editingTitle} placeholder={task.title} onChange={e => setEditingTitle(e.target.value)}
                                        onKeyDown={e => {
                                            if(e.key === 'Enter'){
                                                handleUpdate(e)
                                            }
                                            else if(e.key === 'Escape'){
                                                setEditingId(null)
                                                setEditingTitle('')
                                            }
                                        }}/>
                                        
                                        <button className="home-tasks-list-item-button" onClick={e => {setEditingId(null); setEditingTitle('')}}><CancelIcon id="icon" fontSize='inherit'/></button>
                                        <button className="home-tasks-list-item-button" onClick={e => {handleUpdate(e)}}><CompleteIcon id="icon" fontSize='inherit'/></button>
                                    </form>
                                ):(
                                    <>
                                        {task.title}
                                        <div className="home-tasks-list-item-button-container">
                                            <button className="home-tasks-list-item-button" onClick={e => handleComplete(task.id, true)}><CompleteIcon id="icon" fontSize='inherit'/></button>
                                            <button className="home-tasks-list-item-button" onClick={e => handleDelete(task.id)}><DeleteIcon className="icon" fontSize='inherit'/></button>
                                        </div>
                                    </>
                                )}
                            </li>
                            
                        ))}
                    </ul>
                </div>
                <div className="home-tasks-list-container">
                    <h2 className="home-tasks-list-header">Completed Tasks</h2>
                    <hr />
                    <ul className="home-tasks-list">
                        {tasks.filter(task => task.completed).map(task => (
                            <li className="home-tasks-list-item completed" key={task.id}>
                                {task.title}
                            <div className="home-tasks-list-item-button-container">
                                <button className="home-tasks-list-item-button" onClick={e => handleComplete(task.id, false)}><RestoreIcon className="icon" fontSize='inherit'/></button>
                                <button className="home-tasks-list-item-button" onClick={e => handleDelete(task.id)}><DeleteIcon className="icon" fontSize='inherit' /></button>
                            </div>
                            </li>
                            
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    )
}