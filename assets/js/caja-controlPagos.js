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
    $("#usuarios").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "caja/pagoPorAlumno",
                dataType: "json",
                type: 'post',
                data: {
                    alumno : request.term,
                    opcion : 'buscarAlumnos'
                },
                success: function(data){

                    $("#usuarios").next('i').removeClass('glyphicon-ok');
                    $("#usuarios").next('i').addClass('glyphicon-remove');
                    $("#usuarios").parent().removeClass('has-success');
                    $("#usuarios").parent().addClass('has-error');
                    
                    let result = ( data.alumnos === "vacio") ? [{ vacio: true }] : data.alumnos;
                                        
                    response(result);

                }
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{

                $("#usuarios").val(ui.item.cod_alumno.trim()+" - "+ui.item.apellidos_nombres.trim());
                $("#usuarios").next('i').removeClass('glyphicon-remove');
                $("#usuarios").next('i').addClass('glyphicon-ok');
                $("#usuarios").parent().removeClass('has-error');
                $("#usuarios").parent().addClass('has-success');

            }
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {

        if (item.hasOwnProperty('vacio')) {
            return $( "<li>" )
            .append( "<div>No se encontraron resultados</div>" )
            .appendTo( ul );
        }

        return $( "<li>" )
            .append( "<div><b>Código: </b>" + item.cod_alumno + " &nbsp&nbsp-&nbsp <b>Alumno: </b> " +item.apellidos_nombres + "</div>" )
            .appendTo( ul );
    };
    $("#usuarios").focus();
    $("#tablaPago").DataTable({
        data: {},
        language: language
    })
})

$("#btnBuscar").click(function () {

    $('#tablaPago tbody').empty();
    $('#tablaPago').dataTable().fnDestroy();

    $("#tablaPago").DataTable({
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
            url: path + "caja/controlPagos",
            dataType: "JSON",
            method: "POST",
            data: {
                opcion: "buscar",
                local: $("#id_banco").val(),
                alumno: $("#usuarios").val().split(' ')[0],
                talon: $("#talon").val(),
                recibo: $("#recibo").val()
            },
            beforeSend: function () {
                $('.text-loader').text('CONSULTANDO POR FAVOR ESPERE...');
                $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
                $("body").css({ "padding": 0 });                  
            },
            complete: function () {
                $("#modalLoader").modal("hide");
                $("body").css({ "padding": 0 });
            }
        },
        columns: [           
            {   
                data: "Doc",
                render : function(data){
                    return data ? data : '';
                }, 
                className: "text-center" },
            {
                data: "Talon",
                render: function (data) {
                    return data ? data : '';
                },
                className: "text-center"
            },
            {
                data: "Recibo",
                render: function (data) {
                    return data ? data : '';
                },
                className: "text-center"
            },
            {
                data: "Fecha",
                render: function (data) {
                    return data ? data.trim().substr(0, 10) : '';
                },
                className: "text-center"
            },
            {
                data: "Monto",
                render: function (data) {
                    return data ? data : '';
                },
                className: "text-center"
            },
            {
                data: "Especialidad",
                render: function (data) {
                    return data ? data : '';
                },
                className: "text-center"
            },
            {
                data: "Ciclo",
                render: function (data) {
                    return data ? data : '';
                },
                className: "text-center"
            },  
            {
                data: "Año",
                render: function (data) {
                    return data ? data : '';
                },
                className: "text-center"
            },    
            {
                data: "Mes",
                render: function (data) {
                    return data ? data : '';
                },
                className: "text-center"
            },
            {
                data: "Descripcion",
                render: function (data) {
                    return data ? data : '';
                },
                className: "text-center"
            },
            {
                data: null,
                render: function(data, type, row) { 
                    return row["Doc. Ref"] ? row["Doc. Ref"] : '';
                },
                className: "text-center"
            },
            {
                data: "Est",
                render: function (data) {
                    return data ? data : '';
                },
                className: "text-center"
            },
            {
                data: null,
                render: function(data, type, row) {
                    return row['Env.Sunat'] ? row['Env.Sunat'] : '';
                },
                className: "text-center"
            },
            {
                data: null,
                render: function(data){ 
                    tipo_doc = data.Talon.trim().split('')[0]
                    
                    var tipoConsultar;
                    if(data.Cod_local == "10"){ 
                        if(tipo_doc == "B"){
                            tipoConsultar = "imprimirBoleta10"
                        }
                        if(tipo_doc == "F"){
                            tipoConsultar = "imprimirFactura10"
                        }
                    }else{
                        if(tipo_doc == "B"){
                            tipoConsultar = "imprimirBoleta23"
                        }
                        if(tipo_doc == "F"){
                            tipoConsultar = "imprimirFactura23"
                        }
                    }                
                    tipoConsultara = "imprimirFactura10"
                    return   "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"descargarPDF('"+data.Talon.trim()+"','"+data.Recibo+"','"+tipoConsultara+"');\" title=\"opcion\"><span class=\"icon-file-pdf\"></span></button>";                                     
                },
                createdCell: function (td) {
                    $(td).css('text-align', 'center');
                }
            },
        ]

    });
});


$("#cerraModal").click(function () {
    $('#modalVistaPreviaPdf .modal-body #divIframePdf').html("");
    $("#modalVistaPreviaPdf").modal("hide");
    $("body").css({ "padding": 0 });
})

function descargarPDF(talon, recibo, tipo){

    console.log("ENTROA");
    $.ajax({
        url: path + "Caja/controlPagos",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: tipo,
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