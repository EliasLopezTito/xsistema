$(document).ready(function () {
    cargarSecciones();

    $("#btnGrabarM").click(function () {
        var seccion = $("#seccionM").val();
        var observaciones = $("#observacionesM").val();
        var estado = $("#estadoM").val();
        var opcion = $("#opcion").val();

        $.ajax({
            url: path + "notas/secciones",
            type: "POST",
            data: {
                seccion: seccion,
                observaciones: observaciones,
                estado: estado,
                opcion: opcion
            },
            success: function (data) {
                console.log(data);
                var datos = JSON.parse(data);
                if (datos.respuesta == "success") {
                    $("#modalSeccion").modal("hide");
                    cargarSecciones();
                } else {
                    var errores = "";
                    for (i = 0; i < datos.errores.length; i++) {
                        errores += datos.errores[i] + "<br>";
                    }
                    mostrarMensaje("error", "ERROR", errores);
                }
            }
        });
    });

    $("#mensaje-boton-aceptar").click(function () {
        var codSeccion = $("#codSeccionD").val();
        $.ajax({
            url: path + "notas/secciones",
            type: "POST",
            data: {
                codSeccion: codSeccion,
                opcion: "delete"
            },
            success: function (data) {
                console.log(data);
                var datos = JSON.parse(data);
                if (datos.respuesta == "success") {
                    $("#modalMensaje").modal("hide");
                    cargarSecciones();
                } else {
                    var errores = "";
                    for (i = 0; i < datos.errores.length; i++) {
                        errores += datos.errores[i] + "<br>";
                    }
                    mostrarMensaje("error", "ERROR", errores);
                }
            }
        });
    });
});

function cargarSecciones() {
    var tbody = $("#tablaSecciones tbody");
    tbody.find('tr').remove();
    $.ajax({
        url: path + "notas/secciones",
        type: "POST",
        data: {
            opcion: "select"
        },
        success: function (data) {
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.secciones != "vacio") {
                    var secciones = datos.secciones;
                    for (i = 0; i < secciones.length; i++) {
                        var seccion = secciones[i];
                        var observaciones = "";
                        var estado = "ACTIVO";
                        if (seccion.observaciones != null) {
                            observaciones = seccion.observaciones;
                        }
                        if (seccion.estado1 == 1) {
                            estado = "ACTIVO";
                        } else {
                            estado = "INACTIVO";
                        }
                        var tr = " <tr>" +
                                "    <td class=\"celda-centrada\">" + seccion.cod_seccion.trim() + "</td>" +
                                "    <td class=\"celda-izquierda\">" + observaciones.trim() + "</td>" +
                                "    <td style=\"display: none;\" class=\"celda-centrada\">" + seccion.estado1 + "</td>" +
                                "    <td class=\"celda-centrada\">" + estado + "</td>" +
                                "    <td class=\"celda-centrada\">" +
                                "        <button class=\"btn boton-tabla boton-verde\" type=\"button\" onclick=\"editarSeccion(this);\" title=\"Editar Seccion\"><span class=\"icon-pencil\"></span></button>" +
                                "        <button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"eliminarSeccion(this);\" title=\"Eliminar Seccion\"><span class=\"icon-bin\"></span></button>" +
                                "    </td>" +
                                "</tr>";
                        tbody.append(tr);
                    }
                }
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

function nuevaSeccion() {
    $("#seccionM").val("");
    $("#observacionesM").val("");
    $("#estadoM").val("1");
    $("#opcion").val("create");
    $("#seccionM").focus();
    $("#tituloModal").html("Nueva Seccion");
    $("#modalSeccion").modal({backdrop: 'static', keyboard: false});
}

function eliminarSeccion(btn) {
    $("#codSeccionD").val($(btn).parent().parent().find("td").eq(0).html());
    var mensaje = "Seguro de eliminar la secion: " + $("#codSeccionD").val();
    mostrarMensaje("confirmacion", "CONFIRMAR", mensaje);
}

function editarSeccion(btn) {
    $("#seccionM").val($(btn).parent().parent().find("td").eq(0).html());
    $("#observacionesM").val($(btn).parent().parent().find("td").eq(1).html());
    $("#estadoM").val($(btn).parent().parent().find("td").eq(2).html());
    $("#opcion").val("update");
    $("#seccionM").attr("disabled", true);
    $("#observacionesM").focus();
    $("#tituloModal").html("Editar Seccion");
    $("#modalSeccion").modal({backdrop: 'static', keyboard: false});
}


