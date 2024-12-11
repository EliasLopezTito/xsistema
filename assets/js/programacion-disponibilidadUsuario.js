$(document).ready(function(){
    cargarListado()
    $('#cod_usuario').on('change', function() {
        cargarListado();
    });
    cargarTipoEspecialidades(true)
    $("#tipoEspecialidad").change(function () {
        cargarEspecialidades(true);
    })
});
var tablaDisponibilidad
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
    if ($.fn.DataTable.isDataTable('#tablaDisponibilidadUsuario')) {
        tablaDisponibilidad.destroy();
    }

    var cod_usuario = $("#cod_usuario").val();
    tablaDisponibilidad = $("#tablaDisponibilidadUsuario").DataTable({
        ajax: {
            url: path + "programacion/disponibilidadUsuario",
            type: "POST",
            dataType: "JSON",
            data: {
                cod_usuario: cod_usuario,
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
                render: function (data, type, row, meta) {
                    return data.cod_usuario;
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
                    return data.cod_espe;
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
                    return data.Desde;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Hasta;
                }
            },
            {
                data: null,
                render: function(data){            
                    
                    return   "<button class=\"btn boton-tabla boton-naranja btnEditar\" type=\"button\" onclick=\"editarDispoUsu('"+ data.id+"');\" title=\"Editar Disponibilidad\"><span class=\"icon-pencil\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                             "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"eliminarDispoUsu('"+ data.id +"');\" title=\"Eliminar Disponibilidad\"><span class=\"icon-cross\"></span></button>";                    
                }
            },
        ],
        language: language,
        initComplete: function () {
            $("#tablaDisponibilidadUsuario_wrapper .dataTables_length").append(
                '<button class="btn btn-success mipanel-btn-img-texto" id="btnNuevo" type="button" style="margin-left: 10px;" onclick="limpiarModal(true)"><span class="icon-plus"></span> Nuevo</button>'
            );
        }
    });
}

$("#formRegDispoUsu").submit(function(e){
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "actualizar" });
    $.ajax({
        url: path + 'programacion/disponibilidadUsuario',
        method: "POST",
        dataType: 'json',
        data: form,
        success: function(data) {
            if (data.respuesta == "success") {
                $("#modalRegistrarDisponibilidad").modal('hide');
                tablaDisponibilidad.ajax.reload(null,false)
            } else {
            }
        },
        error: function(error) {
        }
    });
})

function editarDispoUsu(id) {
    limpiarModal(false);
    $.ajax({
        url: path + 'programacion/disponibilidadUsuario',
        method: "POST",
        dataType: 'json',
        data: {
            id: id,
            opcion: "editar"
        },
        success: function(data) {
            const rspta = data.rspta[0];
            if (data.respuesta == "success") {
                $("#id").val(rspta.id);
                $("#usuario_id").val(rspta.cod_usuario.trim());
                $("#tipoEspecialidad").val(rspta.Tipo_espe.trim());

                cargarEspecialidades(false, false, function() {
                    $("#especialidad").val(rspta.cod_espe.trim());
                });

                $("#fechaDesde").val(rspta.desde.substr(0, 10));
                $("#fechaHasta").val(rspta.hasta.substr(0, 10));
            } else {
            }
        },
        error: function(error) {
        }
    });
}

function limpiarModal(valor) {
    $('#formRegDispoUsu').find("#institucion").val("10");
    if (valor == true) {
        $(".modal-title").html("REGISTRAR DISPONIBILIDAD USUARIO");
        $("#btnGrabar").attr("title","Registrar");
        $("#btnGrabar").html("<span class=\"icon-floppy-disk\"></span> Registrar");
        $("#btnGrabar").addClass("btn-primary").removeClass("btn-warning")
        $("#modalRegistrarDisponibilidad").modal({backdrop: 'static', keyboard: false});
        $('#formRegDispoUsu').find("#id").val("0");
        $('#formRegDispoUsu').find("#tipoEspecialidad").val("01");
        $('#formRegDispoUsu').find("#especialidad").val("03");
        $('#usuario_id option:first').prop('selected', true);
        var today = new Date();
        var firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        var formattedFirstDay = firstDayOfMonth.toISOString().slice(0, 10);
        var formattedToday = today.toISOString().slice(0, 10);
        
        $('#formRegDispoUsu').find('#fechaDesde').val(formattedFirstDay); 
        $('#formRegDispoUsu').find('#fechaHasta').val(formattedToday); 
    }else{
        $(".modal-title").html("ACTUALIZAR DISPONIBILIDAD USUARIO");
        $("#btnGrabar").attr("title","Actualizar");
        $("#btnGrabar").html("<span class=\"icon-floppy-disk\"></span> Actualizar");
        $("#btnGrabar").addClass("btn-warning").removeClass("btn-primary")
        $("#modalRegistrarDisponibilidad").modal({backdrop: 'static', keyboard: false});
    }
}

function eliminarDispoUsu( id ){

    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de eliminar la disponibilidad seleccionada?',
        'Si',
        'No',
        function () {
            $.ajax({
                url: path + "programacion/disponibilidadUsuario",
                type: "POST",
                dataType: "JSON",
                data: {
                    opcion: "delete",
                    id: id
                },
                beforeSend: function(){
                },
                success: function (data) {
                    
                    if (data.respuesta == "success") {
                        
                        Notiflix.Notify.Success("LA DISPONIBILIDAD SE ELIMINO CON ÉXITO.", { timeout: 5000 });
                        tablaDisponibilidad.ajax.reload(null,false)

                    } else {
                        
                        Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO", { timeout: 5000 });

                    }

                }
            });

        }
        , function () {
        });

}