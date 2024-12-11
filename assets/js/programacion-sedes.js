$(document).ready(function(){
    cargarListado()
});
var tablaSedes
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

function cargarListado() {
    if ($.fn.DataTable.isDataTable('#tablaSedes')) {
        tablaSedes.destroy();
    }
    tablaSedes = $("#tablaSedes").DataTable({
        ajax: {
            url: path + "programacion/sedes",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "select"
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
                    return response.listar == "vacio" ? {} : response.listar;
                }
            },
        },
        columnDefs: [
            {
                defaultContent: "-",
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [25, 50, 100],
            [25, 50, 100]
        ],
        columns: [
            { data: null, render: function(data, type, row, meta) { return meta.row + meta.settings._iDisplayStart + 1; } },
            {
                data: null,
                render: function (data) {
                    return data.cod_localinst;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Descipcion;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Corta;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.TipoLocal;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.codigoM;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Direccion;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.SUNAT;
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
                    return data.Licenciada;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NroLocalMinedu;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NuevaDescripcion;
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
                    return data.FechaReg;
                }
            },
        ],
        language: language,
        initComplete: function () {
            $("#tablaSedes_wrapper .dataTables_length").append(
                '<button class="btn btn-success mipanel-btn-img-texto" id="btnNuevo" type="button" style="margin-left: 10px;" onclick="limpiarModal(true)"><span class="icon-plus"></span> Nuevo</button>'
            );
        }
    });
}

$("#formSede").submit(function(e){
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "actualizar" });
    $.ajax({
        url: path + 'programacion/sedes',
        method: "POST",
        dataType: 'json',
        data: form,
        success: function(data) {
            if (data.respuesta == "success") {
                $("#modalRegistrarDisponibilidad").modal('hide');
                tablaSedes.ajax.reload(null,false)
            } else {
            }
        },
        error: function(error) {
        }
    });
})

function limpiarModal(valor) {
    $('#formRegDispoUsu').find("#institucion").val("10");
    if (valor == true) {
        $(".modal-title").html("REGISTRAR SEDE");
        $("#btnGrabar").attr("title","Registrar");
        $("#btnGrabar").html("<span class=\"icon-floppy-disk\"></span> Registrar");
        $("#btnGrabar").addClass("btn-primary").removeClass("btn-warning")
        $("#modalRegistrarDisponibilidad").modal({backdrop: 'static', keyboard: false});
        $('#formSede').find('input[type=text], input[type=number]').val('');
        $('#formSede').find('#cod_localinst').val('0');
        $('#licenciada option:first').prop('selected', true);
        $('#estado option:first').prop('selected', true);
    }else{
    }
}