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

$("#btnConsultar").click(function () {

    $("#modalLoader").modal();
    $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');

    $('#tablaListadoAforoXsede').hide();
    $('#tablaListadoAforoXsede_2').hide();

    $('#tablaListadoAforoXsede_2').dataTable().fnDestroy();
    $('#tablaListadoAforoXsede_2').dataTable().fnClearTable();

    ejecutarFuncionEgresados()
        .then(() => {
            $('#tablaListadoAforoXsede').show();
            $("#modalLoader").modal("hide");
        })
        .catch(() => {
            $("#modalLoader").modal("hide");
            Notiflix.Notify.Failure('Actualize la pagina por favor...');
        });
});

function ejecutarFuncionEgresados() {
    return new Promise((resolve, reject) => {
        try {
            resolve(tablaResumen());
        } catch (error) {
            reject(error);
        }
    });
}

function tablaResumen(){
    const semestre = $("#semestre").val();
    const zona = $("#zona").val();
    const sede = $("#sede").val();

    $('#tablaListadoAforoXsede').dataTable().fnDestroy();
    $("#tablaListadoAforoXsede").DataTable({
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
            url: path + "notas/aforoXsede",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "listar",
                semestre: semestre,
                zona: zona,
                sede: sede
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
                    /* console.log("Error: ", response.errores); */
                    return [];
                } else {
                    return response.data;
                }
            },
        },
        order: [[2, 'asc']],
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [25, 50, 75, 100],
            [25, 50, 75, 100]
        ],
        columns: [
            { 
                data: "Sede",
                createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
                    $(cell).on('click', function() {
                        tablaDetalle(rowData.Semestre, rowData.codSede, rowData.cod_espe, rowData.Cod_Turno);
                    });
                }
            },
            { 
                data: "Especialidad", 
                createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
                    $(cell).on('click', function() {
                        tablaDetalle(rowData.Semestre, rowData.codSede, rowData.cod_espe, rowData.Cod_Turno);
                    });
                }
            },
            { 
                data: "Turno",
                createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
                    $(cell).on('click', function() {
                        tablaDetalle(rowData.Semestre, rowData.codSede, rowData.cod_espe, rowData.Cod_Turno);
                    });
                    if (rowData.Cod_Turno !== 'M' && rowData.Cod_Turno !== 'T' && rowData.Cod_Turno !== 'N') {
                        $(cell).css('background-color', 'orange');
                        $(cell).css('color', 'white');
                    }
                    $(cell).css('font-weight', 'bold');
                }
            },
            { 
                data: "Aforo",
                createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
                    $(cell).on('click', function() {
                        tablaDetalle(rowData.Semestre, rowData.codSede, rowData.cod_espe, rowData.Cod_Turno);
                    });
                }
            
            },
            { 
                data: "Nro",
                createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
                    $(cell).on('click', function() {
                        tablaDetalle(rowData.Semestre, rowData.codSede, rowData.cod_espe, rowData.Cod_Turno);
                    });
                    $(cell).css('font-weight', 'bold');
                }
            },
            { 
                data: "Capacidad",
                createdCell: function(cell, cellData, rowData, rowIndex, colIndex) {
                    $(cell).on('click', function() {
                        tablaDetalle(rowData.Semestre, rowData.codSede, rowData.cod_espe, rowData.Cod_Turno);
                    });
                    if (cellData < 0) {
                        $(cell).css('background-color', 'red');
                        $(cell).css('font-weight', 'bold');
                        $(cell).css('color', 'white');
                    }
                }
            }
        ],
        language: language
    });
}


function tablaDetalle(semestre, sede, especialidad, turno){
    f = new Date();
    $('#tablaListadoAforoXsede_2').show();
    $('#tablaListadoAforoXsede_2').dataTable().fnDestroy();
    $("#tablaListadoAforoXsede_2").DataTable({
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
            url: path + "notas/aforoXsede",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "listar_detalle",
                semestre: semestre,
                sede: sede,
                especialidad: especialidad,
                turno: turno
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
                    return data.Zona;
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
                    return data.Turno;
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
                    return data.cod_ciclo;
                }
            }
        ],
        language: language
    });
}

