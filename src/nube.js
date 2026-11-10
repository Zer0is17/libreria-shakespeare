/* Guarda los pedidos en la base de datos (Supabase) para verlos en el panel de administración.
   Si no hay conexión o la nube no está configurada, la tienda sigue funcionando igual:
   los pedidos fallidos se guardan en el navegador y se reintentan la próxima vez que se abra. */
import { SUPABASE_URL, SUPABASE_KEY } from './config.js'

const CLAVE_PENDIENTES = 'bookplace-por-enviar'
export const nubeActiva = Boolean(SUPABASE_URL && SUPABASE_KEY)

function cabecerasLectura() {
  const h = { apikey: SUPABASE_KEY }
  if (SUPABASE_KEY.startsWith('eyJ')) h.Authorization = `Bearer ${SUPABASE_KEY}`
  return h
}

function aLibro(f) {
  return {
    id: f.id,
    titulo: f.titulo,
    autor: f.autor,
    precio: Number(f.precio),
    color: '#628ecb',
    imagen: f.portada_url || null,
    descripcion: f.descripcion || '',
    categorias: Array.isArray(f.categorias) ? f.categorias : [],
  }
}

/* Libros visibles de la base de datos; devuelve null si no se pudo cargar (se usa el catálogo de respaldo) */
export async function cargarLibros() {
  if (!nubeActiva) return null
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/libros?select=*&activo=eq.true&order=orden.asc,creado.asc`, {
      headers: cabecerasLectura(),
    })
    if (!r.ok) return null
    const filas = await r.json()
    return Array.isArray(filas) && filas.length > 0 ? filas.map(aLibro) : null
  } catch {
    return null
  }
}

function cabeceras() {
  const h = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' }
  // Las claves antiguas (anon, formato JWT) también van como Bearer; las "publishable" no.
  if (SUPABASE_KEY.startsWith('eyJ')) h.Authorization = `Bearer ${SUPABASE_KEY}`
  return h
}

function aFila(p) {
  const c = p.cliente || {}
  return {
    numero: p.numero,
    nombre: c.nombre || '',
    correo: c.correo || '',
    direccion: c.direccion || '',
    ciudad: c.ciudad || '',
    pago: c.pago || '',
    libros: p.libros.map((l) => ({ id: l.id, titulo: l.titulo, cantidad: l.cantidad, precio: l.precio })),
    total: p.total,
  }
}

async function enviarFila(fila) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/pedidos`, {
    method: 'POST',
    headers: cabeceras(),
    body: JSON.stringify(fila),
  })
  // 409: ese número de pedido ya estaba guardado, no hay que repetirlo
  if (!r.ok && r.status !== 409) {
    const err = new Error('HTTP ' + r.status)
    err.status = r.status
    throw err
  }
}

/* Errores que no se arreglan reintentando (por ejemplo, un libro que ya no está disponible) */
const esPermanente = (err) =>
  err.status >= 400 && err.status < 500 && ![401, 403, 408, 429].includes(err.status)

function leerPendientes() {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE_PENDIENTES))
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

function guardarPendientes(lista) {
  try {
    localStorage.setItem(CLAVE_PENDIENTES, JSON.stringify(lista))
  } catch {
    /* sin almacenamiento disponible */
  }
}

export async function guardarPedidoEnLaNube(pedido) {
  if (!nubeActiva) return
  const fila = aFila(pedido)
  try {
    await enviarFila(fila)
  } catch (err) {
    if (esPermanente(err)) return
    guardarPendientes(leerPendientes().filter((f) => f.numero !== fila.numero).concat(fila))
  }
}

let reenviando = false

export async function reenviarPendientes() {
  if (!nubeActiva || reenviando) return
  reenviando = true
  try {
    for (const fila of leerPendientes()) {
      try {
        await enviarFila(fila)
        guardarPendientes(leerPendientes().filter((f) => f.numero !== fila.numero))
      } catch (err) {
        if (esPermanente(err)) {
          guardarPendientes(leerPendientes().filter((f) => f.numero !== fila.numero))
          continue
        }
        return // sigue sin conexión: se intenta de nuevo en otra visita
      }
    }
  } finally {
    reenviando = false
  }
}
