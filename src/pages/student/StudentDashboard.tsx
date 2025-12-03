import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Enrollment } from '../../types';
import { Clock, CheckCircle, XCircle, Calendar, Upload, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadEnrollments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadEnrollments = async () => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          class:classes (
            *,
            course:courses (title, image_url)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnrollments(data || []);
    } catch (error: any) {
      console.error('Error loading enrollments:', JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, enrollmentId: string) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    setUploading(enrollmentId);

    try {
      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      // Update Enrollment
      const { error: updateError } = await supabase
        .from('enrollments')
        .update({ receipt_url: publicUrl })
        .eq('id', enrollmentId);

      if (updateError) throw updateError;

      alert('Comprovante enviado com sucesso!');
      loadEnrollments();
    } catch (error: any) {
      console.error('Upload error:', JSON.stringify(error, null, 2));
      alert('Erro no upload: ' + error.message);
    } finally {
      setUploading(null);
    }
  };

  const StatusBadge = ({ status, paid }: { status: string; paid: boolean }) => {
    if (status === 'pending') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Pendente</span>;
    if (status === 'rejected') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Rejeitado</span>;
    if (status === 'approved') {
        return paid 
            ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Matriculado</span>
            : <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" /> Aguardando Pagamento</span>;
    }
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
  };

  const handlePaymentMock = async (enrollmentId: string) => {
      const confirm = window.confirm("Simular pagamento deste curso?");
      if(confirm) {
          const { error } = await supabase.from('enrollments').update({ paid: true }).eq('id', enrollmentId);
          if(!error) loadEnrollments();
      }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">Olá, Estudante</h1>
        <p className="text-gray-500 mt-1">Acompanhe suas matrículas e horários.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stats or Notices could go here */}
        <div className="bg-blue-600 rounded-lg p-6 text-white shadow-lg col-span-full md:col-span-1">
             <h3 className="text-lg font-semibold mb-2">Próximos Passos</h3>
             <p className="text-blue-100 text-sm mb-4">Confira o catálogo para novas turmas abertas este semestre.</p>
             <Link to="/student/catalog" className="inline-block bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50 transition">
                Ver Catálogo
             </Link>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800">Minhas Matrículas</h2>
      
      {loading ? (
        <p className="text-gray-500">Carregando...</p>
      ) : enrollments.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">Você ainda não se matriculou em nenhum curso.</p>
            <Link to="/student/catalog" className="text-blue-600 font-medium hover:underline">Ir para o catálogo</Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {enrollments.map((enrollment) => (
              <li key={enrollment.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {enrollment.class?.course?.image_url ? (
                            <img src={enrollment.class.course.image_url} alt="" className="h-full w-full object-cover"/>
                        ) : (
                            <BookIcon />
                        )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{enrollment.class?.course?.title || 'Curso Indefinido'}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>{enrollment.class?.schedule || 'Horário a definir'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <StatusBadge status={enrollment.status} paid={enrollment.paid} />
                    
                    {/* Payment Action */}
                    {enrollment.status === 'approved' && !enrollment.paid && (
                        <button 
                            onClick={() => handlePaymentMock(enrollment.id)}
                            className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                            Pagar Agora
                        </button>
                    )}

                    {/* Upload Receipt Action (If Pending or Waiting Payment) */}
                    {!enrollment.paid && (
                        <div className="flex items-center space-x-2">
                            {enrollment.receipt_url ? (
                                <a href={enrollment.receipt_url} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center text-blue-600 hover:text-blue-800">
                                    <FileText className="w-3 h-3 mr-1"/> Ver Comprovante
                                </a>
                            ) : (
                                <label className="cursor-pointer text-xs flex items-center text-gray-500 hover:text-blue-600">
                                    <Upload className="w-3 h-3 mr-1" />
                                    {uploading === enrollment.id ? 'Enviando...' : 'Anexar Comprovante'}
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileUpload(e, enrollment.id)}
                                        disabled={uploading === enrollment.id}
                                    />
                                </label>
                            )}
                        </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const BookIcon = () => (
    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
)

export default StudentDashboard;