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

$(document).ready(function(){
    
    cargarInstituciones();

    $("#btnExcel").click(function (){
        $("#frmReporteMoodle").attr("target","_blank");
        $("#frmReporteMoodle").submit();
    });
    $("#tablaModle_").DataTable({data:[],language:language});
});

$("#institucion").change(function(){
  	cargarTipoEspecialidades();
});

$("#tipoEspecialidad").change(function(){
  	cargarEspecialidades();
});


function cargarInstituciones() {
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
                        selected = institucion.cod_local == '10' ? 'selected' : '';
                        cboInstitucion.append("<option "+selected+" value=\"" + institucion.cod_local + "\" >" + institucion.cod_local + " - " + institucion.descripcionM + "</option>");
                    }

                    cargarTipoEspecialidades() ;
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}


function cargarTipoEspecialidades() {
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
                    cargarEspecialidades();
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarEspecialidades() {
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

$("#btn_buscar").click(function(){

    const anio = $("#anioProg").val();
    const mes = $("#mesProg").val();
    const institucion = $("#institucion").val();
    const tipoEspecialidad = $("#tipoEspecialidad").val();
    const especialidad = $("#especialidad").val();
    const turno2 = $("#turno2").val();
    $("#tablaModle_").empty();
    $('#tablaModle_').dataTable().fnDestroy();
    $("#tablaModle_").DataTable({
        ordering:  false,       
        ajax : {
            url: path + "programacion/reporteMoodlePresencial",
            type: "POST",
            dataType: "JSON",
            data: {
                anio : anio,
                mes : mes,
                institucion : institucion,
                tipoEspecialidad : tipoEspecialidad,
                especialidad : especialidad,
                turno2 : turno2,
                opcion: "buscar"
            },
            beforeSend : function(){
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete : function(){
                $("#modalLoader").modal("hide");
            },
            dataSrc: function(response){
                console.log(response)
                //return []
                if(response.respuesta === "error"){
                    return {}    
                }else{
                    return response.datax;
                }            
            },
        },       
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [10,18,20,50,75,100], 
            [10,18,20,50,75,100],
        ],
        columns: [
            {
                data: null,
                render: function (data) {
                    return data.cod_alumno;
                }
            },
            {data: null,
                render: function (data) {
                    return data.apellidos;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.nombres;
                } 
            },
            {data: null,
                render: function(data){
                    return data.TipoDocumento;
                }
            },
            {data: null,
                render: function(data){
                    return data.NumDocumento;
                }
            },
            {data: null,
                render: function (data) {
                    return data.IdGrupo;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.telefono;
                } 
            },     
            {data: null,
                render: function(data){
                    return data.email;
                }
            },
            {data: null,
                render: function (data) {
                    return data.aula1;
                } 
            },     
            {data: null,
                render: function (data) {
                    return data.aula2;
                } 
            },     
            {data: null,
                render: function(data){
                    return data.Sede;
                }
            },
            {data: null,
                render: function (data) {
                    return data.Turno;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.cod_turno;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.primera_hora.trim();
                } 
            },    
            {data: null,
                render: function (data) {
                    return data.segunda_hora.trim();
                } 
            },  
            {data: null,
                render: function (data) {
                    return data.Curso;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.coddocente;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Docente;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.cod_interno;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Transaccion;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.mesProgramacion;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.dnidocente;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Corredocente;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.celulardocente;
                } 
            },
        ],
        language: language
    });

})