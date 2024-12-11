$(document).ready(function () {

    cargarEncuestasDocentes();
    cargarEncuestasTutores();

});

$("#anioProg").change(function () {

    cargarEncuestasDocentes();
    cargarEncuestasTutores();

});

$("#mesProg").change(function () {

    cargarEncuestasDocentes();
    cargarEncuestasTutores();

});

$("#slct_encuesta_para").change(function () {

    if ($("#slct_encuesta_para").val() == 1) {//para docentes

        $("#container_items_1").css("display", "block");
        $("#container_items_2").css("display", "block"); 

        $("#descripcionItem1").val("1) UTILIZA EL DOCENTE LOS RECURSOS MATERIALES, COMO PIZARRA, PROYECTOR, MAQUETAS, VIDEOS PARA FORTALECER TU APRENDIZAJE.");
        $("#descripcionItem2").val("2) DESTACA LA IMPORTANCIA DEL EMPLEO MATERIAL DIDÁCTICO Y LO UTILIZA DE FORMA CORRECTA.");
        $("#descripcionItem3").val("3) EL DOCENTE SE DEJA ENTENDER CON FACILIDAD, UTILIZANDO EL LENGUAJE CLARO, PREESENTANDO CASOS Y EJEMPLOS APLICATIVOS AL TEMA DESARROLLADO.");
        $("#descripcionItem4").val("4) EL DOCENTE TOMA EN CUENTA TUS CONOCIMIENTOS PREVIOS Y OPINIONES EN TU APRENDIZAJE.");
        $("#descripcionItem5").val("5) CUMPLE CON EL ORDEN Y TIEMPO ASIGNADO AL DESARROLLO DEL PLAN DE LA CLASE INDICÁNDOSE SUS OBJETIVOS.");
        $("#descripcionItem6").val("6) REALIZA EVALUACIONES CONTINUAS PARA MEJORAR TU APRENDIZAJE.");
        $("#descripcionItem7").val("7) MANTIENE UNA BUENA RELACIÓN CON LOS ALUMNOS Y FOMENTA UN CLIMA DE CONFIANZA ARMONÍA Y DE BUENAS RELACIONES INTERPERSONALES.");
        $("#descripcionItem8").val("8) EL DOCENTE RECUPERA LAS CLASES NO DESARROLLADAS POR DIVERSOS MOTIVOS.");
        $("#descripcionItem9").val("9) ASISTE PUNTUALMENTE CON REGULARIDAD AL CUMPLIMIENTO DE SUS SESIONES DE CLASE.");
        $("#descripcionItem10").val("10) EL DOCENTE ASISTE CON VESTIMENTA ADECUADA A SUS SESIONES DE CLASE.");

    } else if ($("#slct_encuesta_para").val() == 2) {//para tutores
        $("#container_items_1").css("display", "block");
        $("#container_items_2").css("display", "none");

        $("#descripcionItem1").val("1) COMO CALIFICAS LA ATENCIÓN.");
        $("#descripcionItem2").val("2) SEGÚN EL HORARIO DE ATENCIÓN DE TUTOR(A), ATIENDE TUS DUDAS DE MANERA INSTANTÁNEA.");
        $("#descripcionItem3").val("3) ES CLARO Y PRECISO AL MOMENTO DE BRINDAR LAS INDICACIONES.");
        $("#descripcionItem4").val("4) TIENE MANEJO Y CONTROL DEL COMPORTAMIENTO DEL ALUMNO.");
        $("#descripcionItem5").val("5) EL TUTOR GENERA UN CLIMA AFECTUOSO O DE EMPATÍA EN EL AULA.");
        $("#descripcionItem6").val("6) DOMINA EL MANEJO DE LAS HERRAMIENTAS DIGITALES(WSSP, MOODEL, ZOOM).");
        $("#descripcionItem7").val("");
        $("#descripcionItem8").val("");
        $("#descripcionItem9").val("");
        $("#descripcionItem10").val("");
    }

    //limpiarItems();

});

function limpiarItems() {

    $("#descripcionItem1").val("");
    $("#descripcionItem2").val("");
    $("#descripcionItem3").val("");
    $("#descripcionItem4").val("");
    $("#descripcionItem5").val("");
    $("#descripcionItem6").val("");
    $("#descripcionItem7").val("");
    $("#descripcionItem8").val("");
    $("#descripcionItem9").val("");
    $("#descripcionItem10").val("");

}

function cargarEncuestasDocentes() {

    var anioProg = $("#anioProg").val();
    var mesProg = $("#mesProg").val();
    var opcion = "select";

    if (anioProg != null && mesProg != null) {

        var tbody = $("#tablaEncuestasDocentes tbody");
        tbody.find('tr').remove();

        $.ajax({
            url: path + "programacion/encuestas",
            type: "POST",
            data: {
                opcion: opcion,
                anioProg: anioProg,
                mesProg: mesProg,
                idClasificacionEncuesta: 1
            },
            success: function (data) {

                var datos = JSON.parse(data);

                if (datos.respuesta == "success") {
                    if (datos.arrayFilas != "vacio") {
                        var arrayFilas = datos.arrayFilas;

                        for (i = 0; i < arrayFilas.length; i++) {
                            var arrayFila = arrayFilas[i];

                            var tr = "<tr>" +
                                "   <td class=\"celda-centrada\">" + arrayFila.descripcion + "</td>" +
                                "   <td class=\"celda-centrada\">" + arrayFila.nroItem + "</td>" +
                                "   <td class=\"celda-izquierda\">" + arrayFila.items + "</td>" +
                                "   <td class=\"celda-centrada\">" +
                                "       <button class=\"btn boton-tabla boton-azul\" type=\"button\" onclick=\"editar(this," + arrayFila.idEncuesta + ");\" title=\"Editar Encuesta\"><span class=\"icon-pencil\"></span></button>" +
                                "       <button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"eliminar(this," + arrayFila.idEncuesta + ");\" title=\"Eliminar Encuesta\"><span class=\"icon-bin\"></span></button>" +
                                "   </td>" +
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
}

function cargarEncuestasTutores() {

    var anioProg = $("#anioProg").val();
    var mesProg = $("#mesProg").val();
    var opcion = "select";

    if (anioProg != null && mesProg != null) {

        var tbody = $("#tablaEncuestasTutores tbody");
        tbody.find('tr').remove();

        $.ajax({
            url: path + "programacion/encuestas",
            type: "POST",
            data: {
                opcion: opcion,
                anioProg: anioProg,
                mesProg: mesProg,
                idClasificacionEncuesta: 2
            },
            success: function (data) {

                var datos = JSON.parse(data);

                if (datos.respuesta == "success") {
                    if (datos.arrayFilas != "vacio") {
                        var arrayFilas = datos.arrayFilas;

                        for (i = 0; i < arrayFilas.length; i++) {
                            var arrayFila = arrayFilas[i];

                            var tr = "<tr>" +
                                "   <td class=\"celda-centrada\">" + arrayFila.descripcion + "</td>" +
                                "   <td class=\"celda-centrada\">" + arrayFila.nroItem + "</td>" +
                                "   <td class=\"celda-izquierda\">" + arrayFila.items + "</td>" +
                                "   <td class=\"celda-centrada\">" +
                                "       <button class=\"btn boton-tabla boton-azul\" type=\"button\" onclick=\"editar(this," + arrayFila.idEncuesta + ");\" title=\"Editar Encuesta\"><span class=\"icon-pencil\"></span></button>" +
                                "       <button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"eliminar(this," + arrayFila.idEncuesta + ");\" title=\"Eliminar Encuesta\"><span class=\"icon-bin\"></span></button>" +
                                "   </td>" +
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
}

$("#mensaje-boton-aceptar").click(function () {
    var idEncuesta = $("#idEncuesta").val();

    $.ajax({
        url: path + "programacion/encuestas",
        type: "POST",
        data: {
            idEncuesta: idEncuesta,
            opcion: "delete"
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#modalMensaje").modal("hide");
                cargarEncuestasDocentes();
                cargarEncuestasTutores();

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

$("#btnNuevo").click(function () {
    $("#tituloModal").html("NUEVA ENCUESTA");
    $("#btnGrabarM").attr("title", "Grabar encuesta");
    $("#btnGrabarM").html("<span class=\"icon-floppy-disk\"></span> Grabar Encuesta");
    $("#opcion").val("create");
    limpiarModal();

    $("#anioProgM").attr("disabled", false);
    $("#mesProgM").attr("disabled", false);
    $("#slct_encuesta_para").attr("disabled", false);
    $("#slct_encuesta_para").val("");
    $("#container_items_1").css("display", "none");
    $("#container_items_2").css("display", "none");

    $("#modalEncuesta").modal({ backdrop: 'static', keyboard: false });
});

function limpiarModal() {
    var fecha = new Date();
    var mesStr = "";

    if ((fecha.getMonth() + 1) < 10) {
        mesStr = "0" + (fecha.getMonth() + 1);
    }

    $("#anioProgM").val(fecha.getFullYear());
    $("#mesProgM").val(mesStr);
    $("#tituloEncuesta").val("");
    limpiarItems();
}

$("#btnGrabarM").click(function () {
    var opcion = $("#opcion").val();

    var form = $("#frmEncuesta").serializeArray();
    form.push({ name: "opcion", value: opcion });

    $.ajax({
        url: path + "programacion/encuestas",
        type: "POST",
        data: $.param(form),
        success: function (data) {

            //console.log(data);

            var datos = JSON.parse(data);

            if (datos.respuesta == "success") {

                cargarEncuestasDocentes();
                cargarEncuestasTutores();

                $("#modalEncuesta").modal("hide");

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


function editar(btn, idEncuesta) {

    var opcion = "buscar";

    $.ajax({
        url: path + "programacion/encuestas",
        type: "POST",
        data: {
            opcion: opcion,
            idEncuesta: idEncuesta
        },
        success: function (data) {

            //console.log(data);

            var datos = JSON.parse(data);

            if (datos.respuesta == "success") {
                if (datos.encuesta != "vacio") {

                    $("#idEncuesta").val(idEncuesta);
                    $("#opcion").val("update");

                    var arrayFilas = datos.arrayFilas;

                    $("#anioProgM").val($("#anioProg").val());
                    $("#mesProgM").val($("#mesProg").val());

                    $("#anioProgM").attr("disabled", true);
                    $("#mesProgM").attr("disabled", true);

                    $("#tituloEncuesta").focus();

                    $("#tituloEncuesta").val(datos.descripcionEncuesta);

                    var idClasificacionEncuesta = datos.idClasificacionEncuesta;

                    $("#slct_encuesta_para").val(idClasificacionEncuesta);
                    $("#idClasificacionEncuesta").val(idClasificacionEncuesta);

                    $("#slct_encuesta_para").attr("disabled", true);

                    if (idClasificacionEncuesta == 1) {//docentes

                        $("#container_items_1").css("display", "block");
                        $("#container_items_2").css("display", "block");

                        $("#descripcionItem1").val(arrayFilas["descripcionItem1"]);
                        $("#descripcionItem2").val(arrayFilas["descripcionItem2"]);
                        $("#descripcionItem3").val(arrayFilas["descripcionItem3"]);
                        $("#descripcionItem4").val(arrayFilas["descripcionItem4"]);
                        $("#descripcionItem5").val(arrayFilas["descripcionItem5"]);
                        $("#descripcionItem6").val(arrayFilas["descripcionItem6"]);
                        $("#descripcionItem7").val(arrayFilas["descripcionItem7"]);
                        $("#descripcionItem8").val(arrayFilas["descripcionItem8"]);
                        $("#descripcionItem9").val(arrayFilas["descripcionItem9"]);
                        $("#descripcionItem10").val(arrayFilas["descripcionItem10"]);

                    } else {//tutores

                        $("#container_items_1").css("display", "block");
                        $("#container_items_2").css("display", "none");

                        $("#descripcionItem1").val(arrayFilas["descripcionItem1"]);
                        $("#descripcionItem2").val(arrayFilas["descripcionItem2"]);
                        $("#descripcionItem3").val(arrayFilas["descripcionItem3"]);
                        $("#descripcionItem4").val(arrayFilas["descripcionItem4"]);
                        $("#descripcionItem5").val(arrayFilas["descripcionItem5"]);
                        $("#descripcionItem6").val(arrayFilas["descripcionItem6"]);
                    }


                    $("#tituloModal").html("Editar Encuesta");

                    $("#btnGrabarM").attr("title", "Grabar encuesta");
                    $("#btnGrabarM").html("<span class=\"icon-floppy-disk\"></span> Grabar Encuesta");

                    $("#modalEncuesta").modal({ backdrop: 'static', keyboard: false });
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

function eliminar(btn, idEncuesta) {
    $("#idEncuesta").val(idEncuesta);
    var descripcion = $(btn).parent().parent().find("td").eq(0).html();
    var mensaje = "¿Seguro de eliminar la encuesta: \"" + descripcion + "\"?";
    mostrarMensaje("confirmacion", "CONFIRMAR", mensaje);
}
