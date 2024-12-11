$(document).ready(function(){
    cargarInstituciones(true);  
    cargarTipoEspecialidades(true);      
    cargarInstituciones2(true);
    $("#institucion_").change(function () {
        cargarTipoEspecialidades2(true);
    })
    
    $("#tipoEspecialidad_").change(function () {
        cargarEspecialidades2();
    })
    
    $("#institucion").change(function(){
        cargarTipoEspecialidades(true);
    })
    
    $("#tipoEspecialidad").change(function () {
        cargarEspecialidades();
    })

    cargarProgramacion();
});
var tablaParametros;
const language = {
    "processing": "Procesando...",
    "lengthMenu": "Mostrar _MENU_ registros",
    "zeroRecords": "No se encontraron resultados",
    "emptyTable": "No se encontraron registros",
    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
    "search": "Buscar:",
    "infoThousands": ",",
    "loadingRecords": "Cargando...",
    "paginate": {
        "first": "Primero",
        "last": "Último",
        "next": "Siguiente",
        "previous": "Anterior"
    },
    "info": "Mostrando _START_ a _END_ de _TOTAL_ registros"
};


$('#btnBuscar').click(function () {
    cargarProgramacion()
})

$("#btnNuevo").click(function ()
{   
    cargarInstituciones2(true);
    $("#tituloModal").html("NUEVO PARAMETRO");
    $("#btnGrabarM").attr("title","Grabar parametro");
    $("#btnGrabarM").html("<span class=\"icon-floppy-disk\"></span> Grabar Parametro");
    $("#modalParamtrosCH").modal({backdrop: 'static', keyboard: false});
    limpiarModal();
});



function cargarProgramacion() {
    if ($.fn.DataTable.isDataTable('#tablaParametrosCH')) {
        tablaParametros.destroy();
    }

    var anioProg = $("#anioProg").val();
    var codLocal = $("#institucion").val() || '10';
    /* console.log(anioProg," ",codLocal) */
    tablaParametros = $("#tablaParametrosCH").DataTable({
        ajax: {
            url: path + "programacion/parametrosCH",
            type: "POST",
            dataType: "JSON",
            data: {
                anioProg: anioProg,
                codLocal: codLocal,
                opcion: "select"
            },
            beforeSend: function () {
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                /* console.log(response.data); */
                if (response.respuesta === "error") {
                    return {}
                } else {
                    return response.parametrosCH;
                }
            },
        },
        columnDefs: [
            {
                defaultContent: "-",
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [10, 18, 20, 50, 75, 100],
            [10, 18, 20, 50, 75, 100]
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Op;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Local;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Especialidad;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Año;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Mes;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Fecha;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.UsuarioReg;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FechaReg;
                }
            },
            {
                data: null,
                render: function(data){            
                    
                    return   "<button class=\"btn boton-tabla boton-naranja btnEditar\" type=\"button\" onclick=\"editarParametro('"+ data.Op+"');\" title=\"Editar Parametro\"><span class=\"icon-pencil\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                             "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"eliminarParametro('"+ data.Op +"');\" title=\"Eliminar Parametro\"><span class=\"icon-cross\"></span></button>";                    
                }
            },
        ],
        language: language
    });
}

$("#btnGrabarM").click(function ()
{   
    var Op = ($("#Op").val() !== undefined && $("#Op").val() !== null && $("#Op").val() !== "") ? $("#Op").val() : 0;
    console.log(Op)
    var institucion = $("#institucion_").val();
    var tipoEspecialidad = $("#tipoEspecialidad_").val();
    var especialidad = $("#especialidad_").val();
    var anioProg = $("#anioProgM").val();
    var mesProg = $("#mesProgM").val();
    var fecha = $("#fechaM").val();

    if (anioProg === "" || mesProg === "" || fecha === "") {
        Notiflix.Notify.Failure('Debe llenar todos los campos: Año, Mes y Fecha');
        return;
    }

    $.ajax({
        url: path + "programacion/parametrosCH",
        type: "POST",
        data: {
            opcion: "actualizar",
            Op : Op,
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad,
            especialidad: especialidad,
            anioProg: anioProg,
            mesProg: mesProg,
            fecha: fecha
        },
        success: function(data){
            Notiflix.Notify.Success('LOS PARÁMETROS SE REGISTRARON CON ÉXITO');
            $("#modalParamtrosCH").modal("hide");
            tablaParametros.ajax.reload();
        }
    });
});

function limpiarModal(){
    $("#Op").val("");
    $("#institucion_").val("");
    $("#tipoEspecialidad_").val("");
    $("#especialidad_").val("");

    // Establecer el año, mes y fecha actuales
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();

    // Formatear el mes y día a dos dígitos si es necesario
    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10) {
        day = '0' + day;
    }

    $("#anioProgM").val(year);
    $("#mesProgM").val(month);
    $("#fechaM").val(year + '-' + month + '-' + day);
}
function cambiarEspe(text1, tipo1, text2, tipo2, text3, tipo3){
    $(text1).val(tipo1)
    cargarTipoEspecialidades2()    
    setTimeout(() => {
        $(text2).val(tipo2)
    }, 100);
    cargarEspecialidades2()
    setTimeout(() => {
        $(text3).val(tipo3)
    }, 200);
    
}

function editarParametro(id) {
    cargarInstituciones2(true);
    $("#tituloModal").html("EDITAR PARAMETRO");
    $("#btnGrabarM").attr("title","Grabar parametro");
    $("#btnGrabarM").html("<span class=\"icon-floppy-disk\"></span> Grabar Parametro");
    limpiarModal();
    $("#modalParamtrosCH").modal({backdrop: 'static', keyboard: false});

    $.ajax({
        url: path + "programacion/parametrosCH",
        type: 'POST',
        dataType: "JSON",
        data: { 
            Op: id,
            opcion: "editar" 
        },
        success: function(data) {
            timeout = 240
            if (data.respuesta === "success") {
                setTimeout(() => {
                    var parametros = data.parametros[0];
                    console.log(parametros);
                    $('#Op').val(parametros.Op); 
                    //$('#institucion_').val(parametros.cod_local);
                    cambiarEspe("#institucion_", parametros.cod_local ,"#tipoEspecialidad_", parametros.Tipo_espe.trim(), "#especialidad_", parametros.Cod_espe)
                    //$('#especialidad_').val(parametros.Cod_espe);
                    $('#anioProgM').val(parametros.Año);
                    $('#mesProgM').val(parametros.Mes);
                    $('#fechaM').val(parametros.Fecha);
                }, timeout);
                $("#modalParamtrosCH").modal('show');
            } else {
                console.error(data.errores);
            }
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}



function eliminarParametro(id){

    $.ajax({
        url: path + "programacion/parametrosCH",
        type: "POST",
        data: {
            Op: id,
            opcion: "delete"
        },
        success: function (data) {
            Notiflix.Notify.Success('EL PARÁMETRO SE ELIMINO CON ÉXITO');
            tablaParametros.ajax.reload();
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

function cargarInstituciones2(enlazado) {
    $.ajax({
        url: path + "institucion/getInstituciones",
        type: "POST",
        data: {
        },
        success: function (data) {
            //console.log(data);
            var cboInstitucion = $("#institucion_");
            cboInstitucion.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.instituciones != "vacio") {
                    var instituciones = datos.instituciones;
                    for (i = 0; i < instituciones.length; i++) {
                        var institucion = instituciones[i];
                        var selected = institucion.cod_local === "10" ? "selected" : "";
                        cboInstitucion.append("<option " + selected + " value=\"" + institucion.cod_local + "\" >" + institucion.cod_local + " - " + ((institucion.descripcionM === null || institucion.descripcionM === "") ? institucion.descripcion : institucion.descripcionM) + "</option>");
                    }
                    if (enlazado == true) {
                        cargarTipoEspecialidades2(enlazado);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarTipoEspecialidades2(enlazado) {
    var institucion = $("#institucion_").val();
    $.ajax({
        url: path + "tipoEspecialidad/getTipoEspecialidades",
        type: "POST",
        data: {
            institucion: institucion
        },
        success: function (data) {
            //console.log(data);
            var cboTipoEspecialidad = $("#tipoEspecialidad_");
            cboTipoEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.tipoEspecialidades != "vacio") {
                    var tipoEspecialidades = datos.tipoEspecialidades;
                    for (i = 0; i < tipoEspecialidades.length; i++) {
                        var tipoEspecialidad = tipoEspecialidades[i];
                        cboTipoEspecialidad.append("<option value=\"" + tipoEspecialidad.tipo_espe + "\" >" + tipoEspecialidad.tipo_espe + " - " + tipoEspecialidad.descripcion + "</option>");
                    }
                    if (enlazado == true) {
                        cargarEspecialidades2(enlazado);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarEspecialidades2() {
    var institucion = $("#institucion_").val();
    var tipoEspecialidad = $("#tipoEspecialidad_").val();

    $.ajax({
        url: path + "especialidad/getEspecialidades",
        type: "POST",
        data: {
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad
        },
        success: function (data) {
            //console.log(data);
            var cboEspecialidad = $("#especialidad_");
            cboEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.especialidades != "vacio") {
                    var especialidades = datos.especialidades;
                    for (i = 0; i < especialidades.length; i++) {
                        var especialidad = especialidades[i];
                        cboEspecialidad.append("<option value=\"" + especialidad.cod_espe + "\" >" + especialidad.cod_espe + " - " + especialidad.descripcionM + "</option>");
                    }                    
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}