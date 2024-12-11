tablaPermisoOpciones;
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

$(document).ready(function () {
    cargarMenu1(function() {
        cargarMenu2(function() {
            cargarMenu3();
        });
    });

    $("#btnNuevoPermiso").click(function () {
        $("#modalNuevoPermiso").modal('show');
    });

    cargarPermisosUsuarios();

    $("#menu1").change(function () {
        cargarMenu2(function(hasData) {
            if (hasData) {
                cargarMenu3();
            } else {
                clearMenu3();
            }
        });
    });

    $("#menu2").change(function () {
        cargarMenu3();
    });

    $("#modalNuevoPermiso").on('hidden.bs.modal', function () {
        limpiarFormulario()
    });

    $("#usuario").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Seguridad/usuariosXOpcion",
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarUsuario'
                },
                success: function(data){
                    $("#usuario").removeAttr("data-code");
                    $("#usuario").next('i').removeClass('glyphicon-ok');
                    $("#usuario").next('i').addClass('glyphicon-remove');
                    $("#usuario").parent().removeClass('has-success');
                    $("#usuario").parent().addClass('has-error');
                    let result = (!data.resp) ? [{ vacio: true }] : data.resp;
                    response(result);
                }
            });
        },
        minLength: 3,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                
                $("#usuario").val(ui.item.id_usuario + " - " +ui.item.Usuario);
                $("#usuario").attr('data-code', ui.item.id_usuario);
                $("#usuario").next('i').removeClass('glyphicon-remove');
                $("#usuario").next('i').addClass('glyphicon-ok');
                $("#usuario").parent().removeClass('has-error');
                $("#usuario").parent().addClass('has-success');
            }
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        if (item.vacio) {
            return $( "<li>" )
            .append( "<div>No se encontraron resultados</div>" )
            .appendTo( ul );
        }

        return $( "<li>" )
            .append( "<div>" + item.id_usuario + " - " +item.Usuario + "</div>" )
            .appendTo( ul );
    };

    $("#usuario").focus();
});

function cargarPermisosUsuarios() {
    $.ajax({
        url: path + "seguridad/usuariosXOpcion",
        type: 'POST',
        dataType: "json",
        data: {
            opcion: 'listar'
        },
        beforeSend: function() {
            $('.text-loader').text('Consultando información, por favor espere...');
            $("#modalLoader").modal();
        },
        complete: function(){
            $("#modalLoader").modal("hide");
        },
        success: function(response) {
            if(response.respuesta === "success") {
                tablaPermisoOpciones = $("#tablaPermisoOpciones").DataTable({
                    ordering: false,
                    dom: 'lBfrtip',
                    buttons: [
                        { "extend": 'excel', "text": 'Exportar Excel', "className": 'btn_excel_datatable' }
                    ],
                    data: response.listado,
                    columnDefs: [
                        {
                            targets: '_all',
                            className: 'celda-centrada',
                            orderable: false
                        }
                    ],
                    lengthMenu: [
                        [10, 25, 50, 75, 100],
                        [10, 25, 50, 75, 100]
                    ],
                    columns: [
                        {
                            data: null,
                            render: function (data, type, row, meta) {
                                return meta.row + 1;
                            }
                        },
                        { data: 'Area' },
                        { data: 'IdUsuario' },
                        { data: 'Usuario' },
                        { data: 'Operacion' },
                        { data: 'ruta' },
                        {
                            data: null,
                            render: function (data) {
                                return data.DescripcionMenu1 + " / " + data.DescripcionMenu2 + " / " + data.DescripcionMenu3;
                            }
                        },
                        {
                            data: null,
                            render: function (data, type, row) {
                                return `
                                    <button class="btn boton-tabla boton-naranja" type="button" onclick="editarPermiso('${data.Id}')"><span class="icon-pencil"></span></button>
                                    <button class="btn boton-tabla boton-rojo" type="button" onclick="eliminarPermiso('${data.Id}')"><span class="icon-cross"></span></button>
                                `;
                            },
                            className: 'text-center'
                        }
                        
                    ],
                    language: language
                });
            } else {
                console.log(response.error);
            }
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function cargarMenu1(callback) {
    $.ajax({
        url: path + "seguridad/usuariosXOpcion",
        type: "POST",
        data: {
            opcion: "cargarMenu1"
        },
        success: function (data) {
            var cboMenu1 = $("#menu1");
            cboMenu1.empty();
            var datos = JSON.parse(data);
            if (datos.respuesta === "success") {
                if (datos.data !== "vacio") {
                    var menu1 = datos.data;
                    for (var i = 0; i < menu1.length; i++) {
                        cboMenu1.append("<option value=\"" + menu1[i].id_menu + "\" >" + menu1[i].descripcion + "</option>");
                    }
                }
                if (callback) callback();
            } else {
                mostrarMensaje("error", "ERROR", datos.error);
            }
        }
    });
}

function cargarMenu2(callback) {
    var menu1 = $("#menu1").val();
    $.ajax({
        url: path + "seguridad/usuariosXOpcion",
        type: "POST",
        data: {
            opcion: "cargarMenu2",
            menu1: menu1
        },
        success: function (data) {
            var cboMenu2 = $("#menu2");
            cboMenu2.empty();
            var datos = JSON.parse(data);
            var hasData = false;
            if (datos.respuesta === "success") {
                if (datos.data !== "vacio") {
                    var menu2 = datos.data;
                    for (var i = 0; i < menu2.length; i++) {
                        cboMenu2.append("<option value=\"" + menu2[i].id_menu + "\" >" + menu2[i].descripcion + "</option>");
                    }
                    hasData = true;
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.error);
            }
            if (callback) callback(hasData);
        }
    });
}

function cargarMenu3(callback) {
    var menu2 = $("#menu2").val();
    $.ajax({
        url: path + "seguridad/usuariosXOpcion",
        type: "POST",
        data: {
            opcion: "cargarMenu3",
            menu2: menu2
        },
        success: function (data) {
            var cboMenu3 = $("#menu3");
            cboMenu3.empty();
            var datos = JSON.parse(data);
            if (datos.respuesta === "success") {
                if (datos.data !== "vacio") {
                    var menu3 = datos.data;
                    for (var i = 0; i < menu3.length; i++) {
                        cboMenu3.append("<option value=\"" + menu3[i].id_menu + "\" >" + menu3[i].descripcion + "</option>");
                    }
                }
                if (callback) callback();
            } else {
                mostrarMensaje("error", "ERROR", datos.error);
            }
        }
    });
}

function clearMenu3() {
    $("#menu3").empty();
}

$("#frmModalPermiso").on("submit",function(e){
    e.preventDefault();

    var id = $("#id").val(); 
    var tipoAccion = $("#tipoAccion").val();
    var menu1 = $("#menu1").val();
    var menu2 = $("#menu2").val();
    var menu3 = $("#menu3").val();
    var usuario = $("#usuario").attr('data-code');

    $.ajax({
        url: path + "seguridad/usuariosXOpcion",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "registrar",
            id:id,
            tipoAccion:tipoAccion,
            menu1:menu1,
            menu2:menu2,
            menu3:menu3,
            usuario:usuario
        },
        success: function (response) {                    

            if(response.respuesta === "success"){
                Notiflix.Notify.Success('EL PERMISO DE CREO CON ÉXITO.',{timeout:2000});
                //$("#modalNuevoPermiso").modal('hide');
                tablaPermisoOpciones.ajax.reload(null, false);
                //location.reload();

            }else if(response.respuesta === "warning"){

                Notiflix.Notify.Warning(response.error,{timeout:8000});

            }else{

                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO : "+response.error,{timeout:8000});
            }

        }
    })
})
function editarPermiso(id){
    $.ajax({
        url: path + "seguridad/usuariosXOpcion",
        type: "POST",
        dataType: "json",
        data: {
            id: id,
            opcion: 'obtenerData'
        },
        success: function (data) {
            console.log(data)
            if (data.respuesta == "success") {
                datos = data.info[0]
                console.log(datos)
                $("#id").val(datos.Id.trim());
                $("#usuario").val(datos.Usuario.trim());
                setTimeout(function() {
                    $("#menu1").val(datos.menu1).change();
                    setTimeout(function() {
                        $("#menu2").val(datos.menu2).change();
                        setTimeout(function() {
                            $("#menu3").val(datos.menu3).change();
                        }, 50);
                    }, 100); 
                }, 200); 
                $("#tipoAccion").val(datos.tipoaccion.trim());
                $("#modalNuevoPermiso").modal({keyboard: false});

            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });
}

function eliminarPermiso(id) {

    Notiflix.Confirm.Show(
        'Eliminar Tramite',
        '¿Esta segura de eliminar el permiso? Nro. : '+ id +'',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "seguridad/usuariosXOpcion",
                type: "POST",
                data: {
                    id: id,
                    opcion: 'eliminar'
                },
                success: function (data) {
                    var datos = JSON.parse(data);
                    if (datos.respuesta == "success") {
                        location.reload();
                    } else {
                    }
                }
            });
        },
        function cancelCb() {
        },
        {
        },
    );

}

function limpiarFormulario() {
    $('#frmModalPermiso').find('#id').val('0');
    $('#frmModalPermiso').find('#tipoAccion').val('1');
    $('#frmModalPermiso').find('#menu1').val('1');
    $('#frmModalPermiso').find('#menu2').val('59');
    $('#frmModalPermiso').find('#menu3').val('60');
    $('#frmModalPermiso').find('#usuario').val('004785');
}