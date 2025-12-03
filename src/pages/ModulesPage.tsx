import React from 'react';
import { Link } from 'react-router-dom';
import { User, BookOpen } from 'lucide-react';

// Dados estáticos para replicar o visual exato do site original
const STATIC_MODULES = [
  { id: 1, title: 'Módulo 01', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod1_livros.jpg' },
  { id: 2, title: 'Módulo 02', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod2_livros.jpg' },
  { id: 3, title: 'Módulo 03', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod3_livros.jpg' },
  { id: 4, title: 'Módulo 04', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod4_livros.jpg' },
  { id: 5, title: 'Módulo 05', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod5_livros.jpg' },
  { id: 6, title: 'Módulo 06', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod6_livros.jpg' },
  { id: 7, title: 'Módulo 07', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod7_livros.jpg' },
  { id: 8, title: 'Módulo 08', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod8_livros.jpg' },
  { id: 9, title: 'Módulo 09', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod9_livros.jpg' },
  { id: 10, title: 'Módulo 10', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod10_livros.jpg' },
];

const ModulesPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* Navbar Superior (Reutilizada para consistência) */}
      <header className="bg-white py-4 px-4 md:px-8 shadow-sm flex flex-col md:flex-row items-center justify-between sticky top-0 z-50">
        <Link to="/" className="flex items-center mb-4 md:mb-0">
          <div className="w-10 h-10 relative flex items-center justify-center mr-3">
             <div className="w-full h-full rounded-full bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center text-white text-[10px] font-bold border-2 border-yellow-400">
                IBUC
             </div>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-red-600 font-extrabold text-xl tracking-tight">IBUC</span>
            <span className="text-gray-500 text-xs uppercase tracking-wide">Palmas - TO</span>
          </div>
        </Link>

        <nav className="flex flex-wrap justify-center items-center gap-x-6 text-sm font-medium text-gray-700 mb-4 md:mb-0">
          <Link to="/" className="hover:text-red-600 transition-colors">Início</Link>
          <Link to="/" className="hover:text-red-600 transition-colors">Conheça o IBUC</Link>
          <span className="px-3 py-1 bg-red-50 text-red-600 rounded-md">Módulos</span>
          <Link to="/student/catalog" className="hover:text-red-600 transition-colors font-bold">Matrícula</Link>
        </nav>

        <div className="flex items-center space-x-6 text-sm font-medium text-gray-600">
          <Link to="/login" className="hover:text-blue-600 transition-colors flex items-center group">
            <User className="w-4 h-4 mr-2 group-hover:text-blue-600" />
            Área do Aluno
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow">
        <section className="py-12">
          <div className="max-w-[1240px] mx-auto px-4">
            
            {/* Título da Página */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-[#3b3d40] mb-2 font-[Poppins]">
                Módulos
              </h1>
            </div>

            {/* Grid de Módulos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {STATIC_MODULES.map((module) => (
                <Link 
                  to="/student/catalog" 
                  key={module.id} 
                  className="group relative block bg-[#333] overflow-hidden cursor-pointer rounded-sm shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="h-64 w-full bg-gray-200">
                      {/* Usando object-contain para garantir que a imagem não seja cortada */}
                      <img 
                        src={module.image} 
                        alt={module.title}
                        className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                  </div>
                  
                  {/* Overlay Escuro e Texto */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h2 className="text-white text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {module.title}
                    </h2>
                    <p className="text-gray-300 text-sm mt-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      Ver detalhes
                    </p>
                  </div>
                </Link>
              ))}
            </div>

          </div>
        </section>
      </main>

      {/* Footer Clone */}
      <footer className="bg-[#27282a] text-[#aebcc2] py-16 border-t border-[#3b3d40]">
        <div className="max-w-[1240px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Coluna 1: Patrocinador */}
            <div>
              <h3 className="text-xl text-[#7f8a88] font-bold mb-6">Seja um patrocinador do IBUC</h3>
              <div className="bg-white/5 rounded-lg overflow-hidden">
                 <img src="https://ibuc.com.br/wp-content/uploads/2023/05/apoio.jpg" alt="Apoio" className="w-full opacity-80 hover:opacity-100 transition-opacity"/>
              </div>
            </div>

             {/* Coluna 2: Lista Módulos (Texto) */}
             <div>
                <h3 className="text-xl text-[#7f8a88] font-bold mb-6">Módulos</h3>
                <ul className="grid grid-cols-2 gap-2 text-sm">
                    {STATIC_MODULES.map(m => (
                        <li key={m.id}>
                            <Link to="/student/catalog" className="hover:text-[#277cea] transition-colors">{m.title}</Link>
                        </li>
                    ))}
                </ul>
             </div>

             {/* Coluna 3: Redes Sociais e Contato */}
             <div>
                <h3 className="text-xl text-[#7f8a88] font-bold mb-6">Redes sociais</h3>
                <div className="space-y-4">
                    <a href="#" className="flex items-center group">
                        <div className="w-10 h-10 rounded-full bg-[#3b5998] flex items-center justify-center text-white mr-3 group-hover:opacity-80">F</div>
                        <span className="group-hover:text-[#277cea] transition-colors">IBUC - Instituto Bíblico</span>
                    </a>
                    <div className="flex items-center group">
                        <div className="w-10 h-10 rounded-full bg-[#25d366] flex items-center justify-center text-white mr-3">W</div>
                        <span className="group-hover:text-[#277cea] transition-colors">(62) 3123-6668</span>
                    </div>
                </div>
                
                <div className="mt-8 text-sm text-[#7f8a88]">
                    <p>Razão Social – Instituto Biblico Unico Caminho</p>
                    <p>CNPJ – 35.864.425/0001-23</p>
                </div>
             </div>

          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModulesPage;