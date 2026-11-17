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
        <main className="page-container">
            <section className="surface-card space-y-8 p-5 sm:p-9">
                <header>
                    <h1 className="page-title">User Profile</h1>
                </header>

                <section className="border-t border-[#f0e7eb] pt-6">
                    <h2 className="font-[Rubik] text-xl font-semibold text-[#44363d]">Account details</h2>

                    {loading && <p className="mt-4 text-[#82757c]">Loading profile...</p>}
                    {error && <p className="status-message mt-4">{error}</p>}

                    {!loading && !error && (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-2xl border border-[#efe5e9] bg-[#fcf8fa] p-4">
                                <p className="text-sm font-extrabold text-[#82757c]">Name</p>
                                <p className="mt-1 text-lg font-bold text-[#44363d]">{user.name || 'N/A'}</p>
                            </div>
                            <div className="rounded-2xl border border-[#efe5e9] bg-[#fcf8fa] p-4">
                                <p className="text-sm font-extrabold text-[#82757c]">Email</p>
                                <p className="mt-1 break-words text-lg font-bold text-[#44363d]">{user.email || 'N/A'}</p>
                            </div>
                        </div>
                    )}
                </section>

                <section className="border-t border-[#f0e7eb] pt-6">
                    <h2 className="font-[Rubik] text-xl font-semibold text-[#44363d]">Todo statistics</h2>

                    {loading && <p className="mt-4 text-[#82757c]">Loading statistics...</p>}

                    {!loading && !error && (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="rounded-2xl border border-[#efe5e9] bg-[#fcf8fa] p-4">
                                <h3 className="text-sm font-extrabold text-[#82757c]">Total todos</h3>
                                <p className="mt-2 font-[Rubik] text-3xl font-semibold text-[#bd527c]">{stats.total}</p>
                            </div>
                            <div className="rounded-2xl border border-[#efe5e9] bg-[#fcf8fa] p-4">
                                <h3 className="text-sm font-extrabold text-[#82757c]">Completed</h3>
                                <p className="mt-2 font-[Rubik] text-3xl font-semibold text-[#bd527c]">{stats.completedNum}</p>
                            </div>
                            <div className="rounded-2xl border border-[#efe5e9] bg-[#fcf8fa] p-4">
                                <h3 className="text-sm font-extrabold text-[#82757c]">Active</h3>
                                <p className="mt-2 font-[Rubik] text-3xl font-semibold text-[#bd527c]">{stats.active}</p>
                            </div>
                            <div className="rounded-2xl border border-[#efe5e9] bg-[#fcf8fa] p-4">
                                <h3 className="text-sm font-extrabold text-[#82757c]">Percentage complete</h3>
                                <p className="mt-2 font-[Rubik] text-3xl font-semibold text-[#bd527c]">{stats.percentage}%</p>
                            </div>
                        </div>
                    )}
                </section>
            </section>
        </main>
    );
}
export default ProfilePage;