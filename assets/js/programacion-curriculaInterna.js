$(document).ready(function(){
    
    cargarInstituciones(true);  
    cargarTipoEspecialidades(true);      
    cargarInstituciones2(true);
	
});

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

$("#institucion_").change(function () {
    $("#horarioM").html("");
    $("#primeraHoraM").val("");
    $("#segundaHoraM").val("");
    cargarTipoEspecialidades2(true);
})

$("#tipoEspecialidad_").change(function () {
    $("#horarioM").html("");
    $("#primeraHoraM").val("");
    $("#segundaHoraM").val("");
    cargarEspecialidades2();
})

$("#institucion").change(function(){
    cargarTipoEspecialidades(true);
})

$("#tipoEspecialidad").change(function () {
    cargarEspecialidades();
})

//Para filtro de listado
$("#especialidad").change(function () {

    //$("#contenedor_listado").css("display","block");
    //cargarHorariosPorAula();

});

//Para filtro de listado
$("#btnBuscar").click(function () {

    $("#contenedor_listado").css("display", "block");
    cargarListaCurricular();

});

$("#anioProg").change(function(){
    //cargarHorariosPorAula();
});

$("#mesProg").change(function(){
    //cargarHorariosPorAula();
});

//Para crear las configuraciones de horarios x aula
$("#btnNuevo").click(function ()
{   
    cargarInstituciones2(true);
    $("#tituloModal").html("NUEVA CURRICULA INTERNA");
    $("#btnGrabarM").attr("title","Crear");
    $("#btnGrabarM").html("<span class=\"icon-floppy-disk\"></span> Crear");

    $("#modalTurnoVirtual").modal({backdrop: 'static', keyboard: false});
});

$("#especialidad_").change(function () {

    cargarHorariosByCarrera();

});



$("#btnGrabarM").click(function ()
{   
    var anioProg = $("#anioProg").val();
    var anioProgNuevo = $("#anioProgM").val();
    var local = $("#institucion").val();
    var tipo_espe = $("#tipoEspecialidad").val();
    var ciclo = $("#ciclo").val();
    var programaAcademico = $("#especialidad").val();

    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de crear nueva Curricula?',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "programacion/CurriculaInterna",
                type: "POST",
                data: {
                    opcion: "create",
                    anioProg: anioProg,
                    anioProgNuevo: anioProgNuevo,
                    local: local,
                    tipo_espe: tipo_espe,
                    ciclo: ciclo,
                    programaAcademico: programaAcademico
                },
                success: function (data) {
                    var datos = JSON.parse(data);
                    if (datos.respuesta == "success") {
                        console.log("datos", datos)
                        //cargarInstituciones2(true);

                        $("#modalTurnoVirtual").modal("hide");

                        Notiflix.Notify.Success('LA OPERACIÓN SE REALIZO CON ÉXITO');
                    
                    } else if (datos.respuesta == "ya_existe"){
                        Notiflix.Notify.Warning('LA CURRICULA CON EL AÑO ' + anioProgNuevo +' YA EXISTE');          
                    } else {
                        var errores = "";
                        for (i = 0; i < datos.errores.length; i++) {
                            errores += datos.errores[i] + "<br>";
                        }
                        mostrarMensaje("error", "ERROR", errores);
                    }
                }
            });
        },
        function cancelCb() {

        },
        {
        },
    );
    
});

$("#mensaje-boton-aceptar").click(function ()
{

    $("#modalMensaje").modal("hide");
    var codAula = $("#codAulaD").val();
    var anioProg = $("#anioProgD").val();
    var mesProg = $("#mesProgD").val();
    var opcion = $("#opcionD").val();
        
    if(codAula != null && anioProg != null && mesProg != null && codAula != "" && anioProg != "" && mesProg != "")
    {
        var tbody = $("#tablaCambioTurnoVirtual tbody");
        tbody.find('tr').remove();
        $.ajax({
            url: path + "programacion/confHorarioPorAula",
            type: "POST",
            data: {
                opcion: opcion,
                codAula: codAula,
                anioProg: anioProg,
                mesProg: mesProg
            },
            success: function(data){

                var datos = JSON.parse(data);

                if(datos.respuesta=="success")
                {
                    cargarListaCurricular();
                }else{
                    var errores = "";
                    for(i=0; i<datos.errores.length; i++){
                        errores += datos.errores[i] + "<br>";
                    }
                    mostrarMensaje("error","ERROR",errores);
                }
            }
        });
    }
});

function cargarListaCurricular()
{
    var anioProg = $("#anioProg").val();
    var local = $("#institucion").val();
    var tipo_espe = $("#tipoEspecialidad").val();
    var ciclo = $("#ciclo").val();
    var programaAcademico = $("#especialidad").val();

    $('#tablaCurriculaInterna').dataTable().fnDestroy();
    $("#tablaCurriculaInterna").DataTable({
        ordering: false,
        dom: 'lBfrtip',
        buttons: [
            {
                "extend": 'excel',
                "text": 'Exportar Excel',
                "className": 'btn_excel_datatable',
                'filename': 'Reporte'
            }
        ],
        ajax: {
            url: path + "programacion/CurriculaInterna",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "select",
                anioProg: anioProg,
                local: local,
                tipo_espe: tipo_espe,
                ciclo: ciclo,
                programaAcademico: programaAcademico

            },
            beforeSend: function () {
                // $("#modalLoader").modal();
                // $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                // $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                console.log(response.datax);
                if (response.respuesta === "error") {
                    $("#btnNuevo").hide();
                    return {}
                } else {                   
                    $("#btnNuevo").show();
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
            [10, 18, 20, 50, 75, 100],
            [10, 18, 20, 50, 75, 100]
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.orden;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.CursoInterno;
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
                    return data.Curso;
                }
            }
            // {
            //     data: null,
            //     render: function (data) {
            //         return data.DOS;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {
            //         return data.TRES;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {
            //         return data.CUATRO;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {
            //         return data.CINCO;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {
            //         return data.SEIS;
            //     }
            // },
            // {
            //     data: null,
            //     render: function (data) {
            //         return data.Total;
            //     }
            // }
        ],
        language: language
    });
    

    if(anioProg != null && ciclo != null && programaAcademico != null)
    {
        var tbody = $("#tablaCurriculaInterna tbody");
        tbody.find('tr').remove();

        
    }else
    {
        Notiflix.Report.Failure('Error',"Debe seleccionar un programa académico, ciclo y año.","Cerrar");
    }
}



//============================

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