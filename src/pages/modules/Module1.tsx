import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, ChevronDown, Facebook, Youtube, Mail, Phone, MapPin, Instagram } from 'lucide-react';

const MODULES_LINKS = [
  { id: 1, title: 'Módulo 01', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod1_livros.jpg', link: '/modules/modulo-1' },
  { id: 2, title: 'Módulo 02', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod2_livros.jpg', link: '/modules/modulo-2' },
  { id: 3, title: 'Módulo 03', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod3_livros.jpg', link: '/modules/modulo-3' },
  { id: 4, title: 'Módulo 04', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod4_livros.jpg', link: '/modules/modulo-4' },
  { id: 5, title: 'Módulo 05', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod5_livros.jpg', link: '/modules/modulo-5' },
  { id: 6, title: 'Módulo 06', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod6_livros.jpg', link: '/modules/modulo-6' },
  { id: 7, title: 'Módulo 07', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod7_livros.jpg', link: '/modules/modulo-7' },
  { id: 8, title: 'Módulo 08', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod8_livros.jpg', link: '/modules/modulo-8' },
  { id: 9, title: 'Módulo 09', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod9_livros.jpg', link: '/modules/modulo-9' },
  { id: 10, title: 'Módulo 10', image: 'https://ibuc.com.br/wp-content/uploads/2023/05/mod10_livros.jpg', link: '/modules/modulo-10' },
];

const Module1: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      {/* Header / Navbar */}
      <header className="bg-white py-2 px-4 md:px-8 shadow-sm flex flex-col md:flex-row items-center justify-between sticky top-0 z-50 h-auto md:h-[110px]">
        <Link to="/" className="flex items-center mb-4 md:mb-0">
          <div className="w-16 md:w-40 mr-3">
             <img src="https://ibuc.com.br/wp-content/uploads/2023/05/logo-site.png" alt="IBUC Logo" className="w-full h-auto" />
          </div>
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex flex-wrap justify-center items-center gap-x-8 text-[15px] font-semibold text-[#3b3d40] uppercase tracking-wide">
          <Link to="/" className="hover:text-[#277cea] transition-colors">Início</Link>
          
          <Link to="/#about" className="hover:text-[#277cea] transition-colors">Sobre o IBUC</Link>
          
          {/* Dropdown Módulos */}
          <div className="relative group cursor-pointer py-4">
            <span className="flex items-center hover:text-[#277cea] transition-colors text-[#277cea]">
              Módulos <ChevronDown className="ml-1 w-4 h-4" />
            </span>
            <div className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-sm py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border-t-2 border-[#277cea]">
              {MODULES_LINKS.map((mod) => (
                <Link 
                  key={mod.id} 
                  to={mod.link} 
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#277cea]"
                >
                  {mod.title}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/login" className="hover:text-[#277cea] transition-colors">Área do Aluno</Link>
          <Link to="/login" className="hover:text-[#277cea] transition-colors">Área Administrativa</Link>
        </nav>

        {/* Menu Mobile Button */}
        <button className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="block w-6 h-0.5 bg-current mb-1"></span>
            <span className="block w-6 h-0.5 bg-current mb-1"></span>
            <span className="block w-6 h-0.5 bg-current"></span>
        </button>

        {/* Socials Desktop */}
        <div className="hidden md:flex items-center space-x-2 text-gray-400">
           <a href="https://www.instagram.com/ibuc_oficial/" target="_blank" rel="noreferrer" className="hover:text-[#E1306C] transition-colors"><Instagram className="w-5 h-5"/></a>
           <a href="https://facebook.com/IBUC.com.br" target="_blank" rel="noreferrer" className="hover:text-[#1877F2] transition-colors"><Facebook className="w-5 h-5"/></a>
           <a href="https://www.youtube.com/@IBUConline" target="_blank" rel="noreferrer" className="hover:text-[#FF0000] transition-colors"><Youtube className="w-5 h-5"/></a>
           <a href="mailto:contatoibuc@gmail.com" className="hover:text-gray-600 transition-colors"><Mail className="w-5 h-5"/></a>
        </div>
      </header>

      {/* Menu Mobile Expanded */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4">
            <Link to="/" className="block text-gray-700 font-bold">Início</Link>
            <Link to="/#about" className="block text-gray-700 font-bold">Sobre o IBUC</Link>
            <div className="font-bold text-[#277cea]">Módulos</div>
            <div className="pl-4 space-y-2 border-l-2 border-gray-100">
                {MODULES_LINKS.map(m => (
                    <Link key={m.id} to={m.link} className="block text-sm text-gray-600">{m.title}</Link>
                ))}
            </div>
            <Link to="/login" className="block text-gray-700 font-bold">Área do Aluno</Link>
            <Link to="/login" className="block text-gray-700 font-bold">Área Administrativa</Link>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-grow">
        {/* Title Section */}
        <section className="py-12 md:py-20">
          <div className="max-w-[1200px] mx-auto px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-[#3b3d40] text-center mb-8 font-[Poppins]">
              Módulo 01
            </h1>
            
            {/* Content Images */}
            <div className="flex flex-col md:flex-row justify-center gap-0 md:gap-0">
               <div className="w-full md:w-auto">
                  <img 
                    src="https://ibuc.com.br/wp-content/uploads/2023/05/mod1_livros.jpg" 
                    alt="Módulo 01 Livros" 
                    className="w-full h-auto max-w-full md:max-w-[500px]"
                  />
               </div>
               <div className="w-full md:w-auto">
                  <img 
                    src="https://ibuc.com.br/wp-content/uploads/2023/05/mod1_licoes.jpg" 
                    alt="Módulo 01 Lições" 
                    className="w-full h-auto max-w-full md:max-w-[500px]"
                  />
               </div>
            </div>
          </div>
        </section>

        {/* Grid Navigation Section (Other Modules) */}
        <section className="py-8 bg-[#eeeeee]">
           <div className="max-w-[1200px] mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
                 {MODULES_LINKS.map((mod) => (
                    <Link 
                        key={mod.id} 
                        to={mod.link}
                        className="relative group block overflow-hidden bg-[#333] h-48"
                    >
                        <img 
                            src={mod.image} 
                            alt={mod.title}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 group-hover:opacity-50"
                        />
                        <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                            <h3 className="text-white font-bold text-sm md:text-base uppercase">{mod.title}</h3>
                        </div>
                    </Link>
                 ))}
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#27282a] text-[#aebcc2] border-t border-[#3b3d40]">
        
        {/* Top Footer with Image Background */}
        <div className="relative py-16">
            <div className="absolute inset-0 z-0">
                <img src="https://ibuc.com.br/wp-content/uploads/2024/04/IMG_9298.jpg" alt="Background" className="w-full h-full object-cover opacity-10" />
                <div className="absolute inset-0 bg-[#27282a]/90"></div>
            </div>

            <div className="relative z-10 max-w-[1200px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Col 1 */}
                <div>
                    <h3 className="text-xl text-[#7f8a88] font-bold mb-6">Seja um patrocinador do IBUC</h3>
                    <a href="https://ibuc.com.br/apoio-2/">
                        <img src="https://ibuc.com.br/wp-content/uploads/2023/05/apoio.jpg" alt="Apoio" className="w-full max-w-[300px] hover:opacity-80 transition-opacity"/>
                    </a>
                </div>

                {/* Col 2 */}
                <div>
                    <h3 className="text-xl text-[#7f8a88] font-bold mb-6">Módulos</h3>
                    <div className="grid grid-cols-2 gap-1">
                        {MODULES_LINKS.slice(1).map(m => ( // Show snippet of modules
                            <Link key={m.id} to={m.link} className="text-sm hover:text-[#277cea] transition-colors">{m.title}</Link>
                        ))}
                    </div>
                </div>

                {/* Col 3 */}
                <div>
                    <h3 className="text-xl text-[#7f8a88] font-bold mb-6">Redes sociais</h3>
                    <div className="space-y-4 text-sm">
                        <a href="https://facebook.com/IBUC.com.br" className="flex items-center hover:text-[#277cea] transition-colors">
                            <Facebook className="w-4 h-4 mr-2" /> IBUC – Instituto Bíblico Único Caminho
                        </a>
                        <a href="https://wa.me/556231236668" className="flex items-center hover:text-[#277cea] transition-colors">
                            <Phone className="w-4 h-4 mr-2" /> (62) 3123-6668 (whatsapp)
                        </a>
                        <a href="https://goo.gl/maps/MJJFR66pPejFnKNQ8" className="flex items-center hover:text-[#277cea] transition-colors">
                            <MapPin className="w-4 h-4 mr-2" /> Av. T9, nº647, Setor Bueno
                        </a>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Footer */}
        <div className="bg-[#323336] py-8 border-t border-[#3b3d40]">
            <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs md:text-sm text-[#7f8a88]">
                <p>Razão Social – Instituto Biblico Unico Caminho</p>
                <p>CNPJ – 35.864.425/0001-23</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default Module1;