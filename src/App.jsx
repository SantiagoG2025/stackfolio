
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navegar from './componentes/navegar'

function Inicio() {
  return (
    <section className="hero text-center">
      <div className="container">
        <p className="text-info fw-bold">DESARROLLADOR FULLSTACK</p>
        <h1>Hola, soy un desarrollador en formación.</h1>
        <p className="lead">
          Creo aplicaciones web modernas, funcionales y adaptables.
        </p>
        <a href="#tecnologias" className="btn btn-info mt-3">
          Conocer tecnologías
        </a>
      </div>
    </section>
  )
}

function Proyectos() {
  return (
    <section className="container py-5">
      <h2>Mis proyectos</h2>
      <p>Próximamente encontrarás aquí mis proyectos y demostraciones.</p>
    </section>
  )
}

function Contacto() {
  return (
    <section className="container py-5">
      <h2>Contacto</h2>
      <p>Podés comunicarte conmigo mediante el formulario de contacto.</p>
    </section>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navegar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/proyectos" element={<Proyectos />} />
        <Route path="/contacto" element={<Contacto />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
