validarPermisosXUsuariosNuevo()

$("#btnGrabarM").click(function () {
    var periodo = $("#periodoM").val();
    var inicio = $("#inicioM").val();
    var termino = $("#terminoM").val();
    var fechaNomina = $("#fechaNominaM").val();
    var fechaActa = $("#fechaActaM").val();
    var opcion = $("#opcion").val();

    $.ajax({
        url: path + "notas/periodosAcademicos",
        type: "POST",
        data: {
            periodo: periodo,
            inicio: inicio,
            termino: termino,
            fechaNomina: fechaNomina,
            fechaActa: fechaActa,
            opcion: opcion
        },
        success: function (data) {
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#modalPeriodo").modal("hide");
                location.reload();
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
    var periodo = $("#periodoD").val();
    $.ajax({
        url: path + "notas/periodosAcademicos",
        type: "POST",
        data: {
            periodo: periodo,
            opcion: "delete"
        },
        success: function (data) {
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#modalMensaje").modal("hide");
                location.reload();
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

$('#btnBuscar').click(function () {
    cargarPeriodos()
})

function cargarPeriodos() {
    var periodo = $("#periodo").val();
    if(periodo != null){
        var tbody = $("#tablaPeriodos tbody");
        tbody.find('tr').remove();
        $.ajax({
            url: path + "notas/periodosAcademicos",
            type: "POST",
            data: {
                periodo: periodo,
                opcion: "select"
            },
            success: function(data){
                
                var datos = JSON.parse(data);
                console.log("data", datos);
                if(datos.respuesta=="success"){
                    periodos = datos.periodos
                    if(periodos != "vacio"){
                        periodos.forEach(element => {                        
                            var tr = "<tr>" + 
                                        "<td class=\"celda-centrada\">" + element.id_periodo_academico + "</td>" +
                                        "<td class=\"celda-centrada\">" + element.inicio_periodo.split("-")[2] +  " - " +element.inicio_periodo.split("-")[1] +  " - " +element.inicio_periodo.split("-")[0] + "</td>" +
                                        "<td class=\"celda-centrada\">" + element.fin_periodo.split("-")[2] +  " - " +element.fin_periodo.split("-")[1] +  " - " +element.fin_periodo.split("-")[0]  + "</td>" +
                                        "<td class=\"celda-centrada\">" + element.fecha_nomina.split("-")[2] +  " - " +element.fecha_nomina.split("-")[1] +  " - " +element.fecha_nomina.split("-")[0] + "</td>" +
                                        "<td class=\"celda-centrada\">" + element.fecha_acta.split("-")[2] +  " - " +element.fecha_acta.split("-")[1] +  " - " +element.fecha_acta.split("-")[0] + "</td>" +
                                        "<td class=\"celda-centrada\">" +
                                        "    <button class=\"btn boton-tabla boton-verde boton_editar\" type=\"button\" onclick=\"editarPeriodo(this);\" title=\"Editar Periodo\"><span class=\"icon-pencil\"></span></button>" +
                                        "    <button class=\"btn boton-tabla boton-rojo boton_eliminar\" type=\"button\" onclick=\"eliminarPeriodo(this);\" title=\"Eliminar Periodo\"><span class=\"icon-bin\"></span></button>" +
                                        "</td>"
                                tbody.append(tr);
                        });
                    }
                    validarPermisosXUsuariosEditar()
                    validarPermisosXUsuariosEliminar()
                }else{
                    mostrarMensaje("error","ERROR",datos.errores);
                }
            }
        });
    }
}

function validarPermisosXUsuariosEliminar(){
    $.ajax({
        url: path + "notas/periodosAcademicos",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "validar",
            tipo: 3,
            ruta: "notas/periodosAcademicos"  
        },
        success: function(response) {
            console.log(response)
            if (response.respuesta === "success" && response.validarUsuario === "SI") {
                $(".boton_eliminar").attr('disabled', false);
            } else {
                $(".boton_eliminar").attr('disabled', true);
            }
        },
        error: function() {
            Notiflix.Report.Failure("ERROR","Ocurrió un error al validar los permisos. Por favor, intenta de nuevo.", "Cerrar");
        }
    });
}

function validarPermisosXUsuariosEditar(){
    $.ajax({
        url: path + "notas/periodosAcademicos",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "validar",
            tipo: 2,
            ruta: "notas/periodosAcademicos"  
        },
        success: function(response) {
            console.log(response)
            if (response.respuesta === "success" && response.validarUsuario === "SI") {
                $(".boton_editar").attr('disabled', false);
            } else {
                $(".boton_editar").attr('disabled', true);
            }
        },
        error: function() {
            Notiflix.Report.Failure("ERROR","Ocurrió un error al validar los permisos. Por favor, intenta de nuevo.", "Cerrar");
        }
    });
}

function validarPermisosXUsuariosNuevo(){
    $.ajax({
        url: path + "notas/periodosAcademicos",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "validar",
            tipo: 1,
            ruta: "notas/periodosAcademicos"  
        },
        success: function(response) {
            console.log(response)
            if (response.respuesta === "success" && response.validarUsuario === "SI") {
                $("#btnNuevo").attr('disabled', false);
            } else {
                $("#btnNuevo").attr('disabled', true);
            }
        },
        error: function() {
            Notiflix.Report.Failure("ERROR","Ocurrió un error al validar los permisos. Por favor, intenta de nuevo.", "Cerrar");
        }
    });
}

function nuevoPeriodo(){
    // $("#periodoM").val("");
    // $("#inicioM").val("");
    // $("#terminoM").val("");
    // $("#fechaNominaM").val("");
    // $("#fechaActaM").val("");
    $("#opcion").val("create");
    $("#periodoM").attr("disabled", false);
    $("#periodoM").focus();
    $("#tituloModal").html("Nuevo Periodo");
    $("#modalPeriodo").modal({backdrop: 'static', keyboard: false});
}

function eliminarPeriodo(btn) {
    var periodo = $(btn).parent().parent().find("td").eq(0).html();
    $("#periodoD").val(periodo);
    var mensaje = "Seguro de eliminar el periodo: " + periodo;
    mostrarMensaje("confirmacion", "CONFIRMAR", mensaje);
}

function editarPeriodo(btn) {
    $("#periodoM").val($(btn).parent().parent().find("td").eq(0).html());
    $("#inicioM").val($(btn).parent().parent().find("td").eq(1).html());
    $("#terminoM").val($(btn).parent().parent().find("td").eq(2).html());
    $("#fechaNominaM").val($(btn).parent().parent().find("td").eq(3).html());
    $("#fechaActaM").val($(btn).parent().parent().find("td").eq(4).html());
    $("#opcion").val("update");
    $("#periodoM").attr("disabled", true);
    $("#inicioM").focus();
    $("#tituloModal").html("Editar Periodo");
    $("#modalPeriodo").modal({backdrop: 'static', keyboard: false});
}