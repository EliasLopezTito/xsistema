$(document).ready(function () {
    
    cargarConfiguraciones();

    cargarParametrosEncuesta();

});

//INCIO DE CONFIGURACIONES

$("#btnNuevo").click(function () {
    $("#tipoM").val($("#tipoM > option:first").val());
    $("#unidadM").val($("#unidadM > option:first").val());
    $("#activacionM").val("");
    $("#bloqueoM").val("");
    $("#anioProgM").prop("disabled", false);
    $("#mesProgM").prop("disabled", false);
    $("#tipoM").prop("disabled", false);
    $("#unidadM").prop("disabled", false);    
    $("#opcionM").val("insert");
    $("#anioProgM").focus();
    $("#tituloModal").html("Nueva Configuracion");
    $("#modalConfiguraciones").modal({backdrop: 'static', keyboard: false});
});

$("#btnGrabarM").click(function () {
    var anioProg = $("#anioProgM").val();
    var mesProg = $("#mesProgM").val();
    var tipo = $("#tipoM").val();
    var unidad = $("#unidadM").val();
    var activacion = $("#activacionM").val();
    var bloqueo = $("#bloqueoM").val();
    var opcion = $("#opcionM").val();

    $.ajax({
        url: path + "programacion/parametros",
        type: "POST",
        data: {
            anioProg: anioProg,
            mesProg: mesProg,
            tipo: tipo,
            unidad: unidad,
            activacion: activacion,
            bloqueo: bloqueo,
            opcion: opcion
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#modalConfiguraciones").modal("hide");
                cargarConfiguraciones();
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

$("#btnGrabar").click(function () {
    var desdeImpLista = $("#desdeImpLista").val();
    var hastaImpLista = $("#hastaImpLista").val();
    var desdeImpCarga = $("#desdeImpCarga").val();
    var hastaImpCarga = $("#hastaImpCarga").val();
    let verExcelDesde = $("#verExcelDesde").val();
    let verExcelHasta = $("#verExcelHasta").val();
    let disponibilidad_desde = $("#disponibilidad_desde").val();
    let disponibilidad_hasta = $("#disponibilidad_hasta").val();

    $.ajax({
        url: path + "programacion/parametros",
        type: "POST",
        data: {
            desdeImpLista: desdeImpLista,
            hastaImpLista: hastaImpLista,
            desdeImpCarga: desdeImpCarga,
            hastaImpCarga: hastaImpCarga,
            verExcelDesde: verExcelDesde,
            verExcelHasta: verExcelHasta,
            disponibilidad_desde: disponibilidad_desde,
            disponibilidad_hasta: disponibilidad_hasta,
            opcion: "grabar"
        },
        beforeSend: function () {
            $("#loader").css({"display": "block"});
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#loader").css({"display": "none"});
                mostrarMensaje("exito", "EXITO", "Parametros actualizados correctamente");
            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                $("#loader").css({"display": "none"});
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });
});

function cargarConfiguraciones() {
    var tbody = $("#tablaConfiguraciones tbody");
    tbody.find('tr').remove();

    $.ajax({
        url: path + "programacion/parametros",
        type: "POST",
        data: {
            opcion: "select"
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                var configuraciones = datos.configuraciones;
                if (configuraciones != "vacio") {
                    for (i = 0; i < configuraciones.length; i++) {
                        var configuracion = configuraciones[i];
                        var tr =    "<tr>" +
                                    "   <td class=\"celda-centrada\">" + configuracion.anio_prog + "</td>" +
                                    "   <td class=\"celda-centrada\">" + configuracion.mes_prog + "</td>" +
                                    "   <td style=\"display: none\">" + configuracion.cod_local + "</td>" +
                                    "   <td class=\"celda-centrada\">" + configuracion.tipo + "</td>" +
                                    "   <td class=\"celda-centrada\">" + configuracion.unidad_didactica + "</td>" +
                                    "   <td class=\"celda-centrada\">" + configuracion.fecha_activacion + "</td>" +
                                    "   <td class=\"celda-centrada\">" + configuracion.fecha_bloqueo + "</td>" +
                                    "   <td class=\"celda-centrada\">" +
                                    "       <button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"editarConfiguracion(this);\" title=\"Editar Configuracion\"><span class=\"icon-pencil\"></span></button>" +
                                    "       <button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"eliminarConfiguracion(this);\" title=\"Eliminar Configuracion\"><span class=\"icon-bin\"></span></button>" +
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

function eliminarConfiguracion(btn){
    var anioProg = $(btn).parent().parent().find("td").eq(0).html();
    var mesProg = $(btn).parent().parent().find("td").eq(1).html();
    var tipo = $(btn).parent().parent().find("td").eq(2).html();
    var unidad = $(btn).parent().parent().find("td").eq(4).html();
    
    $.ajax({
        url: path + "programacion/parametros",
        type: "POST",
        data: {
            anioProg: anioProg,
            mesProg: mesProg,
            tipo: tipo,
            unidad: unidad,
            opcion: "delete"
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                cargarConfiguraciones();
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

function editarConfiguracion(btn){
    var anioProg = $(btn).parent().parent().find("td").eq(0).html();
    var mesProg = $(btn).parent().parent().find("td").eq(1).html();
    var tipo = $(btn).parent().parent().find("td").eq(2).html();
    var unidad = $(btn).parent().parent().find("td").eq(4).html();
    var activacion = $(btn).parent().parent().find("td").eq(5).html();
    var bloqueo = $(btn).parent().parent().find("td").eq(6).html();
    
    $("#anioProgM").val(anioProg);
    $("#mesProgM").val(mesProg);
    $("#tipoM").val(tipo);
    $("#unidadM").val(unidad);
    $("#activacionM").val(activacion);
    $("#bloqueoM").val(bloqueo);
    
    $("#anioProgM").prop("disabled", true);
    $("#mesProgM").prop("disabled", true);
    $("#tipoM").prop("disabled", true);
    $("#unidadM").prop("disabled", true);
    
    $("#opcionM").val("update");
    $("#anioProgM").focus();
    $("#tituloModal").html("Editando Configuracion");
    $("#modalConfiguraciones").modal({backdrop: 'static', keyboard: false});
    
}

//FIN DE CONFIGURACIONES

//INICIO DE ENCUESTAS
function cargarParametrosEncuesta() 
{

    var tbody = $("#tablaParametrosEncuesta tbody");
    tbody.find('tr').remove();

    $.ajax({
        url: path + "programacion/parametros",
        type: "POST",
        data: {
            opcion: "selectParametrosEncuesta"
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") 
            {

                var parametrosEncuesta = datos.parametrosEncuesta;

                if (parametrosEncuesta != "vacio")
                {

                    for (i = 0; i < parametrosEncuesta.length; i++)
                    {

                        var parametroEncuesta = parametrosEncuesta[i];
                        var tr =    "<tr>" +
                                    "   <td class=\"celda-centrada\">" + parametroEncuesta.AnoProgramado + "</td>" +
                                    "   <td class=\"celda-centrada\">" + parametroEncuesta.MesProgramado + "</td>" +
                                    "   <td class=\"celda-izquierda\">" + parametroEncuesta.Descripcion + "</td>" +
                                    "   <td class=\"celda-izquierda\">" + parametroEncuesta.DescripcionClasifEncuesta + "</td>" +//nuevo
                                    "   <td class=\"celda-centrada\">" + parametroEncuesta.FechaActivacion + "</td>" +
                                    "   <td class=\"celda-centrada\">" + parametroEncuesta.FechaBloqueo + "</td>" +
                                    "   <td class=\"celda-centrada\">" +
                                    "       <button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"editarParametroEncuesta(this,"+parametroEncuesta.id_ParametrosEncuesta+");\" title=\"Editar Parámetro de Encuesta\"><span class=\"icon-pencil\"></span></button>" +
                                    "       <button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"eliminarParametroEncuesta(this,"+parametroEncuesta.id_ParametrosEncuesta+");\" title=\"Eliminar Parámetro de Encuesta\"><span class=\"icon-bin\"></span></button>" +
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

$("#btnNuevoParametroEncuesta").click(function () 
{      

    $("#anioProgEncuesta").prop("disabled", false);
    $("#mesProgEncuesta").prop("disabled", false);
    $("#slct_encuesta_para").prop("disabled", false);
    $("#encuesta").prop("disabled", false);
    $("#slct_encuesta_para").find('option').remove();
    $("#slct_encuesta_para").append('<option value="" selected disabled="">SELECCIONA UNA OPCIÓN</option>');
    $("#slct_encuesta_para").append('<option value="1">DOCENTES</option>');
    $("#slct_encuesta_para").append('<option value="2">TUTORES</option>');
    $("#encuesta").find('option').remove();
    $("#fechaActivacionEncuesta").val("");
    $("#fechaBloqueoEncuesta").val("");
    $("#opcionParametroEncuesta").val("insertarParametroEncuesta");
    $("#anioProgEncuesta").focus();
    $("#tituloModalParametrosEncuesta").html("Nueva Configuracion");
    $("#modalParametroEncuesta").modal({backdrop: 'static', keyboard: false});
});

$("#anioProgEncuesta").change(function () {
     cargarEncuestaByMesAnoProgramado($("#anioProgEncuesta").val(),$("#mesProgEncuesta").val(), $("#slct_encuesta_para").val());
});
$("#mesProgEncuesta").change(function () {
     cargarEncuestaByMesAnoProgramado($("#anioProgEncuesta").val(),$("#mesProgEncuesta").val(), $("#slct_encuesta_para").val());
});

$("#slct_encuesta_para").change(function () {
    
    cargarEncuestaByMesAnoProgramado($("#anioProgEncuesta").val(),$("#mesProgEncuesta").val(), $("#slct_encuesta_para").val());

});

function cargarEncuestaByMesAnoProgramado(anio,mes,idClasificacionEncuesta) 
{

    $.ajax({
        url: path + "programacion/parametros",
        type: "POST",
        data: {
            opcion: "cargarEncuestas",
            anio: anio,
            mes: mes,
            idClasificacionEncuesta: idClasificacionEncuesta
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);

            if (datos.respuesta == "success") 
            {

                var encuestas = datos.encuestas;

                $("#encuesta").find('option').remove();

                if (encuestas != "vacio")
                {

                    for (i = 0; i < encuestas.length; i++)
                    {

                        var encuesta = encuestas[i];

                        $("#encuesta").append("<option value=\"" + encuesta.id_Encuesta + "\">" + encuesta.Descripcion + "</option>");
                      
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

$("#btnGrabarParametroEncuesta").click(function () {
  
    var idEncuesta = $("#encuesta").val();
    var fechaActivacionEncuesta = $("#fechaActivacionEncuesta").val();
    var fechaBloqueoEncuesta = $("#fechaBloqueoEncuesta").val();
    var opcion = $("#opcionParametroEncuesta").val();

    $.ajax({
        url: path + "programacion/parametros",
        type: "POST",
        data: {
            idEncuesta: idEncuesta,
            fechaActivacionEncuesta: fechaActivacionEncuesta,
            fechaBloqueoEncuesta: fechaBloqueoEncuesta,
            opcion: opcion
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#modalParametroEncuesta").modal("hide");
                cargarParametrosEncuesta();
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

function editarParametroEncuesta(btn,idParametrosEncuesta)
{
    var anioProg = $(btn).parent().parent().find("td").eq(0).html();
    var mesProg = $(btn).parent().parent().find("td").eq(1).html();
    var encuesta = $(btn).parent().parent().find("td").eq(2).html();
    var clasificacionEncuesta = $(btn).parent().parent().find("td").eq(3).html();
    var activacion = $(btn).parent().parent().find("td").eq(4).html();
    var bloqueo = $(btn).parent().parent().find("td").eq(5).html();


    $("#anioProgEncuesta").val(anioProg);
    $("#mesProgEncuesta").val(mesProg);
    $("#encuesta").find('option').remove();
    $("#encuesta").append('<option value=' + idParametrosEncuesta + ' selected>' + encuesta + '</option>');
    $("#slct_encuesta_para").find('option').remove();
    $("#slct_encuesta_para").append('<option value="" selected>' + clasificacionEncuesta + '</option>');
    $("#fechaActivacionEncuesta").val(activacion);
    $("#fechaBloqueoEncuesta").val(bloqueo);
    
    $("#anioProgEncuesta").prop("disabled", true);
    $("#mesProgEncuesta").prop("disabled", true);
    $("#encuesta").prop("disabled", true);
    $("#slct_encuesta_para").prop("disabled", true);
    
    $("#opcionParametroEncuesta").val("actualizarParametroEncuesta");
    $("#anioProgEncuesta").focus();
    $("#tituloModalParametrosEncuesta").html("Editando Configuración");
    $("#modalParametroEncuesta").modal({backdrop: 'static', keyboard: false});
    
}

function eliminarParametroEncuesta(btn, idParametrosEncuesta){

    $.ajax({
        url: path + "programacion/parametros",
        type: "POST",
        data: {
            idParametrosEncuesta: idParametrosEncuesta,
            opcion: "eliminarParametroEncuesta"
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                cargarParametrosEncuesta();
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