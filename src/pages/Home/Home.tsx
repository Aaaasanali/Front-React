import { useEffect, useState } from "react";
import { completeTask, createTask, deleteTask, fetchTasks, Task, updateTask } from "../../api/tastks";
import { AnimatePresence, motion } from "framer-motion";
import './Home.css'

import DeleteIcon from '@mui/icons-material/Delete';
import CompleteIcon from '@mui/icons-material/Check';
import RestoreIcon from '@mui/icons-material/RestartAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import LogoutIcon from '@mui/icons-material/Logout';
import { ConfirmWindow } from "../../components/ConfirmWindow";
import { useNavigate } from "react-router-dom";

export default function Home(){
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTitle, setNewTitle] = useState('')
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [currentTask, setCurrentTask] = useState<Task>()
    const [currentTaskColor, setCurrentTaskColor] = useState<string>('');
    const [placeholder, setPlaceholder] = useState("");
    const placeholderText = "New Task";
    const [tasksAnimation, setTasksAnimation] = useState(false)
    const navigate = useNavigate()
    const [showConfirm, setShowConfirm] = useState(false);
    const [draggable, setDraggable] = useState(true);
    useEffect(() => {
        fetchTasks().then(setTasks).catch(console.error);
    }, []);
    useEffect(() => {
        let i = 0;
        let interval: NodeJS.Timeout;
        const placeholderTyping = () =>{
            interval = setInterval(() => {
                setPlaceholder(placeholderText.slice(0, i+1));
                i++;
                if(i === placeholderText.length) clearInterval(interval)
            }, 200); 
        };

        const delay = setTimeout(placeholderTyping, 1500)

        return () => {
            clearInterval(interval);
            clearTimeout(delay)
        }
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
        setDraggable(true);
    }


    const dragStartHandler = (e: React.DragEvent<HTMLLIElement>, task: Task) => {
        // console.log(e, task)
        setCurrentTask(task)
        setCurrentTaskColor(e.currentTarget.style.background);
    }
    const dragLeaveHandler = (e: React.DragEvent<HTMLLIElement>, task: Task) => {
        // console.log(e, task)

        e.currentTarget.style.opacity = '1';
    }
    const dragEndHandler = (e: React.DragEvent<HTMLLIElement>, task: Task) => {
        // console.log(e, task)
    }
    const dragOverHandler = (e: React.DragEvent<HTMLLIElement>, task: Task) => {
        // console.log(e, task);
        e.preventDefault();

        e.currentTarget.style.opacity = '0.8';
    }
    const dropHandler = async (e: React.DragEvent<HTMLLIElement>, task: Task) => {
        e.preventDefault();
        console.log('here')
        e.currentTarget.style.opacity = '1';
        
        setTasks(tasks.map(t => {
            if (t.id === task.id && currentTask) {
                return { ...t, order: currentTask.order };
            }
            if (t.id === currentTask?.id) {
                return { ...t, order: task.order };
            }
            return t;
        }));
        if (currentTask)
            await updateTask(currentTask.id, { ...currentTask, order: task.order });
        await updateTask(task.id, { ...task, order: currentTask?.order || 0 });
        setCurrentTask(undefined);
    }




    const onDragOverListHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        e.currentTarget.style.background = '#90b2b5';
    }
    const onDragLeaveListHandler = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        e.currentTarget.style.background = '#8BAAAD';
    }
    const onDropListHandler = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.currentTarget.style.background = '#8BAAAD';
        if (!currentTask) return;
        if(e.currentTarget.getAttribute('list-type')){
            await handleComplete(currentTask.id, true);
        }
        else{
            await handleComplete(currentTask.id, false);
        }
        setCurrentTask(undefined);
    }

    const handleLogOut = () => {
        localStorage.removeItem('token');
        navigate('/login')
    }

    return (
        <div id="home-body">

            {showConfirm ? (
                <div className="confirmation-widnow">
                <ConfirmWindow
                    message="Are you sure you want to logout?"
                    onConfirm={handleLogOut}
                    onCancel={() => setShowConfirm(false)} />
                </div>
            ):(null)}
            

            <motion.div id="home-header" 
            initial={{translateY: -100, opacity: 0}} 
            animate={{translateY: 0, opacity: 1}} 
            transition={{duration: 2}}>
                <h1 id="home-logo">Task Manager</h1>
            <div id="home-logout-btn">
                <button onClick={e => setShowConfirm(true)} id="logout-btn"><LogoutIcon fontSize="inherit" color="inherit"/></button>
            </div>
            </motion.div>
            
            <form onSubmit={handleCreate} id="home-form">
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition = {{duration: 2, delay: 1}}>
                <motion.div initial={{width: 120}} animate={{width: 320}} transition = {{duration: 2, delay: 3.5}} onAnimationComplete={e => setTasksAnimation(true)}>
                    <input 
                    className="home-form-input" 
                    placeholder={placeholder} 
                    value={newTitle} 
                    onChange={e => (setNewTitle(e.target.value))} 
                    maxLength={30} 
                    />
                </motion.div>
                </motion.div>
                <motion.div initial={{width: 0}} animate={{width: 60, overflow: 'hidden'}} transition = {{duration: 0.5, delay: 5.5}} className="home-form-button-container">
                    <button id="home-form-button" type="submit">
                        <motion.span initial={{opacity: 0}} animate={{opacity: 1}} transition = {{duration: 0.5, delay: 6}} style={{ display: "inline-block" }}>
                            OK
                        </motion.span>
                        </button>
                </motion.div>
            </form>
            <div id="home-tasks-container">
                <div className="home-tasks-list-container">

                    <motion.h2 className="home-tasks-list-header"
                    initial={{opacity: 0}} 
                    animate={{opacity: 1}} 
                    transition = {{duration: 0.5, delay: 3}}
                    >To be Done</motion.h2>

                    <motion.hr 
                    initial={{width: 0, borderColor: '#8BAAAD'}} 
                    animate={{width: 475, borderColor: '#185153'}} 
                    transition = {{duration: 2, delay: 3.5}} />

                    <div className="home-tasks-list-empty"
                     onDragOver={(e) => onDragOverListHandler(e)} 
                     onDrop={(e) => onDropListHandler(e)}
                     onDragLeave={(e) => onDragLeaveListHandler(e)}>

                        <ul className="home-tasks-list" 
                        ><AnimatePresence>
                            {tasks
                            .sort((a: Task, b: Task) => a.order-b.order)
                            .filter(task => !task.completed)
                            .map(task => (
                                
                                <motion.div 
                                initial = {!tasksAnimation ? {y: 100, opacity: 0} : {y: 20, opacity: 0}} 
                                animate = {!tasksAnimation ? {y: 0, opacity: 1} : {y: 0, opacity: 1}} 
                                exit = {{y: 20, opacity: 0}} 
                                transition={!tasksAnimation ? {duration: 2, delay: 2.5} : {duration: 0.2}}
                                key={task.order} 
                                >
                                <li 
                                className="home-tasks-list-item" 
                                
                                onDoubleClick={e => {
                                    
                                    setEditingId(task.id)
                                    
                                    setEditingTitle(task.title);
                                }}
                                onClick={e => {
                                    if(e.shiftKey) handleComplete(task.id, !task.completed)
                                    
                                }}
                                draggable={draggable}
                                onDragStart={e => dragStartHandler(e, task)}
                                onDragLeave={e => dragLeaveHandler(e, task)}
                                onDragEnd={e => dragEndHandler(e, task)}
                                onDragOver={e => dragOverHandler(e, task)}
                                onDrop={e => dropHandler(e, task)}
                                >
                                
                                    {editingId === task.id ? (
                                        <form className="home-tasks-list-item-button-container" onSubmit={e => handleUpdate}>
                                            <input className="home-form-input" value={editingTitle} placeholder={task.title} onChange={e => {setEditingTitle(e.target.value);}} onClick={e => setDraggable(false)}
                                            onKeyDown={e => {
                                                if(e.key === 'Enter'){
                                                    handleUpdate(e);
                                                    setEditingTitle('');  
                                                }
                                                else if(e.key === 'Escape'){
                                                    setEditingId(null);
                                                    setEditingTitle('');
                                                }
                                            }}/>
                                            
                                            <button className="home-tasks-list-item-button" onClick={e => {setEditingId(null); setEditingTitle('');}}><CancelIcon id="icon" fontSize='inherit'/></button>
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
                                </motion.div>
                                
                            ))}</AnimatePresence>
                        </ul>
                    </div>
                </div>
                <div className="home-tasks-list-container">
                    <motion.h2 className="home-tasks-list-header"
                    initial={{opacity: 0}} 
                    animate={{opacity: 1}} 
                    transition = {{duration: 0.5, delay: 3}}
                    >Completed Tasks</motion.h2>

                    <motion.hr 
                    initial={{width: 0, borderColor: '#8BAAAD'}} 
                    animate={{width: 475, borderColor: '#185153'}} 
                    transition = {{duration: 2, delay: 3.5}} />
                    <div 
                    className="home-tasks-list-empty" 
                    list-type="completed" 
                    onDragOver={(e) => onDragOverListHandler(e)} 
                    onDrop={(e) => onDropListHandler(e)}
                    onDragLeave={(e) => onDragLeaveListHandler(e)}>
                        <ul className="home-tasks-list">
                            <AnimatePresence>
                            {tasks.filter(task => task.completed).map(task => (
                                <motion.div 
                                initial = {!tasksAnimation ? {y: 100, opacity: 0} : {y: 20, opacity: 0}} 
                                animate = {!tasksAnimation ? {y: 0, opacity: 1} : {y: 0, opacity: 1}}
                                exit = {{y: 20, opacity: 0}}  
                                transition={!tasksAnimation ? {duration: 2, delay: 2.5}: {duration: 0.2}}
                                key={task.order} 
                                onAnimationComplete={e => setTasksAnimation(true)}
                                >
                                <li className="home-tasks-list-item completed"
                                draggable={draggable}
                                onDragStart={e => dragStartHandler(e, task)}
                                onDragLeave={e => dragLeaveHandler(e, task)}
                                onDragEnd={e => dragEndHandler(e, task)}
                                onDragOver={e => dragOverHandler(e, task)}
                                onDrop={e => dropHandler(e, task)}
                                onClick={e => {
                                    if(e.shiftKey) handleComplete(task.id, !task.completed)
                                }}
                                > 
                                    {task.title}
                                <div className="home-tasks-list-item-button-container">
                                    <button className="home-tasks-list-item-button" onClick={e => handleComplete(task.id, false)}><RestoreIcon className="icon" fontSize='inherit'/></button>
                                    <button className="home-tasks-list-item-button" onClick={e => handleDelete(task.id)}><DeleteIcon className="icon" fontSize='inherit' /></button>
                                </div>
                                </li>
                                </motion.div>
                            ))}
                            </AnimatePresence>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}