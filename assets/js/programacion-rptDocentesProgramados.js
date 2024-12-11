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
    $("#btnExcel").click(function (){
        $("#frmReporteDocentesProgramados").attr("target","_blank");
        $("#frmReporteDocentesProgramados").submit();
    });
    $("#tablaListado_").DataTable({data:[],language:language});
});

$("#btnPDF").click(function () {
    if ($("#anioProg").val() != null && $("#mesProg").val() != null && $("#anioProg").val() != "" && $("#mesProg").val() != "") {
        var anioProg = $("#anioProg").val();
        var mesProg = $("#mesProg").val();
        
        $.ajax({
            url: path + "Programacion/rptDocentesProgramados",
            type: "POST",
            data: {
                anioProg: anioProg,
                mesProg: mesProg
            },
            beforeSend: function () {
                $("#modalLoaderTitle").html("Imprimiendo Programación de Docentes...");
                $("#modalLoader").modal({backdrop: 'static', keyboard: false});
            },
            success: function (data) {
                //console.log(data);
                var datos = JSON.parse(data);
                $("#modalLoader").modal("hide");
                if (datos.respuesta == "success") {
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
                mostrarMensaje("error", "ERROR", "Se produjo un error durante la impresion de la Programación de Docentes");
            }
        });
    } else {
        mostrarMensaje("error", "ERROR", "Seleccione el año y mes de programacion");
    }
});

$("#btn_buscar").click(function(){

    const anio = $("#anioProg").val();
    const mes = $("#mesProg").val();
    $("#tablaListado_").empty();
    $('#tablaListado_').dataTable().fnDestroy();
    $("#tablaListado_").DataTable({
        ordering:  false,       
        ajax : {
            url: path + "programacion/rptDocentesProgramadosListado",
            type: "POST",
            dataType: "JSON",
            data: {
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
                console.log(response)
                //return []
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
            {
                data: null,
                render: function (data) {
                    return data.codDocente;
                }
            },
            {data: null,
                render: function (data) {
                    return data.profesor;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.programa;
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
                render: function(data){
                    return data.horario;
                }
            },
            {data: null,
                render: function (data) {
                    return data.nro_horas;
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
                    return data.telefono;
                } 
            },     
            {data: null,
                render: function(data){
                    return data.curso1;
                }
            },
            {data: null,
                render: function (data) {
                    return data.curso2;
                } 
            },
            {data: null,
                render: function (data) {
                    return data.profesion;
                } 
            }
        ],
        language: language
    });

})