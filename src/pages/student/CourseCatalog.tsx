import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ClassSession } from '../../types';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourseCatalog: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          course:courses (*)
        `)
        .eq('course.active', true);

      if (error) throw error;
      // Filter out classes where course might be null due to join
      setClasses(data?.filter(c => c.course) || []);
    } catch (error: any) {
      console.error('Error fetching classes:', JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (classId: string) => {
    if (!user) return;
    setEnrolling(classId);

    try {
        // Check if already enrolled
        const { data: existing } = await supabase
            .from('enrollments')
            .select('id')
            .eq('user_id', user.id)
            .eq('class_id', classId)
            .single();
        
        if (existing) {
            alert('Você já solicitou matrícula para esta turma.');
            setEnrolling(null);
            return;
        }

        const { error } = await supabase.from('enrollments').insert({
            user_id: user.id,
            class_id: classId,
            status: 'pending',
            paid: false
        });

        if (error) throw error;
        alert('Solicitação enviada com sucesso! Acompanhe no seu painel.');
        navigate('/student');

    } catch (error: any) {
        console.error('Enroll error:', JSON.stringify(error, null, 2));
        alert('Erro ao realizar matrícula: ' + error.message);
    } finally {
        setEnrolling(null);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin h-8 w-8 text-blue-600"/></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Catálogo de Cursos</h1>
      </div>

      {classes.length === 0 ? (
          <div className="text-center p-10 bg-white rounded shadow">
              <p className="text-gray-500">Nenhuma turma disponível no momento.</p>
              <p className="text-sm text-gray-400 mt-2">(Se você é admin, crie cursos e turmas no painel administrativo)</p>
          </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden flex flex-col h-full">
                <div className="h-48 bg-gray-200 relative">
                    {cls.course?.image_url ? (
                        <img src={cls.course.image_url} alt={cls.course.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-300">
                            <span className="text-4xl font-bold opacity-25">IBUC</span>
                        </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md text-xs font-bold shadow-sm text-gray-700">
                        Vagas: {cls.capacity}
                    </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cls.course?.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                    {cls.course?.description}
                </p>
                
                <div className="mt-auto space-y-3 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Horário:</span>
                        <span className="font-medium text-gray-800">{cls.schedule}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Professor:</span>
                        <span className="font-medium text-gray-800">{cls.teacher_name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Início:</span>
                        <span className="font-medium text-gray-800">{new Date(cls.start_date).toLocaleDateString('pt-BR')}</span>
                    </div>

                    <button
                        onClick={() => handleEnroll(cls.id)}
                        disabled={enrolling === cls.id}
                        className="w-full mt-4 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {enrolling === cls.id ? <Loader2 className="animate-spin w-5 h-5"/> : 'Matricular-se'}
                    </button>
                </div>
                </div>
            </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;