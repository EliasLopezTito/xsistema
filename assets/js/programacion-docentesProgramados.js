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

    // $("#docente").autocomplete({
    //     source: function(request, response){
    //         $.ajax({
    //             url: path + "Notas/verRegistro",
    //             dataType: "json",
    //             data: {
    //                 term: request.term,
    //                 opcion: 'buscarDocente'
    //             },
    //             success: function(data){
    //                 $("#docente").removeAttr("data-code");
    //                 $("#docente").next('i').removeClass('glyphicon-ok');
    //                 $("#docente").next('i').addClass('glyphicon-remove');
    //                 $("#docente").parent().removeClass('has-success');
    //                 $("#docente").parent().addClass('has-error');
    //                 let tbody = $("#tablaCursosProgramados tbody");
    //                 tbody.find('tr').remove();
    //                 $("#panel_notas").css("display", "none");     
    //                 tbody = $("#tablaNotasProgramacion tbody");
    //                 tbody.find('tr').remove();

    //                 let result = (!data.docentes) ? [{ vacio: true }] : data.docentes;

    //                 response(result);
    //             }
    //         });
    //     },
    //     minLength: 3,
    //     select: function(event, ui){
    //         if (ui.item.vacio) {
    //             event.preventDefault();
    //         } else{
    //             $("#docente").val(ui.item.cod_emp +" - "+ ui.item.nombre);
    //             $("#docente").attr('data-code', ui.item.cod_emp);
    //             $("#docente").next('i').removeClass('glyphicon-remove');
    //             $("#docente").next('i').addClass('glyphicon-ok');
    //             $("#docente").parent().removeClass('has-error');
    //             $("#docente").parent().addClass('has-success');
    //         }
    //         return false;
    //     }
    // })
    // .autocomplete( "instance" )._renderItem = function( ul, item ) {
    //     if (item.vacio) {
    //         return $( "<li>" )
    //         .append( "<div>No se encontraron resultados</div>" )
    //         .appendTo( ul );
    //     }

    //     return $( "<li>" )
    //         .append( "<div>" + item.cod_emp + " - " +item.nombre + "</div>" )
    //         .appendTo( ul );
    // };

    $("#docente").focus();

    //$("#tablaListado").DataTable({ data: [], language: language, ordering: false, });
    // $('#tablaListado tbody').on('click', 'tr', function() {
    //     $('#tablaListado tbody tr').removeClass('success');
    //     $(this).addClass('success');
    //     let data = tablaCabezaTitulacion.row(this).data();
    //     tablaDetalle(data.Año, data.Cod_espe)
    //     console.log("daa", data.Cod_espe);
        
    // });

    $('#tablaListado tbody').on('click', 'td', function() {
        $(this).css('background-color', '#93c5fd');
        $('#tablaListado tbody td').not(this).css('background-color', ''); // Esto quita el color de otras celdas
        var cell = tablaCabezaTitulacion.cell(this); // Obtenemos la celda clicada
        var columnIndex = cell.index().column; // Índice de la columna
        mes =  (columnIndex - 1).toString().padStart(2,"0");
        var rowIndex = cell.index().row; // Índice de la fila
        var cellData = cell.data(); // Dato de la celda

        tablaDetalle(cellData.Año, mes)
        
        console.log("mes", mes);
        console.log("ROW INDEX", rowIndex);
        console.log("COLUMN INDEX", columnIndex);
        console.log("cellData INDEX", cellData);
        // // Verificar si el clic fue en la columna específica
        // if ($(this).find('td').eq(columnIndex).is(':hover')) {
        //     var cellData = tablaCabezaTitulacion.cell(this, rowIndex).index(); // Obtener el dato de la celda
        //     console.log('Haz hecho clic en: ' + JSON.stringify(cellData));
        // }
    });

});


$("#btnConsultar").click(function () {
    console.log("Ejecutando función")

    $("#modalLoader").modal(),
        $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...'),

        setTimeout(() => {
            $('#tablaListado').hide();
            $('#tablaListado_2').hide();
            $('#tablaListado_2').dataTable().fnDestroy();
            $('#tablaListado_2').dataTable().fnDraw();
            $('#tablaListado_2').dataTable().fnClearTable();
            ejecutarFuncionEgresados()
                .then(() => setTimeout(() => {
                    $('#tablaListado').show();
                    //$('#tablaListado_2').show();
                    //$("#modalLoader").modal("hide")
                }, 1000))
                .catch(() => setTimeout(() => {
                    $("#modalLoader").modal("hide")
                    Notiflix.Notify.Failure('Actualize la pagina por favor...');
                }, 1000))
        }, 500);


})

function ejecutarFuncionEgresados(){
    return new Promise((resolve, reject) => {
        // Código que toma mucho tiempo
        //tablaResumen();
        //resolve(tablaResumen(), tablaDetalle() )
        resolve(tablaResumen())
    })
}

function tablaResumen(){
    const anio = $("#anio").val();
    const docente = $("#docente").val()
    
    //$('#tablaListado').empty();
    $('#tablaListado').dataTable().fnDestroy();
    tablaCabezaTitulacion = $("#tablaListado").DataTable({
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
            url: path + "programacion/docentesProgramados",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "listar",
                anio: anio,
                docente: docente,
            },
            beforeSend: function () {
                // $("#modalLoader").modal();
                // $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                console.log("data", response.data);
                if (response.respuesta === "error") {
                    return {}
                } else {
                    return response.data;
                }
            },
        },
        order: [[2, 'asc']],
        columnDefs: [
            {   
                // targets: 0,
                // visible: false,
                targets: '_all',
                className: 'celda-centrada',
                orderable: false,
                
            }
        ],
        lengthMenu: [
            [50, 75, 100],
            [50, 75, 100]
        ],
        columns: [
            {
                data: null,
                render: function (data,type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
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
                    return data.M1;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.M2;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.M3;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.M4;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.M5;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.M6;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.M7;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.M8;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.M9;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.M10;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.M11;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.M12;
                }
            }
            // {
            //     data: null,
            //     render: function (data) {
            //         return "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"tablaDetalle('"+data.UltSemestre+"');\" title=\"Ver Detalle\"><span class=\"icon-eye\"></span></button>";
            //     }
            // }
        ],
        language: language
    });
    // setTimeout(() => {
    //     tablaCabezaTitulacion.rows().every(function() {
    //         var data = this.data();
    //         $(this.node()).find('td').eq(3).addClass('color-morado');
    //     });

    // }, 1000);
    
     
}

function tablaDetalle(anio, mes){
    //const semestre = $("#semestre").val();
    const docente = $("#docente").val()

    //$('#tablaListado_2').empty();
    $('#tablaListado_2').show();
    $('#tablaListado_2').dataTable().fnDestroy();
    $("#tablaListado_2").DataTable({
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
            url: path + "programacion/docentesProgramados",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "listar_detalle",
                anio: anio,
                mes: mes,
                docente: docente
            },
            beforeSend: function () {
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                if (response.respuesta === "error") {
                    return {}
                } else {
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
                    return data.CodDocente;
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
                    return data.Correo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.dni;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Inicio;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Termino;
                }
            }
        ],
        language: language
    });
}

function descargarHistorico(codAlumno, codEspe, semestre){
    $.ajax({
        url: path + "titulacion/titulacionSemestre",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "historicoPDF",
            codAlumno: codAlumno,
            codEspe: codEspe,
            semestre: semestre
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
