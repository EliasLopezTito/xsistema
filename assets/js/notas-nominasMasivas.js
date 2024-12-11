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
    //const semestre = $("#semestre").val();
    //e.preventDefault();
    // var form = $("#frmActa").serializeArray();
    //     form.push({ name: "opcion", value: "listar" });
    // console.log("data", form)
    const periodo = $("#periodo").val();
    const seccion = $("#seccion").val();
    const turno = $("#turno").val();
    const sede = $("#sede").val();
    const especialidad = $("#especialidad").val();
    
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
            url: path + "Notas/nominasMasivas",
            type: "POST",
            dataType: "JSON",
            data: {
                periodo: periodo,
                seccion: seccion,
                turno: turno,
                sede: sede,
                especialidad: especialidad,
                opcion: "listar"
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
            dataSrc: 'Periodo',
            startRender: function (rows, group) {
                return 'Ver detalles totales '+ periodo + ": &nbsp;&nbsp;&nbsp; <button class=\"btn boton-tabla boton-verde\" type=\"button\" onclick=\"tablaDetalle('" + periodo + "','"+ seccion +"','"+ turno +"','"+ sede +"','"+ especialidad +"','');\" title=\"Ver Detalle\"><span class=\"icon-eye\"></span></button>";
            },
            endRender: function (rows, group) {
                var UNOX =
                    rows
                        .data()
                        .pluck('UNO')
                        .reduce(function (a, b) {
                            return parseFloat(a) + parseFloat(b);
                        }, 0);
                var DOSX =
                    rows
                        .data()
                        .pluck('DOS')
                        .reduce(function (a, b) {
                            return parseFloat(a) + parseFloat(b);
                        }, 0);
                var TRESX =
                    rows
                        .data()
                        .pluck('TRES')
                        .reduce(function (a, b) {
                            return parseFloat(a) + parseFloat(b);
                        }, 0);
                var CUATROX =
                    rows
                        .data()
                        .pluck('CUATRO')
                        .reduce(function (a, b) {
                            return parseFloat(a) + parseFloat(b);
                        }, 0);
                var CINCOX =
                    rows
                        .data()
                        .pluck('CINCO')
                        .reduce(function (a, b) {
                            return parseFloat(a) + parseFloat(b);
                        }, 0);
                var SEISX =
                    rows
                        .data()
                        .pluck('SEIS')
                        .reduce(function (a, b) {
                            return parseFloat(a) + parseFloat(b);
                        }, 0);

                // Use the DataTables number formatter
                return (
                    'Total CICLO I: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    DataTable.render.number(',', '.', 0, '').display(UNOX) + 
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    'Total CICLO IV: &nbsp;&nbsp;&nbsp;&nbsp;' +
                    DataTable.render.number(',', '.', 0, '').display(CUATROX) + '<br>' +
                    'Total CICLO II: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    DataTable.render.number(',', '.', 0, '').display(DOSX) +
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    'Total CICLO V: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    DataTable.render.number(',', '.', 0, '').display(CINCOX) + '<br>' + 
                    'Total CICLO III: &nbsp;&nbsp;&nbsp;&nbsp;' +
                    DataTable.render.number(',', '.', 0, '').display(TRESX) + 
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp' +
                    'Total CICLO VI: &nbsp;&nbsp;&nbsp;&nbsp;' +
                    DataTable.render.number(',', '.', 0, '').display(SEISX) + '<br>'
                );
            }
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'text-right',
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
                    return DataTable.render.number(',', '.', 0, '').display(data.UNO) + "&nbsp;&nbsp;&nbsp; <button class=\"btn boton-tabla boton-plomo\" type=\"button\" onclick=\"tablaDetalle('" + data.Periodo + "','"+ seccion +"','"+ turno +"','"+ sede +"','"+ data.cod_espe +"','01');\" title=\"Ver Detalle\"><span class=\"icon-eye\"></span></button>";
;
                }
            },
            {
                data: null,
                render: function (data) {
                    return DataTable.render.number(',', '.', 0, '').display(data.DOS) + "&nbsp;&nbsp;&nbsp; <button class=\"btn boton-tabla boton-plomo\" type=\"button\" onclick=\"tablaDetalle('" + data.Periodo + "','"+ seccion +"','"+ turno +"','"+ sede +"','"+ data.cod_espe +"','02');\" title=\"Ver Detalle\"><span class=\"icon-eye\"></span></button>";
                }
            },
            {
                data: null,
                render: function (data) {
                    return DataTable.render.number(',', '.', 0, '').display(data.TRES) + "&nbsp;&nbsp;&nbsp; <button class=\"btn boton-tabla boton-plomo\" type=\"button\" onclick=\"tablaDetalle('" + data.Periodo + "','"+ seccion +"','"+ turno +"','"+ sede +"','"+ data.cod_espe +"','03');\" title=\"Ver Detalle\"><span class=\"icon-eye\"></span></button>";
                }
            },
            {
                data: null,
                render: function (data) {
                    return DataTable.render.number(',', '.', 0, '').display(data.CUATRO) + "&nbsp;&nbsp;&nbsp; <button class=\"btn boton-tabla boton-plomo\" type=\"button\" onclick=\"tablaDetalle('" + data.Periodo + "','"+ seccion +"','"+ turno +"','"+ sede +"','"+ data.cod_espe +"','04');\" title=\"Ver Detalle\"><span class=\"icon-eye\"></span></button>";
                }
            },
            {
                data: null,
                render: function (data) {
                    return DataTable.render.number(',', '.', 0, '').display(data.CINCO) + "&nbsp;&nbsp;&nbsp; <button class=\"btn boton-tabla boton-plomo\" type=\"button\" onclick=\"tablaDetalle('" + data.Periodo + "','"+ seccion +"','"+ turno +"','"+ sede +"','"+ data.cod_espe +"','05');\" title=\"Ver Detalle\"><span class=\"icon-eye\"></span></button>";
                }
            },
            {
                data: null,
                render: function (data) {
                    return DataTable.render.number(',', '.', 0, '').display(data.SEIS) + "&nbsp;&nbsp;&nbsp; <button class=\"btn boton-tabla boton-plomo\" type=\"button\" onclick=\"tablaDetalle('" + data.Periodo + "','"+ seccion +"','"+ turno +"','"+ sede +"','"+ data.cod_espe +"','06');\" title=\"Ver Detalle\"><span class=\"icon-eye\"></span></button>";
                }
            },
            {
                data: null,
                render: function (data) {
                    return DataTable.render.number(',', '.', 0, '').display(data.Total);
                }
            },
            
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

function tablaDetalle(periodo, cod_seccion, cod_turno, cod_sede, cod_espe, cod_ciclo){
    //const semestre = $("#semestre").val();


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
            url: path + "Notas/nominasMasivas",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "listar_detalle",
                periodo: periodo,
                cod_seccion: cod_seccion,
                cod_turno: cod_turno,
                cod_sede: cod_sede,
                cod_espe: cod_espe,
                cod_ciclo: cod_ciclo
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
                    return data.CodAlumno;
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
                    return data.edad;
                }
            }
            // {
            //     data: null,
            //     render: function (data) {
            //         return `<button class="btn boton-tabla boton-azul" type="button" onclick="descargarHistorico('${data.cod_alumno}', '${data.cod_espe.trim()}', '${data.UltSemestre}')"><span class="icon-printer"></span></button>`;
            //     }
            // }
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
