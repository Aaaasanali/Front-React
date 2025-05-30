const baseURL = 'http://localhost:4000'
let orderCount = 0
export interface Task{
    id: number,
    title: string,
    completed: boolean,
    order: number
}

function getHeaders(){
    const token = localStorage.getItem('token')
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    }
}

export async function fetchTasks(): Promise<Task[]>{
    const userId = localStorage.getItem('userId');
    const response = await fetch(`${baseURL}/tasks?userId=${userId}`, {
    headers: getHeaders(),
    });
    return await response.json();
}

export async function createTask(title: string): Promise<Task>{
    orderCount++;
    const newTask = {title:title, completed:false, order: orderCount}
    const response = await fetch(`${baseURL}/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newTask)
    })
    return await response.json()
}

export async function completeTask(id: number, completed: boolean): Promise<Task>{
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
    orderCount--;   
}

export async function updateTask(id: number|null, data: Partial<{ completed: boolean; title: string, order:number }>): Promise<Task> {
  const response = await fetch(`${baseURL}/tasks/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return await response.json();
}