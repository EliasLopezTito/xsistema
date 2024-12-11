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

    //$("#tablaListado").DataTable({ data: [], language: language, ordering: false, });

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
                }, 4000))
                .catch(() => setTimeout(() => {
                    $("#modalLoader").modal("hide")
                    Notiflix.Notify.Failure('Actualize la pagina por favor...');
                }, 4000))
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
    const semestre = $("#semestre").val();
    
    //$('#tablaListado').empty();
    $('#tablaListado').dataTable().fnDestroy();
    $("#tablaListado").DataTable({
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
            url: path + "Notas/egresadosTotales",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "listar",
                semestre: semestre
            },
            beforeSend: function () {
                // $("#modalLoader").modal();
                // $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                console.log(response.data);
                if (response.respuesta === "error") {
                    return {}
                } else {
                    return response.data;
                }
            },
        },
        order: [[2, 'asc']],
        rowGroup: {
            dataSrc: 'UltSemestre',
            startRender: function (rows, group) {
                return 'Semestre: ' + group + "&nbsp;&nbsp;&nbsp; <button class=\"btn boton-tabla boton-verde\" type=\"button\" onclick=\"tablaDetalle('" + group + "');\" title=\"Ver Detalle\"><span class=\"icon-eye\"></span></button>";
            },
            endRender: function (rows, group) {
                var egre =
                    rows
                        .data()
                        .pluck('Egresado')
                        .reduce(function (a, b) {
                            return parseFloat(a) + parseFloat(b);
                        }, 0);
                var no_egre =
                    rows
                        .data()
                        .pluck('NoEgresado')
                        .reduce(function (a, b) {
                            return parseFloat(a) + parseFloat(b);
                        }, 0);
                var total =
                    rows
                        .data()
                        .pluck('Totales')
                        .reduce(function (a, b) {
                            return parseFloat(a) + parseFloat(b);
                        }, 0);

                // Use the DataTables number formatter
                return (
                    'Total Egresados: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    DataTable.render.number(',', '.', 0, '').display(egre) + '<br>' + 
                    'Total No Egresados: ' +
                    DataTable.render.number(',', '.', 0, '').display(no_egre) + '<br>' +
                    'Suma Totales: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    DataTable.render.number(',', '.', 0, '').display(total)
                );
            }
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [50, 75, 100],
            [50, 75, 100]
        ],
        columns: [
            // {
            //     data: null,
            //     render: function (data) {
            //         return data.UltSemestre;
            //     }
            // },
            {
                data: null,
                render: function (data) {
                    return data.Especialidad;
                }
            },
            {
                data: null,
                render: function (data) {
                    return DataTable.render.number(',', '.', 0, '').display(data.Egresado);
                }
            },
            {
                data: null,
                render: function (data) {
                    return DataTable.render.number(',', '.', 0, '').display(data.NoEgresado);
                }
            },
            {
                data: null,
                render: function (data) {
                    return DataTable.render.number(',', '.', 0, '').display(data.Totales);
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
}

function tablaDetalle(semestre){
    //const semestre = $("#semestre").val();
    f = new Date();

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
                'filename': 'Egresado_Total_'+f.getDate() + "-"+ f.getMonth()+ "-" +f.getFullYear()
            }
        ],
        ajax: {
            url: path + "Notas/egresadosTotales",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "listar_detalle",
                semestre: semestre
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
                    return data.cod_alumno;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Alumno;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.TipoDocumento;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NumDocumento;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.sexo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.telefono;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.email;
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
                    return data.EstadoAlum;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.UltSemestre;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Curricula;
                }
            },
            {
                data: null,
                render: function (data) {
                    return `<button class="btn boton-tabla boton-azul" type="button" onclick="descargarHistorico('${data.cod_alumno}', '${data.cod_espe.trim()}', '${data.UltSemestre}')"><span class="icon-printer"></span></button>`;
                }
            }
        ],
        language: language
    });
}

function descargarHistorico(codAlumno, codEspe, semestre){
    $.ajax({
        url: path + "notas/egresadosTotales",
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
