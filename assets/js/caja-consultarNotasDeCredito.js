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

$(document).ready(function () {
    $("#tablaBusqueda").DataTable({
        data: {},
        language: language
    })
})

$("#btnBuscar").click(function () {

    $('#tablaBusqueda tbody').empty();
    $('#tablaBusqueda').dataTable().fnDestroy();

    $("#tablaBusqueda").DataTable({
        language: language,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
            
        ],
        ordering: true,
        responsive: true,
        lengthMenu: [[15, 20, 50, 100 - 1], [15, 20, 50, 100, "Todos"]],
        iDisplayLength: 15,
        ajax: {
            url: path + "caja/consultarNotasDeCredito",
            dataType: "JSON",
            method: "POST",
            data: {
                opcion: "buscar",
                desde: $("#desde").val(),
                hasta: $("#hasta").val()
            },
            beforeSend: function () {
                $('.text-loader').text('CONSULTANDO POR FAVOR ESPERE...');
                $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
                $("body").css({ "padding": 0 });                  
            },
            dataSrc: function (r) {
                if (r.respuesta === "success") {
                    data = r.data
                    dataConEstado = r.dataEstado

                    $('#nroDocumentos').html(data.length);
                    $('#nroDocRendir').html((data.length - dataConEstado.length));

                    resp = 0
                    for (let index = 0; index < data.length; index++) {
                        const cantMonto = data[index]['Monto'];                        
                        resp += cantMonto                     
                    }
                    respEstadoSuma = 0
                    for (let index = 0; index < dataConEstado.length; index++) {
                        const cantMontoEstado = dataConEstado[index]['Monto'];                        
                        respEstadoSuma += cantMontoEstado                     
                    }
                    $('#nroMontoSoles').html('S/. '+resp);
                    $('#nroMontoRendir').html('S/. '+(resp - respEstadoSuma)); 

                    $('#nroDocAnulados').html(dataConEstado.length);
                    $('#nroMontoAnulados').html('S/. '+respEstadoSuma);

                    return r.data;
                } else {
                    return {};
                }
            },
            complete: function () {
                $("#modalLoader").modal("hide");
                $("body").css({ "padding": 0 });
            }
        },
        columns: [           
            {   
                data: null,
                render : function(data){
                    return data.fecha.trim().substring(0,10);
                }, 
                className: "text-center" },
            {
                data: null,
                render: function (data) {
                    return data.Doc.trim();
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.Talon.trim();
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.Recibo;
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.Codigo.trim();
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.Alumno.trim();
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.Monto;
                },
                className: "text-center"
            },  
            {
                data: null,
                render: function (data) {
                    return data.estado.trim() == '' ? '' : 'X';
                },
                className: "text-center"
            },    
            {
                data: null,
                render: function (data) {
                    return data.docref.trim();
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.descripcion.trim();
                },
                className: "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.Cod_local;
                },
                className: "text-center"
            },
            {
                data: null,
                render: function(data){                    
                    
                    return   "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"descargarNtcPDFXNota('"+data.Talon.trim()+"','"+data.Recibo+"');\" title=\"opcion\"><span class=\"icon-file-pdf\"></span></button>";
                                        
                }
            },
        ]

    });
    
})

$("#cerraModal").click(function () {
    $('#modalVistaPreviaPdf .modal-body #divIframePdf').html("");
    $("#modalVistaPreviaPdf").modal("hide");
    $("body").css({ "padding": 0 });
})

function descargarNtcPDF(){

    console.log("ENTROA");
    $.ajax({
        url: path + "Caja/consultarNotasDeCredito",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "imprimirPDF",
            fecha_1: $('#desde').val(),
            fecha_2: $('#hasta').val(),
        },
        beforeSend: function () {
            // $('.text-loader').text('GENERANDO HISTORICO, PORFAVOR ESPERE...');
            // $("#modalLoader").modal();
        },
        complete: function () {
            // $("#modalLoader").modal("hide");
        },
        success: function (response) {

            console.log(response);

            if (response.respuesta === "success") {

                $("#modalVistaPreviaCertificado").modal("show")
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                let pdf = '<iframe src="' + response.historico + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);

            } else {

                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado", "Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }
        },
    })
}

function descargarNtcPDFXNota(talon, recibo){

    console.log("ENTROA");
    $.ajax({
        url: path + "Caja/consultarNotasDeCredito",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "imprimirPDFXNota",
            talon: talon,
            recibo: recibo,
        },
        beforeSend: function () {
            // $('.text-loader').text('GENERANDO HISTORICO, PORFAVOR ESPERE...');
            // $("#modalLoader").modal();
        },
        complete: function () {
            // $("#modalLoader").modal("hide");
        },
        success: function (response) {

            console.log(response);

            if (response.respuesta === "success") {

                $("#modalVistaPreviaCertificado").modal("show")
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                let pdf = '<iframe src="' + response.pdfTalon + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);

            } else {

                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado", "Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }
        },
    })
}