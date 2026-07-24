const inventario = [];
// VARIABLES
    // PANEL DE CARGA DE PRODUTOS AL SISTEMA
const cajaCodigo = document.getElementById("code");
const cajaDescripcion = document.getElementById("description");
const cajaCantidadInicial = document.getElementById("cantidad-inicial");
const btnAñadirProducto = document.getElementById("add");
    // TABLA PARA MOSTRAR EL INVENTARIO EN PANTALLA
const sectorInventario = document.getElementById("inventario-body");
const barraDeBusqueda = document.getElementById("search-bar");
    // PANEL DE EDICIÓN DE PRODUCTOS
const selectorDeProductos = document.getElementById("selector");
const cajaCantidadAEditar = document.getElementById("amount");
const btnAñadirStock = document.getElementById("add-amount");
const btnRemoverStock = document.getElementById("remove-amount");

// FUNCIONES
    // FUNCIÓN PARA ACTUALIZAR E IMPRIMIR NUESTRO INVENTARIO EN PANTALLA
function renderizarInventario(listaARenderizar = inventario){
    sectorInventario.innerHTML = "";
    
    for (const producto of listaARenderizar){
        const fila = document.createElement("tr");
        const celdaCodigo = document.createElement("td");
        const celdaDescripcion = document.createElement("td");
        const celdaCantidad = document.createElement("td");
        const celdaAcciones = document.createElement("td");
        const borrarIcono = document.createElement("img");
        
        celdaCodigo.textContent = producto.codigo;
        celdaDescripcion.textContent = producto.descripcion;
        celdaCantidad.textContent = producto.cantidad;
        borrarIcono.src = `assets/delete.png`;
        
        // EVENTO PARA BORRAR EL PRODUCTO AL HACER CLICK SOBRE EL ICONO DE ELIMINAR 
        borrarIcono.addEventListener("click", ()=>{
            eliminarProducto(producto);
        });
        
        celdaAcciones.appendChild(borrarIcono);
        fila.appendChild(celdaCodigo);
        fila.appendChild(celdaDescripcion);
        fila.appendChild(celdaCantidad);
        fila.appendChild(celdaAcciones);
        sectorInventario.appendChild(fila);
    }
};
    // FUNCIÓN PARA ACTUALIZAR Y RENDERIZAR NUESTRO SELECTOR DE PRODUCTOS EN EL PANEL DE EDICION
function renderizarSelector(){
    selectorDeProductos.innerHTML = `<option value="">Elija una opción...</option>`;

    for (const producto of inventario){
        const opcion = document.createElement("option");

        opcion.textContent = producto.codigo;
        selectorDeProductos.appendChild(opcion)
    }
};
    // FUNCION PARA MODIFICAR STOCK DE UN PRODUCTO EN ESPECIFICO
function modificarStock(tipo){
    const codigo = selectorDeProductos.value;
    const productoEncontrado = inventario.find(producto => producto.codigo === codigo);
    const cantidad = Number(cajaCantidadAEditar.value.trim());

    if (cajaCantidadAEditar.value.trim() === ""){
        alert("Ingrese un número valido");
        return;
    }
    if (!productoEncontrado){
        alert("Su producto no existe.");
        return;
    }
    if (!Number.isInteger(cantidad)){
        alert("Ingrese un valor entero.");
        return;
    }
    if (cantidad <= 0){
        alert("Ingrese un valor mayor a 0.");
        return;
    }
    // SI SU PRODUCTO EXISTE: 
    if (tipo === "añadir"){
        productoEncontrado.cantidad += cantidad;
    } else if (tipo === "remover"){
        if ((productoEncontrado.cantidad - cantidad) < 0){
            alert("Denegado, su stock queda en negativo.");
            return;
        }
        productoEncontrado.cantidad -= cantidad;
    }
    guardarInventario();
    renderizarInventario();
    renderizarSelector();
    console.log(inventario);
    cajaCantidadAEditar.value = "";
};
    // FUNCIÓN PARA GUARDAR INVENTARIO
function guardarInventario(){
    const inventarioJSON = JSON.stringify(inventario);
    localStorage.setItem("inventario", inventarioJSON);
}
    // FUNCIÓN PARA CARGAR INVENTARIO
function cargarInventario(){
    inventario.length = 0;
    const inventarioJSON = localStorage.getItem("inventario");
    if (inventarioJSON === null){
        return;
    }
    const inventarioLocalStorage = JSON.parse(inventarioJSON);
    
    for (const producto of inventarioLocalStorage){
        inventario.push(producto);
    }
    renderizarInventario();
    renderizarSelector();
}
    // FUNCIÓN PARA ELIMINAR UN PRODUCTO EL INVENTARIO
function eliminarProducto(producto){
    const indice = inventario.findIndex(item => item.codigo === producto.codigo);
    if (indice === -1){
        return;
    }
    if (confirm(`Esta seguro de eliminar el producto ${producto.codigo}?`)){
        inventario.splice(indice, 1);
        guardarInventario();
        renderizarInventario();
        renderizarSelector();
    }
}

// EVENTOS
    // BOTON PARA AÑADIR PRODUCTOS AL INVENTARIO
btnAñadirProducto.addEventListener("click", ()=>{
    const codigo = cajaCodigo.value.trim().toUpperCase();
    const descripcion = cajaDescripcion.value.trim();
    const cantidad = Number(cajaCantidadInicial.value);

    
    if (codigo === ""){
        alert("Ingrese un código válido.");
        return;
    }
    if (descripcion === ""){
        alert("Ingrese una descripción válida.");
        return;
    }
    if (cajaCantidadInicial.value.trim() === ""){
        alert("Ingrese un número válido.");
        return;
    }
    if (cantidad < 0){
        alert("Ingrese un valor igual o mayor a 0.");
        return;
    }
    if (!Number.isInteger(cantidad)){
        alert("Ingrese un número entero.");
        return;
    }
    if (inventario.some(producto => producto.codigo === codigo)){
        alert("Su producto ya existe en el inventario.");
        return;
    }
    const producto = {
        codigo: codigo,
        descripcion: descripcion,
        cantidad: cantidad
    }

    inventario.push(producto);
    guardarInventario();
    renderizarInventario();
    renderizarSelector();

    cajaCodigo.value = "";
    cajaDescripcion.value = "";
    cajaCantidadInicial.value = "";

    console.log(inventario);
});
    // BOTON PARA AÑADIR STOCK DE UN PRODCUTO EN ESPECIFICO
btnAñadirStock.addEventListener("click", ()=>{
    modificarStock("añadir");
});
    // BOTON PARA REMOVER STOCK DE UN PRODUCTO EN ESPECIFICO
btnRemoverStock.addEventListener("click", ()=>{
    modificarStock("remover")
});
    // BARRA DE BUSQUEDA PARA FILTRAR OBJETOS
barraDeBusqueda.addEventListener("input", ()=>{
    const busqueda = barraDeBusqueda.value.toLowerCase().trim();

    const inventarioAux = inventario.filter(producto =>
        producto.codigo.toLowerCase().includes(busqueda)
        ||
        producto.descripcion.toLowerCase().includes(busqueda));
    
    renderizarInventario(inventarioAux);
});


cargarInventario();