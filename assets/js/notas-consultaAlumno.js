$(document).ready(function () {
    $("#codAlumno").attr("readonly", true);
    $("#codAlumnoI").attr("readonly", true);
    $("#apellidos").attr("readonly", true);
    $("#nombres").attr("readonly", true);
    $("#instituto").attr("readonly", true);
    $("#programa").attr("readonly", true);
    $("#ciclo").attr("readonly", true);
    $("#seccion").attr("readonly", true);
    $("#periodo").attr("readonly", true);
});
//ok
function showModalBuscar() {
    $("#codigoBus").val("");
    $("#apellidosNombresBus").val("");
    $("#tablaModalAlumno tbody").find('tr').remove();
    $("#codigoBus").focus();
    $("#modalAlumnos").modal({backdrop: 'static', keyboard: false});
}
//ok
function buscarAlumnoMatriculado() {
    var codigoBus = $("#codigoBus").val().trim();
    var apellidosNombresBus = $("#apellidosNombresBus").val().trim();

    $.ajax({
        url: path + "notas/consultaAlumno",
        type: "POST",
        data: {
            codigoBus: codigoBus,
            apellidosNombresBus: apellidosNombresBus,
            opcion: "buscarAlumno"
        },
        success: function (data) {
            //console.log(data);
            var tbody = $("#tablaModalAlumno tbody");
            tbody.find('tr').remove();

            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.alumnos != "vacio") {
                    var alumnos = datos.alumnos;
                    for (i = 0; i < alumnos.length; i++) {
                        var alumno = alumnos[i];
                        var tr = "<tr ondblclick=\"seleccionarAlumno(this);\">" +
                                "<td class=\"celda-centrada\">" + alumno.cod_alumno + "</td>" +
                                "<td>" + alumno.apellidos_nombres + "</td>" +
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

function seleccionarAlumno(tr) {
    var codAlumno = $(tr).find("td").eq(0).html();
    $.ajax({
        url: path + "notas/consultaAlumno",
        type: "POST",
        data: {
            codAlumno: codAlumno,
            opcion: "seleccionarAlumno"
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#modalAlumnos").modal("hide");
                var tbody = $("#tablaProgramas tbody");
                tbody.find("tr").remove();
                $("#foto").attr({"src": datos.foto});

                if (datos.programas != "vacio") {
                    var programas = datos.programas;
                    if (programas.length == 1) {
                        $("#divProgramas").css("display", "none");
                        cargarDatos(codAlumno, programas[0].malla_curricular, programas[0].cod_local, programas[0].tipo_espe, programas[0].cod_espe);
                    } else {
                        for (i = 0; i < programas.length; i++) {
                            var programa = programas[i];
                            var tr = "<tr ondblclick=\"seleccionarPrograma(this);\" readonly>" +
                                    "   <td style=\"display: none;\">" + codAlumno + "</td>" +
                                    "   <td style=\"display: none;\">" + programa.malla_curricular + "</td>" +
                                    "   <td style=\"display: none;\">" + programa.cod_local + "</td>" +
                                    "   <td style=\"display: none;\">" + programa.tipo_espe + "</td>" +
                                    "   <td style=\"display: none;\">" + programa.cod_espe + "</td>" +
                                    "   <td>" + programa.local_des + "</td>" +
                                    "   <td>" + programa.programa_des + "</td>" +
                                    "   <td class=\"celda-centrada\">" + programa.malla_des + "</td>" +
                                    "</tr> ";
                            tbody.append(tr);
                        }
                        $("#divProgramas").css("display", "block");
                    }
                } else {
                    mostrarMensaje("error", "ERROR", "El alumno no esta matriculado en ningun Programa");
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

function cargarDatos(codAlumno, malla, codLocal, tipoEspe, codEspe) {
    $.ajax({
        url: path + "notas/consultaAlumno",
        type: "POST",
        data: {
            codAlumno: codAlumno,
            malla: malla,
            codLocal: codLocal,
            tipoEspe: tipoEspe,
            codEspe: codEspe,
            opcion: "cargarDatos"
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                var datosMat = datos.datosMat;
                if (datosMat != "vacio") {
                    $("#codAlumno").val(datosMat.cod_alumno.trim());
                    $("#codAlumnoI").val(datosMat.cod_interno.trim());
                    $("#apellidos").val(datosMat.apell_alumno.trim());
                    $("#nombres").val(datosMat.nombre_alumno.trim());
                    $("#instituto").val(datosMat.instituto.trim());
                    $("#programa").val(datosMat.programa.trim());
                    $("#ciclo").val(datosMat.cod_ciclo.trim());
                    $("#seccion").val(datosMat.cod_seccion.trim());
                    $("#periodo").val(datosMat.id_periodo_academico.trim());
                    if(datosMat.observacion !== ""){
                        mostrarMensaje("mensaje", "Mensaje", datosMat.observacion);
                    }
                } else {
                    $("#codAlumno").val("");
                    $("#codAlumnoI").val("");
                    $("#apellidos").val("");
                    $("#nombres").val("");
                    $("#instituto").val("");
                    $("#programa").val("");
                    $("#ciclo").val("");
                    $("#seccion").val("");
                    $("#periodo").val("");
                    mostrarMensaje("error", "ERROR", "No existen datos para mostrar");
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

function seleccionarPrograma(tr) {
    var codAlumno = $(tr).find("td").eq(0).html().trim();
    var malla = $(tr).find("td").eq(1).html().trim();
    var codLocal = $(tr).find("td").eq(2).html().trim();
    var tipoEspe = $(tr).find("td").eq(3).html().trim();
    var codEspe = $(tr).find("td").eq(4).html().trim();

    pintarFila(tr);
    cargarDatos(codAlumno, malla, codLocal, tipoEspe, codEspe);
}

function pintarFila(tr) {
    $(tr).parent().find("tr").each(function () {
        $(this).removeClass("tr-seleccionado");
    });
    $(tr).addClass("tr-seleccionado");
}