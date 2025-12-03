import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Course, ClassSession } from '../../types';
import { Plus, Trash2, Edit2, Loader2, Save } from 'lucide-react';

const CourseManager: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [isEditingClass, setIsEditingClass] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Partial<Course>>({});
  const [selectedClass, setSelectedClass] = useState<Partial<ClassSession>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: coursesData } = await supabase.from('courses').select('*').order('created_at');
    const { data: classesData } = await supabase.from('classes').select('*, course:courses(title)').order('start_date');
    setCourses(coursesData || []);
    setClasses(classesData || []);
    setLoading(false);
  };

  const saveCourse = async () => {
    try {
        if(selectedCourse.id) {
            await supabase.from('courses').update(selectedCourse).eq('id', selectedCourse.id);
        } else {
            await supabase.from('courses').insert(selectedCourse);
        }
        setIsEditingCourse(false);
        setSelectedCourse({});
        fetchData();
    } catch (e) {
        alert('Erro ao salvar curso');
    }
  };

  const saveClass = async () => {
    try {
        if(selectedClass.id) {
            await supabase.from('classes').update(selectedClass).eq('id', selectedClass.id);
        } else {
            await supabase.from('classes').insert(selectedClass);
        }
        setIsEditingClass(false);
        setSelectedClass({});
        fetchData();
    } catch (e) {
        alert('Erro ao salvar turma');
    }
  }

  const deleteItem = async (table: 'courses'|'classes', id: string) => {
      if(!window.confirm('Tem certeza? Isso pode afetar matrículas existentes.')) return;
      await supabase.from(table).delete().eq('id', id);
      fetchData();
  }

  return (
    <div className="space-y-12">
      {/* COURSES SECTION */}
      <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Cursos Disponíveis</h2>
            <button 
                onClick={() => { setSelectedCourse({ active: true }); setIsEditingCourse(true); }}
                className="flex items-center bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-sm"
            >
                <Plus className="w-4 h-4 mr-2"/> Novo Curso
            </button>
        </div>

        {isEditingCourse && (
            <div className="bg-white p-4 rounded-lg shadow mb-6 border border-blue-200">
                <h3 className="font-semibold mb-4">{selectedCourse.id ? 'Editar' : 'Novo'} Curso</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="border p-2 rounded" placeholder="Título" value={selectedCourse.title || ''} onChange={e => setSelectedCourse({...selectedCourse, title: e.target.value})} />
                    <input className="border p-2 rounded" placeholder="URL da Imagem" value={selectedCourse.image_url || ''} onChange={e => setSelectedCourse({...selectedCourse, image_url: e.target.value})} />
                    <textarea className="border p-2 rounded md:col-span-2" placeholder="Descrição" value={selectedCourse.description || ''} onChange={e => setSelectedCourse({...selectedCourse, description: e.target.value})} />
                    <div className="flex items-center space-x-2">
                        <label>
                            <input type="checkbox" checked={selectedCourse.active} onChange={e => setSelectedCourse({...selectedCourse, active: e.target.checked})} /> Ativo
                        </label>
                    </div>
                </div>
                <div className="mt-4 flex space-x-2">
                    <button onClick={saveCourse} className="bg-green-600 text-white px-4 py-2 rounded flex items-center"><Save className="w-4 h-4 mr-2"/> Salvar</button>
                    <button onClick={() => setIsEditingCourse(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancelar</button>
                </div>
            </div>
        )}

        <div className="bg-white shadow overflow-hidden rounded-md">
            <ul className="divide-y divide-gray-200">
                {courses.map(course => (
                    <li key={course.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                        <div>
                            <p className="font-medium text-gray-900">{course.title}</p>
                            <p className="text-sm text-gray-500 truncate max-w-md">{course.description}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => { setSelectedCourse(course); setIsEditingCourse(true); }} className="text-blue-600 hover:text-blue-800"><Edit2 className="w-5 h-5"/></button>
                            <button onClick={() => deleteItem('courses', course.id)} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5"/></button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
      </section>

      {/* CLASSES SECTION */}
      <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Turmas / Classes</h2>
            <button 
                onClick={() => { setSelectedClass({}); setIsEditingClass(true); }}
                className="flex items-center bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 text-sm"
            >
                <Plus className="w-4 h-4 mr-2"/> Nova Turma
            </button>
        </div>

        {isEditingClass && (
            <div className="bg-white p-4 rounded-lg shadow mb-6 border border-purple-200">
                <h3 className="font-semibold mb-4">{selectedClass.id ? 'Editar' : 'Nova'} Turma</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select 
                        className="border p-2 rounded" 
                        value={selectedClass.course_id || ''} 
                        onChange={e => setSelectedClass({...selectedClass, course_id: e.target.value})}
                    >
                        <option value="">Selecione um curso...</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                    <input className="border p-2 rounded" placeholder="Professor" value={selectedClass.teacher_name || ''} onChange={e => setSelectedClass({...selectedClass, teacher_name: e.target.value})} />
                    <input className="border p-2 rounded" placeholder="Horário (ex: Seg/Qua 19h)" value={selectedClass.schedule || ''} onChange={e => setSelectedClass({...selectedClass, schedule: e.target.value})} />
                    <input type="date" className="border p-2 rounded" value={selectedClass.start_date || ''} onChange={e => setSelectedClass({...selectedClass, start_date: e.target.value})} />
                    <input type="number" className="border p-2 rounded" placeholder="Capacidade" value={selectedClass.capacity || ''} onChange={e => setSelectedClass({...selectedClass, capacity: parseInt(e.target.value)})} />
                </div>
                <div className="mt-4 flex space-x-2">
                    <button onClick={saveClass} className="bg-green-600 text-white px-4 py-2 rounded flex items-center"><Save className="w-4 h-4 mr-2"/> Salvar</button>
                    <button onClick={() => setIsEditingClass(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancelar</button>
                </div>
            </div>
        )}

        <div className="bg-white shadow overflow-hidden rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Professor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                        <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {classes.map(cls => (
                        <tr key={cls.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {cls.course?.title || 'Curso Removido'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.teacher_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cls.schedule}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => { setSelectedClass(cls); setIsEditingClass(true); }} className="text-blue-600 hover:text-blue-900 mr-4"><Edit2 className="w-4 h-4"/></button>
                                <button onClick={() => deleteItem('classes', cls.id)} className="text-red-600 hover:text-red-900"><Trash2 className="w-4 h-4"/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </section>
    </div>
  );
};

export default CourseManager;