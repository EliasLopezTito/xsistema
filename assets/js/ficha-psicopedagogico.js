$(document).ready(function(){
    $("#tablaUsuarios").DataTable({
        serverSide: true,
        processing: true,
        // searching: false,
        // ordering:  false,
        lengthMenu: [
            [25, 50, 100], 
            [25, 50, 100]
        ],
        ajax: {
            url: path + "Psicopedagogico/index",
            type: 'get',
            dataSrc: function(data){
                console.log(data.order);
                return data.data;
            }
        },
        columnDefs: [
            {
                targets: [1, 4, 6],
                orderable: false
            },
            {
                targets: [0, 1, 4, 5],
                searchable: false,
                className: 'celda-centrada'
            }
        ],
        columns: [

            { 
                data: 'ID',
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: 'Cod_Alumno' },
            { data: 'Apellidos' },
            { data: 'Nombres'},
            { data: 'Celular' },
            { data: 'fechaReg' },
            {
                data: 'Cod_Alumno',
                className: 'celda-centrada',
                render: function(data){
                    return `<button class='btn boton-tabla boton-rojo' data-code='${data}' type='button' onclick='verReportePDF(this)'><span class='icon-file-pdf'></span></button>`;
                }
            },
        ],
        language: {
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
        }
    });

});

const verReporteExcel = () => {
    document.getElementById('opcion').value = 'excel';
    document.getElementById("frmFicha").submit();
}

function verReportePDF(e){
    let cod = e.getAttribute('data-code');

    document.getElementById('codigo').value = cod;
    document.getElementById('opcion').value = 'pdf';
    document.getElementById("frmFicha").submit();
}
