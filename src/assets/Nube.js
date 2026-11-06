/* Guarda los pedidos en la base de datos (Supabase) para verlos en el panel de administración.
   Si no hay conexión o la nube no está configurada, la tienda sigue funcionando igual:
   los pedidos fallidos se guardan en el navegador y se reintentan la próxima vez que se abra. */
import { SUPABASE_URL, SUPABASE_KEY } from './config.js'

const CLAVE_PENDIENTES = 'bookplace-por-enviar'
export const nubeActiva = Boolean(SUPABASE_URL && SUPABASE_KEY)

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
  if (!r.ok && r.status !== 409) throw new Error('HTTP ' + r.status)
}

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
  } catch {
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
      } catch {
        return // sigue sin conexión: se intenta de nuevo en otra visita
      }
    }
  } finally {
    reenviando = false
  }
}