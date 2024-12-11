$(document).ready(function () {
    cargarInstituciones(false);

    $("#docentes").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "programacion/datosDocente",
                dataType: "json",
                method : "post",
                data: {
                    docente: request.term,
                    opcion: 'buscarDocente'
                },
                success: function(data){
                    $("#docentes").removeAttr("data-code");
                    $("#docentes").next('i').removeClass('glyphicon-ok');
                    $("#docentes").next('i').addClass('glyphicon-remove');
                    $("#docentes").parent().removeClass('has-success');
                    $("#docentes").parent().addClass('has-error');
                    $("#rowButton").css('display','none');
                    let result = (!data.docentes) ? [{ vacio: true }] : data.docentes;
                    response(result);                  
                }
                    
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{

                $("#docentes").val( ui.item.cod_emp+" - "+ui.item.nombre);
                $("#docentes").next('i').removeClass('glyphicon-remove');
                $("#docentes").next('i').addClass('glyphicon-ok');
                $("#docentes").parent().removeClass('has-error');
                $("#docentes").parent().addClass('has-success');
                
            }
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {

        if (item.hasOwnProperty('vacio')) {
            return $( "<li>" )
            .append( "<div>No se encontraron resultados</div>" )
            .appendTo( ul );
        }

        return $( "<li>" )
            .append( "<div><b>Docente: </b>" + item.cod_emp + "<br><b>Nombre: </b> " +item.nombre + "</div>" )
            .appendTo( ul );
    };    
    $("#docentes").focus();
});


const language = {
    "processing": "Procesando...",
    "lengthMenu": "Mostrar _MENU_ registros",
    "zeroRecords": "No se encontraron resultados",
    "emptyTable": "No se encontraron registros",
    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
    "search": "Buscar:",
    "infoThousands": ",",
    "loadingRecords": "Cargando...",
    "paginate": {
        "first": "Primero",
        "last": "Último",
        "next": "Siguiente",
        "previous": "Anterior"
    },
    "info": "Mostrando _START_ a _END_ de _TOTAL_ registros"
};


//INCIO DE CONFIGURACIONES

$("#btnNuevo").click(function () {

    var fecha = new Date();
    formateada = fecha.toJSON().slice(0,10);

    $("#tipoM").val($("#tipoM > option:first").val());
    $("#unidadM").val($("#unidadM > option:first").val());
    $("#activacionM").val(formateada);
    $("#bloqueoM").val(formateada);
    $("#anioProgM").prop("disabled", false);
    $("#mesProgM").prop("disabled", false);
    $("#tipoM").prop("disabled", false);
    $("#unidadM").prop("disabled", false);    
    $("#opcionM").val("insert");
    $("#anioProgM").focus();
    $("#tituloModal").html("Nueva Configuracion");
    $("#modalConfiguraciones").modal({backdrop: 'static', keyboard: false});
});

$("#btnNuevoDocente").click(function () {

    var fecha = new Date();
    formateada = fecha.toJSON().slice(0,10);

    $("#docentes").val(null);
    //$("#tipoMDocente").val($("#tipoM > option:first").val());
    $("#unidadMDocente").val($("#unidadMDocente > option:first").val());
    $("#activacionMDocente").val(formateada);
    $("#bloqueoMDocente").val(formateada);
    $("#docentes").prop("disabled", false);
    $("#anioProgMDocente").prop("disabled", false);
    $("#mesProgMDocente").prop("disabled", false);
    $("#tipoMDocente").prop("disabled", false);
    $("#unidadMDocente").prop("disabled", false);    
    $("#opcionMDocente").val("insertDocente");
    $("#anioProgMDocente").focus();
    $("#tituloModalDocente").html("Nueva Configuracion");
    $("#modalConfiguracionesDocente").modal({backdrop: 'static', keyboard: false});
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
        url: path + "programacion/BloqueoNotas",
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

$("#btnGrabarMDocente").click(function () {
    var anioProg = $("#anioProgMDocente").val();
    var mesProg = $("#mesProgMDocente").val();
    var unidad = $("#unidadMDocente").val();
    var activacion = $("#activacionMDocente").val();
    var bloqueo = $("#bloqueoMDocente").val();
    var docente = $("#docentes").val().split(" ")[0]
    var opcion = $("#opcionMDocente").val();

    $.ajax({
        url: path + "programacion/BloqueoNotas",
        type: "POST",
        data: {
            anioProg: anioProg,
            mesProg: mesProg,
            unidad: unidad,
            activacion: activacion,
            bloqueo: bloqueo,
            docente: docente,
            opcion: opcion
        },
        success: function (data) {
            //console.log(data);
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                $("#modalConfiguracionesDocente").modal("hide");
                cargarConfiguracionesDocente();
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
        url: path + "programacion/BloqueoNotas",
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
                mostrarMensaje("exito", "EXITO", "Bloqueo de notas actualizados correctamente");
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

$("#modalConfiguraciones").draggable({
    handle: ".modal-header"
}); 

$('#btnBuscar').click(function () {
    cargarConfiguraciones()
})

$('#btnBuscarDocente').click(function () {
    cargarConfiguracionesDocente()
})

function cargarConfiguraciones() {
    var anioProg = $("#anioProg").val();
    var codLocal = $("#institucion").val();
    $('#tablaConfiguraciones').dataTable().fnDestroy();
    $("#tablaConfiguraciones").DataTable({
        ajax: {
            url: path + "programacion/BloqueoNotas",
            type: "POST",
            dataType: "JSON",
            data: {
                anioProg: anioProg,
                codLocal: codLocal,
                opcion: "select"
            },
            beforeSend: function () {
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                /* console.log(response.data); */
                if (response.respuesta === "error") {
                    return {}
                } else {
                    return response.configuraciones;
                }
            },
        },
        columnDefs: [
            {
                defaultContent: "-",
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [10, 18, 20, 50, 75, 100],
            [10, 18, 20, 50, 75, 100]
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.año;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.mes;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Tipo;
                }
            },
            {
                data: null,
                render: function (data) {
                    if (data.UnidadD === 1) {
                        return "I";
                    } else if (data.UnidadD === 2) {
                        return "II";
                    } else {
                        return data.UnidadD;
                    }
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FInicio;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FTerminto;
                }
            },
            {
                data: null,
                render: function(data){            
                    
                    return   "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"editarConfiguracion('"+ data.año +"','"+ data.mes +"','"+ data.cod_local +"','"+ data.UnidadD +"','"+ data.FInicio +"','"+ data.FTerminto +"');\" title=\"Editar Configuracion\"><span class=\"icon-pencil\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                             "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"eliminarConfiguracion('"+ data.año +"','"+ data.mes +"','"+ data.cod_local +"','"+ data.UnidadD +"');\" title=\"Eliminar Configuracion\"><span class=\"icon-cross\"></span></button>";                    
                }
            },
        ],
        language: language
    });
}

function cargarConfiguracionesDocente() {
    var anioDocente = $("#anioDocente").val();
    var mesDocente = $("#mesDocente").val();
    $('#tablaConfiguracionesDocentes').dataTable().fnDestroy();
    $("#tablaConfiguracionesDocentes").DataTable({
        ajax: {
            url: path + "programacion/BloqueoNotas",
            type: "POST",
            dataType: "JSON",
            data: {
                anioDocente: anioDocente,
                mesDocente: mesDocente,
                opcion: "selectDocente"
            },
            beforeSend: function () {
                $("#modalLoader").modal();
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            },
            complete: function () {
                $("#modalLoader").modal("hide");
            },
            dataSrc: function (response) {
                /* console.log(response.data); */
                if (response.respuesta === "error") {
                    return {}
                } else {
                    return response.configuraciones;
                }
            },
        },
        columnDefs: [
            {
                defaultContent: "-",
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [
            [10, 18, 20, 50, 75, 100],
            [10, 18, 20, 50, 75, 100]
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.idC;
                }
            },
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.anio_prog;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.mes_prog;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_emp;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Empleado.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    if (data.unidad_didactica === 1) {
                        return "I";
                    } else if (data.unidad_didactica === 2) {
                        return "II";
                    } else {
                        return data.unidad_didactica;
                    }
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.fecha_activacion;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.fecha_bloqueo;
                }
            },
            {
                data: null,
                render: function(data){            
                    
                    return   "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"editarConfiguracionDocente('"+ data.anio_prog +"','"+ data.mes_prog +"','"+ data.unidad_didactica +"','"+ data.fecha_activacion +"','"+ data.fecha_bloqueo +"','"+ data.cod_emp +"','"+ data.Empleado +"');\" title=\"Editar Configuracion\"><span class=\"icon-pencil\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                             "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"eliminarConfiguracionDocente('"+ data.idC +"');\" title=\"Eliminar Configuracion\"><span class=\"icon-cross\"></span></button>";                    
                }
            },
        ],
        language: language
    });
}

function eliminarConfiguracion(año,mes,Tipo,unidad_didactica){

    Notiflix.Confirm.Show(
        'Eliminar Configuracion',
        '¿Esta segura de eliminar? ',
        'Si',
        'No',
        function okCb() {

            var anioProg = año;
            var mesProg = mes;
            var tipo = Tipo;
            var unidad = unidad_didactica; 
            console.log(anioProg+" ",mesProg+" ",tipo+" ",unidad)
            $.ajax({
                url: path + "programacion/BloqueoNotas",
                type: "POST",
                data: {
                    anioProg: anioProg,
                    mesProg: mesProg,
                    tipo: tipo,
                    unidad: unidad,
                    opcion: "delete"
                },
                success: function (data) {
                    //console.log("datos: "+data);
                    var datos = JSON.parse(data);
                    console.log(data);
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

        },
        function cancelCb() {

        },
        {
        },
    );
   
}

function editarConfiguracion(año,mes,Tipo,unidad_didactica,FInicio,FTerminto){

    var anioProg = año;
    var mesProg = mes;
    var tipo = Tipo;
    var unidad = unidad_didactica; 
    var activacion = FInicio;
    var bloqueo = FTerminto;

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

function eliminarConfiguracionDocente(id){

    Notiflix.Confirm.Show(
        'Eliminar Configuracion',
        '¿Esta segura de eliminar? ',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "programacion/BloqueoNotas",
                type: "POST",
                data: {
                    id: id,
                    opcion: "deleteDocente"
                },
                success: function (data) {
                    //console.log("datos: "+data);
                    var datos = JSON.parse(data);
                    console.log(data);
                    if (datos.respuesta == "success") {
                        cargarConfiguracionesDocente();
                    } else {
                        var errores = "";
                        for (i = 0; i < datos.errores.length; i++) {
                            errores += datos.errores[i] + "<br>";
                        }
                        mostrarMensaje("error", "ERROR", errores);
                    }
                }
            });

        },
        function cancelCb() {

        },
        {
        },
    );
   
}

function editarConfiguracionDocente(año,mes,unidad_didactica,FInicio,FTerminto, cod_emp, empleado){

    var anioProg = año;
    var mesProg = mes;
    var unidad = unidad_didactica; 
    var activacion = FInicio;
    var bloqueo = FTerminto;

    $("#docentes").val(cod_emp + ' - ' + empleado);
    $("#anioProgMDocente").val(anioProg);
    $("#mesProgMDocente").val(mesProg);
    $("#unidadMDocente").val(unidad);
    $("#activacionMDocente").val(activacion);
    $("#bloqueoMDocente").val(bloqueo);
    
    $("#docentes").prop("disabled", true);
    $("#anioProgMDocente").prop("disabled", true);
    $("#mesProgMDocente").prop("disabled", true);
    $("#tipoMDocente").prop("disabled", true);
    $("#unidadMDocente").prop("disabled", true);
    
    $("#opcionMDocente").val("updateDocente");
    $("#anioProgMDocente").focus();
    $("#tituloModalDocente").html("Editando Configuracion");
    $("#modalConfiguracionesDocente").modal({backdrop: 'static', keyboard: false});
}

//FIN DE CONFIGURACIONES

//INICIO DE ENCUESTAS
function cargarParametrosEncuesta() 
{

    var tbody = $("#tablaParametrosEncuesta tbody");
    tbody.find('tr').remove();

    $.ajax({
        url: path + "programacion/BloqueoNotas",
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
        url: path + "programacion/BloqueoNotas",
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
        url: path + "programacion/BloqueoNotas",
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
        url: path + "programacion/BloqueoNotas",
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