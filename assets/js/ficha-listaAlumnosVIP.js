$(document).ready(function(){
    

});


$('#btnConsultar').click(function(){
    verListaAlumnos();
})

function verListaAlumnos(){
    $("#tablaUsuariosx").DataTable({
        destroy: 'true',
        searching: true,
        processing: false,
        responsive: true,
        ordering:  false,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
        ],
        lengthMenu: [
            [20, 100, -1], 
            [50, 100, 'TODO']
        ],
        ajax: {
            url: path + "Psicopedagogico/listaAlumnosVIP",
            type: "POST",
            data: {
                especialidad: $('#especialidad').val(),
                sede: $('#sede').val(),
                opcion: 'select'
            },
            dataSrc: function(data){      
                return data.datax;                               
            }
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada'
            }
        ],
        columns: [
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
                    return data.Documento;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.celular;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.correo;
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
                    return data.ciclo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Modalidad;
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
                    return data.a46;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.fechaReg;
                }
            },
            {
                data: 'Cod_Alumno',
                className: 'celda-centrada',
                render: function(data){
                    return `<button class='btn boton-tabla boton-verde' data-code='${data}' type='button' onclick='verReportePDF(this)'><span class='icon-file-pdf'></span></button>`;
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
}

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
