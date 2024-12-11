$(document).ready(function () {

    Notiflix.Loading.Init({
        clickToClose: true
    });
    
    bloquearDesbloquear(1);
    $("#codAlumno").attr("readonly", true);
    $("#dni").attr("readonly", true);
    $("#ce").attr("readonly", true);
});

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

// $("#idConsultarReniec").click(function () {
//     consultarApiReniec();
// });


// function consultarApiReniec(){
//     const dni = $("#dni").val();
//     console.log("dni", dni)
//     $.ajax({
//         url: path + "notas/actualizarDatosDni",
//         type: "POST",
//         data: {
//             dni: dni,
//             opcion: 'consultarDNIApi'
//         },
//         beforeSend: function () {
//             Notiflix.Loading.Hourglass('Cargando...');
//         },
//         success: function (data) {
//             const datos = JSON.parse(data);
//             $("#NotiflixLoadingWrap").trigger("click");
//             console.log("response", datos);
//             if (datos.data !== null) {
//                 if (datos.data.success === true) {

//                     resp = datos.data.data
//                     console.log("resp", resp);
//                     $("#idDni").val(resp.numero); 
//                     $("#idDni").css("border", "1px solid green");
//                     $("#idNombres").val(resp.nombres);
//                     $("#idApellidos").val(resp.apellido_paterno + " " + resp.apellido_materno);
//                     resp.sexo != null ? $("#idSexo").val(resp.sexo) : $("#idSexo").val("")
//                     resp.fecha_nacimiento != null ? $("#idFechaNac").val(resp.fecha_nacimiento) : $("#idFechaNac").val("")
//                     $("#idDepartamento").val(resp.departamento);
//                     $("#idProvincia").val(resp.provincia);
//                     $("#idDistrito").val(resp.distrito);

//                     if(resp.nombres.trim() != $("#nombres").val().trim()){
//                         $("#idNombres").css("border", "1px solid blue");
//                     }else{
//                         $("#idNombres").css("border", "1px solid green");
//                     }
                    
//                     if($("#idApellidos").val().trim() != $("#apellidos").val().trim()){
//                         $("#idApellidos").css("border", "1px solid blue");
//                     }else{
//                         $("#idApellidos").css("border", "1px solid green");
//                     }

//                 } else {
//                     Notiflix.Notify.Failure("EL DNI NO EXISTE")
//                 }
//             } else {
//                 console.log("CONSULTELO MAS TARDE");
//             }


//         }
//     });
// }

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
            $("#idConsultarReniec").attr("disabled", true);
            band = true;
            break;
        case 2: //select
            $("#btnBuscar").attr("disabled", false);
            $("#btnEditar").attr("disabled", false);
            $("#btnGrabar").attr("disabled", true);
            $("#btnCancelar").attr("disabled", true);
            $("#dni").attr("readonly", true);
            $("#ce").attr("readonly", true);
            $("#idConsultarReniec").attr("disabled", false);
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

function seleccionarAlumno(tr) {
    var codAlumno = $(tr).find("td").eq(0).html();

    $.ajax({
        url: path + "notas/alumnos",
        type: "POST",
        data: {
            codAlumno: codAlumno,
            opcion: "seleccionar"
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
                    //if (alumno.dni.trim() != "" || alumno.dni != null) {
                    $("#dni").val(alumno.dni.trim());
                        //consultarApiReniec();
                    // }else{
                    //     Notiflix.Notify.Warning('Este alumno no tiene DNI registrado');
                    //     $("#dni").val(alumno.dni.trim());
                    // }
                    
                    $("#ce").val(alumno.CE);
                    $("#fechaNac").val(alumno.fecha_naci);
                    $("#edad").val(alumno.edad);
                    $("#sexo").val(alumno.sexo);
                    $("#telefono").val(alumno.telefono);
                    $("#fechaMat").val(alumno.fecha_matricula);
                    $("#direccion").val(alumno.domicilio);
                    $("#distrito").val(alumno.distrito);
                    $("#email").val(alumno.email);
                    if (datos.resfoto === true) {
                        $("#foto").attr({ "src": "https://www.istalcursos.edu.pe/intranet/assets/files/FotoPerfil/" + datos.foto.NombreArchivo });
                    } else {
                        $("#foto").attr({ "src": path + datos.foto });
                    }

                    bloquearDesbloquear(2);
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

