/* Lógica del Sistema de Gestión de Carnicería (datos guardados en localStorage) */
const CLAVE = "carniceria_sistema_v1";
let datos = JSON.parse(localStorage.getItem(CLAVE) || "null") || {
  productos: [],
  clientes: [],
  proveedores: [],
  ventas: [],
};
let carrito = [];
const $ = (id) => document.getElementById(id);
const bs = (n) => "Bs " + Number(n || 0).toFixed(2);
const escapar = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
function guardar() {
  localStorage.setItem(CLAVE, JSON.stringify(datos));
  actualizarTodo();
}
function mostrarSeccion(id) {
  document.querySelectorAll(".section").forEach((s) => s.classList.toggle("active", s.id === id));
  document
    .querySelectorAll(".side-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.section === id));
}
document
  .querySelectorAll(".side-btn")
  .forEach((b) => b.addEventListener("click", () => mostrarSeccion(b.dataset.section)));

function limpiarProducto() {
  $("formProducto").reset();
  $("productoId").value = "";
  $("guardarProducto").textContent = "Guardar producto";
}
$("formProducto").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = $("productoId").value;
  const p = {
    id: id || String(Date.now()),
    nombre: $("nombreProducto").value.trim(),
    categoria: $("categoriaProducto").value,
    precio: Number($("precioProducto").value),
    stock: Number($("stockProducto").value),
    unidad: $("unidadProducto").value,
  };
  if (!p.nombre || p.precio <= 0 || p.stock < 0) return alert("Verifica los datos del producto.");
  if (id) {
    const anterior = datos.productos.find((x) => x.id === id);
    if (anterior) {
      p.stock = Number($("stockProducto").value);
      Object.assign(anterior, p);
    }
  } else datos.productos.push(p);
  limpiarProducto();
  guardar();
});
function editarProducto(id) {
  const p = datos.productos.find((x) => x.id === id);
  if (!p) return;
  $("productoId").value = p.id;
  $("nombreProducto").value = p.nombre;
  $("categoriaProducto").value = p.categoria;
  $("precioProducto").value = p.precio;
  $("stockProducto").value = p.stock;
  $("unidadProducto").value = p.unidad;
  $("guardarProducto").textContent = "Actualizar producto";
  mostrarSeccion("productos");
}
function eliminarProducto(id) {
  if (!confirm("¿Eliminar este producto?")) return;
  datos.productos = datos.productos.filter((p) => p.id !== id);
  guardar();
}
function renderProductos() {
  const q = $("buscarProducto").value.toLowerCase();
  const lista = datos.productos.filter(
    (p) => p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q),
  );
  $("tablaProductos").innerHTML = lista.length
    ? lista
        .map(
          (p) =>
            `<tr><td>${escapar(p.nombre)}</td><td>${escapar(p.categoria)}</td><td>${bs(p.precio)}</td><td>${p.stock} ${escapar(p.unidad)}</td><td><button class="btn small" onclick="editarProducto('${p.id}')">Editar</button> <button class="btn danger small" onclick="eliminarProducto('${p.id}')">Eliminar</button></td></tr>`,
        )
        .join("")
    : '<tr><td colspan="5" class="empty">No hay productos registrados.</td></tr>';
}

function renderInventario() {
  const q = $("buscarInventario").value.toLowerCase();
  const lista = datos.productos.filter((p) => p.nombre.toLowerCase().includes(q));
  $("tablaInventario").innerHTML = lista.length
    ? lista
        .map(
          (p) =>
            `<tr><td>${escapar(p.nombre)}</td><td>${escapar(p.categoria)}</td><td><span class="pill ${p.stock <= 5 ? "warn" : ""}">${p.stock}</span></td><td>${escapar(p.unidad)}</td><td><input type="number" min="0" step="0.01" id="stock-${p.id}" value="${p.stock}" style="width:100px"> <button class="btn small" onclick="actualizarStock('${p.id}')">Guardar</button></td></tr>`,
        )
        .join("")
    : '<tr><td colspan="5" class="empty">No hay productos registrados.</td></tr>';
}
function actualizarStock(id) {
  const p = datos.productos.find((x) => x.id === id);
  const n = Number($("stock-" + id).value);
  if (!p || !Number.isFinite(n) || n < 0) return alert("Ingresa una cantidad válida.");
  p.stock = n;
  guardar();
}

function limpiarCliente() {
  $("formCliente").reset();
  $("clienteId").value = "";
}
$("formCliente").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = $("clienteId").value;
  const c = {
    id: id || String(Date.now()),
    nombre: $("nombreCliente").value.trim(),
    telefono: $("telefonoCliente").value.trim(),
    correo: $("correoCliente").value.trim(),
  };
  if (id) {
    const i = datos.clientes.findIndex((x) => x.id === id);
    if (i >= 0) datos.clientes[i] = c;
  } else datos.clientes.push(c);
  limpiarCliente();
  guardar();
});
function editarCliente(id) {
  const c = datos.clientes.find((x) => x.id === id);
  if (!c) return;
  $("clienteId").value = c.id;
  $("nombreCliente").value = c.nombre;
  $("telefonoCliente").value = c.telefono;
  $("correoCliente").value = c.correo;
  mostrarSeccion("clientes");
}
function eliminarCliente(id) {
  if (!confirm("¿Eliminar este cliente?")) return;
  datos.clientes = datos.clientes.filter((c) => c.id !== id);
  guardar();
}
function renderClientes() {
  const q = $("buscarCliente").value.toLowerCase();
  const lista = datos.clientes.filter((c) => c.nombre.toLowerCase().includes(q) || c.telefono.includes(q));
  $("tablaClientes").innerHTML = lista.length
    ? lista
        .map(
          (c) =>
            `<tr><td>${escapar(c.nombre)}</td><td>${escapar(c.telefono)}</td><td>${escapar(c.correo)}</td><td><button class="btn small" onclick="editarCliente('${c.id}')">Editar</button> <button class="btn danger small" onclick="eliminarCliente('${c.id}')">Eliminar</button></td></tr>`,
        )
        .join("")
    : '<tr><td colspan="4" class="empty">No hay clientes registrados.</td></tr>';
}

function limpiarProveedor() {
  $("formProveedor").reset();
  $("proveedorId").value = "";
}
$("formProveedor").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = $("proveedorId").value;
  const p = {
    id: id || String(Date.now()),
    nombre: $("nombreProveedor").value.trim(),
    contacto: $("contactoProveedor").value.trim(),
    telefono: $("telefonoProveedor").value.trim(),
    producto: $("productoProveedor").value.trim(),
  };
  if (id) {
    const i = datos.proveedores.findIndex((x) => x.id === id);
    if (i >= 0) datos.proveedores[i] = p;
  } else datos.proveedores.push(p);
  limpiarProveedor();
  guardar();
});
function editarProveedor(id) {
  const p = datos.proveedores.find((x) => x.id === id);
  if (!p) return;
  $("proveedorId").value = p.id;
  $("nombreProveedor").value = p.nombre;
  $("contactoProveedor").value = p.contacto;
  $("telefonoProveedor").value = p.telefono;
  $("productoProveedor").value = p.producto;
  mostrarSeccion("proveedores");
}
function eliminarProveedor(id) {
  if (!confirm("¿Eliminar este proveedor?")) return;
  datos.proveedores = datos.proveedores.filter((p) => p.id !== id);
  guardar();
}
function renderProveedores() {
  const q = $("buscarProveedor").value.toLowerCase();
  const lista = datos.proveedores.filter(
    (p) => p.nombre.toLowerCase().includes(q) || p.producto.toLowerCase().includes(q),
  );
  $("tablaProveedores").innerHTML = lista.length
    ? lista
        .map(
          (p) =>
            `<tr><td>${escapar(p.nombre)}</td><td>${escapar(p.contacto)}</td><td>${escapar(p.telefono)}</td><td>${escapar(p.producto)}</td><td><button class="btn small" onclick="editarProveedor('${p.id}')">Editar</button> <button class="btn danger small" onclick="eliminarProveedor('${p.id}')">Eliminar</button></td></tr>`,
        )
        .join("")
    : '<tr><td colspan="5" class="empty">No hay proveedores registrados.</td></tr>';
}

function actualizarOpcionesVenta() {
  const actual = $("productoVenta").value;
  $("productoVenta").innerHTML =
    '<option value="">Seleccionar producto</option>' +
    datos.productos
      .filter((p) => p.stock > 0)
      .map(
        (p) =>
          `<option value="${p.id}">${escapar(p.nombre)} — ${bs(p.precio)} / ${escapar(p.unidad)} (stock: ${p.stock})</option>`,
      )
      .join("");
  if (datos.productos.some((p) => p.id === actual && p.stock > 0)) $("productoVenta").value = actual;
  $("clienteVenta").innerHTML =
    '<option value="">Cliente ocasional</option>' +
    datos.clientes.map((c) => `<option value="${c.id}">${escapar(c.nombre)}</option>`).join("");
}
$("agregarVenta").addEventListener("click", () => {
  const id = $("productoVenta").value;
  const cantidad = Number($("cantidadVenta").value);
  const p = datos.productos.find((x) => x.id === id);
  if (!p) return alert("Selecciona un producto.");
  if (!Number.isFinite(cantidad) || cantidad <= 0) return alert("Ingresa una cantidad válida.");
  const enCarrito = carrito.filter((x) => x.productoId === id).reduce((a, x) => a + x.cantidad, 0);
  if (enCarrito + cantidad > p.stock) return alert("No hay suficiente stock disponible.");
  carrito.push({ productoId: id, cantidad });
  renderCarrito();
});
function renderCarrito() {
  const filas = carrito
    .map((x, i) => {
      const p = datos.productos.find((y) => y.id === x.productoId);
      return p
        ? `<tr><td>${escapar(p.nombre)}</td><td>${x.cantidad} ${escapar(p.unidad)}</td><td>${bs(p.precio * x.cantidad)}</td><td><button class="btn danger small" onclick="quitarCarrito(${i})">Quitar</button></td></tr>`
        : "";
    })
    .join("");
  $("detalleVenta").innerHTML =
    filas || '<tr><td colspan="4" class="empty">No hay productos agregados.</td></tr>';
  $("totalPagar").textContent = carrito
    .reduce((t, x) => {
      const p = datos.productos.find((y) => y.id === x.productoId);
      return t + (p ? p.precio * x.cantidad : 0);
    }, 0)
    .toFixed(2);
}
function quitarCarrito(i) {
  carrito.splice(i, 1);
  renderCarrito();
}
function vaciarCarrito() {
  carrito = [];
  renderCarrito();
}
$("confirmarVenta").addEventListener("click", () => {
  if (!carrito.length) return alert("Agrega al menos un producto.");
  for (const x of carrito) {
    const p = datos.productos.find((y) => y.id === x.productoId);
    if (!p || p.stock < x.cantidad) return alert("El stock cambió. Revisa el detalle de la venta.");
  }
  const cliente = datos.clientes.find((c) => c.id === $("clienteVenta").value);
  const items = carrito.map((x) => {
    const p = datos.productos.find((y) => y.id === x.productoId);
    p.stock = Number((p.stock - x.cantidad).toFixed(2));
    return {
      nombre: p.nombre,
      cantidad: x.cantidad,
      unidad: p.unidad,
      precio: p.precio,
      subtotal: p.precio * x.cantidad,
    };
  });
  const total = items.reduce((a, x) => a + x.subtotal, 0);
  datos.ventas.unshift({
    id: String(Date.now()),
    fecha: new Date().toLocaleString("es-BO"),
    cliente: cliente ? cliente.nombre : "Cliente ocasional",
    items,
    total,
  });
  carrito = [];
  guardar();
  alert("Venta registrada correctamente. El inventario fue actualizado.");
});
function renderVentas() {
  $("historialVentas").innerHTML = datos.ventas.length
    ? datos.ventas
        .map(
          (v, i) =>
            `<tr><td>${datos.ventas.length - i}</td><td>${escapar(v.fecha)}</td><td>${escapar(v.cliente)}</td><td>${v.items.map((x) => `${escapar(x.nombre)} (${x.cantidad})`).join(", ")}</td><td>${bs(v.total)}</td></tr>`,
        )
        .join("")
    : '<tr><td colspan="5" class="empty">Todavía no hay ventas registradas.</td></tr>';
}

function actualizarTodo() {
  renderProductos();
  renderInventario();
  renderClientes();
  renderProveedores();
  actualizarOpcionesVenta();
  renderCarrito();
  renderVentas();
  actualizarDashboard();
  actualizarReportes();
}
function actualizarDashboard() {
  $("totalProductos").textContent = datos.productos.length;
  $("totalInventario").textContent = datos.productos.reduce((a, p) => a + Number(p.stock), 0).toFixed(2);
  $("totalVentas").textContent = datos.ventas.length;
  $("totalClientes").textContent = datos.clientes.length;
  const bajos = datos.productos.filter((p) => p.stock <= 5);
  $("alertasInventario").innerHTML = bajos.length
    ? bajos
        .map((p) => `<p>⚠️ <strong>${escapar(p.nombre)}</strong>: quedan ${p.stock} ${escapar(p.unidad)}</p>`)
        .join("")
    : '<span class="pill">Inventario sin alertas de stock bajo</span>';
  $("ultimasVentas").innerHTML =
    datos.ventas
      .slice(0, 5)
      .map(
        (v) => `<tr><td>${escapar(v.fecha)}</td><td>${escapar(v.cliente)}</td><td>${bs(v.total)}</td></tr>`,
      )
      .join("") || '<tr><td colspan="3" class="empty">No hay ventas todavía.</td></tr>';
}
function actualizarReportes() {
  $("ingresosTotales").textContent = bs(datos.ventas.reduce((a, v) => a + v.total, 0));
  $("cantidadVentas").textContent = datos.ventas.length;
  $("productosRegistrados").textContent = datos.productos.length;
  $("alertasStock").textContent = datos.productos.filter((p) => p.stock <= 5).length;
  $("tablaReportes").innerHTML = datos.ventas.length
    ? datos.ventas
        .map(
          (v) =>
            `<tr><td>${escapar(v.fecha)}</td><td>${escapar(v.cliente)}</td><td>${v.items.map((x) => `${escapar(x.nombre)} x ${x.cantidad}`).join(", ")}</td><td>${bs(v.total)}</td></tr>`,
        )
        .join("")
    : '<tr><td colspan="4" class="empty">No hay información para mostrar.</td></tr>';
}

actualizarTodo();
