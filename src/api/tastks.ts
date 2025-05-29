const baseURL = 'http://localhost:4000'

export interface Task{
    id: number,
    title: string,
    completed: boolean
}

function getHeaders(){
    const token = localStorage.getItem('token')
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }
}

export async function fetchTasks(): Promise<Task[]>{
    const response = await fetch(`${baseURL}/tasks`, {
        headers: getHeaders()
    });
    return await response.json()
}

export async function createTask(title: string): Promise<Task>{
    const response = await fetch(`${baseURL}/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({title})
    })
    return await response.json()
}

export async function updateTask(id: number, completed: boolean): Promise<Task>{
    const response = await fetch(`${baseURL}/tasks/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({completed})
    })
    return await response.json()
}

export async function deleteTask(id: number): Promise<void>{
    const response = await fetch(`${baseURL}/tasks/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    })
}