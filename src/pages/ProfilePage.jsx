import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function ProfilePage() {
    const { user, token } = useAuth();
    const [stats, setStats] = useState({ total: 0, completedNum: 0, active: 0, percentage: 'N/A'});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                
                const total = tasksList.length;

                const completed = tasksList.filter((todo) => todo.isCompleted);

                const completedNum = completed.length;

                const active = total - completedNum;

                const percentage = total === 0 ? '0' :((completedNum / total) * 100).toFixed(0);

                setStats({ total, completedNum, active, percentage });
            

            } catch (error) {
                setError(`Error loading statistics: ${error.message}`);
            } finally {
                setLoading(false);
            }
        }

        fetchTodoStats();
    }, [token])

    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-8">
            <section className="space-y-8 rounded-xl bg-white p-6 shadow-lg sm:p-8">
                <header>
                    <h1 className="text-3xl font-bold text-slate-800">User Profile</h1>
                    <p className="mt-2 text-slate-500">Manage your account and view your todo progress.</p>
                </header>

                <section className="border-t border-slate-200 pt-6">
                    <h2 className="text-xl font-bold text-slate-800">Account Details</h2>

                    {loading && <p className="mt-4 text-slate-500">Loading profile...</p>}
                    {error && <p className="mt-4 rounded-md bg-red-100 px-4 py-3 text-red-700">{error}</p>}

                    {!loading && !error && (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg bg-slate-50 p-4">
                                <p className="text-sm font-semibold text-slate-500">Name</p>
                                <p className="mt-1 text-lg text-slate-800">{user.name || 'N/A'}</p>
                            </div>
                            <div className="rounded-lg bg-slate-50 p-4">
                                <p className="text-sm font-semibold text-slate-500">Email</p>
                                <p className="mt-1 break-words text-lg text-slate-800">{user.email || 'N/A'}</p>
                            </div>
                        </div>
                    )}
                </section>

                <section className="border-t border-slate-200 pt-6">
                    <h2 className="text-xl font-bold text-slate-800">Todo Statistics</h2>

                    {loading && <p className="mt-4 text-slate-500">Loading statistics...</p>}
                    {error && <p className="mt-4 rounded-md bg-red-100 px-4 py-3 text-red-700">{error}</p>}

                    {!loading && !error && (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-lg border border-slate-200 p-4">
                                <h3 className="text-sm font-semibold text-slate-500">Total Todos</h3>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{stats.total}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 p-4">
                                <h3 className="text-sm font-semibold text-slate-500">Completed</h3>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{stats.completedNum}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 p-4">
                                <h3 className="text-sm font-semibold text-slate-500">Active</h3>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{stats.active}</p>
                            </div>
                            <div className="rounded-lg border border-slate-200 p-4">
                                <h3 className="text-sm font-semibold text-slate-500">Percentage Complete</h3>
                                <p className="mt-2 text-3xl font-bold text-slate-800">{stats.percentage}%</p>
                            </div>
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}
export default ProfilePage;