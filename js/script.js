const inventario = [];

const cajaCodigo = document.getElementById("code");
const cajaDescripcion = document.getElementById("description");
const cajaCantidadInicial = document.getElementById("cantidad-inicial");
const btnAñadirProducto = document.getElementById("add");

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

    cajaCodigo.value = "";
    cajaDescripcion.value = "";
    cajaCantidadInicial.value = "";
    
    console.log(inventario);
})