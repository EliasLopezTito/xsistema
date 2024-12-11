$(document).ready(function () {
    cargarInstituciones(true);
    $("#btnImprimirNomina").attr("disabled", true);

    $("#institucion").change(function () {
        borrarResultado();
        cargarTipoEspecialidades(true);
    });

    $("#tipoEspecialidad").change(function () {
        borrarResultado();
        cargarEspecialidades(true);
    });

    $("#especialidad").change(function () {
        borrarResultado();
        cargarMallaCurriculares(true);
    });

    $("#periodo").change(function () {
        borrarResultado();
    });

    $("#sede").change(function () {
        borrarResultado();
    });

    $("#mallaCurricular").change(function () {
        borrarResultado();
    });

    $("#turno").change(function () {
        borrarResultado();
    });

    $("#ciclo").change(function () {
        borrarResultado();
    });

    $("#seccion").change(function () {
        borrarResultado();
    });

    /*$("#pagina").change(function () {
        if ($("#pagina").val() == 2) {
            $("#divFecha").css("display", "block");
        } else {
            $("#divFecha").css("display", "none");
        }
    });*/

    $("#cbxBorrador").change(function()
    {

        if($("#cbxBorrador").prop("checked"))
        {//si se selecciona el borrador

            $("#pagina").val(1);//seleccionando primera hoja
            $("#pagina option[value='2']").attr("disabled",""); //deshabilitando segunda hoja

        }else
        {
            $("#pagina option[value='2']").removeAttr("disabled"); //deshabilitando segunda hoja
        }
    });
});

$("#btnMostrarMatriculados").click(function () {
    cargarAlumnosMatriculados();
    $("#btnImprimirNomina").attr("disabled", false);
});

$("#btnImprimirNomina").click(function () {
    var form = $("#frmNomina").serializeArray();
    form.push({name: "opcion", value: "imprimir"});
    $.ajax({
        url: path + "notas/nominas",
        type: "POST",
        data: $.param(form),
        beforeSend: function () {
            $("#modalLoaderTitle").html("Imprimiendo Nomina...");
            $("#modalLoader").modal({backdrop: 'static', keyboard: false});
        },
        success: function (data) {
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
});

function borrarResultado() {
    $("#btnImprimirNomina").attr("disabled", true);
    var tbody = $("#tablaMatriculados tbody");
    tbody.find('tr').remove();
    $("#nroAlumnos").html("-");
}

function cargarAlumnosMatriculados() {
    var sede = $("#sede").val();
    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();
    var especialidad = $("#especialidad").val();
    var mallaCurricular = $("#mallaCurricular").val();
    var periodo = $("#periodo").val();
    var turno = $("#turno").val();
    var ciclo = $("#ciclo").val();
    var seccion = $("#seccion").val();

    $.ajax({
        //url: path + "notas/getAlumnosMatriculadosEnUnaSeccion",
        url: path + "notas/nominas",
        type: "POST",
        data: {
            sede: sede,
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad,
            especialidad: especialidad,
            mallaCurricular: mallaCurricular,
            periodo: periodo,
            turno: turno,
            ciclo: ciclo,
            seccion: seccion,
            opcion: "vista"
        },
        beforeSend: function(){
            $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete: function(){
            $("#modalLoader").modal("hide");
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                var tbody = $("#tablaMatriculados tbody");
                tbody.find('tr').remove();
                if (datos.alumnos != "vacio") {
                    var alumnos = datos.alumnos;
                    for (i = 0; i < alumnos.length; i++) {
                        var alumno = alumnos[i];
                        var fila = "<tr>" +
                                "<td class=\"celda-centrada\">" + (i + 1) + "</td>" +
                                "<td class=\"celda-centrada\">" + alumno.cod_alumno + "</td>" +
                                "<td class=\"celda-centrada\">" + alumno.dni + "</td>" +
                                "<td>" + alumno.apellidos_nombres + "</td>" +
                                "<td class=\"celda-centrada\">" + alumno.sexo + "</td>" +
                                "<td class=\"celda-centrada\">" + alumno.edad + "</td>" +
                                "</tr>";
                        tbody.append(fila);
                    }
                    var nroAlumnos = $("#tablaMatriculados > tbody > tr").length;
                    $("#nroAlumnos").html(nroAlumnos);
                } else {
                    $("#nroAlumnos").html("0");
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

