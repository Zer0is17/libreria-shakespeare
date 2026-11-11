import './App.css'
import { cargarLibros, consultarPedido, guardarPedidoEnLaNube, nubeActiva, reenviarPendientes } from './nube.js'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import logo from './assets/logo-encabezado.svg'
import portadaPrincipito from './assets/el-principito.jpg'
import portadaOrgullo from './assets/orgullo-y-prejuicio.jpg'
import portadaCrepusculo from './assets/crepusculo.jpg'
import portadaCanserbero from './assets/canserbero.jpg'
import portadaAnaFrank from './assets/el-diario-de-ana-frank.jpg'
import portadaAlas from './assets/alas-de-luz-estelar.jpg'
import portadaRomeo from './assets/romeo-y-julieta.jpg'
import portadaCorazon from './assets/el-corazon-del-rey.jpg'
import portadaEstrellas from './assets/hasta-que-nos-quedemos-sin-estrellas.jpg'
import portadaInvisible from './assets/invisible.jpg'
import portadaHarry from './assets/harry-potter-y-la-piedra-filosofal.jpg'
import portadaCien from './assets/cien-años-de-soledad.jpg'
import portadaAlicia from './assets/alicia-en-el-pais-de-las-maravillas.jpg'
import portadaSangre from './assets/de-sangre-y-cenizas.jpg'
import portadaMujercitas from './assets/mujercitas.jpg'

/* Catálogo de respaldo: se usa si no hay conexión con la base de datos.
   El catálogo real se edita desde el panel de administración. */
const LIBROS = [
  {
    id: 'el-principito',
    titulo: 'El Principito',
    categorias: ['Clásicos'],
    autor: 'Antoine de Saint-Exupéry',
    precio: 149,
    color: '#7b8c64',
    imagen: portadaPrincipito,
    descripcion: 'Un piloto perdido en el desierto conoce a un pequeño príncipe que viaja de planeta en planeta. Una historia sencilla sobre la amistad, el amor y lo que de verdad importa.',
  },
  {
    id: 'orgullo-y-prejuicio',
    titulo: 'Orgullo y prejuicio',
    categorias: ['Clásicos', 'Romance'],
    autor: 'Jane Austen',
    precio: 269,
    color: '#8aaee0',
    imagen: portadaOrgullo,
    descripcion: 'La inteligente y independiente Elizabeth Bennet conoce al reservado señor Darcy en una sociedad pendiente de las apariencias y la posición social. Entre malentendidos, orgullo y primeras impresiones equivocadas, esta novela clásica de Jane Austen retrata el amor, la familia y los prejuicios de su época.',
  },
  {
    id: 'crepusculo',
    titulo: 'Crepúsculo',
    categorias: ['Fantasía', 'Romance', 'Juvenil'],
    autor: 'Stephenie Meyer',
    precio: 249,
    color: '#2b2b2b',
    imagen: portadaCrepusculo,
    descripcion: 'Bella Swan se muda a Forks, un pueblo lluvioso, y allí conoce al misterioso Edward Cullen. Lo que empieza como una atracción inexplicable la lleva a descubrir el secreto de su familia y un amor tan intenso como peligroso.',
  },
  {
    id: 'canserbero-el-cantante-indigo',
    titulo: 'Canserbero, el cantante índigo: la historia no autorizada',
    categorias: ['Biografías'],
    autor: 'Félix González',
    precio: 259,
    color: '#395886',
    imagen: portadaCanserbero,
    descripcion: 'Biografía no autorizada de Canserbero, el cantante y rapero venezolano, escrita por Félix González. Un recorrido por su vida y su obra.',
  },
  {
    id: 'el-diario-de-ana-frank',
    titulo: 'El diario de Ana Frank',
    categorias: ['Biografías'],
    autor: 'Ana Frank',
    precio: 189,
    color: '#8aaee0',
    imagen: portadaAnaFrank,
    descripcion: 'El diario que escribió Ana Frank, una adolescente judía, durante los años en que su familia vivió escondida en Ámsterdam en plena Segunda Guerra Mundial. Un testimonio íntimo sobre el miedo, la esperanza y los sueños de una joven.',
  },
  {
    id: 'alas-de-luz-estelar',
    titulo: 'Alas de luz estelar',
    categorias: ['Fantasía', 'Romance', 'Juvenil'],
    autor: 'Allison Saft',
    precio: 329,
    color: '#628ecb',
    imagen: portadaAlas,
    descripcion: 'Clarion, a punto de ser coronada reina de Pixie Hollow, sale a enfrentar a un supuesto monstruo en los Bosques de Invierno y se encuentra con Milori, joven guardián de ese reino helado. Entre ambos nace una alianza que podría convertirse en algo más. Una novela de fantasía y romance de Disney.',
  },
  {
    id: 'romeo-y-julieta',
    titulo: 'Romeo y Julieta',
    categorias: ['Clásicos', 'Romance'],
    autor: 'William Shakespeare',
    precio: 199,
    color: '#628ecb',
    imagen: portadaRomeo,
    descripcion: 'La tragedia más famosa de Shakespeare: en Verona, Romeo y Julieta, jóvenes de familias enemigas, los Montesco y los Capuleto, se enamoran a pesar del odio que separa a sus casas. Una historia de amor, destino y conflicto que sigue conmoviendo siglos después. Traducción de Joelia Dávila.',
  },
  {
    id: 'el-corazon-del-rey',
    titulo: 'El corazón del rey',
    categorias: ['Fantasía', 'Romance'],
    autor: 'Karine Bernal Lobo',
    precio: 349,
    color: '#395886',
    imagen: portadaCorazon,
    descripcion: 'Tercera parte de la Saga Rey. En el palacio de Lacrontte, un rey marcado por las heridas de su pasado ama a una mujer que no puede perdonarlo. Emily nunca soñó con la corona del reino enemigo, pero el destino la lleva al centro de un mundo de intrigas, alianzas ocultas y un amor que lo arriesga todo.',
  },
  {
    id: 'hasta-que-nos-quedemos-sin-estrellas',
    titulo: 'Hasta que nos quedemos sin estrellas',
    categorias: ['Romance', 'Juvenil'],
    autor: 'Inma Rubiales',
    precio: 329,
    color: '#628ecb',
    imagen: portadaEstrellas,
    descripcion: 'Liam ha perdido la ilusión por las redes sociales y vive una relación falsa que terminó mal. Maia arrastra pesadillas desde la noche de un accidente. Un cumpleaños caótico los hace coincidir y sus mundos colisionan en esta novela romántica juvenil nacida en Wattpad.',
  },
  {
    id: 'invisible',
    titulo: 'Invisible',
    categorias: ['Juvenil'],
    autor: 'Eloy Moreno',
    precio: 259,
    color: '#8aaee0',
    imagen: portadaInvisible,
    descripcion: 'Novela de Eloy Moreno sobre un niño que sufre acoso escolar y se siente invisible para quienes lo rodean. Una historia sobre la empatía, el silencio y la importancia de mirar de verdad a los demás.',
  },
  {
    id: 'harry-potter-y-la-piedra-filosofal',
    titulo: 'Harry Potter y la piedra filosofal',
    categorias: ['Fantasía', 'Juvenil'],
    autor: 'J.K. Rowling',
    precio: 249,
    color: '#395886',
    imagen: portadaHarry,
    descripcion: 'Harry Potter crece sin saber que es un mago hasta que, al cumplir once años, recibe una invitación al Colegio Hogwarts de Magia y Hechicería. Allí encontrará amigos, secretos y el comienzo de una aventura que cambiará su vida.',
  },
  {
    id: 'cien-años-de-soledad',
    titulo: 'Cien años de soledad',
    categorias: ['Clásicos'],
    autor: 'Gabriel García Márquez',
    precio: 349,
    color: '#395886',
    imagen: portadaCien,
    descripcion: 'La historia de varias generaciones de la familia Buendía en el pueblo imaginario de Macondo. Una obra maestra del realismo mágico, entre el amor, la guerra, la memoria y la soledad.',
  },
  {
    id: 'alicia-en-el-pais-de-las-maravillas',
    titulo: 'Alicia en el país de las maravillas',
    categorias: ['Clásicos', 'Fantasía'],
    autor: 'Lewis Carroll',
    precio: 449,
    color: '#628ecb',
    imagen: portadaAlicia,
    descripcion: 'Alicia sigue a un conejo blanco y cae por su madriguera a un mundo disparatado, lleno de personajes inolvidables y reglas que nadie entiende. Un clásico de la literatura fantástica, en una edición ilustrada por Benjamin Lacombe.',
  },
  {
    id: 'de-sangre-y-cenizas',
    titulo: 'De sangre y cenizas',
    categorias: ['Fantasía', 'Romance'],
    autor: 'Jennifer L. Armentrout',
    precio: 349,
    color: '#395886',
    imagen: portadaSangre,
    descripcion: 'Libro 1 de la serie. Poppy, la Doncella, tiene un destino marcado desde su nacimiento y una vida llena de reglas. La llegada de un nuevo guardia pondrá a prueba lo que cree saber de su mundo en esta novela de fantasía y romance.',
  },
  {
    id: 'mujercitas',
    titulo: 'Mujercitas',
    categorias: ['Clásicos'],
    autor: 'Louisa May Alcott',
    precio: 279,
    color: '#8aaee0',
    imagen: portadaMujercitas,
    descripcion: 'La vida de las hermanas March (Meg, Jo, Beth y Amy) entre sueños, travesuras, dificultades y amor familiar mientras crecen. Un clásico sobre la amistad entre hermanas y el camino a la vida adulta.',
  },
]

const INFO = {
  direccion: 'Hidalgo #20, Centro, 45300 Tala, Jal.',
  correo: 'LibreriaShakespeare@gmail.com',
  telefono: '+52 33 2204 8892',
  horario: 'Lunes a viernes, 9:30 a 3:00 h',
}

/* Las categorías salen de los libros; estas van primero y en este orden */
const CATEGORIAS_ORDEN = ['Clásicos', 'Fantasía', 'Romance', 'Juvenil', 'Biografías']

function categoriasDe(libros) {
  const posicion = (c) => (CATEGORIAS_ORDEN.includes(c) ? CATEGORIAS_ORDEN.indexOf(c) : CATEGORIAS_ORDEN.length)
  return [...new Set(libros.flatMap((l) => l.categorias || []))].sort(
    (a, b) => posicion(a) - posicion(b) || a.localeCompare(b, 'es'),
  )
}

/* Catálogo disponible para todas las páginas */
const CatalogoContext = createContext(null)
function useCatalogo() {
  return useContext(CatalogoContext)
}

/* Información de entrega y pago que se muestra al comprar (cámbiala por la real) */
const TIEMPO_ENTREGA = { min: 3, max: 5 } // días hábiles
const NOTAS_PAGO = {
  'Pago al recibir': 'Pagarás cuando recibas tu pedido.',
  'Transferencia bancaria': 'Contáctanos para recibir los datos bancarios y confirmar tu pago.',
}

const dinero = (n) => n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })
const normalizar = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

/* Folio del pedido: LS- y 8 caracteres al azar (sin letras que se confunden) */
function generarFolio() {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  return 'LS-' + Array.from(bytes, (b) => letras[b % letras.length]).join('')
}

function sumarDiasHabiles(fecha, dias) {
  const d = new Date(fecha)
  let n = 0
  while (n < dias) {
    d.setDate(d.getDate() + 1)
    if (d.getDay() !== 0 && d.getDay() !== 6) n++
  }
  return d
}
const fechaCorta = (d) => d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
const fechaLarga = (d) => d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })

function leer(clave, porDefecto) {
  try {
    const v = JSON.parse(localStorage.getItem(clave))
    return v === null ? porDefecto : v
  } catch {
    return porDefecto
  }
}

function guardar(clave, valor) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor))
  } catch {
  }
}

function parsearHash(hash) {
  try {
    const [pag, arg] = hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent)
    return { pag, arg }
  } catch {
    return { pag: '?', arg: undefined }
  }
}

function useRuta() {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const alCambiar = () => setHash(window.location.hash)
    window.addEventListener('hashchange', alCambiar)
    return () => window.removeEventListener('hashchange', alCambiar)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [hash])

  return parsearHash(hash)
}

function irA(destino) {
  window.location.hash = destino
}

/* ---------- Componentes ---------- */
function Portada({ libro, clase }) {
  if (libro.imagen) {
    return (
      <div className={`portada con-imagen ${clase}`} aria-hidden="true">
        <img src={libro.imagen} alt="" />
      </div>
    )
  }
  return (
    <div className={`portada ${clase}`} style={{ '--c': libro.color }} aria-hidden="true">
      <span>{libro.titulo}</span>
    </div>
  )
}

function BotonComprar({ id, onAgregar }) {
  const [agregado, setAgregado] = useState(false)
  const temporizador = useRef(null)

  useEffect(() => () => clearTimeout(temporizador.current), [])

  function alPulsar() {
    onAgregar(id)
    setAgregado(true)
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => setAgregado(false), 1200)
  }

  return (
    <button
      type="button"
      className={`comprar${agregado ? ' agregado' : ''}`}
      onClick={alPulsar}
    >
      {agregado ? '¡Agregado!' : 'Comprar'}
    </button>
  )
}

function Tarjeta({ libro, onAgregar }) {
  return (
    <article className="tarjeta">
      <a href={`#/libro/${libro.id}`} tabIndex={-1} aria-hidden="true" className="enlace-portada">
        <Portada libro={libro} clase="media" />
      </a>
      <h3>
        <a href={`#/libro/${libro.id}`}>{libro.titulo}</a>
      </h3>
      <p className="autor">{libro.autor}</p>
      <p className="precio">{dinero(libro.precio)}</p>
      <BotonComprar id={libro.id} onAgregar={onAgregar} />
    </article>
  )
}

function Filtros({ valor, onCambio }) {
  const { categorias } = useCatalogo()
  return (
    <div className="filtros" role="group" aria-label="Filtrar por categoría">
      {['Todos', ...categorias].map((c) => (
        <button
          key={c}
          type="button"
          className="filtro"
          aria-pressed={valor === c}
          onClick={() => onCambio(c)}
        >
          {c}
        </button>
      ))}
    </div>
  )
}

function Buscador({ valor, onCambio, onEnviar, inputRef }) {
  return (
    <form className="buscador" role="search" onSubmit={onEnviar}>
      <input
        ref={inputRef}
        type="search"
        id="q"
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        placeholder="Busca por título o autor"
        aria-label="Buscar libros por título o autor"
        autoComplete="off"
      />
      <button type="submit" className="boton">Buscar</button>
    </form>
  )
}

/* ---------- Páginas ---------- */
function PaginaInicio({ onAgregar }) {
  const { libros } = useCatalogo()
  const [q, setQ] = useState('')
  const [categoria, setCategoria] = useState('Todos')
  const visibles = categoria === 'Todos' ? libros : libros.filter((l) => l.categorias.includes(categoria))

  function buscar(e) {
    e.preventDefault()
    const texto = q.trim()
    irA('#/busqueda' + (texto ? '/' + encodeURIComponent(texto) : ''))
  }

  return (
    <>
      <h2>Nuestros libros</h2>
      <Buscador valor={q} onCambio={setQ} onEnviar={buscar} />
      <Filtros valor={categoria} onCambio={setCategoria} />
      <p className={categoria === 'Todos' ? 'sr-only' : 'conteo'} aria-live="polite">
        {categoria === 'Todos'
          ? 'Mostrando todos los libros'
          : `${visibles.length} ${visibles.length === 1 ? 'libro' : 'libros'} en ${categoria}`}
      </p>
      <section className="libros">
        {visibles.map((l) => (
          <Tarjeta key={l.id} libro={l} onAgregar={onAgregar} />
        ))}
      </section>
    </>
  )
}

function PaginaBusqueda({ texto, onAgregar }) {
  const { libros } = useCatalogo()
  const [q, setQ] = useState(texto || '')
  const [categoria, setCategoria] = useState('Todos')
  const entrada = useRef(null)

  useEffect(() => {
    if (!texto) entrada.current?.focus()
  }, [texto])

  const consulta = normalizar(q.trim())
  const encontrados = libros.filter(
    (l) =>
      (normalizar(l.titulo).includes(consulta) || normalizar(l.autor).includes(consulta)) &&
      (categoria === 'Todos' || l.categorias.includes(categoria)),
  )

  let conteo
  if (encontrados.length === 0) {
    conteo = 'No encontramos libros con esa búsqueda. Prueba con otro título, autor o categoría.'
  } else if (!consulta && categoria === 'Todos') {
    conteo = 'Todos los libros'
  } else {
    conteo = encontrados.length + (encontrados.length === 1 ? ' libro coincide' : ' libros coinciden')
  }

  return (
    <>
      <h2>Buscar libros</h2>
      <Buscador
        valor={q}
        onCambio={setQ}
        onEnviar={(e) => e.preventDefault()}
        inputRef={entrada}
      />
      <Filtros valor={categoria} onCambio={setCategoria} />
      <p className="conteo" aria-live="polite">{conteo}</p>
      <section className="libros">
        {encontrados.map((l) => (
          <Tarjeta key={l.id} libro={l} onAgregar={onAgregar} />
        ))}
      </section>
    </>
  )
}

function PaginaDetalle({ id, onAgregar }) {
  const { libroPorId, listo } = useCatalogo()
  const l = libroPorId(id)
  if (!l) return listo ? <Pagina404 /> : <p className="vacio">Cargando…</p>

  return (
    <>
      <a className="volver" href="#/">Volver al catálogo</a>
      <section className="detalle">
        <Portada libro={l} clase="grande" />
        <div className="info">
          <h2>{l.titulo}</h2>
          <p className="autor">{l.autor}</p>
          <ul className="categorias" aria-label="Categorías">
            {l.categorias.map((c) => (
              <li key={c} className="etiqueta">{c}</li>
            ))}
          </ul>
          <p className="descripcion">{l.descripcion}</p>
          <p className="precio grande">{dinero(l.precio)}</p>
          <BotonComprar id={l.id} onAgregar={onAgregar} />
        </div>
      </section>
    </>
  )
}

function PaginaCarrito({ carrito, total, onCambiar, onQuitar }) {
  const { libroPorId } = useCatalogo()
  if (carrito.length === 0) {
    return (
      <>
        <h2>Tu carrito</h2>
        <p className="vacio">Tu carrito está vacío. Elige un libro con "Comprar".</p>
        <div className="acciones">
          <a className="boton" href="#/">Ver los libros</a>
        </div>
      </>
    )
  }

  return (
    <>
      <h2>Tu carrito</h2>
      <ul className="lista-carrito">
        {carrito.map((i) => {
          const l = libroPorId(i.id)
          return (
            <li key={l.id}>
              <Portada libro={l} clase="mini" />
              <div>
                <strong>{l.titulo}</strong>
                <span className="autor">{l.autor}</span>
                <br />
                <span className="precio">{dinero(l.precio)}</span>
              </div>
              <div className="controles">
                <button
                  type="button"
                  aria-label={`Quitar uno de ${l.titulo}`}
                  onClick={() => onCambiar(l.id, -1)}
                >
                  −
                </button>
                <span aria-label={`Cantidad de ${l.titulo}`}>{i.cantidad}</span>
                <button
                  type="button"
                  aria-label={`Agregar uno de ${l.titulo}`}
                  onClick={() => onCambiar(l.id, 1)}
                >
                  +
                </button>
                <button
                  type="button"
                  className="quitar"
                  aria-label={`Quitar ${l.titulo} del carrito`}
                  onClick={() => onQuitar(l.id)}
                >
                  Quitar
                </button>
              </div>
            </li>
          )
        })}
      </ul>
      <div className="total">
        <span>Total</span>
        <span>{dinero(total)}</span>
      </div>
      <div className="acciones">
        <a className="boton claro" href="#/">Seguir comprando</a>
        <a className="boton" href="#/compra">Continuar con la compra</a>
      </div>
    </>
  )
}

function PaginaCompra({ carrito, total, onConfirmar }) {
  const { libroPorId } = useCatalogo()
  const enviado = useRef(false)
  const vacio = carrito.length === 0

  useEffect(() => {
    if (vacio && !enviado.current) irA('#/carrito')
  }, [vacio])

  if (vacio) return null

  function enviar(e) {
    e.preventDefault()
    const datos = Object.fromEntries(new FormData(e.currentTarget))
    enviado.current = true
    onConfirmar(datos)
  }

  return (
    <>
      <h2>Datos de compra</h2>
      <form className="formulario" onSubmit={enviar}>
        <label>
          Nombre completo
          <input type="text" name="nombre" required autoComplete="name" />
        </label>
        <label>
          Correo electrónico
          <input type="email" name="correo" required autoComplete="email" />
        </label>
        <label>
          Dirección de entrega
          <input type="text" name="direccion" required autoComplete="street-address" />
        </label>
        <label>
          Ciudad
          <input type="text" name="ciudad" required autoComplete="address-level2" />
        </label>
        <label>
          Forma de pago
          <select name="pago" required defaultValue="">
            <option value="">Elige una opción</option>
            <option>Pago al recibir</option>
            <option>Transferencia bancaria</option>
          </select>
        </label>
        <ul className="resumen">
          {carrito.map((i) => {
            const l = libroPorId(i.id)
            return (
              <li key={l.id}>
                <span>{l.titulo} × {i.cantidad}</span>
                <span>{dinero(l.precio * i.cantidad)}</span>
              </li>
            )
          })}
          <li className="suma">
            <span>Total</span>
            <span>{dinero(total)}</span>
          </li>
        </ul>
        <button type="submit" className="boton">Confirmar compra</button>
      </form>
    </>
  )
}

function PaginaCompraRealizada({ compra }) {
  useEffect(() => {
    if (!compra) irA('#/')
  }, [compra])

  if (!compra) return null

  const cliente = compra.cliente || {}
  const fecha = new Date(compra.fecha)
  const entregaDesde = sumarDiasHabiles(fecha, TIEMPO_ENTREGA.min)
  const entregaHasta = sumarDiasHabiles(fecha, TIEMPO_ENTREGA.max)

  return (
    <section className="aviso pedido">
      <p className="grande" aria-hidden="true">✓</p>
      <h2>¡Compra realizada!</h2>
      <p>Gracias, {cliente.nombre || ''}. Recibimos tu pedido.</p>
      <p className="pedido-folio">
        {compra.numero ? `Pedido n.º ${compra.numero} · ` : ''}
        {fechaLarga(fecha)}
      </p>

      <div className="pedido-secciones">
        <section className="pedido-bloque">
          <h3>Entrega estimada</h3>
          <p>
            Entre el <strong>{fechaCorta(entregaDesde)}</strong> y el{' '}
            <strong>{fechaCorta(entregaHasta)}</strong>.
          </p>
          <p>{TIEMPO_ENTREGA.min} a {TIEMPO_ENTREGA.max} días hábiles (fechas aproximadas).</p>
        </section>

        <section className="pedido-bloque">
          <h3>Dirección de entrega</h3>
          <p>{cliente.nombre}</p>
          <p>{cliente.direccion}</p>
          <p>{cliente.ciudad}</p>
        </section>

        <section className="pedido-bloque">
          <h3>Forma de pago</h3>
          <p><strong>{cliente.pago}</strong></p>
          {NOTAS_PAGO[cliente.pago] && <p>{NOTAS_PAGO[cliente.pago]}</p>}
        </section>

        <section className="pedido-bloque">
          <h3>¿Dudas con tu pedido?</h3>
          <p>Escríbenos a <a href={`mailto:${INFO.correo}`}>{INFO.correo}</a></p>
          <p>o llámanos al <a href={`tel:${INFO.telefono.replace(/[^\d+]/g, '')}`}>{INFO.telefono}</a></p>
          <p>{INFO.horario}</p>
        </section>

        <section className="pedido-bloque ancho">
          <h3>Tu pedido</h3>
          <ul className="resumen">
            {compra.libros.map((l) => (
              <li key={l.titulo}>
                <span>{l.titulo} × {l.cantidad}</span>
                {l.precio != null && <span>{dinero(l.precio * l.cantidad)}</span>}
              </li>
            ))}
            <li className="suma">
              <span>Total</span>
              <span>{dinero(compra.total)}</span>
            </li>
          </ul>
        </section>
      </div>

      <div className="acciones">
        {compra.numero && <a className="boton" href={`#/seguimiento/${compra.numero}`}>Seguir mi pedido</a>}
        <a className="boton claro" href="#/">Volver al inicio</a>
      </div>
    </section>
  )
}

/* ---------- Seguimiento de pedidos ---------- */
const PASOS = ['Pedido recibido', 'Enviado', 'Entregado']
const PASO_ACTUAL = { pendiente: 0, enviado: 1, entregado: 2 }
const MENSAJE_ESTADO = {
  pendiente: 'Recibimos tu pedido y lo estamos preparando.',
  enviado: 'Tu pedido va en camino.',
  entregado: 'Tu pedido fue entregado. ¡Disfruta tu lectura!',
  cancelado: 'Este pedido fue cancelado. Si tienes dudas, escríbenos.',
}

function normalizarFolio(texto) {
  const f = texto.trim().toUpperCase().replace(/\s+/g, '')
  return f && !f.startsWith('LS-') ? 'LS-' + f : f
}

function PaginaSeguimiento({ folioInicial }) {
  const [folio, setFolio] = useState(folioInicial || '')
  const [fase, setFase] = useState(folioInicial ? 'cargando' : 'inicial') // inicial | cargando | ok | noexiste | error
  const [pedido, setPedido] = useState(null)

  async function consultar(texto) {
    const f = normalizarFolio(texto)
    if (!f) return
    setFase('cargando')
    try {
      const r = await consultarPedido(f)
      setPedido(r)
      setFase(r ? 'ok' : 'noexiste')
    } catch {
      setFase('error')
    }
  }

  useEffect(() => {
    if (folioInicial) consultar(folioInicial)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folioInicial])

  function enviar(e) {
    e.preventDefault()
    const f = normalizarFolio(folio)
    if (!f) return
    setFolio(f)
    if (f === normalizarFolio(folioInicial || '')) consultar(f)
    else irA('#/seguimiento/' + encodeURIComponent(f))
  }

  const fecha = pedido ? new Date(pedido.creado) : null
  const paso = pedido ? PASO_ACTUAL[pedido.estado] : -1
  const enCamino = pedido && (pedido.estado === 'pendiente' || pedido.estado === 'enviado')

  return (
    <>
      <h2>Seguimiento de pedido</h2>
      <p className="texto-centro">Escribe el folio que recibiste al comprar para ver cómo va tu pedido.</p>

      <form className="formulario" onSubmit={enviar}>
        <label>
          Folio del pedido
          <input
            type="text"
            value={folio}
            onChange={(e) => setFolio(e.target.value)}
            placeholder="LS-XXXXXXXX"
            autoComplete="off"
            autoCapitalize="characters"
            required
          />
        </label>
        <button type="submit" className="boton" disabled={fase === 'cargando'}>
          {fase === 'cargando' ? 'Buscando…' : 'Consultar'}
        </button>
      </form>

      <div aria-live="polite">
        {fase === 'noexiste' && (
          <p className="mensaje-aviso">No encontramos ese folio. Revisa que esté escrito igual que en tu confirmación de compra.</p>
        )}
        {fase === 'error' && (
          <p className="mensaje-aviso">No pudimos consultar tu pedido en este momento. Inténtalo de nuevo en unos minutos.</p>
        )}
      </div>

      {fase === 'ok' && pedido && (
        <section className="aviso pedido seguimiento">
          <h3 className="seguimiento-folio">Pedido {pedido.numero}</h3>
          <p className="pedido-folio">{fechaLarga(fecha)}</p>

          {pedido.estado !== 'cancelado' && (
            <ol className="pasos" aria-label="Progreso del pedido">
              {PASOS.map((nombre, i) => (
                <li
                  key={nombre}
                  className={`${i < paso || pedido.estado === 'entregado' ? 'hecho' : ''} ${i === paso ? 'actual' : ''}`.trim()}
                  aria-current={i === paso ? 'step' : undefined}
                >
                  <span className="paso-punto" aria-hidden="true">{i < paso || pedido.estado === 'entregado' ? '✓' : i + 1}</span>
                  <span>{nombre}</span>
                </li>
              ))}
            </ol>
          )}

          <p className="seguimiento-mensaje">{MENSAJE_ESTADO[pedido.estado]}</p>

          <div className="pedido-secciones">
            {pedido.estado === 'cancelado' && pedido.motivo_cancelacion && (
              <section className="pedido-bloque ancho">
                <h3>Motivo de la cancelación</h3>
                <p>{pedido.motivo_cancelacion}</p>
              </section>
            )}

            {(pedido.estado !== 'cancelado' || pedido.origen) && (
              <section className="pedido-bloque">
                <h3>Procedencia del envío</h3>
                <p>{pedido.origen ? <strong>{pedido.origen}</strong> : 'Por confirmar. Te mostraremos desde dónde se envía en cuanto lo tengamos.'}</p>
              </section>
            )}

            {enCamino && (
              <section className="pedido-bloque">
                <h3>Entrega estimada</h3>
                <p>
                  Entre el <strong>{fechaCorta(sumarDiasHabiles(fecha, TIEMPO_ENTREGA.min))}</strong> y el{' '}
                  <strong>{fechaCorta(sumarDiasHabiles(fecha, TIEMPO_ENTREGA.max))}</strong>.
                </p>
                <p>Fechas aproximadas.</p>
              </section>
            )}

            {(pedido.guia || pedido.seguimiento_url) && (
              <section className="pedido-bloque">
                <h3>Guía de rastreo</h3>
                {pedido.guia && <p><strong>{pedido.guia}</strong></p>}
                {pedido.seguimiento_url && (
                  <p>
                    <a href={pedido.seguimiento_url} target="_blank" rel="noopener noreferrer">Rastrear mi paquete</a>
                  </p>
                )}
              </section>
            )}

            <section className="pedido-bloque">
              <h3>Libros del pedido</h3>
              <ul className="resumen">
                {(pedido.libros || []).map((l, i) => (
                  <li key={i}>
                    <span>{l.titulo} × {l.cantidad}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <p className="pedido-folio">
            ¿Dudas? Escríbenos a <a href={`mailto:${INFO.correo}`}>{INFO.correo}</a> o llámanos al{' '}
            <a href={`tel:${INFO.telefono.replace(/[^\d+]/g, '')}`}>{INFO.telefono}</a>.
          </p>
        </section>
      )}
    </>
  )
}

function PaginaNosotros() {
  return (
    <>
      <h2>Sobre nosotros</h2>

      <h3 className="seccion-titulo">Quiénes somos</h3>
      <p className="texto-centro">
        Librería Shakespeare es una librería en línea para lectores de todas las edades. 
        Te ofrecemos libros seleccionados, una compra sencilla y la tranquilidad de recibirlos donde estés. 
        Porque leer debería ser fácil, y encontrar tu próximo libro, un placer.
      </p>

      <h3 className="seccion-titulo">Dónde encontrarnos</h3>
      <ul className="datos">
        <li className="dato">
          <span className="icono" aria-hidden="true">📍</span>
          <div>
            <h4>Ubicación</h4>
            <p>{INFO.direccion}</p>
          </div>
        </li>
        <li className="dato">
          <span className="icono" aria-hidden="true">✉️</span>
          <div>
            <h4>Correo electrónico</h4>
            <p><a href={`mailto:${INFO.correo}`}>{INFO.correo}</a></p>
          </div>
        </li>
        <li className="dato">
          <span className="icono" aria-hidden="true">📞</span>
          <div>
            <h4>Teléfono</h4>
            <p><a href={`tel:${INFO.telefono.replace(/[^\d+]/g, '')}`}>{INFO.telefono}</a></p>
          </div>
        </li>
        <li className="dato">
          <span className="icono" aria-hidden="true">🕒</span>
          <div>
            <h4>Horario de atención</h4>
            <p>{INFO.horario}</p>
          </div>
        </li>
      </ul>
    </>
  )
}

function Pagina404() {
  return (
    <section className="aviso">
      <p className="grande" aria-hidden="true">404</p>
      <h2>Página no encontrada</h2>
      <p>La dirección que buscas no existe.</p>
      <div className="acciones">
        <a className="boton" href="#/">Volver al inicio</a>
      </div>
    </section>
  )
}

const ENLACES = [
  { ruta: 'busqueda', href: '#/busqueda', texto: 'Buscar' },
  { ruta: 'seguimiento', href: '#/seguimiento', texto: 'Seguimiento' },
  { ruta: 'nosotros', alias: 'contacto', href: '#/nosotros', texto: 'Sobre nosotros' },
]

export default function App() {
  const { pag, arg } = useRuta()

  /* Catálogo: se muestra al instante el último guardado (o el de respaldo) y se actualiza desde la base de datos */
  const [libros, setLibros] = useState(() => {
    const guardado = leer('bookplace-catalogo', null)
    return Array.isArray(guardado) && guardado.length > 0 ? guardado : LIBROS
  })
  const [catalogoListo, setCatalogoListo] = useState(!nubeActiva)

  useEffect(() => {
    if (!nubeActiva) return undefined
    let activo = true
    cargarLibros().then((lista) => {
      if (!activo) return
      if (lista) {
        setLibros(lista)
        guardar('bookplace-catalogo', lista)
      }
      setCatalogoListo(true)
    })
    return () => {
      activo = false
    }
  }, [])

  const catalogo = useMemo(
    () => ({
      libros,
      libroPorId: (id) => libros.find((l) => l.id === id),
      categorias: categoriasDe(libros),
      listo: catalogoListo,
    }),
    [libros, catalogoListo],
  )
  const { libroPorId } = catalogo

  const [carritoGuardado, setCarrito] = useState(() => {
    const c = leer('bookplace-carrito-v2', [])
    return Array.isArray(c) ? c : []
  })
  /* Solo cuentan los libros que existen en el catálogo actual */
  const carrito = useMemo(() => carritoGuardado.filter((i) => libros.some((l) => l.id === i.id)), [carritoGuardado, libros])
  useEffect(() => {
    if (catalogoListo && carrito.length !== carritoGuardado.length) setCarrito(carrito)
  }, [catalogoListo, carrito, carritoGuardado.length])
  const [ultimaCompra, setUltimaCompra] = useState(() => leer('bookplace-ultima-compra', null))
  const [estado, setEstado] = useState('')
  const temporizadorEstado = useRef(null)
  useEffect(() => {
    guardar('bookplace-carrito-v2', carritoGuardado)
  }, [carritoGuardado])

  useEffect(() => () => clearTimeout(temporizadorEstado.current), [])

  /* Reintenta enviar pedidos que no se pudieron guardar por falta de conexión */
  useEffect(() => {
    reenviarPendientes()
  }, [])

  const cantidadTotal = carrito.reduce((s, i) => s + i.cantidad, 0)
  const total = carrito.reduce((s, i) => s + libroPorId(i.id).precio * i.cantidad, 0)

  function agregar(id) {
    setCarrito((actual) =>
      actual.some((i) => i.id === id)
        ? actual.map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + 1 } : i))
        : [...actual, { id, cantidad: 1 }],
    )
    setEstado(`${libroPorId(id).titulo} agregado al carrito`)
    clearTimeout(temporizadorEstado.current)
    temporizadorEstado.current = setTimeout(() => setEstado(''), 2000)
  }

  function cambiarCantidad(id, cambio) {
    setCarrito((actual) =>
      actual
        .map((i) => (i.id === id ? { ...i, cantidad: i.cantidad + cambio } : i))
        .filter((i) => i.cantidad > 0),
    )
  }

  function quitar(id) {
    setCarrito((actual) => actual.filter((i) => i.id !== id))
  }

  function confirmarCompra(datos) {
    const pedido = {
      numero: generarFolio(),
      fecha: new Date().toISOString(),
      cliente: datos,
      libros: carrito.map((i) => ({
        id: i.id,
        titulo: libroPorId(i.id).titulo,
        cantidad: i.cantidad,
        precio: libroPorId(i.id).precio,
      })),
      total,
    }
    guardar('bookplace-pedidos', leer('bookplace-pedidos', []).concat(pedido))
    guardar('bookplace-ultima-compra', pedido)
    guardarPedidoEnLaNube(pedido) // envía el pedido a la base de datos (no bloquea la compra)
    setUltimaCompra(pedido)
    setCarrito([])
    irA('#/compra-realizada')
  }

  let contenido
  if (pag === '') contenido = <PaginaInicio onAgregar={agregar} />
  else if (pag === 'busqueda') contenido = <PaginaBusqueda key={arg ?? ''} texto={arg} onAgregar={agregar} />
  else if (pag === 'libro') contenido = <PaginaDetalle id={arg} onAgregar={agregar} />
  else if (pag === 'carrito')
    contenido = <PaginaCarrito carrito={carrito} total={total} onCambiar={cambiarCantidad} onQuitar={quitar} />
  else if (pag === 'compra')
    contenido = <PaginaCompra carrito={carrito} total={total} onConfirmar={confirmarCompra} />
  else if (pag === 'compra-realizada') contenido = <PaginaCompraRealizada compra={ultimaCompra} />
  else if (pag === 'seguimiento') contenido = <PaginaSeguimiento key={arg ?? ''} folioInicial={arg} />
  else if (pag === 'nosotros' || pag === 'contacto') contenido = <PaginaNosotros />
  else contenido = <Pagina404 />

  return (
    <CatalogoContext.Provider value={catalogo}>
    <div className={`app${pag !== '' ? ' compacto' : ''}`}>
      <header>
        <nav aria-label="Principal">
          <a href="#/" aria-current={pag === '' ? 'page' : undefined}>Inicio</a>
          <div className="nav-der">
            {ENLACES.map((e) => (
              <a key={e.ruta} href={e.href} aria-current={pag === e.ruta || pag === e.alias ? 'page' : undefined}>
                {e.texto}
              </a>
            ))}
            <a href="#/carrito" aria-current={pag === 'carrito' ? 'page' : undefined}>
              Carrito
              <span className="badge">{cantidadTotal}</span>
              <span className="sr-only"> en el carrito</span>
            </a>
          </div>
        </nav>
        <h1>
          <a href="#/">
            <img className="logo-img" src={logo} alt="Librería Shakespeare" />
          </a>
        </h1>
        <p className="lema">un lugar para perderse entre libros</p>
      </header>

      <p className="sr-only" role="status">{estado}</p>

      <main id="vista" tabIndex={-1}>{contenido}</main>

      <footer className="pie">
        <div className="pie-contenido">
          <section className="pie-marca">
            <a href="#/" aria-label="Librería Shakespeare, ir al inicio">
              <img className="pie-logo" src={logo} alt="" />
            </a>
            <p>Una librería en línea para lectores de todas las edades.</p>
          </section>

          <section aria-labelledby="pie-explora">
            <h2 className="pie-titulo" id="pie-explora">Explora</h2>
            <ul className="pie-lista">
              <li><a href="#/">Inicio</a></li>
              <li><a href="#/busqueda">Buscar libros</a></li>
              <li><a href="#/seguimiento">Seguimiento de pedido</a></li>
              <li><a href="#/nosotros">Sobre nosotros</a></li>
              <li><a href="#/carrito">Carrito</a></li>
            </ul>
          </section>

          <section aria-labelledby="pie-contacto">
            <h2 className="pie-titulo" id="pie-contacto">Contacto</h2>
            <ul className="pie-lista">
              <li>{INFO.direccion}</li>
              <li><a href={`mailto:${INFO.correo}`}>{INFO.correo}</a></li>
              <li><a href={`tel:${INFO.telefono.replace(/[^\d+]/g, '')}`}>{INFO.telefono}</a></li>
              <li>{INFO.horario}</li>
            </ul>
          </section>
        </div>

        <div className="pie-legal">
          <p>© 2026 Librería Shakespeare</p>
          <p>Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
    </CatalogoContext.Provider>
  )
}
