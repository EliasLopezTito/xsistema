$(document).ready(function () {
    autocomplete();
    bloquearDesbloquear(1);
    $("#codAlumno").attr("readonly", true);
    $("#dni").attr("readonly", true);
    $("#ce").attr("readonly", true);
});

function autocomplete() {

    $("#alumno").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "programacion/consultarAlumnos",
                type: 'post',
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarAlumnos'
                },
                success: function (data) {

                    $("#alumno").attr("codigo", "");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');

                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos;
                    response(result);

                }
            });
        },
        minLength: 3,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {

                $("#alumno").val(ui.item.codigo + " - " + ui.item.nombre);
                $("#alumno").attr('codigo', ui.item.codigo);
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');
                seleccionarAlumno(ui.item.codigo.trim());

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
                .append("<div><b>" + item.codigo + "</b> - " + item.nombre + "</div>")
                .appendTo(ul);
        };
    $("#alumno").focus();

}

$("#alumno").keyup(function () {
    if ($(this).val().length < 1) {
        $("#alumno").attr("codigo", "");
        $("#alumno").next('i').removeClass('glyphicon-ok');
        $("#alumno").next('i').addClass('glyphicon-remove');
        $("#alumno").parent().removeClass('has-success');
        $("#alumno").parent().addClass('has-error');
    }
})

$("#apellidos").keydown(function (event) {
    if (event.keyCode == 13) {
        console.log("enviar");
    }
});

$("#btnBuscar").click(function () {
    $("#codigoBus").val("");
    $("#apellidosNombresBus").val("");
    $("#tablaModalAlumno tbody").find('tr').remove();
    $("#codigoBus").focus();
    $("#modalAlumnos").modal({ backdrop: 'static', keyboard: false });
});

$("#btnEditar").click(function () {
    bloquearDesbloquear(3);
});

$("#btnCancelar").click(function () {
    bloquearDesbloquear(2);
});

$("#btnGrabar").click(function () {
    var form = $("#frmAlumno").serializeArray();
    form.push({ name: "opcion", value: "actualizar" });
    $.ajax({
        url: path + "notas/alumnos",
        type: "POST",
        data: $.param(form),
        success: function (data) {
            console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                bloquearDesbloquear(2);
                Notiflix.Notify.Success("OPERACIÓN EXITOSA")
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

function bloquearDesbloquear(op) {
    var band = true;
    switch (op) {
        case 1: //inicio
            $("#btnBuscar").attr("disabled", false);
            $("#btnEditar").attr("disabled", true);
            $("#btnGrabar").attr("disabled", true);
            $("#btnCancelar").attr("disabled", true);
            $("#dni").attr("readonly", true);
            $("#ce").attr("readonly", true);
            band = true;
            break;
        case 2: //select
            $("#btnBuscar").attr("disabled", false);
            $("#btnEditar").attr("disabled", false);
            $("#btnGrabar").attr("disabled", true);
            $("#btnCancelar").attr("disabled", true);
            $("#dni").attr("readonly", true);
            $("#ce").attr("readonly", true);
            band = true;
            break;
        case 3: //editar
            $("#btnBuscar").attr("disabled", true);
            $("#btnEditar").attr("disabled", true);
            $("#btnGrabar").attr("disabled", false);
            $("#btnCancelar").attr("disabled", false);

            if ($("#tipoDoc").val() === "DNI") {
                $("#dni").attr("readonly", false);
                $("#ce").attr("readonly", true);
            } else {
                $("#dni").attr("readonly", true);
                $("#ce").attr("readonly", false);
            }

            band = false;
            break;
    }

    $("#apellidos").attr("readonly", band);
    $("#nombres").attr("readonly", band);
    $("#tipoDoc").attr("disabled", band);
    $("#fechaNac").attr("readonly", band);
    $("#edad").attr("readonly", band);
    $("#sexo").attr("disabled", band);
    $("#telefono").attr("readonly", band);
    $("#fechaMat").attr("readonly", band);
    $("#direccion").attr("readonly", band);
    $("#distrito").attr("readonly", band);
    $("#email").attr("readonly", band);
}

$("#tipoDoc").click(function () {

    if ($(this).val() === "DNI") {

        $("#dni").attr("readonly", false);
        $("#ce").attr("readonly", true);
        $("#ce").val("");

    } else {

        $("#dni").attr("readonly", true);
        $("#ce").attr("readonly", false);
        $("#dni").val("");

    }

})

function buscarAlumnoMatriculado() {
    var codigoBus = $("#codigoBus").val().trim();
    var apellidosNombresBus = $("#apellidosNombresBus").val().trim();

    $.ajax({
        url: path + "notas/alumnos",
        type: "POST",
        data: {
            codigoBus: codigoBus,
            apellidosNombresBus: apellidosNombresBus,
            opcion: "buscar"
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

function seleccionarAlumno(codAlumno) {
    //var codAlumno = $(tr).find("td").eq(0).html();    
    $.ajax({
        url: path + "notas/alumnos",
        type: "POST",
        data: {
            codAlumno: codAlumno,
            opcion: "seleccionar"
        },
        beforeSend: function () {
            $("#btnDescargarQr").attr("disabled", true);
        },
        success: function (data) {
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#modalAlumnos").modal("hide");
                if (datos.alumno != "vacio") {
                    var alumno = datos.alumno[0];

                    if (alumno.TipDoc === "DNI") {
                        $("#tipoDoc").html("<option value='DNI' selected>DNI</option><option value='CARNET DE EXTRANJERIA'>CARNET DE EXTRANJERÍA</option>");
                    } else {
                        $("#tipoDoc").html("<option value='CARNET DE EXTRANJERIA' selected>CARNET DE EXTRANJERÍA</option><option value='DNI'>DNI</option>");
                    }

                    $("#codAlumno").val(alumno.cod_alumno.trim());
                    $("#apellidos").val(alumno.apell_alumno.trim());
                    $("#nombres").val(alumno.nombre_alumno.trim());
                    $("#dni").val(alumno.dni);
                    $("#ce").val(alumno.CE);
                    $("#fechaNac").val(alumno.fecha_naci);
                    $("#edad").val(alumno.edad);
                    $("#sexo").val(alumno.sexo);
                    $("#telefono").val(alumno.telefono);
                    $("#fechaMat").val(alumno.fecha_matricula);
                    $("#direccion").val(alumno.domicilio);
                    $("#distrito").val(alumno.distrito);
                    $("#email").val(alumno.email);

                    //$("#btnDescargarQr").attr("disabled",false);
                    //$("#btnDescargarQr").prop("href","https://www.istalcursos.edu.pe/intranet/assets/temp-qr/"+alumno.cod_alumno.trim()+".png");
                    //$("#btnDescargarQr").prop("download", alumno.cod_alumno.trim() + "-qr.png");

                    if (datos.resfoto === true) {
                        $("#foto").attr({ "src": "https://www.istalcursos.edu.pe/intranet/assets/files/FotoPerfil/" + datos.foto.NombreArchivo });
                    } else {
                        $("#foto").attr({ "src": path + datos.foto });
                    }

                    bloquearDesbloquear(2);

                    generarQr(alumno.cod_alumno.trim());

                } else {

                    $("#btnDescargarQr").attr("disabled", true);
                    //$("#btnDescargarQr").prop("href","#");
                    //$("#btnDescargarQr").prop("download","");

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

function generarQr(codigo) {
    $.ajax({
        url: path + "estudiante/crearQr",
        type: "POST",
        dataType: "JSON",
        data: {
            codigo: codigo,
        },
        success: function (response) {

            $("#btnDescargarQr").attr("disabled", false);
            $("#btnDescargarQr").prop("download", codigo.trim() + "-qr.png");

        }
    });
}

async function downloadImage(imageSrc, codigo) {
    const image = await fetch(imageSrc)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
    const link = document.createElement('a')
    link.href = imageURL
    link.download = codigo + '.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}