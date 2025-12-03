import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Enrollment } from '../../types';
import { Check, X, Search, FileText, Download, ExternalLink } from 'lucide-react';

const StudentManager: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending'>('all');

  useEffect(() => {
    fetchEnrollments();
  }, [filter]);

  const fetchEnrollments = async () => {
    let query = supabase
      .from('enrollments')
      .select(`
        *,
        profile:profiles(full_name, email, role),
        class:classes(
          id,
          schedule,
          course:courses(title)
        )
      `)
      .order('created_at', { ascending: false });

    if (filter === 'pending') {
      query = query.eq('status', 'pending');
    }

    const { data, error } = await query;
    if (!error && data) setEnrollments(data);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('enrollments')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (!error) {
      fetchEnrollments();
    } else {
        alert('Erro ao atualizar status');
    }
  };

  const exportToCSV = () => {
    if (enrollments.length === 0) {
        alert('Sem dados para exportar');
        return;
    }

    const headers = ['Aluno', 'Email', 'Curso', 'Turma', 'Status', 'Pago', 'Comprovante', 'Data'];
    const rows = enrollments.map(enr => [
        enr.profile?.full_name || 'N/A',
        enr.profile?.email || 'N/A',
        enr.class?.course?.title || 'N/A',
        enr.class?.schedule || 'N/A',
        enr.status,
        enr.paid ? 'Sim' : 'Não',
        enr.receipt_url || 'Não enviado',
        new Date(enr.created_at).toLocaleDateString()
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `matriculas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Alunos</h1>
        <div className="flex space-x-2">
            <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md text-sm ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                Todos
            </button>
            <button 
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-md text-sm ${filter === 'pending' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
                Pendentes
            </button>
            <button 
                onClick={exportToCSV}
                className="px-4 py-2 rounded-md text-sm bg-green-100 text-green-700 flex items-center hover:bg-green-200"
            >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
            </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aluno</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso / Turma</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {enrollments.map((enr) => (
                    <tr key={enr.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{enr.profile?.full_name || 'Desconhecido'}</div>
                                    <div className="text-sm text-gray-500">{enr.profile?.email}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{enr.class?.course?.title}</div>
                            <div className="text-sm text-gray-500">{enr.class?.schedule}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${enr.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                  enr.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-red-100 text-red-800'}`}>
                                {enr.status}
                            </span>
                            {enr.paid && <span className="ml-2 px-2 text-xs bg-blue-100 text-blue-800 rounded-full">Pago</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2 flex justify-end">
                            {enr.receipt_url && (
                                <a href={enr.receipt_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900" title="Ver Comprovante">
                                    <FileText className="w-5 h-5" />
                                </a>
                            )}
                            
                            {enr.status === 'pending' && (
                                <>
                                    <button onClick={() => updateStatus(enr.id, 'approved')} className="text-green-600 hover:text-green-900" title="Aprovar">
                                        <Check className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => updateStatus(enr.id, 'rejected')} className="text-red-600 hover:text-red-900" title="Rejeitar">
                                        <X className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentManager;