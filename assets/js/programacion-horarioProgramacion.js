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

const meses = {
    '01': 'ENERO',
    '02': 'FEBRERO',
    '03': 'MARZO',
    '04': 'ABRIL',
    '05': 'MAYO',
    '06': 'JUNIO',
    '07': 'JULIO',
    '08': 'AGOSTO',
    '09': 'SEPTIEMBRE',
    '10': 'OCTUBRE',
    '11': 'NOVIEMBRE',
    '12': 'DICIEMBRE'
}

$(document).ready(function () {

    $("#tablaListado").DataTable({
        data: [], language: language, dom: 'lBfrtip',
        buttons: [
            { "extend": 'excel', "text": 'Exportar Excel', "className": 'btn_excel_datatable' }
        ] 
    });

    cargarInstituciones_(true);
    cargarSedes(true);

    $("#institucion").change(function () {
        cargarTipoEspecialidades_(true);
    });

    $("#tipoEspecialidad").change(function () {
        cargarEspecialidades_(true);
    });        

 });
 
$("#formListado").submit(function (e) {
   
    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:'opcion',value:'cargarListado'});

    $('#tablaListado').empty();
    $('#tablaListado').dataTable().fnDestroy();

    $.ajax({
        url: path + "programacion/horarioProgramacion",
        type: "POST",
        dataType: "JSON",
        data: $.param(data),
        beforeSend: function () {  
            $("#tablaListado tbody").html("");    
            $("#btnCargarListado").html("CARGANDO INFORMACIÓN...").prop("disabled",true);   
        },
        complete: function(){
            $("#btnCargarListado").html('<span style="padding-right: 5px;"></span> Consultar').prop("disabled",false);      
        },
        success: function (response) {            
            if(response.respuesta === "success"){
                                
                $("#tablaListado").DataTable({
                    ordering: false,
                    dom: 'lBfrtip',
                    buttons: [
                        { "extend": 'excel', "text": 'Exportar Excel', "className": 'btn_excel_datatable' }
                    ],
                    data: response.data,
                    columnDefs: [
                        {
                            targets: '_all',
                            className: 'celda-centrada',
                            orderable: false
                        }
                    ],
                    lengthMenu: [
                        [10 ,25, 50, 75 , 100],
                        [10 ,25, 50, 75 , 100]
                    ],
                    columns: [
                        {
                            data: null,
                            render: function (data) {
                                return data.Aula;
                            }
                        },
                        {
                            data: null,
                            render: function (data) {
                                return data.Aforo;
                            }
                        },
                        {
                            data: null,
                            render: function (data) {
                                return data.ciclo;
                            }
                        },                        
                        {
                            data: null,
                            render: function (data, type, row, meta) {
                                return data.Especialidad;
                            }
                        },                                                                                                
                        {
                            data: null,
                            render: function (data) {
                                return data.Codigo;
                            }
                        },
                        {
                            data: null,
                            render: function (data) {
                                return data.mesIngreso;
                            }
                        },
                        {
                            data: null,
                            render: function (data) {
                                return data.NumAlumnos;
                            }
                        },
                        {
                            data: null,
                            render: function (data) {
                                return data.Curso;
                            }
                        },
                        {
                            data: null,
                            render: function (data) {
                                return data.Horas;
                            }
                        },
                        {
                            data: null,
                            render: function (data) {
                                return data.Docente;
                            }
                        },
                        {
                            data: null,
                            render: function (data) {
                                return data.Turno;
                            }
                        },
                        {
                            data: null,
                            render: function (data) {
                                return data.Sede;
                            }
                        },
                        {
                            data: null,
                            render: function (data) {
                                 return data.Profesion;
                            }
                        },
                        {
                            data: null,
                            render: function (data) {
                                 return data.Telefonos;
                            }
                        }
                    ],
                    language: language
                });

            }else{
                
            }

        }
    });

});




function cargarInstituciones_(enlazado) {
    $.ajax({
        url: path + "institucion/getInstituciones",
        type: "POST",
        data: {
        },
        success: function (data) {
            //console.log(data);
            var cboInstitucion = $("#institucion");
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
                        cargarTipoEspecialidades_(enlazado);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarTipoEspecialidades_(enlazado) {
    var institucion = $("#institucion").val();
    $.ajax({
        url: path + "tipoEspecialidad/getTipoEspecialidades",
        type: "POST",
        data: {
            institucion: institucion
        },
        success: function (data) {
            //console.log(data);
            var cboTipoEspecialidad = $("#tipoEspecialidad");
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
                        cargarEspecialidades_(enlazado);
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarEspecialidades_(enlazado) {
    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();

    $.ajax({
        url: path + "especialidad/getEspecialidades",
        type: "POST",
        data: {
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad
        },
        success: function (data) {
            //console.log(data);
            var cboEspecialidad = $("#especialidad");
            cboEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.especialidades != "vacio") {
                    var especialidades = datos.especialidades;
                    cboEspecialidad.append("<option value='0'>TODOS</option>");
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