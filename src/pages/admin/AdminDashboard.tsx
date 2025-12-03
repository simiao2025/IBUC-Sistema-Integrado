import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { StatData } from '../../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    activeEnrollments: 0,
    pendingEnrollments: 0
  });
  const [enrollmentData, setEnrollmentData] = useState<StatData[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Parallel fetching for performance
      const [students, courses, enrollments] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'student'),
        supabase.from('courses').select('id', { count: 'exact' }),
        supabase.from('enrollments').select('status')
      ]);

      const enrollmentCounts = (enrollments.data || []).reduce((acc: any, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalStudents: students.count || 0,
        totalCourses: courses.count || 0,
        activeEnrollments: enrollmentCounts['approved'] || 0,
        pendingEnrollments: enrollmentCounts['pending'] || 0
      });

      const chartData = Object.keys(enrollmentCounts).map(key => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: enrollmentCounts[key]
      }));
      setEnrollmentData(chartData);

    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-lg shadow p-6 flex items-center">
        <div className={`p-3 rounded-full ${color} text-white mr-4`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Alunos" value={stats.totalStudents} icon={Users} color="bg-blue-500" />
        <StatCard title="Cursos Ativos" value={stats.totalCourses} icon={BookOpen} color="bg-purple-500" />
        <StatCard title="Matrículas Ativas" value={stats.activeEnrollments} icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Pendentes" value={stats.pendingEnrollments} icon={Clock} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-6">Distribuição de Matrículas</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={enrollmentData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label
                        >
                            {enrollmentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-center items-center text-center">
           <h3 className="text-lg font-semibold mb-2">Ações Rápidas</h3>
           <p className="text-gray-500 mb-6">Atalhos para gerenciamento diário</p>
           <div className="space-y-3 w-full max-w-xs">
               <button onClick={() => window.location.hash = '#/admin/students'} className="w-full bg-blue-50 text-blue-700 py-3 rounded-lg hover:bg-blue-100 font-medium transition">
                   Revisar Matrículas Pendentes
               </button>
               <button onClick={() => window.location.hash = '#/admin/courses'} className="w-full bg-gray-50 text-gray-700 py-3 rounded-lg hover:bg-gray-100 font-medium transition">
                   Criar Nova Turma
               </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;