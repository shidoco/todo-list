import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
    const { user, token, isAuthenticated } = useAuth();
    const [stats, setStats] = useState({ total: 0, completedNum: 0, active: 0});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        async function fetchTodoStats() {

            if (!token) return;

            try {
                setLoading(true);
                setError('');

                const options = {
                    method: 'GET',
                    headers: {'X-CSRF-TOKEN': token},
                    credentials: 'include',
                };

                const response = await fetch('/api/tasks', options);

                if (response.status === 401) {
                    throw new Error('Unauthorized');
                }

                if (!response.ok) {
                    throw new Error(`Failed to fetch todos`);
                }

                const todos = await response.json();
                
                const tasksList = todos.tasks;

                if (tasksList.length > 0 && tasksList[0].User) {
                    setName(tasksList[0].User.name || '');
                    setEmail(tasksList[0].User.email || '');
                } else if (user) {
                    setName(user.name || '');
                    setEmail(user.email || '');
                }
                

                const total = tasksList.length;
                    
                const completed = tasksList.filter((todo) => todo.isCompleted);
                    
                const completedNum = completed.length;
                    
                const active = total - completedNum;

                setStats({total, completedNum, active });
            

            } catch (error) {
                setError(`Error loading statistics: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }

        fetchTodoStats();
    }, [token])

    return (
        <div className="profile">
            <h1>User Profile</h1>

            <section className="profile-info">
                <h2>Account Details</h2>
                <p>
                    Name: {name || user?.name || 'N/A'}
                </p>
                <p>
                    Email: {email || user?.email || 'N/A'}
                </p>
            </section>

            <section className="profile-stats">
                <h2>Todo Statistics</h2>

                {loading && <p>Loading statistics...</p>}
                {error && <p>{error}</p>}

                {!loading && !error && (
                    <div className="stats">
                        <h3>Total Todos</h3>
                        <p>{stats.total}</p>
                        <h3>Completed</h3>
                        <p>{stats.completedNum}</p>
                        <h3>Active</h3>
                        <p>{stats.active}</p>
                    </div>
                )}
            </section>
        </div>
    );
}
export default ProfilePage;