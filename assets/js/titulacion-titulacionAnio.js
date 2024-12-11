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
    $('#tablaListado tbody').on('click', 'tr', function() {
        $('#tablaListado tbody tr').removeClass('success');
        $(this).addClass('success');
        let data = tablaCabezaTitulacion.row(this).data();
        tablaDetalle(data.Año, data.Cod_espe)
        console.log("daa", data.Cod_espe);
        
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
    const mes = $("#mes").val();
    const cod_espe = $("#carrera").val();
    
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
            url: path + "titulacion/titulacionAnio",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "listar",
                anio: anio,
                mes: mes,
                cod_espe: cod_espe
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
                render: function (data) {
                    return data.Cod_espe;
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
                    return data.Especialidad;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.C1;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.C2;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.C3;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.C4;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.C5;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.C6;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.SEM1;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.C7;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.C8;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.C9;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.C10;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.C11;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.C12;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.SEM2;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Total;
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
    setTimeout(() => {
        tablaCabezaTitulacion.rows().every(function() {
            var data = this.data();
            $(this.node()).find('td').eq(9).addClass('color-morado');
            $(this.node()).find('td').eq(16).addClass('color-morado');
            $(this.node()).find('td').eq(17).addClass('color-amarillo');
        });

    }, 1000);
    
     
}

function tablaDetalle(anio, especialidad){
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
            url: path + "titulacion/titulacionAnio",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "listar_detalle",
                anio: anio,
                especialidad: especialidad
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
                    return data.Cod_Alumno;
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
                    return data.Especialidad;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Fecha; 
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
                    return data.Nro_titulo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.RegAuxiliar;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Nro_resolucion;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FechaDRELM;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FechaRecojo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Usuario;
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
