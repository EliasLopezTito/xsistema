$(document).ready(function () {

    cargarTabla()

})

const LANGUAGE = {
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
    "info": "Mostrando del _START_ al _END_ de _TOTAL_ registros"
}

$("#btnExcel").click(function () {
    //$("#frmExcel").attr("target", "_blank");
    $("#frmExcel").submit();
});

function cargarTabla() {

    tablaEgresados = $("#tablaEgresados").DataTable({
        responsive: true,
        language: LANGUAGE,
        ordering: false,
        lengthMenu: [[10, 20, 50, 100, 200, - 1], [10, 20, 50, 100, 200, "Todos"]],
        iDisplayLength: 20,
        ajax: {
            url: path + "/BolsaTrabajo/seguimientoEgresados",
            method: 'POST',
            dataType: 'JSON',
            data: {
                opcion: "listar"
            },
            dataSrc: function (res) {
                return res.data;
            }
        },
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                },
                className: "text-center font-13"
            },
            {
                data: "Alumno",
                className: "text-center font-13"
            },
            {
                data: "documento",
                className: "font-14 text-center"
            },
            {
                data: null, render: function (data) {

                    return data.P26;

                }, className: "text-center font-14"
            },
            {
                data: null, render: function (data) {

                    return data.RsptFechaReg;

                }, className: "text-center font-14"
            }
            // {
            //     data: null, render: function (data) {

            //         return `<button class="btn btn-xs px-2 btn-warning" op="${data.id}" onclick="editPassword(this)">
            //                     <i class="nav-icon fa fa-edit" style="color:#fff"></i>                                
            //                 </button> `;

            //     }, className: "text-center font-14"
            // }
        ]

    })

}

function imprimirExcel(){

    $.ajax({
        url: path + "BolsaTrabajo/seguimientoEgresados",
        type: "POST",
        data: {
            opcion: "imprimirExcel"
        },
        success: function (data) {
            console.log(data);
        }
    });
}