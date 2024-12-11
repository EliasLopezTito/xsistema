$(document).ready(function () {

    cargarInstituciones();
    cargarTipoEspecialidades();
    cargarEspecialidades();

});

$("#anioProg").change(function () {
    $("#tablaAlumnos tbody").find("tr").remove();
    $("#divAlumnos").css({"display": "none"});
});

$("#mesProg").change(function () {
    $("#tablaAlumnos tbody").find("tr").remove();
    $("#divAlumnos").css({"display": "none"});
});

$("#turno").change(function () {
    $("#tablaAlumnos tbody").find("tr").remove();
    $("#divAlumnos").css({"display": "none"});
});

$("#cbxTodos").change(function () {
    console.log($("#cbxTodos").prop("checked"))
    marcarCheckbox($("#cbxTodos").prop("checked"));
});

function marcarCheckbox(val) {
    $(".checkbox_class").children("input").prop("checked", val);
    //$("#tablaAlumnos tbody").find("tr").each(function () {
    //$(this).find("td").eq(11).find("input:checkbox").prop("checked", val);
    //});
}

$("#btnEliminar").click(function () {
    mostrarMensaje("confirmacion", "CONFIRMAR", "Seguro de eliminar los alumnos seleccionados");
});

$("#mensaje-boton-aceptar").click(function () {
    if ($("#anioProg").val() != null && $("#mesProg").val() != null && $("#turno").val() != null && $("#anioProg").val() != "" && $("#mesProg").val() != "" && $("#turno").val() != "") {
        eliminarAlumnos();
    } else {
        mostrarMensaje("error", "ERROR", "Seleccione todos los parametros");
    }

});

$("#btnConsultar").click(function () {
    if ($("#anioProg").val() != null && $("#mesProg").val() != null && $("#turno").val() != null && $("#institucion").val() != null && $("#tipoEspecialidad").val() != null && $("#especialidad").val() != null && $("#anioProg").val() != "" && $("#mesProg").val() != "" && $("#turno").val() != "" && $("#institucion").val() != "" && $("#tipoEspecialidad").val() != "" && $("#especialidad").val() != "") {

        var checkbox = "";
        var tbody = $("#tablaAlumnos tbody");
        tbody.find("tr").remove();

        $.ajax({
            url: path + "Programacion/noPagantes",
            type: "POST",
            data: {
                opcion: "consultar",
                anioProg: $("#anioProg").val(),
                mesProg: $("#mesProg").val(),
                turno: $("#turno").val(),
                institucion: $("#institucion").val(),
                tipoEspecialidad: $("#tipoEspecialidad").val(),
                especialidad: $("#especialidad").val()
            },
            beforeSend: function () {
                $("#labelL").html("Consultando Datos...");
                $("#divAlumnos").css({"display": "none"});
                $("#modalLoader").modal({backdrop: 'static', keyboard: false});
            },
            success: function (data) {
                //console.log(data);
                var datos = JSON.parse(data);
                $("#modalLoader").modal("hide");
                $("#divAlumnos").css({"display": "block"});
                if (datos.respuesta === "success") {
                    if (datos.alumnos !== "vacio") {
                        var alumnos = datos.alumnos;
                        for (i = 0; i < alumnos.length; i++) {
                            var alumno = alumnos[i];
                            var observacion = "";
                            var color = "";
                            checkbox = "";

                            if (alumno.boleta2 != "-") {
                                observacion += "OTRO CICLO : " + alumno.otro_ciclo + "<br />(" + alumno.boleta2 + ")";
                            }
                            if (alumno.boleta3 != "-") {
                                if (observacion != "") {
                                    observacion += "<br />";
                                }
                                observacion += "OTRO PROGRAMA : " + alumno.otra_carrera + "<br />(" + alumno.boleta3 + ")";
                            }
                            if (observacion != "") {
                                color = "texto-azul";
                                checkbox = "<input type=\"checkbox\">";
                            } else {
                                observacion = "SIN PAGO";
                                color = "texto-rojo";
                                checkbox = "<input type=\"checkbox\" checked>";
                            }
                            var tr = "<tr style=\"color: #00f;\">" +
                                "   <td class=\"celda-centrada " + color + " \">" + (i + 1) + "</td>" +
                                "   <td style=\"display: none;\">" + alumno.cod_local + "</td>" +
                                "   <td style=\"display: none;\">" + alumno.tipo_espe + "</td>" +
                                "   <td style=\"display: none;\">" + alumno.cod_espe + "</td>" +
                                "   <td style=\"display: none;\">" + alumno.cod_localInst + "</td>" +
                                "   <td style=\"display: none;\">" + alumno.cod_aula + "</td>" +
                                "   <td style=\"display: none;\">" + alumno.cod_ciclo + "</td>" +
                                "   <td class=\"celda-centrada " + color + " \">" + alumno.cod_alumno + "</td>" +
                                "   <td class=\"celda-izquierda " + color + " \">" + alumno.alumno + "</td>" +
                                "   <td class=\"celda-centrada " + color + " \">" + alumno.descripcionM + "</td>" +
                                "   <td class=\"celda-centrada " + color + " \">" + alumno.cod_ciclo + "</td>" +
                                "   <td class=\"celda-centrada " + color + " \">" + alumno.cod_turno + "</td>" +
                                "   <td class=\"celda-centrada " + color + " \">" + observacion + "</td>" +
                                "   <td class=\"celda-centrada checkbox_class\" >" + checkbox + "</td>" +
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
    } else {
        mostrarMensaje("error", "ERROR", "Seleccione todos los parametros");
    }
});

$("#btnExportar").click(function () {
    exportarExcel();
});

$("#institucion").change(function(){

    var cboInstitucion = $("#institucion").val();

    if (cboInstitucion == "%") {
        var cboTipoEspecialidad = $("#tipoEspecialidad");
        cboTipoEspecialidad.find('option').remove();
        cboTipoEspecialidad.append('<option value="%"> - TODOS LOS TIPOS DE ESPECIALIDAD - </option>');

        var cboEspecialidad = $("#especialidad");
        cboEspecialidad.find('option').remove();
        cboEspecialidad.append('<option value="%"> - TODOS LOS PROGRAMAS ACADÉMICOS - </option>');

    } else {
        cargarTipoEspecialidades();

        var cboEspecialidad = $("#especialidad");
        cboEspecialidad.find('option').remove();
        cboEspecialidad.append('<option value="%"> - TODOS LOS PROGRAMAS ACADÉMICOS - </option>');
    }
});

$("#tipoEspecialidad").change(function(){

    var tipoEspecialidad = $("#tipoEspecialidad").val();

    if (tipoEspecialidad == "%") {

        var cboEspecialidad = $("#especialidad");
        cboEspecialidad.find('option').remove();
        cboEspecialidad.append('<option value="%"> - TODOS LOS PROGRAMAS ACADÉMICOS - </option>');

    } else {
        cargarEspecialidades();
    }

});



function eliminarAlumnos() {

    var alumnos = new Array();
    var alumno = "";
    var codLocal = "";
    var tipoEspe = "";
    var codEspe = "";

    $("#tablaAlumnos tbody").find("tr").each(function () {

        if ($(this).find("td").eq(13).find("input:checkbox").prop("checked")) {
            alumno = $(this).find("td").eq(7).text();
            codLocal = $(this).find("td").eq(1).text();
            tipoEspe = $(this).find("td").eq(2).text();
            codEspe = $(this).find("td").eq(3).text();
            codTurno = $(this).find("td").eq(11).text();
            codAula = $(this).find("td").eq(5).text();
            codCiclo = $(this).find("td").eq(6).text();

            alumnos.push(new Array(alumno, codLocal, tipoEspe, codEspe, codTurno, codAula, codCiclo));
        }
    });

    if (alumnos.length > 0) {
        $.ajax({
            url: path + "Programacion/noPagantes",
            type: "POST",
            data: {
                opcion: "eliminar",
                anioProg: $("#anioProg").val(),
                mesProg: $("#mesProg").val(),
                alumnos: alumnos
            },
            beforeSend: function () {
                $("#modalMensaje").modal("hide");
                $("#labelL").html("Eliminando alumnos...");
                $("#modalLoader").modal({backdrop: 'static', keyboard: false });
            },
            success: function (data) {
                //console.log(data);
                var datos = JSON.parse(data);
                if (datos.respuesta === "success") {
                    $("#btnConsultar").trigger("click");
                    //mostrarMensaje("exito", "OK", "Los alumnos se eliminaron correctamente");
                } else {
                    $("#modalLoader").modal("hide");
                    var errores = "";
                    for (i = 0; i < datos.errores.length; i++) {
                        errores += datos.errores[i] + "<br>";
                    }
                    mostrarMensaje("error", "ERROR", errores);
                }
            }
        });
    } else {
        mostrarMensaje("error", "ERROR", "Debe seleccionar los alumnos a eliminar de la programación");
    }
}

function exportarExcel() {
    $.ajax({
        url: path + "Programacion/noPagantes",
        type: "POST",
        data: {
            opcion: "exportar",
            anioProg: $("#anioProg").val(),
            mesProg: $("#mesProg").val(),
            turno: $("#turno").val(),
            institucion: $("#institucion").val(),
            tipoEspecialidad: $("#tipoEspecialidad").val(),
            especialidad: $("#especialidad").val()
        },
        beforeSend: function () {
            $("#labelL").html("Exportando Datos...");
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
        },
        success: function (data) {
            //console.log(data);
            $("#modalLoader").modal("hide");
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                var a = $("<a>");
                a.attr("href", datos.file);
                $("body").append(a);
                a.attr("download", "no_pagantes.xls");
                a[0].click();
                a.remove();
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

function cargarInstituciones() {
    return;
    $.ajax({
        url: path + "institucion/getInstituciones",
        type: "POST",
        data: {
        },
        success: function (data) {
            //console.log(data);
            var cboInstitucion = $("#institucion");
            cboInstitucion.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.instituciones != "vacio") {
                    var instituciones = datos.instituciones;
                    cboInstitucion.append('<option value="%"> - TODAS LAS INSTITUCIONES - </option>');
                    for (i = 0; i < instituciones.length; i++) {
                        var institucion = instituciones[i];
                        //if(institucion.cod_local === "10"){
                        //    cboInstitucion.append("<option selected value=\"" + institucion.cod_local + "\" >" + institucion.cod_local + " - " + institucion.descripcionM + "</option>");
                        //}else{
                        cboInstitucion.append("<option value=\"" + institucion.cod_local + "\" >" + institucion.cod_local + " - " + institucion.descripcionM + "</option>");
                        //}

                    }
                    $("#institucion").val(10)
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarTipoEspecialidades() {
    return;
    var institucion = $("#institucion").val();
    institucion == null ? institucion = 10 : institucion
    $.ajax({
        url: path + "tipoEspecialidad/getTipoEspecialidades",
        type: "POST",
        data: {
            institucion: institucion
        },
        success: function (data) {
            //console.log(data);
            var cboTipoEspecialidad = $("#tipoEspecialidad");
            cboTipoEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.tipoEspecialidades != "vacio") {
                    var tipoEspecialidades = datos.tipoEspecialidades;
                    cboTipoEspecialidad.append('<option value="%"> - TODOS LOS TIPOS DE ESPECIALIDAD - </option>');
                    for (i = 0; i < tipoEspecialidades.length; i++) {
                        var tipoEspecialidad = tipoEspecialidades[i];
                        cboTipoEspecialidad.append("<option value=\"" + tipoEspecialidad.tipo_espe + "\" >" + tipoEspecialidad.tipo_espe + " - " + tipoEspecialidad.descripcion + "</option>");
                    }
                    $("#tipoEspecialidad").val('01')
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarEspecialidades() {
    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();
    institucion == null ? institucion = 10 : institucion
    tipoEspecialidad == null ? tipoEspecialidad = '01' : tipoEspecialidad

    $.ajax({
        url: path + "especialidad/getEspecialidades",
        type: "POST",
        data: {
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad
        },
        success: function (data) {
            //console.log(data);
            var cboEspecialidad = $("#especialidad");
            cboEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.especialidades != "vacio") {
                    var especialidades = datos.especialidades;
                    cboEspecialidad.append('<option value="%"> - TODOS LOS PROGRAMAS ACADÉMICOS - </option>');
                    for (i = 0; i < especialidades.length; i++) {
                        var especialidad = especialidades[i];
                        cboEspecialidad.append("<option value=\"" + especialidad.cod_espe + "\" >" + especialidad.cod_espe + " - " + especialidad.descripcionM + "</option>");
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

