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

    cargarInstituciones(true,true);    
    $("#tablaListado_").DataTable({ data: [], language: language, ordering: false, });

});

$("#institucion").change(function(){
    cargarTipoEspecialidades(true,true);
})

$("#tipoEspecialidad").change(function () {
    cargarEspecialidades(false,true);

})

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
                        var selected = tipoEspecialidad.tipo_espe === "11" ? "selected" : "";
                        cboTipoEspecialidad.append("<option " + selected + " value=\"" + tipoEspecialidad.tipo_espe + "\" >" + tipoEspecialidad.tipo_espe + " - " + tipoEspecialidad.descripcion + "</option>");
                    }
                    cargarEspecialidades();
                    //$('#tipoEspecialidad').val(11);
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
    const local = $("#institucion").val();
    const tipo = $("#tipoEspecialidad").val();
    const especialidad = $("#especialidad").val();

    $("#tablaListado_").empty();
    $('#tablaListado_').dataTable().fnDestroy();
    $("#tablaListado_").DataTable({
        ordering:  false,  
        dom: 'lBfrtip',
        buttons: [
            {
                "extend": 'excel',
                "text": 'Exportar Excel',
                "className": 'btn_excel_datatable',
                'filename': 'Reporte'
            }
        ],     
        ajax : {
            url: path + "programacion/idiomasCargaHorariaPresencial",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "cargarListado",
                local: local,
                tipo: tipo,
                especialidad: especialidad,
                anio : anio,
                mes : mes
            },
            beforeSend : function(){
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete : function(){
                $("#modalLoader").modal("hide");
            },
            dataSrc: function(response){      
                console.log(response.data);          
                if(response.respuesta === "error"){
                    return {}    
                }else{
                    return response.data;
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
            [10,18,20,50,75,100]
        ],
        columns: [
            {data: null,
                render: function (data,type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {data: null,
                render: function (data) {
                    return data.cod_prof;
                }
            },
            {data: null,
                render: function (data) {
                    return data.Docente;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.Especialidad;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.cod_aula.trim();
                } 
            },
            {
                data: null,
                render: function (data) {
                    return data.Sede.trim();
                }
            },  
            {
                data: null,
                render: function (data) {
                    return data.cod_turno.trim();
                }
            }, 
            {
                data: null,
                render: function (data) {
                    return data.cod_ciclo.trim();
                }
            },               
            {data: null,
                render: function (data) {
                    return data.NroHoras;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.condicion;
                } 
            },     
            {data: null,
                render: function(data){
                    return data.correo;
                }
            },
            {data: null,
                render: function (data) {
                    return data.telefonos;
                } 
            },     
            {data: null,
                render: function(data){
                    return data.Curso.trim();
                }
            },            
            {data: null,
                render: function (data) {
                    return data.Profesion;
                } 
            }
        ],
        language: language
    });

})

$("#btnPDF").click(function () {

    if ($("#anioProg").val() !== null && $("#mesProg").val() !== null && $("#anioProg").val() !== "" && $("#mesProg").val() !== "") {

        const anio = $("#anioProg").val();
        const mes = $("#mesProg").val();
        const local = $("#institucion").val();
        const tipo = $("#tipoEspecialidad").val();
        const especialidad = $("#especialidad").val();
        $.ajax({
            url: path + "Programacion/idiomasCargaHorariaPresencial",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "descargarPdf",
                anio: anio,
                mes: mes,
                local: local,
                tipo: tipo,
                especialidad: especialidad
            },
            beforeSend: function () {
                $("#modalLoaderTitle").html("Imprimiendo Programación de Docentes...");
                $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            },
            complete: function(){
                $("#modalLoader").modal("hide");
            },
            success: function (datos) {
                    
                console.log(datos);
                
                if (datos.respuesta === "success") {

                    var a = $("<a>");
                    a.attr("href", datos.file);
                    $("body").append(a);
                    a.attr("download", "file.pdf");
                    a[0].click();
                    a.remove();

                } else {

                    var errores = "";                    
                    for (i = 0; i < datos.errores.length; i++) {
                        errores += datos.errores[i] + "<br>";
                    }
                    mostrarMensaje("error", "ERROR", errores);

                }

            },
            error: function () {
                $("#modalLoader").modal("hide");
                mostrarMensaje("error", "ERROR", "Se produjo un error durante la impresión de la Programación de Docentes");
            }
        });
    } else {
        mostrarMensaje("error", "ERROR", "Seleccione el año y mes de programacion");
    }

});

$("#btnExcel").click(function () {
    $("#frmReporteDocentesProgramados").attr("target", "_blank");
    $("#frmReporteDocentesProgramados").submit();
});