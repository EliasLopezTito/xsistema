$(document).ready(function () {

    autocomplete();    

});

function autocomplete() {
    $("#docente").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "idiomas/controlDocentes",
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarDocente'
                },
                success: function (data) {
                    $("#docente").removeAttr("data-code");
                    $("#docente").next('i').removeClass('glyphicon-ok');
                    $("#docente").next('i').addClass('glyphicon-remove');
                    $("#docente").parent().removeClass('has-success');
                    $("#docente").parent().addClass('has-error');
                    let tbody = $("#tablaCursosProgramados tbody");
                    tbody.find('tr').remove();

                    $("#panel_notas").css("display", "none");
                    tbody = $("#tablaNotasProgramacion tbody");
                    tbody.find('tr').remove();
                    
                    let result = (!data.docentes) ? [{ vacio: true }] : data.docentes;
                    response(result);

                }
            });
        },
        minLength: 3,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {
                $("#docente").val(ui.item.cod_emp +" "+ui.item.nombre);
                $("#docente").attr('data-code', ui.item.cod_emp);
                $("#docente").next('i').removeClass('glyphicon-remove');
                $("#docente").next('i').addClass('glyphicon-ok');
                $("#docente").parent().removeClass('has-error');
                $("#docente").parent().addClass('has-success');
                mostrarProgramaciones();
                mostrarDatos(ui.item.Telefonos, ui.item.Correo);
            }
            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, item) {
            if (item.vacio) {
                return $("<li>")
                    .append("<div>No se encontraron resultados</div>")
                    .appendTo(ul);
            }
            return $("<li>")
                .append("<div>" + item.cod_emp + " - " + item.nombre + "</div>")
                .appendTo(ul);
        };

    $("#docente").focus();
}

document.addEventListener('click', (e) => {

    if (e.target.matches('#btnProgramacion')) {
        mostrarProgramaciones();
    }

    if (e.target.matches('#btnGrabarNotas')) {
        grabarNotasByProgramacion('#frmNotasDocente', 1);
    };

    if (e.target.matches('#btnImprimir')) {
        imprimirNotasByProgramacion("#frmNotasDocente", "pagantes");
    };

    if (e.target.matches('#btnImprimirNoPagantes')) {
        imprimirNotasByProgramacion("#frmNotasNoPagantesDocente", "nopagantes");
    };

});

document.addEventListener('change', (e) => {

    if (e.target.matches('#anioProg')) {
        mostrarProgramaciones();
    }

    if (e.target.matches('#mesProg')) {
        mostrarProgramaciones();
    }

})

function mostrarProgramaciones() {

    if ($("#docente").attr('data-code')) {
        
        verProgramaciones();
        $("#panel_notas").css("display", "none");        
        var tbody = $("#tablaNotasProgramacion tbody");
        tbody.find('tr').remove();
        
    } else {
        $("#docente").focus();
    }
    
}

function mostrarDatos(tel, correo) {
    $('#div-datos').show('300');
    $('#lbl-telefono').text(tel);
    $('#lbl-correo').text(correo);
}

function verProgramaciones() {

    let anioProg = $("#anioProg").val();
    let mesProg = $("#mesProg").val();
    let cod_emp = $("#docente").attr('data-code');

    let tbody = $("#tablaCursosProgramados tbody");
    tbody.find('tr').remove();

    $.ajax({
        url: path + "idiomas/controlDocentes",
        type: "POST",
        data: {
            anioProg: anioProg,
            mesProg: mesProg,
            cod_emp: cod_emp,
            opcion: "cursosProgramados"
        },
        beforeSend: function () {

            $('.text-loader').text('Consultando datos, por favor espere...');
            $("#modalLoader").modal();

            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("#cod_local").val("");
            $("#tipo_espe").val("");
            $("#cod_espe").val("");
            $("#ciclo").val("");
            $("#semestre").val("");
            $("#malla_curricular").val("");
            $("#codCursoM").val("");
            $("#aula").val("");
        },
        success: function (data) {

            $("#modalLoader").modal("hide");

            //console.log(data);

            $("#panel_cprogramados").css("display", "block");

            var datos = JSON.parse(data);

            if (datos.respuesta == "success") {

                if (datos.arrayProgramaciones != "vacio") {

                    var arrayProgramaciones = datos.arrayProgramaciones;

                    for (i = 0; i < arrayProgramaciones.length; i++) {
                        var programacion = arrayProgramaciones[i];

                        var tr = "<tr class=\"fila_programacion\" onclick=\"cargarAlumnosProgramacion(this,'" + programacion.ciclo + "','" + programacion.codTipoEspecialidad + "','" + programacion.codEspecialidad + "','" + programacion.codLocal + "','" + programacion.codCursoM + "','" + programacion.aula + "','" + programacion.semestre + "'," + anioProg + ",'" + mesProg + "','" + programacion.turno + "'); \">" +
                            "    <td class=\"celda-centrada\">" + programacion.tcar + "</td>" +
                            "    <td class=\"celda-centrada\">" + programacion.sede + "</td>" +
                            "    <td class=\"celda-centrada\">" + programacion.aula + "</td>" +
                            "    <td class=\"celda-centrada\">" + programacion.carrera + "</td>" +
                            "    <td class=\"celda-centrada\">" + programacion.curso + "</td>" +
                            "    <td class=\"celda-centrada\">" + programacion.turno + "</td>" +
                            "    <td class=\"celda-centrada\">" + programacion.ciclo + "</td>" +
                            "    <td class=\"celda-centrada\">" + programacion.nroalu + "</td>" +
                            "    <td class=\"celda-centrada\">" + programacion.codCursoM + "</td>" +
                            "</tr>";
                        tbody.append(tr);
                    }
                }

            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                Notiflix.Notify.Failure('El docente no tiene progrmaciones en el periodo seleccionado!');
                // mostrarMensaje("error", "ERROR", errores);
            }
        },
        complete: function () {
            $("#modalLoader").modal("hide");
            $("#modalCargarVoucher").modal("hide");
        }
    });

}

function cargarAlumnosProgramacion(elemento, ciclo, codTipoEspe, codEspecialidad, codlocal, codCursoM, aula, semestre, anio, mes, turno) {

    $(".fila_programacion").css("background-color", "white");

    $(elemento).css("background-color", "#3abfff");//pintando fila
    let codigoDocente = $("#docente").attr('data-code');

    $.ajax({
        url: path + "idiomas/controlDocentes",
        type: "POST",
        data: {
            ciclo: ciclo,
            codTipoEspe: codTipoEspe,
            codEspecialidad: codEspecialidad,
            codlocal: codlocal,
            codCursoM: codCursoM,
            aula: aula,
            anio: anio,
            mes: mes,
            semestre: semestre,
            codigoDocente: codigoDocente,
            turno: turno,
            opcion: "selectNotas"
        },
        beforeSend: function () {
            $('.text-loader').text('Consultando datos, por favor espere...');
            $("#modalLoader").modal();

            $("#cod_local").val("");
            $("#tipo_espe").val("");
            $("#cod_espe").val("");
            $("#ciclo").val("");
            $("#semestre").val("");
            $("#malla_curricular").val("");
            $("#codCursoM").val("");
            $("#aula").val("");
            $("#turno__").val("");
        },
        success: function (data) {

            let datos = JSON.parse(data);

            let tbody = $("#tablaNotasProgramacion tbody");
            tbody.find('tr').remove();            

            if (datos.respuesta == "success") {

                $("#panel_notas").css("display", "block");                

                if (datos.arrayNotasProgramacion.length > 0) {

                    $("#cod_local").val(codlocal);
                    $("#tipo_espe").val(codTipoEspe);
                    $("#cod_espe").val(codEspecialidad);
                    $("#ciclo").val(ciclo);
                    $("#semestre").val(semestre);
                    $("#malla_curricular").val(datos.mallaCurricular);
                    $("#codCursoM").val(codCursoM);
                    $("#aula").val(aula);
                    $("#turno__").val(turno);

                    var arrayNotasProgramacion = datos.arrayNotasProgramacion;

                    for (i = 0; i < arrayNotasProgramacion.length; i++) {

                        var arrayNotaProgramacion = arrayNotasProgramacion[i];

                        var tr = "<tr>" +
                            "    <input type=\"hidden\" name=\"tipo_grabado[]\" value=\"" + arrayNotaProgramacion.tipo_grabado + "\">" +
                            "    <input type=\"hidden\" name=\"id_NotaD[]\" value=\"" + arrayNotaProgramacion.id_NotaDocente + "\">" +
                            "    <input type=\"hidden\" name=\"cod_alumno[]\" value=\"" + arrayNotaProgramacion.cod_alumno + "\">" +
                            "    <td class=\"celda-centrada\">" + (i + 1) + "</td>" +
                            "    <td class=\"celda-centrada\">" + arrayNotaProgramacion.cod_alumno + "</td>" +
                            "    <td class=\"celda-izquierda\">" + arrayNotaProgramacion.NombreCompletoAlumno + " <span style=\"color:red;font-weight:bold;float:right;\"></span></td>" +
                            // "    <td class=\"celda-centrada\" >" +
                            // "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ap1[]\" disabled value=\"" + arrayNotaProgramacion.ap1.trim() + "\" />" +
                            // "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ed1[]\" value=\"" + arrayNotaProgramacion.ed1.trim() + "\" />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ac1[]\" value=\"" + arrayNotaProgramacion.ac1.trim() + "\"  />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ep[]\" value=\"" + arrayNotaProgramacion.ep.trim() + "\" />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;background-color:rgb(205, 237, 245);text-transform: uppercase;\" name=\"pr1[]\" value=\"" + arrayNotaProgramacion.pr1 + "\"  />" +
                            "    </td>" +
                            // "    <td class=\"celda-centrada\" >" +
                            // "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ap2[]\" disabled value=\"" + arrayNotaProgramacion.ap2.trim() + "\"  />" +
                            // "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ed2[]\" value=\"" + arrayNotaProgramacion.ed2.trim() + "\"  />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ac2[]\" value=\"" + arrayNotaProgramacion.ac2.trim() + "\"  />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"ef[]\" value=\"" + arrayNotaProgramacion.ef.trim() + "\"  />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;background-color:rgb(205, 237, 245);text-transform: uppercase;\" name=\"pr2[]\" value=\"" + arrayNotaProgramacion.pr2 + "\"   />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);validarPromedioFinal(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;background-color:#fff2c8fc;text-transform: uppercase;\" name=\"pr[]\" value=\"" + arrayNotaProgramacion.pr.trim() + "\"   />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);validarPromedioFinal(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"er[]\" value=\"" + arrayNotaProgramacion.er.trim() + "\"   />" +
                            "    </td>" +                            
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;text-transform: uppercase;\" name=\"pfinal[]\" value=\"" + arrayNotaProgramacion.pfinal.trim() + "\"   />" +
                            "    </td>" +
                            "</tr>";
                        tbody.append(tr);
                    }

                    pintarNotasProgramacion();
                }                

            } else {

                $("#panel_notas").css("display", "none");                

                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        },
        complete: function () {
            $("#modalLoader").modal("hide");
            $("#modalCargarVoucher").modal("hide");
        }
    });

}

function pintarNotasProgramacion() {
    $("#tablaNotasProgramacion tbody").find("tr").each(function () {
        var nroText = $(this).find("input:text").length;
        var i = 0;
        for (i = 0; i < nroText; i++) {
            validarNota($(this).find("input:text").eq(i));
        }
    });

}

function validarNota(text) {

    var nota = $(text).val().trim();

    $(text).css({ "color": "black" });

    if (nota == 'NSP' || nota == 'nsp') {

        $(text).css({ "color": "red" });
        $(text).val("NSP");

    } else if (isNaN(nota) || nota == "") {

        $(text).val("");

    } else {

        if (isNaN(parseInt(nota))) {

            $(text).val("");

        } else {

            nota = parseInt(nota);
            if (nota < 0 || nota > 20) {
                $(text).val("");
            } else {
                if (nota >= 0 && nota <= 9) {
                    $(text).val("0" + nota.toString());
                } else {
                    $(text).val(nota);
                }
                if (nota < 11) {
                    $(text).css({ "color": "red" });
                } else {
                    $(text).css({ "color": "blue" });
                }
            }
        }
    }
}

function validarPromedioFinal(elemento) {

    var pr = $(elemento).parent().parent().find("input:text").eq(8).val();
    var ea = $(elemento).parent().parent().find("input:text").eq(9).val();

    if (pr.toUpperCase() !== "NSP" && pr !== "" && ea.toUpperCase() !== "NSP" && ea !== "") {
        var pfinal = ((parseInt(ea) + parseInt(pr)) / 2).toFixed(0);
        $(elemento).parent().parent().find("input:text").eq(10).val(pfinal);
    } else {
        if (pr.toUpperCase() !== "NSP" && pr !== "") {
            $(elemento).parent().parent().find("input:text").eq(10).val(pr);
        } else {
            $(elemento).parent().parent().find("input:text").eq(10).val("");
        }

    }

    validarNota($(elemento).parent().parent().find("input:text").eq(10));

}

function obtenerPromedio1(elemento) {

    var ed1 = ($(elemento).parent().parent().find("input:text").eq(0).val()).trim();
    var ep = ($(elemento).parent().parent().find("input:text").eq(1).val()).trim();
    var ac1 = ($(elemento).parent().parent().find("input:text").eq(2).val()).trim();
    //var ac1 = ($(elemento).parent().parent().find("input:text").eq(3).val()).trim();
    const ep_ = (($(elemento).parent().parent().find("input:text").eq(3).val()).trim());
    const ef_ = (($(elemento).parent().parent().find("input:text").eq(7).val()).trim());

    if (ac1 != "" && ed1 != "" && ep != "") {

        if (ac1 == "") { ac1 = 0; }
        if (ed1 == "") { ed1 = 0; }
        if (ep == "") { ep = 0; }
        //if (ac1 == "") { ac1 = 0; }

        //var pr1 = ((parseInt(ap1) + parseInt(ed1) + parseInt(ep) + parseInt(ac1)) / 4).toFixed(0);
        var pr1 = ((parseInt(ed1) + parseInt(ep) + parseInt(ac1)) / 3).toFixed(0);

        $(elemento).parent().parent().find("input:text").eq(3).val(pr1);

        validarNota($(elemento).parent().parent().find("input:text").eq(3));

        //obteniendo promedio general
        var pr1 = ($(elemento).parent().parent().find("input:text").eq(3).val()).trim();
        var pr2 = ($(elemento).parent().parent().find("input:text").eq(7).val()).trim();

        if (pr1 != "" && pr2 != "" && pr1 != "NSP" && pr2 != "NSP" && pr1 != "nsp" && pr2 != "nsp") {

            var pr = ((parseInt(pr1) + parseInt(pr2)) / 2).toFixed(0);
            $(elemento).parent().parent().find("input:text").eq(8).val(pr);
            validarNota($(elemento).parent().parent().find("input:text").eq(8));

            var ea = $(elemento).parent().parent().find("input:text").eq(9).val();
            if (ea.toUpperCase() !== "NSP" && ea !== "") {
                var pfinal = ((parseInt(ea) + parseInt(pr)) / 2).toFixed(0);
                $(elemento).parent().parent().find("input:text").eq(10).val(pfinal);
            } else {
                $(elemento).parent().parent().find("input:text").eq(10).val(pr);
            }

            validarNota($(elemento).parent().parent().find("input:text").eq(10));

        } else {

            $(elemento).parent().parent().find("input:text").eq(8).val("");
            $(elemento).parent().parent().find("input:text").eq(10).val("");

        }

        if ((ep_ === "nsp" || ep_ === "NSP") && (ef_ === "nsp" || ef_ === "NSP")) {

            $(elemento).parent().parent().find("input:text").eq(8).val("NSP").css({ "color": "red" });

        }

    } else {

        $(elemento).parent().parent().find("input:text").eq(8).val("");

        if ((ep_ === "nsp" || ep_ === "NSP") && (ef_ === "nsp" || ef_ === "NSP")) {

            $(elemento).parent().parent().find("input:text").eq(8).val("NSP").css({ "color": "red" });

        }

    }

}

function obtenerPromedio2(elemento) {

    var ed2 = ($(elemento).parent().parent().find("input:text").eq(4).val()).trim();
    var ef = ($(elemento).parent().parent().find("input:text").eq(5).val()).trim();
    var ac2 = ($(elemento).parent().parent().find("input:text").eq(6).val()).trim();
    //var ac2 = ($(elemento).parent().parent().find("input:text").eq(8).val()).trim();
    const ep_ = (($(elemento).parent().parent().find("input:text").eq(3).val()).trim());
    const ef_ = (($(elemento).parent().parent().find("input:text").eq(7).val()).trim());
    //console.log(ap2 + ' ' + ed2 + ' ' + ef + ' '+ ac2);

    if (ed2 != "" && ef != "" && ac2 != "") {
        //if (ap2 == "") { ap2 = 0; }
        if (ed2 == "") { ed2 = 0; }
        if (ef == "") { ef = 0; }
        if (ac2 == "") { ac2 = 0; }

        //var pr2 = ((parseInt(ap2) + parseInt(ed2) + parseInt(ef) + parseInt(ac2)) / 4).toFixed(0);
        var pr2 = ((parseInt(ed2) + parseInt(ef) + parseInt(ac2)) / 3).toFixed(0);

        $(elemento).parent().parent().find("input:text").eq(7).val(pr2);

        validarNota($(elemento).parent().parent().find("input:text").eq(7));

        var pr1 = ($(elemento).parent().parent().find("input:text").eq(3).val()).trim();
        var pr2 = ($(elemento).parent().parent().find("input:text").eq(7).val()).trim();

        if (pr1 != "" && pr2 != "" && pr1 != "NSP" && pr2 != "NSP" && pr1 != "nsp" && pr2 != "nsp") {

            var pr = ((parseInt(pr1) + parseInt(pr2)) / 2).toFixed(0);
            $(elemento).parent().parent().find("input:text").eq(8).val(pr);
            validarNota($(elemento).parent().parent().find("input:text").eq(8));

            var ea = $(elemento).parent().parent().find("input:text").eq(9).val();
            if (ea.toUpperCase() !== "NSP" && ea !== "") {
                var pfinal = ((parseInt(ea) + parseInt(pr)) / 2).toFixed(0);
                $(elemento).parent().parent().find("input:text").eq(10).val(pfinal);
            } else {
                $(elemento).parent().parent().find("input:text").eq(10).val(pr);
            }

            validarNota($(elemento).parent().parent().find("input:text").eq(10));

        } else {
            $(elemento).parent().parent().find("input:text").eq(8).val("");
            $(elemento).parent().parent().find("input:text").eq(10).val("");
        }

        if ((ep_ === "nsp" || ep_ === "NSP") && (ef_ === "nsp" || ef_ === "NSP")) {
            $(elemento).parent().parent().find("input:text").eq(8).val("NSP").css({ "color": "red" });
        }


    } else {

        $(elemento).parent().parent().find("input:text").eq(8).val("");

        if ((ep_ === "nsp" || ep_ === "NSP") && (ef_ === "nsp" || ef_ === "NSP")) {
            $(elemento).parent().parent().find("input:text").eq(8).val("NSP").css({ "color": "red" });
        }

    }
}

function grabarNotasByProgramacion(form, estado) {

    $("input:text").removeAttr("disabled");

    var mesProg = $("#mesProg").val();
    var anioProg = $("#anioProg").val();
    let codigoDocente = $("#docente").attr('data-code');

    var form = $(form).serializeArray();
    form.push({ name: "opcion", value: "grabarNotasDocente" });
    form.push({ name: "codigoDocente", value: codigoDocente });
    form.push({ name: "mesProg", value: mesProg });
    form.push({ name: "anioProg", value: anioProg });
    form.push({ name: "estado", value: estado });

    $.ajax({
        url: path + "Idiomas/controlDocentes",
        type: "POST",
        data: $.param(form),
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                //desactivarCamposNotas(true);
                mostrarMensaje("exito", "Notas Guardadas", "Las notas fueron guardadas correctamente");
                verProgramaciones();

                $("#panel_leyenda").css("display", "none");
                $("#panel_notas").css("display", "none");
                $("#panel_notas_no_pagantes").css("display", "none");

                var tbody = $("#tablaNotasProgramacion tbody");
                tbody.find('tr').remove();

                var tbody2 = $("#tablaNotasNoPagantesProgramacion tbody");
                tbody2.find('tr').remove();

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

function imprimirNotasByProgramacion(form, tipopdf) {

    var anioProg = $("#anioProg").val();
    var mesProg = $("#mesProg").val();
    let codigoDocente = $("#docente").attr('data-code');

    var form = $(form).serializeArray();

    form.push({ name: "opcion", value: "imprimirNotasProgramacion" });
    form.push({ name: "anio", value: anioProg });
    form.push({ name: "mes", value: mesProg });
    form.push({ name: "tipoPdf", value: tipopdf });
    form.push({ name: "codigoDocente", value: codigoDocente });

    $.ajax({
        url: path + "Idiomas/controlDocentes",
        type: "POST",
        data: $.param(form),
        beforeSend: function () {
            $("#modalLoaderTitle").html("Imprimiendo Notas de la Programación seleccionada...");
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
                a.attr("download", "registro_evaluacion.pdf");
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