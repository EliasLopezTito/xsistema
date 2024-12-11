$(document).ready(function () {
    
    $("#codAlumno").attr("readonly", true);
    $("#nombreAlumno").attr("readonly", true);

    $("#btnBuscar").click(function () {
        $("#codigoBus").val("");
        $("#apellidosNombresBus").val("");
        $("#tablaModalAlumno tbody").find('tr').remove();
        $("#codigoBus").focus();
        $("#modalAlumnosMatriculados").modal({backdrop: 'static', keyboard: false});
    });

    $("#carrera").change(function () {
        limpiarCampos(2);
        var carrera = $("#carrera").val();

        if (carrera != "") {
            var parametros = carrera.split("-");
            var codLocal = parametros[0];
            var tipoEspe = parametros[1];
            var codEspe = parametros[2];
            var mallaCurricular = parametros[3];
            var codAlumno = $("#codAlumno").val();

            if (parametros.length > 1) {
                $("#cod_local").val(codLocal);
                $("#tipo_espe").val(tipoEspe);
                $("#cod_espe").val(codEspe);
                $("#malla_curricular").val(mallaCurricular);

                cargarPeriodos(codLocal, tipoEspe, codEspe, mallaCurricular, codAlumno);
            }
        }
    });

    $("#periodo").change(function () {
        limpiarCampos(3);
        var periodo = $("#periodo").val();
        var carrera = $("#carrera").val();

        if (carrera != "" && periodo != "") {
            var parametros = carrera.split("-");
            if (parametros.length > 1) {
                var codLocal = parametros[0];
                var tipoEspe = parametros[1];
                var codEspe = parametros[2];
                var mallaCurricular = parametros[3];
                var codAlumno = $("#codAlumno").val();

                cargarCursos(codLocal, tipoEspe, codEspe, mallaCurricular, periodo, codAlumno);
            }
        }
    });

    $("#btnImprimirBoleta").click(function () {
        if ($("#codAlumno").val() != null && $("#carrera").val() != null && $("#periodo").val() != null && $("#codAlumno").val() != "" && $("#carrera").val() != "" && $("#periodo").val() != "") {
            $('#tipo').val('btnImprimirBoleta');
            setTimeout(() => {
                $("#frmBoleta").submit();
            }, 100);
            return;
            var form = $("#frmBoleta").serializeArray();
            form.push({name: "opcion", value: "imprimirBoletaNotas"});
            $.ajax({
                url: path + "notas/boletaDeNotas",
                type: "POST",
                data: $.param(form),
                beforeSend: function () {
                    $("#modalLoaderTitle").html("Imprimiendo Boleta...");
                    $("#modalLoader").modal({backdrop: 'static', keyboard: false});
                },
                success: function (data) {
                    console.log(data);
                    $("#modalLoader").modal("hide");
                    var datos = JSON.parse(data);
                    if (datos.respuesta == "success") {
                        var a = $("<a>");
                        a.attr("href", datos.file);
                        $("body").append(a);
                        a.attr("download", "file.pdf");
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
        } else {
            mostrarMensaje("error", "ERROR", "Seleccione todos los parametros");
        }
    });

    $("#btnImprimirHistorico").click(function () {
        if ($("#codAlumno").val() != null && $("#carrera").val() != null && $("#codAlumno").val() != "" && $("#carrera").val() != "") {
            $('#tipo').val('btnImprimirHistorico');
            setTimeout(() => {
                $("#frmBoleta").submit();
            }, 100);
            return;
            var form = $("#frmBoleta").serializeArray();
            form.push({name: "opcion", value: "imprimirHistoricoNotas"});
            $.ajax({
                url: path + "notas/boletaDeNotas",
                type: "POST",
                data: $.param(form),
                beforeSend: function () {
                    $("#modalLoaderTitle").html("Imprimiendo Histórico...");
                    $("#modalLoader").modal({backdrop: 'static', keyboard: false});
                },
                success: function (data) {
                    //console.log(response);
                    var response = JSON.parse(data);
                    $("#modalLoader").modal("hide");
                    // if (response.respuesta === "success") {
                    //     $("#modalVistaPreviaCertificado").modal("show")
                    //     $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                    //     let pdf = '<iframe src="' + response.file + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                    //     $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);
                    // } else {
                    //     $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                    //     Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado", "Por favor recargue la página y vuelva a intentarlo.", "Aceptar");
                    // }    


                    var datos = JSON.parse(data);
                    if (datos.respuesta == "success") {
                        var a = $("<a>");
                        a.attr("href", datos.file);
                        $("body").append(a);
                        a.attr("download", "file.pdf");
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
        } else {
            mostrarMensaje("error", "ERROR", "Seleccione todos los parametros");
        }
    });
    
});



function buscarAlumnoMatriculado() {
    var codigoBus = $("#codigoBus").val().trim();
    var apellidosNombresBus = $("#apellidosNombresBus").val().trim();

    if (codigoBus == "" && apellidosNombresBus == "") {
        $("#errorAlumnoBus").html("Debe ingresar el código o apellidos y nombres a buscar");
        $("#errorAlumnoBus").css("display", "block");
        return false;
    } else {
        $("#errorAlumnoBus").html("");
        $("#errorAlumnoBus").css("display", "none");
    }

    $.ajax({
        url: path + "notas/boletaDeNotas",
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
    var apellidosNombres = $(tr).find("td").eq(1).html();

    $.ajax({
        url: path + "notas/boletaDeNotas",
        type: "POST",
        data: {
            codAlumno: codAlumno,
            opcion: "seleccionarAlumno"
        },
        success: function (data) {
            //console.log(data);
            limpiarCampos(1);

            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#codAlumno").val(codAlumno);
                $("#nombreAlumno").val(apellidosNombres);
                if (datos.matriculas != "vacio") {
                    var matriculas = datos.matriculas;
                    $("#carrera").append("<option value=\"\" selected disabled hidden></option>");
                    for (i = 0; i < matriculas.length; i++) {
                        var matricula = matriculas[i];
                        $("#carrera").append("<option value=\"" + matricula.cod_local + "-" + matricula.tipo_espe + "-" + matricula.cod_espe + "-" + matricula.malla_curricular + "\">" + matricula.cod_local + " --- " + matricula.tipo_espe_des + " --- " + matricula.especialidad_des + " --- " + matricula.malla_curricular_abr + "</option>");
                    }
                } else {
                    mostrarMensaje("error", "ERROR", "El alumno no tiene matriculas con registro de notas.");
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

    $("#modalAlumnosMatriculados").modal("hide");
}

function cargarPeriodos(codLocal, tipoEspe, codEspe, mallaCurricular, codAlumno) {
    limpiarCampos(3);

    $.ajax({
        url: path + "notas/boletaDeNotas",
        type: "POST",
        data: {
            codLocal: codLocal,
            tipoEspe: tipoEspe,
            codEspe: codEspe,
            mallaCurricular: mallaCurricular,
            codAlumno: codAlumno,
            opcion: "periodos"
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.periodos != "vacio") {
                    var periodos = datos.periodos;
                    $("#periodo").append("<option value=\"\" selected disabled hidden></option>");
                    for (i = 0; i < periodos.length; i++) {
                        var periodo = periodos[i];
                        $("#periodo").append("<option value=\"" + periodo.id_periodo_academico + "\">" + periodo.id_periodo_academico + "</option>");
                    }
                } else {
                    mostrarMensaje("error", "ERROR", "No existen periodos matriculados que tengan registro de notas para el programa seleccionado");
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

function cargarCursos(codLocal, tipoEspe, codEspe, mallaCurricular, periodo, codAlumno) {
    limpiarCampos(3);

    $.ajax({
        url: path + "notas/boletaDeNotas",
        type: "POST",
        data: {
            codLocal: codLocal,
            tipoEspe: tipoEspe,
            codEspe: codEspe,
            mallaCurricular: mallaCurricular,
            periodo: periodo,
            codAlumno: codAlumno,
            opcion: "cursos"
        },
        beforeSend: function () {
            $("#modalLoaderTitle").html("Consultando datos...");
            $("#modalLoader").modal({backdrop: 'static', keyboard: false});
        },
        success: function (data) {
            //console.log(data);
            $("#modalLoader").modal("hide");
            var tbody = $("#tablaCursos tbody");
            var datos = JSON.parse(data);

            if (datos.respuesta == "success") {
                $("#divCursos").css("display", "block");
                if (datos.cursos != "vacio") {
                    var boletaNotas = datos.boletaNotasArray;

                    for (i = 0; i < boletaNotas.length; i++) {
                        var boletaNota = boletaNotas[i];
                        var color = colorNota(boletaNota.pf.trim());
                        var tr = "<tr>" +
                                "    <td class=\"celda-centrada\">" + (i + 1) + "</td>" +
                                "    <td class=\"celda-centrada\">" + boletaNota.codCiclo + "</td>" +
                                "    <td class=\"celda-centrada\">" + boletaNota.codCurso + "</td>" +
                                "    <td class=\"celda-izquierda\">" + boletaNota.descripcionCurso+"</td>" +
                                "    <td class=\"celda-centrada\">" + boletaNota.DescripcionTipoNota + "    </td>" +
                                "    <td class=\"celda-centrada\" " + color + " >" + boletaNota.pf.trim() + "</td>" +
                                "</tr>";
                        tbody.append(tr);

                    }

                    var trTotalAprobados = "<tr>" +
                                     "    <td colspan=\"3\" class=\"celda-centrada\" style=\"font-weight:bold;background: #cfeefd;color: #286090;\">TOTAL CURSOS APROBADOS: </td>" +
                                     "    <td colspan=\"3\" class=\"celda-izquierda\">" +datos.cantCAprobados+ "</td>" +
                                    "</tr>";  
                    tbody.append(trTotalAprobados);

                    var trTotalDesaprobados = "<tr>" +
                                     "    <td colspan=\"3\" class=\"celda-centrada\" style=\"font-weight:bold;background: #cfeefd;color: #286090;\">TOTAL CURSOS DESAPROBADOS: </td>" +
                                     "    <td colspan=\"3\" class=\"celda-izquierda\">" +datos.cantCDesaprobados+ "</td>" +
                                    "</tr>";   
                    tbody.append(trTotalDesaprobados); 
                    var trTotalPromedioPonderado = "<tr>" +
                                     "    <td colspan=\"3\" class=\"celda-centrada\" style=\"font-weight:bold;background: #cfeefd;color: #286090;\">PROMEDIO PONDERADO: </td>" +
                                     "    <td colspan=\"3\" class=\"celda-izquierda\">" +boletaNotas[0].proPonderado+ "</td>" +
                                    "</tr>";   
                    tbody.append(trTotalPromedioPonderado); 

                } else {
                    mostrarMensaje("error", "ERROR", "No existen cursos matriculados en el periodo seleccionado");
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

function colorNota(nota) {
    if (isNaN(nota) || nota == "") {
        return "";
    } else {
        if (isNaN(parseInt(nota))) {
            return "";
        } else {
            nota = parseInt(nota);
            if (nota < 0 || nota > 20) {
                return "";
            } else {
                if (nota < 13) {
                    return "style=\"color: red;\"";
                } else {
                    return "style=\"color: blue;\"";
                }
            }
        }
    }
}

function limpiarCampos(op) {
    switch (op) {
        case 1:
            $("#codAlumno").val("");
            $("#nombreAlumno").val("");
            $("#carrera").find('option').remove();
        case 2:
            $("#cod_local").val("");
            $("#tipo_espe").val("");
            $("#cod_espe").val("");
            $("#malla_curricular").val("");
            $("#periodo").find('option').remove();
        case 3:
            $("#divCursos").css("display", "none");
            $("#tablaCursos tbody").find('tr').remove();
            break;
    }
}


