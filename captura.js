'use strict';

const registros = [];
let idEdicion = 0;

// Funcion que carga los valores en los inputs dado un id
// Realiza una busqueda en los registros previamente cargados y almacenados en el arreglo
function cargarRegistro(id) {
  try {
    const registro = registros.filter(registro => registro.Id == id)[0];

    idEdicion = id;
    document.getElementById("codigoDeTarea").value = registro.CodigoDeTarea;
    document.getElementById("tituloDeTarea").value = registro.TituloDeTarea;
    document.getElementById("descripcionTarea").value = registro.DescripcionTarea;
    document.getElementById("fechaInicio").value = registro.FechaInicio;
    document.getElementById("nombreCliente").value = registro.NombreCliente;
    document.getElementById("idProyecto").value = registro.IdProyecto;
    document.getElementById("comentarios").value = registro.Comentarios;
    document.getElementById("estatus").value = registro.Estatus;

    muestraBotones();
  } catch (error) {
    console.log(error);
    alert("Ha ocurrido un error, intentalo de nuevo");
  }
}

// Crea los renglones de la tabla con los datos en el arreglo "registros para mostrar" 
function dibujaTabla(registrosParaMostrar) {
  try {
    const registrosBody = document.getElementById("registrosBody");
    registrosBody.innerHTML = '';

    ordenaRegistros(registrosParaMostrar);

    registrosParaMostrar.forEach(registro => {
      const nuevoRegistro = registrosBody.insertRow();

      nuevoRegistro.innerHTML = `
          <td>${registro.CodigoDeTarea}</td>
          <td>${registro.TituloDeTarea}</td>
          <td>${registro.DescripcionTarea}</td>
          <td>${registro.FechaInicio}</td>
          <td>${registro.NombreCliente}</td>
          <td>${registro.IdProyecto}</td>
          <td><textarea disabled style='width: 100%'>${registro.Comentarios}</textarea></td>
          <td>${registro.Estatus}</td>
          <td><button type='button' onclick='cargarRegistro(${registro.Id})' class='btn btn-outline-secondary btn-sm' />Editar</td>`;
    });
  } catch (error) {
    console.log(error);
    alert("Ha ocurrido un error, intentalo de nuevo");
  }
}

// Actualiza el arreglo registros de un renglon previamente seleccionado 
function actualizarRegistro() {
  try {
    const valores = obtenRegistroDeForma(false);
    const idx = registros.findIndex((registro) => registro.Id == idEdicion);  

    delete registros[idx];
    
    const nuevosComentarios = document.getElementById('nuevosComentarios').value;

    valores.Id = idEdicion;

    if (nuevosComentarios != '') {
      const now = new Date();
      valores.Comentarios += `\n${now.toUTCString()}\n${nuevosComentarios}`;
    }

    registros.push(valores);

    ocultaBotones();
    dibujaTabla(registros);
  } catch (error) {
    console.log(error);
    alert("Ha ocurrido un error, intentalo de nuevo");
  }
}

// Cancela la actualización de un registro determiando y resetea los valores
function cancelarActualizacion() {
  ocultaBotones();
  dibujaTabla(registros);
}

// Oculta y deshabilita los elementos para la edición de un registro
function ocultaBotones() {
  document.getElementById('comentarios').disabled = false;
  document.getElementById('editarComentarios').classList.add("oculta");  
  document.getElementById('btnActualizar').classList.add("oculta");  
  document.getElementById('btnCancelar').classList.add("oculta");  
  document.getElementById('btnAgregar').classList.remove("oculta");
}

// Muestra y habilita los elementos para la edición de un registro
function muestraBotones() {
  document.getElementById('comentarios').disabled = true;
  document.getElementById('editarComentarios').classList.remove("oculta");  
  document.getElementById('btnActualizar').classList.remove("oculta");  
  document.getElementById('btnCancelar').classList.remove("oculta");  
  document.getElementById('btnAgregar').classList.add("oculta");
}

// Retorna un objeto con toda la información de la forma de captura
function obtenRegistroDeForma(agregaFecha) {
  const codigoDeTarea = document.getElementById("codigoDeTarea").value;
  const tituloDeTarea = document.getElementById("tituloDeTarea").value;
  const descripcionTarea = document.getElementById("descripcionTarea").value;
  const fechaInicio = document.getElementById("fechaInicio").value;
  const nombreCliente = document.getElementById("nombreCliente").value;
  const idProyecto = document.getElementById("idProyecto").value;
  const comentarios = document.getElementById("comentarios").value;
  const estatus = document.getElementById("estatus").value;

  const now = new Date();

  return {
    CodigoDeTarea: codigoDeTarea,
    TituloDeTarea: tituloDeTarea,
    DescripcionTarea: descripcionTarea,
    FechaInicio: fechaInicio,
    NombreCliente: nombreCliente,
    IdProyecto: idProyecto,
    Comentarios: `${agregaFecha ? now.toUTCString() + '\n' : ''}${comentarios}`,
    Estatus: estatus
  };
}

// Ordena un arreglo determinado en base a su id
function ordenaRegistros(registrosParaMostrar) {
  registrosParaMostrar.sort(function(a, b) {
    var keyA =a.Id, keyB = b.Id;
    if (keyA < keyB) return -1;
    if (keyA > keyB) return 1;
    return 0;
  });
}

// Función que filtra los registros dependiendo de su estatus
function filtrarRegistros() {
  const filtroEstatus = document.getElementById("filtroEstatus").value;
  const registrosFiltrados = registros.filter(registro => registro.Estatus == filtroEstatus);
  dibujaTabla(registrosFiltrados);
}

function quitarFiltros() {
  dibujaTabla(registros);
}

(() => {
    const forms = document.querySelectorAll('.needs-validation');
    
    // Registro del evento submit de todas las formas del documento
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();

        if (!form.checkValidity()) {
          form.classList.add('was-validated');
          return;
        }

        agregarTarea();
        form.reset();
        form.classList.remove('was-validated');

      }, false);
    });

    function agregarTarea() {
        const registro = obtenRegistroDeForma(true);
        registro.Id = Date.now();
        registros.push(registro);
        dibujaTabla(registros);
    }

    function getUsuario() {
        const params = new URLSearchParams(window.location.search);
        if (params.has("usuario")) {
            const usuario = params.get('usuario');
            const etiquetaUsuario = document.getElementById("usuario");

            etiquetaUsuario.innerHTML = usuario;
        }
    }

    getUsuario();
    ocultaBotones();
})();