import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User, GraduationCap, CheckCircle, ArrowRight, Loader2, ChevronDown, Menu, X, Facebook, Instagram, Youtube, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Course } from '../types';

const LandingPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .eq('active', true)
        .order('created_at');
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses for landing page', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* Navbar Superior */}
      <header className="bg-white py-2 px-4 md:px-8 shadow-sm flex flex-col md:flex-row items-center justify-between sticky top-0 z-50 h-auto md:h-[110px]">
        
        <div className="flex w-full md:w-auto justify-between items-center">
            {/* Logo */}
            <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="w-16 md:w-40 mr-3">
                    <img src="https://ibuc.com.br/wp-content/uploads/2023/05/logo-site.png" alt="IBUC Logo" className="w-full h-auto" />
                </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
                className="md:hidden text-gray-600 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
            </button>
        </div>

        {/* Menu Desktop */}
        <nav className="hidden md:flex flex-wrap justify-center items-center gap-x-8 text-[15px] font-semibold text-[#3b3d40] uppercase tracking-wide h-full">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-[#277cea] transition-colors py-8">Início</button>
          
          <button onClick={() => scrollToSection('about')} className="hover:text-[#277cea] transition-colors py-8">Sobre o IBUC</button>
          
          {/* Dropdown Módulos */}
          <div className="relative group cursor-pointer py-8 h-full flex items-center">
            <span className="flex items-center hover:text-[#277cea] transition-colors">
              Módulos <ChevronDown className="ml-1 w-4 h-4" />
            </span>
            <div className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-sm py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-[#277cea]">
              <Link to="/modules" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#277cea]">Todos os Módulos</Link>
              <div className="border-t border-gray-100 my-1"></div>
              {Array.from({length: 10}).map((_, i) => (
                  <Link key={i} to={`/modules/modulo-${i+1}`} className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#277cea]">
                      Módulo {String(i+1).padStart(2, '0')}
                  </Link>
              ))}
            </div>
          </div>

          <Link to="/login" className="hover:text-[#277cea] transition-colors py-8">Área do Aluno</Link>
          <Link to="/login" className="hover:text-[#277cea] transition-colors py-8">Área Administrativa</Link>
        </nav>

        {/* Socials Desktop */}
        <div className="hidden md:flex items-center space-x-2 text-gray-400">
           <a href="https://www.instagram.com/ibuc_oficial/" target="_blank" rel="noreferrer" className="hover:text-[#E1306C] transition-colors"><Instagram className="w-5 h-5"/></a>
           <a href="https://facebook.com/IBUC.com.br" target="_blank" rel="noreferrer" className="hover:text-[#1877F2] transition-colors"><Facebook className="w-5 h-5"/></a>
           <a href="https://www.youtube.com/@IBUConline" target="_blank" rel="noreferrer" className="hover:text-[#FF0000] transition-colors"><Youtube className="w-5 h-5"/></a>
           <a href="mailto:contatoibuc@gmail.com" className="hover:text-gray-600 transition-colors"><Mail className="w-5 h-5"/></a>
        </div>
      </header>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg border-t absolute top-[70px] left-0 right-0 z-40 p-4 flex flex-col space-y-4">
              <button onClick={() => scrollToSection('about')} className="text-left font-semibold text-gray-700">Sobre o IBUC</button>
              <div className="font-semibold text-[#277cea]">Módulos</div>
              <div className="pl-4 border-l-2 border-blue-100 flex flex-col space-y-2">
                  <Link to="/modules" className="text-sm text-gray-600">Ver Todos</Link>
                  <Link to="/modules/modulo-1" className="text-sm text-gray-600">Módulo 01</Link>
                  <Link to="/modules/modulo-2" className="text-sm text-gray-600">Módulo 02</Link>
              </div>
              <Link to="/login" className="font-semibold text-gray-700">Área do Aluno</Link>
              <Link to="/login" className="font-semibold text-gray-700">Área Administrativa</Link>
          </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#d32f2f] to-[#b71c1c] flex flex-col items-center justify-center text-center px-4 py-20 md:py-32 relative overflow-hidden">
        <div className="z-10 max-w-5xl w-full flex flex-col items-center text-white">
            <div className="mb-8 relative group">
                 <div className="w-32 h-32 md:w-48 md:h-48 bg-white rounded-full flex items-center justify-center border-4 border-yellow-400 shadow-2xl mx-auto transform transition-transform duration-500 hover:scale-105">
                     <span className="text-red-600 font-black text-4xl md:text-6xl drop-shadow-sm">IBUC</span>
                 </div>
                 <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-700 text-white text-xs md:text-sm font-bold px-4 py-1 rounded-full border-2 border-white shadow-lg whitespace-nowrap">
                    Único Caminho
                 </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-md tracking-tight font-[Poppins]">
              Instituto Bíblico Único Caminho
            </h1>
            <h2 className="text-lg md:text-2xl font-light mb-8 text-red-50 opacity-90">
              Formando líderes e fortalecendo a fé cristã em Palmas - TO
            </h2>

            <Link 
              to="/student/catalog" 
              className="group relative inline-flex items-center justify-center px-8 py-3 text-lg font-bold text-white transition-all duration-200 bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-[#d32f2f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-600 focus:ring-white"
            >
              Fazer Matrícula
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-500 opacity-10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none"></div>
      </section>

      {/* Seção Conheça o IBUC */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-16">
            <h2 className="text-base text-red-600 font-semibold tracking-wide uppercase">Sobre Nós</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Conheça o IBUC
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Comprometidos com a excelência no ensino bíblico e a formação de caráter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
              <p>
                O <strong>Instituto Bíblico Único Caminho (IBUC)</strong> nasceu com o propósito de oferecer educação teológica acessível e de alta qualidade. Nossa metodologia combina profundidade bíblica com aplicação prática para o dia a dia.
              </p>
              <p>
                Acreditamos que o conhecimento da Palavra de Deus é a base para transformar vidas e comunidades. Nossos cursos são desenhados para crianças, jovens e adultos que desejam crescer espiritualmente.
              </p>
              <ul className="space-y-3 mt-4">
                {[
                  'Professores qualificados e experientes',
                  'Material didático exclusivo',
                  'Ambiente acolhedor e cristão',
                  'Certificado de conclusão reconhecido internamente'
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-64 md:h-96 bg-gray-100 rounded-2xl overflow-hidden shadow-xl group">
               {/* Placeholder image simulating institution photo */}
               <div className="absolute inset-0 bg-gradient-to-tr from-blue-900 to-blue-500 flex items-center justify-center text-white text-center p-8">
                  <div>
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-80" />
                    <span className="text-2xl font-bold">Excelência no Ensino</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Módulos / Cursos (Preview) */}
      <section id="modules" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Nossos Cursos</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Destaques
            </p>
          </div>

          {/* Botão grande para ver todos os módulos */}
          <div className="text-center">
             <Link to="/modules" className="inline-flex items-center justify-center px-10 py-4 text-xl font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-lg transition-all transform hover:scale-105">
                 Ver Todos os Módulos
                 <ArrowRight className="ml-3 w-6 h-6" />
             </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div>
             <h4 className="text-white text-lg font-bold mb-4">IBUC</h4>
             <p className="text-sm leading-relaxed">
               Instituto Bíblico Único Caminho.<br/>
               Ensinando a verdade, transformando vidas.
             </p>
           </div>
           <div>
             <h4 className="text-white text-lg font-bold mb-4">Links Rápidos</h4>
             <ul className="space-y-2 text-sm">
               <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition">Sobre Nós</button></li>
               <li><Link to="/modules" className="hover:text-white transition">Módulos</Link></li>
               <li><Link to="/login" className="hover:text-white transition">Portal do Aluno</Link></li>
             </ul>
           </div>
           <div>
             <h4 className="text-white text-lg font-bold mb-4">Contato</h4>
             <p className="text-sm">Palmas - Tocantins</p>
             <p className="text-sm mt-2">Email: contato@ibuc.com.br</p>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-xs">
           &copy; {new Date().getFullYear()} IBUC - Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;