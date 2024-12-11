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
    //$("#tablaListado_2").DataTable({ data: [], language: language, ordering: false, });

});



$("#btnConsultar").click(function(){
    console.log("Ejecutando función")

    $("#modalLoader").modal(),
    $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...'),

    setTimeout(() => {
        $('#tablaListado').hide();
        $('#tablaListado_2').hide();
        ejecutarFuncion()
            .then(() => setTimeout(() => {
                $('#tablaListado').show();
                $('#tablaListado_2').show();
                //$("#modalLoader").modal("hide")
            }, 2000))
            .catch(() => setTimeout(() => {
                $("#modalLoader").modal("hide")
                Notiflix.Notify.Failure('Actualize la pagina por favor...');
            }, 2000))
    }, 500);
    
        
})

function ejecutarFuncion(){
    return new Promise((resolve, reject) => {
        // Código que toma mucho tiempo
        //tablaResumen();
        resolve(tablaResumen(), tablaDetalle())
    })
}

function tablaResumen(){
    const semestre = $("#semestre").val();
    const sede = $("#sede").val();

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
            url: path + "Notas/matriculadosSemestre",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "listar",
                semestre: semestre,
                sede: sede
            },
            beforeSend: function () {
                // $("#modalLoader").modal();
                // $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                // $("#modalLoader").modal("hide");
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
                    return data.Institucion;
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
                    return data.Especialidad;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.UNO;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.DOS;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.TRES;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.CUATRO;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.CINCO;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.SEIS;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Total;
                }
            }
        ],
        language: language
    });
}

function tablaDetalle(){
    const semestre = $("#semestre").val();
    const sede = $("#sede").val();

    //$('#tablaListado_2').empty();
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
            url: path + "Notas/matriculadosSemestre",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "listar_detalle",
                semestre: semestre,
                sede: sede
            },
            beforeSend: function () {
                // $("#modalLoader").modal();
                // $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                console.log(response);
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
                    return data.malla_curricular;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Institucion;
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
                    return data.Especialidad;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_ciclo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Seccion;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Turno;
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
                    return data.edad;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.sexo;
                }
            }
        ],
        language: language
    });
}
