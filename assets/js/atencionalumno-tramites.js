$(document).ready(function () 
{

    Notiflix.Loading.Init({
        clickToClose: true
    });

    $("#codAlumno").attr("disabled", true);
    $("#nombreAlumno").attr("disabled", true);

});

$("#btnBuscar").click(function () 
{
    $("#codigoBus").val("");
    $("#apellidosNombresBus").val("");
    $("#tablaModalAlumno tbody").find('tr').remove();
    $("#codigoBus").focus();
    $("#modalAlumnos").modal({backdrop: 'static', keyboard: false});
});

$("#btnLimpiar").click(function () 
{
    limpiarCampos(1);
});

function exportarExcel(){
        
    $.ajax({
        url: path + "AtencionAlumno/tramites",
        type: "POST",
        dataType: 'json',
        data: {
            opcion: "exportarExcelTramite",
            tipoTramite: $("#tipo-tramite").val(),
            codAlumno: $("#codAlumno").val(),
            mes: $("#mes").val(),
            anio: $("#anio").val()
        },
        success: function (r) {
           
            var $a = $("<a>");
            $a.attr("href", r.data);
            $("body").append($a);
            $a.attr("download", "Tramites.xlsx");
            $a[0].click();
            $a.remove();

        }
    });


}

function buscarAlumnoMatriculado()
{

    var codigoBus = $("#codigoBus").val().trim();
    var apellidosNombresBus = $("#apellidosNombresBus").val().trim();

    if (codigoBus == "" && apellidosNombresBus == "")
    {
        $("#errorAlumnoBus").html("Debe ingresar el código o apellidos y nombres a buscar");
        $("#errorAlumnoBus").css("display", "block");

        return false;

    } else
    {
        $("#errorAlumnoBus").html("");
        $("#errorAlumnoBus").css("display", "none");
    }

    $.ajax({
        url: path + "AtencionAlumno/tramites",
        type: "POST",
        data: {
            codigoBus: codigoBus,
            apellidosNombresBus: apellidosNombresBus,
            opcion: "buscarAlumno"
        },
        success: function (data) {

            var tbody = $("#tablaModalAlumno tbody");
            tbody.find('tr').remove();

            var datos = JSON.parse(data);

            if (datos.respuesta == "success")
            {
                if (datos.alumnos != "vacio")
                {
                    var alumnos = datos.alumnos;

                    for (i = 0; i < alumnos.length; i++)
                    {
                        var alumno = alumnos[i];

                        var tr = "<tr ondblclick=\"seleccionarAlumno(this);\">" +
                                "<td class=\"celda-centrada\">" + alumno.cod_alumno + "</td>" +
                                "<td>" + alumno.apellidos_nombres + "</td>" +
                                "</tr>";

                        tbody.append(tr);
                    }
                }

            } else
            {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });
}

function seleccionarAlumno(tr)
{

    limpiarCampos(1);

    var codAlumno = $(tr).find("td").eq(0).html();
    var apellidosNombres = $(tr).find("td").eq(1).html()

    $("#codAlumno").val(codAlumno);
    $("#nombreAlumno").val(apellidosNombres);

    $("#modalAlumnos").modal("hide");
}

function limpiarCampos(op)
{
    switch (op) {
        case 1:
            $("#codAlumno").val("");
            $("#nombreAlumno").val("");
            break;
        default:
            break;
    }
}

function descargarArchivosAdjuntos( btn ){
    
    const file = $(btn).attr("file");
    const ruta = $(btn).attr("ruta");

    const dni = ruta + "Dni/" + file;    
    const firma = ruta + "FirmasJpg/" + file;
    const foto = ruta + "Fotos/" + file;
    const pago = ruta + "Pago/" + file;
    
    $("#dni_").attr("href",dni)
    $("#firma_").attr("href", firma)
    $("#foto_").attr("href", foto)
    $("#pago_").attr("href", pago)

    $("#modalDocumentosAdjuntosDescargar").modal();

}

function consultarTramites()
{
    $("#container-consulta-tramite").empty();

    $.ajax({
        url: path + "AtencionAlumno/tramites",
        type: "POST",
        data: {
            opcion: "consultarTramites",
            tipoTramite: $("#tipo-tramite").val(),
            codAlumno: $("#codAlumno").val(),
            mes: $("#mes").val(),
            anio: $("#anio").val()
        },
        beforeSend: function()
        {            
            $("#modalLoader").modal({backdrop:'static',keyboard:false});
            $(".text-loader").text("Cargando...")
        },
        complete: function () 
        {
            $("#modalLoader").modal("hide");
        },
        success: function(data)
        {

            //console.log(data);

            $("#NotiflixLoadingWrap").trigger("click");

            var datos = JSON.parse(data);

            if(datos.respuesta=="success")
            {
                $("#container-consulta-tramite").html(datos.vista);

            }else
            {
                var errores = "";

                for(i = 0; i < datos.errores.length; i++){
                    errores += datos.errores[i] + "<br>";
                }

                Notiflix.Report.Failure('Error',errores,"Cerrar");
            }
        }
    });
}

function actualizarTramites()
{
    $("#btnConsultar").trigger("click");
}

function gestionarEstadoEvaluacion(elemento, idTramite, idEstadoEvaluacion, idEstadoTramite)
{

    if(idEstadoTramite == 4)
    {//EL ALUMNO CANCELÓ EL TRAMITE
        
        $(elemento).val(idEstadoEvaluacion);
        Notiflix.Report.Warning("Aviso","El alumno ha cancelado el trámite, no es necesaria una evaluación","Cerrar");

    }else
    {
        Notiflix.Confirm.Show(
            'Confirmación',
            '¿Desea confirmar la selección?',
            'Si',
            'No',
            function(){

                $.ajax({
                    url: path + "AtencionAlumno/tramites",
                    type: "POST",
                    data: {
                        opcion: "actualizarEstadoEvaluacion",
                        idEstadoEvaluacion: $(elemento).val(),
                        idTramite: idTramite
                    },
                    success: function(data)
                    {
            
                        //console.log(data);
            
                        var datos = JSON.parse(data);
            
                        if(datos.respuesta=="success")
                        {
                            Notiflix.Report.Success("Actualización Exitosa","Se ha actualizado exitosamente el estado de evaluación del trámite.","Cerrar");
                            actualizarTramites();
            
                        }else
                        {
                            var errores = "";
            
                            for(i = 0; i < datos.errores.length; i++){
                                errores += datos.errores[i] + "<br>";
                            }
            
                            Notiflix.Report.Failure('Error',errores,"Cerrar");
                        }
            
                    }
                });

            }
            ,function(){
                //En caso, sea no
                $(elemento).val(idEstadoEvaluacion);
            });

    }
}

function gestionarEstadoObservacionPago(elemento, idTramite, idEstadoObservacionPago, idEstadoTramite)
{

    if(idEstadoTramite == 4)
    {//EL ALUMNO CANCELÓ EL TRAMITE
        
        $(elemento).val(idEstadoObservacionPago);
        Notiflix.Report.Warning("Aviso","El alumno ha cancelado el trámite, no es necesario seleccionar una opción","Cerrar");

    }else
    {
        Notiflix.Confirm.Show(
            'Confirmación',
            '¿Desea confirmar la selección?',
            'Si',
            'No',
            function(){

                $.ajax({
                    url: path + "AtencionAlumno/tramites",
                    type: "POST",
                    data: {
                        opcion: "actualizarEstadoObservacionPago",
                        idEstadoObservacionPago: $(elemento).val(),
                        idTramite: idTramite
                    },
                    success: function(data)
                    {
            
                        //console.log(data);
            
                        var datos = JSON.parse(data);
            
                        if(datos.respuesta=="success")
                        {
                            Notiflix.Report.Success("Actualización Exitosa","Se ha actualizado exitosamente el estado de pago del trámite.","Cerrar");
                            actualizarTramites();
            
                        }else
                        {
                            var errores = "";
            
                            for(i = 0; i < datos.errores.length; i++){
                                errores += datos.errores[i] + "<br>";
                            }
            
                            Notiflix.Report.Failure('Error',errores,"Cerrar");
                        }
            
                    }
                });

            }
            ,function(){
                //En caso, sea no
                $(elemento).val(idEstadoObservacionPago);
            });

    }
}

function gestionarEstadoTramite(elemento, idTramite, idEstadoTramite)
{

    Notiflix.Confirm.Show(
            'Confirmación',
            '¿Desea confirmar la selección?',
            'Si',
            'No',
            function(){

                $.ajax({
                    url: path + "AtencionAlumno/tramites",
                    type: "POST",
                    data: {
                        opcion: "actualizarEstadoTramite",
                        idEstadoTramite: $(elemento).val(),
                        idTramite: idTramite
                    },
                    success: function(data)
                    {

                        //console.log(data);

                        var datos = JSON.parse(data);

                        if(datos.respuesta=="success")
                        {
                            Notiflix.Report.Success("Actualización Exitosa","Se ha actualizado exitosamente el estado del trámite.","Cerrar");
                            actualizarTramites();

                        }else
                        {
                            var errores = "";
            
                            for(i = 0; i < datos.errores.length; i++){
                                errores += datos.errores[i] + "<br>";
                            }
            
                            Notiflix.Report.Failure('Error',errores,"Cerrar");
                        }
            
                    }
                });

            }
            ,function(){
                //En caso, sea no
                $(elemento).val(idEstadoTramite);
            });


}

function documentosAdjuntos(idTramite)
{

    $("#tituloModalDocumentosAdjuntos").html("DOCUMENTOS ADJUNTOS");

    $("#modalDocumentosAdjuntos").modal({backdrop: 'static', keyboard: false});
    consultarDocumentosAdjuntos(idTramite);
}

function consultarDocumentosAdjuntos(idTramite)
{
    $("#container-consulta-docs-adjuntos").empty();

    $.ajax({
        url: path + "AtencionAlumno/tramites",
        type: "POST",
        data: {
            opcion: "consultarDocumentosAdjuntos",
            idTramite: idTramite
        },
        success: function(data)
        {

            //console.log(data);

            var datos = JSON.parse(data);

            if(datos.respuesta=="success")
            {
                $("#container-consulta-docs-adjuntos").html(datos.vista);

            }else
            {
                var errores = "";

                for(i = 0; i < datos.errores.length; i++){
                    errores += datos.errores[i] + "<br>";
                }

                Notiflix.Report.Failure('Error',errores,"Cerrar");
            }

        }
    });
}

function actualizarDocumentosAdjuntos(idTramite)
{
    consultarDocumentosAdjuntos(idTramite);
}

function descargarDocumentosAdjuntos(rutaTipoTramite, nombreArchivo)
{
    var a = $("<a>");
    //console.log("nombre de ruta:" + rutaTipoTramite+'/'+nombreArchivo);
    a.attr("href", rutaTipoTramite+'/'+nombreArchivo);
    $("body").append(a);
    a.attr("download", nombreArchivo);
    a[0].click();
    a.remove();
}

function verTramitePDF(idTramite, idTipoTramite)
{

    var opcion = "";

    switch(idTipoTramite)
    {
        case 1:
            opcion = "pdfTramiteTCambiarTurno";
            break;
        case 2:
            opcion = "pdfTramiteTCarneMedioPasaje";
            break;
        default:
            break;
    }

    $.ajax({
        url: path + "AtencionAlumno/tramites",
        type: "POST",
        data: {
            opcion: opcion,
            idTramite: idTramite
        },
        success: function (data)
        {
            //console.log(data);
            var datos = JSON.parse(data);

            var a = $("<a>");
                a.attr("href", datos.file);
                $("body").append(a);
                a.attr("download", "Tramite00" + idTramite + ".pdf");
                a[0].click();
                a.remove();
        }
    });

}


function enviarMensaje(idTramite)
{

    $("#tituloModalEnviarMensaje").html("ENVIAR MENSAJE");

    $("#modalEnviarMensaje").modal({backdrop: 'static', keyboard: false});

    mostrarFormEnviarMensaje(idTramite);

}

function mostrarFormEnviarMensaje(idTramite)
{
    $("#container-form-enviar-mensaje").empty();

    $.ajax({
        url: path + "AtencionAlumno/tramites",
        type: "POST",
        data: {
            opcion: "formEnviarMensaje",
            idTramite: idTramite
        },
        success: function(data)
        {
            //console.log(data);

            var datos = JSON.parse(data);

            $("#container-form-enviar-mensaje").html(datos.vista);

        },
        complete: function(){
             setTimeout(verUltimoMensaje, 200);
        }
    });
}

function grabarMensajeEnter()
{
    if (event.keyCode == 13)
    {
        $("#btnEnviarMensaje").trigger("click");
    }
    
}

function grabarMensaje(idTramite)
{

    var descripcionMensaje = $('#descripcion-mensaje').val();

    if(descripcionMensaje.trim().length > 0)
    {

        $.ajax({
            url: path + "AtencionAlumno/tramites",
            type: "POST",
            data: {
                opcion: "grabarMensaje",
                idTramite: idTramite,
                descripcionMensaje: descripcionMensaje
            },
            success: function(data)
            {
                //console.log(data);

                var datos = JSON.parse(data);

                if(datos.respuesta=="success")
                {

                    if(datos.respuesta!="vacio")
                    {

                        $("#cuerpo-chat").append(datos.vista);
                        $("#container-sin-mensajes").css("display", "none");
                        $("#descripcion-mensaje").val("");
                        
                    }
                   
                }else
                {
                    var errores = "";

                    for(i = 0; i < datos.errores.length; i++){
                        errores += datos.errores[i] + "<br>";
                    }

                    Notiflix.Report.Failure('Error',errores,"Cerrar");
                }
            },complete: function(){
                setTimeout(verUltimoMensaje, 200);
            }
        });
    }

}


function verUltimoMensaje()
{
    let cuerpo_chat = document.getElementById('cuerpo-chat');
    cuerpo_chat.scrollTop = cuerpo_chat.scrollHeight - cuerpo_chat.clientHeight;
    //console.log("top: " + cuerpo_chat.scrollTop );
}

function gestionarEstadoMensaje(elemento,idMensaje, idEstadoACambiar)
{

    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Desea continuar?',
        'Si',
        'No',
        function(){

            $.ajax({
                url: path + "AtencionAlumno/tramites",
                type: "POST",
                data: {
                    opcion: "actualizarEstadoMensaje",
                    idMensaje: idMensaje,
                    idEstadoACambiar: idEstadoACambiar,
                },
                success: function(data)
                {
        
                    //console.log(data);
        
                    var datos = JSON.parse(data);
        
                    if(datos.respuesta=="success")
                    {
                        
                        eliminarMensaje(elemento);
        
                    }else
                    {
                        var errores = "";
        
                        for(i = 0; i < datos.errores.length; i++){
                            errores += datos.errores[i] + "<br>";
                        }
        
                        Notiflix.Report.Failure('Error',errores,"Cerrar");
                    }
        
                }
            });

        }
        ,function(){
            
            
        });
}


function eliminarMensaje(elementoEnlaceEliminar)
{

	eliminarContenedorClonado(elementoEnlaceEliminar,5);

}

function actualizarMensajes(idTramite)
{
    mostrarFormEnviarMensaje(idTramite);
}