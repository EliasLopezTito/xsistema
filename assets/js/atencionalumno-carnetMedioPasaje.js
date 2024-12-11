$(document).ready(function()
{
    Notiflix.Loading.Init({
        clickToClose: true
    });
    $('#caja1').hide()
    $('#caja2').hide()
    cargarGrafico1()
    consultarListaCarnet()
    document.getElementById("alumnoInicio").focus();

    $(".contenedorCaja").hide(200)
   // limpiarCanvas();
    //actualizarDatosAlumnos();

    $("#alumno").autocomplete({        
        source: function(request, response){
            $('#caja1').hide()
            $('#caja2').hide()
            $.ajax({
                url: path + "atencionAlumno/carnetMedioPasaje",
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarDatosAlumno'
                },
                success: function(data){
                    $("#alumno").removeAttr("data-code");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');
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
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                $("#alumno").val(ui.item.Alumno);
                $("#alumno").attr('data-code', ui.item.cod_alumno);
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');

                mostrarFormCarneMedioPasaje(ui.item.cod_alumno)
                $('#caja1').show()
                $('#caja2').show()
            }
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        if (item.vacio) {
            return $( "<li>" )
            .append( "<div>No se encontraron resultados</div>" )
            .appendTo( ul );
        }

        return $( "<li>" )
            .append( "<div>" + item.cod_alumno + " - " +item.Alumno + "</div>" )
            .appendTo( ul );
    };

    $("#alumno").focus();

});

$(document).on('change', '#terminos', function () {
    if ($(this).is(':checked')) {
        $('#btnEnviarDatosActualizadosAlumnos').prop('disabled', false);
    } else {
        $('#btnEnviarDatosActualizadosAlumnos').prop('disabled', true);
    }
});

$("#tipoEspecialidad").change(function () {
    cargarEspecialidades(false);
});

$("#btnConsultar").click(function () {
    consultarListaCarnet()
})

$("#btnVerificarPago").click(function () {
    //var valor = this.value
    //if(valor == "1"){
        validarPagoCajaIal($('#alumno').attr('data-code'));
    //}else{
    //    $(".contenedorCaja").hide(200)
    //}
});

$("#btnNuevo").click(function (){
    $("#tituloModalNuevoTramite").html("NUEVO TRÁMITE");
    $('#caja1').hide()
    $('#caja2').hide()
    $('#alumno').val(null)
    $('#alumno').attr('data-code', null) 
    $("#foto").val("")
    $("#firma_").val("")
    $('#transaccion').val("")
    $('#pagoFecha').val("")
    $(".contenedorCaja").hide()
    document.getElementById('preview').src = "https://ialadmin.edu.pe/siga/assets/img/fondo_carnet.jpg";
    $("#modalTramite").modal({backdrop: 'static', keyboard: false});
    limpiarModalNuevoTramite();
    setTimeout(() => {
        $('#alumno').focus()
    }, 500);
});

$("#btnVerPagos").click(function (){
    verPagosLista($('#alumno').attr('data-code'))
});

$("#btnEditarFoto").click(function (){
    $("#opcionesEditar").hide(200)
    $("#contenido_ver_foto").hide(200)
    $("#contenido_editar_foto").show(200)
    $("#opcionesBoton").show(200) 

});

$("#btnCancelar").click(function (){
    $("#opcionesEditar").show(200)
    $("#contenido_ver_foto").show(200)
    $("#contenido_editar_foto").hide(200)
    $("#opcionesBoton").hide(200)
    $("#foto_editar").val("")
    document.getElementById('preview_editar').src = "imagenotfound";
});


$("#cambiarEstadoAdmin").change(function () {
    var valor = this.value
    if(valor == "3"){
        $("#contenedor_observacion").hide(200)
    }else{
        $("#contenedor_observacion").show(200)
    }
});

$("#filtroPago").change(function () {
    consultarListaCarnet()
})

$("#btnDescargarFotos").click(function()
{
    Notiflix.Confirm.Show(
    'Confirmación',
    '¿Desea continuar?',
    'Si',
    'No',
    function(){
        $.ajax({
            url: path + "atencionAlumno/carnetMedioPasaje",
            type: "POST",
            data: {
                opcion: "permisoCambiarEstado"
            },
            success: function(data)
            {
                var datos = JSON.parse(data);

                console.log("permiso", datos.data.aulas);

                if(datos.respuesta=="success")
                {
                    if(datos.data !="vacio")
                    {   
                        if(datos.data.aulas != "0")
                        {   
                            //PERMISO PARA REGINA
                            var target = path + "atencionAlumno/carnetMedioPasaje";
                            $("#form_descargarFotos").attr("action",target);
                            $("#form_descargarFotos").attr("target","_blank");
                            $("#form_descargarFotos").submit();

                            Notiflix.Report.Success("Enhorabuena", "Descarga de FOTOS completada con exito.","Cerrar");

                        }else{
                            //PERMISO PARA COORDINADORAS
                            Notiflix.Report.Info("Aviso", "Comuniquese con el Área Matrícula y Notas para realizar esta accion.","Cerrar");
                            return;
                            $("#modalCambiarEstadoCordina").modal({backdrop: 'static', keyboard: false});
                            $("#cambiarEstadoCordi").val(estado);
                        }
                    }else{
                        Notiflix.Report.Warning('Aviso', 'Ocurrio un error, no se encontro el OP',"Cerrar");
                    }

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
        // No button callbackalert('If you say so...');
    });
})

$("#btnExportarExcel").click(function()
{
    Notiflix.Confirm.Show(
    'Confirmación',
    '¿Desea continuar?',
    'Si',
    'No',
    function(){
        $.ajax({
            url: path + "atencionAlumno/carnetMedioPasaje",
            type: "POST",
            data: {
                opcion: "permisoCambiarEstado"
            },
            success: function(data)
            {
                var datos = JSON.parse(data);

                console.log("permiso", datos.data.aulas);

                if(datos.respuesta=="success")
                {
                    if(datos.data !="vacio")
                    {   
                        if(datos.data.aulas != "0")
                        {   
                            //PERMISO PARA REGINA
                            var target = path + "atencionAlumno/carnetMedioPasaje";
                            $("#form_exportalExcel").attr("action",target);
                            $("#form_exportalExcel").attr("target","_blank");
                            $("#form_exportalExcel").submit();

                            Notiflix.Report.Success("Enhorabuena", "Descarga de EXCEL con exito.","Cerrar");

                        }else{
                            //PERMISO PARA COORDINADORAS
                            Notiflix.Report.Info("Aviso", "Comuniquese con el Área Matrícula y Notas para realizar esta accion.","Cerrar");
                            return;
                            $("#modalCambiarEstadoCordina").modal({backdrop: 'static', keyboard: false});
                            $("#cambiarEstadoCordi").val(estado);
                        }
                    }else{
                        Notiflix.Report.Warning('Aviso', 'Ocurrio un error, no se encontro el OP',"Cerrar");
                    }

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
        // No button callbackalert('If you say so...');
    });
})

function verPagosLista(codAlumno){

    $.ajax({
        url: path + "atencionAlumno/carnetMedioPasaje",
        type: "POST",
        data: {
            codAlumno: codAlumno,
            opcion: "verListaPagosAlumno",
        },
        beforeSend: function()
        {

            Notiflix.Loading.Hourglass('Cargando...');

        },
        success: function(data)
        {   
            $("#NotiflixLoadingWrap").trigger("click");
            tbody = $('#tablaVerPagos tbody');
            tbody.find('tr').remove();

            var datos = JSON.parse(data);
            console.log("dataos", datos);

            if(datos.respuesta=="success")
            {
                var resp = datos.data;
                    if(resp == "vacio"){
                        Notiflix.Report.Warning('Aviso','No se encontro ninguna solicitud',"Cerrar");
                        return;
                    }else{

                        $('.operacion_').html("  "+ codAlumno)

                        for (i = 0; i < resp.length; i++) 
                        {
                            var datax = resp[i];                       

                            var tr = "<tr class=\"fila_programacion\">" +
                                        "    <td class=\"celda-centrada\">" + datax.Transaccion + "</td>" +
                                        "    <td class=\"celda-centrada\">" + datax.Concepto + "</td>" +
                                        "    <td class=\"celda-centrada\">" + datax.Importe + "</td>" +
                                        "    <td class=\"celda-centrada\">" + datax.Fecha + "</td>" +                                        
                                        "    <td class=\"celda-centrada\">" + datax.AnoPago + "</td>" +
                                    "</tr>";
                                tbody.append(tr);
                        }

                        $("#modalVerPagos").modal({backdrop: 'static', keyboard: false});
                    }

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

function limpiarModalNuevoTramite()
{
    var cboxTipoTramite = $("#cbox-tipo-tramite");
    cboxTipoTramite.find('option').remove();

    $("#container-tramite").empty();
}

function validarPagoCajaIal(cod_Alumno){
    $.ajax({
        url: path + "atencionAlumno/carnetMedioPasaje",
        type: "POST",
        data: {
            codAlumno: cod_Alumno,
            opcion: "validarPagoCaja",
        },
        success: function(data)
        {
            var datos = JSON.parse(data);
            if(datos.respuesta=="success")
            {
                if(datos.data == "vacio"){
                    Notiflix.Report.Warning("Aviso","Usted no tiene ningun pago en CAJA IAL.","Cerrar");
                    return;
                }               
                $('#transaccion').val(datos.data[0].Transaccion)
                $('#pagoFecha').val(datos.data[0].Fecha.substring(0, 10))
                $(".contenedorCaja").show(200)
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

function consultarListaCarnet()
{   
    Notiflix.Loading.Dots('Sonrie :)');

    $("#container-consulta-tramite").empty();

    listaCarnetMedioPasaje = $("#tablaTramitesSolicitados").DataTable({
        destroy: 'true',
        searching: true,
        processing: false,
        responsive: true,
        ordering:  false,
        lengthMenu: [
            [15, 100, -1], 
            [15, 100, 'TODO']
        ],
        ajax: {
            url: path + "atencionAlumno/carnetMedioPasaje",
            type: "POST",
            data: {
                opcion: "selectListaCarnet",
                semestre: $("#semestres").val(),
                sede: $("#sedeBuscar").val(),
                codAlumno: $("#alumnoInicio").val(),
                filtroPago: $("#filtroPago").val(),
            },
            dataSrc: function(data){

                Notiflix.Loading.Remove();

                console.log("data", data) 
                if(data.respuesta == "success"){
                    return data.data == "vacio" ? {} : data.data;
                }else{
                    return {};
                }        
                               
            }
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada'
            }
        ],
        columns: [
            {
                data: null,
                render: function (data) {
                    return data.Op;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Fecha;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Sede;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Especialidad;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.CodAlumno;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Alumno;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.TipoDocumento;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NroDocumento;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Observacion;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.TipoSolicitud;
                }
            },            
            {
                data: null,
                render: function (data) {
                    if (data.Estado == "ENVIADO") {
                        return "<span class=\"badge badge-pill badge-primary\" style=\"background-color: #ffc107\">" + data.Estado + "</span>"   
                    } else if (data.Estado == "REGISTRADO"){
                        return "<span class=\"badge badge-pill badge-primary\" style=\"background-color: blue\">" + data.Estado + "</span>"
                    } else if (data.Estado == "PROCEDE"){
                        return "<span class=\"badge badge-pill badge-primary\" style=\"background-color: #198754\">" + data.Estado + "</span>"  
                    }else{
                        return "<span class=\"badge badge-pill badge-primary\" style=\"background-color: #dc3545\">" + data.Estado + "</span>"    
                    }
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.id_UsuarioRegistro;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FechaActualizacion != null ? data.FechaActualizacion : '-';
                }
            },
            {
                data: null,
                render: function (data) {
                    return "<button class=\"btn boton-tabla boton-verde btnCarnet\" type=\"button\" onclick=\"verPagosLista('"+ data.CodAlumno+"');\" title=\"Ver Pagos\"><span class=\"icon-credit-card\"></span></button>";
                }
            },
            {
                data: null,
                render: function (data) {          
                    return "<button class=\"btn boton-tabla boton-naranja btnCarnet\" type=\"button\" onclick=\"verCarnetSolicitud('"+ data.Op+"');\" title=\"Ver Carnet\"><span class=\"icon-eye\"></span></button>&nbsp;&nbsp;&nbsp;"+ 
                            "<button class=\"btn boton-tabla boton-azul\" type=\"button\" onclick=\"cambiarEstado('" + data.Op + "','" + data.Estado + "','" + data.CodAlumno + "','" + data.Alumno + "')\" title=\"Cambiar estado\"><span class=\"icon-loop2\"></span></button>&nbsp;&nbsp;&nbsp;"+
                            "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"eliminarCarnet('" + data.Op + "')\" title=\"Eliminar Tramite\"><span class=\"icon-bin\"></span></button>";
                            // "<button class=\"btn boton-tabla boton-verde\" type=\"button\" onclick=\"descargarSolicitudPDF('" + data.Op + "')\" title=\"Ver PDF\"><span class=\"icon-download\"></span></button>";  
                }
            }
            
        ],
        language: {
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
        }
    });
}

function cambiarEstado(op, estado, codAlumno, alumno)
{
    
	$.ajax({
        url: path + "atencionAlumno/carnetMedioPasaje",
        type: "POST",
        data: {
            opcion: "permisoCambiarEstado"
        },
        success: function(data)
        {
            var datos = JSON.parse(data);

            console.log("permiso", datos.data.aulas);

            if(datos.respuesta=="success")
            {
                if(datos.data !="vacio")
                {   
                    if(datos.data.aulas != "0")
                    {   
                        //PERMISO PARA REGINA
                        $("#contenedor_observacion").hide(200)
                        $("#modalCambiarEstadoAdmin").modal({backdrop: 'static', keyboard: false});
                        $("#op_canbiarEstadoAdmin").val(op)
                        $("#cod_estado").val(codAlumno)
                        $("#nombre_estado").val(alumno)

                    }else{
                        //PERMISO PARA COORDINADORAS
                        Notiflix.Report.Info("Aviso","No tiene permisos para realizar esta accion.","Cerrar");
                        return;
                        $("#modalCambiarEstadoCordina").modal({backdrop: 'static', keyboard: false});
                        $("#cambiarEstadoCordi").val(estado);
                    }
                }else{
                    Notiflix.Report.Warning('Aviso', 'Ocurrio un error, no se encontro el OP',"Cerrar");
                }

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

function eliminarCarnet(op)
{
    Notiflix.Confirm.Show(
    'Confirmación',
    '¿Desea continuar?',
    'Si',
    'No',
    function(){
        $.ajax({
            url: path + "atencionAlumno/carnetMedioPasaje",
            type: "POST",
            data: {
                opcion: "permisoCambiarEstado"
            },
            success: function(data)
            {
                var datos = JSON.parse(data);

                console.log("permiso", datos.data.aulas);

                if(datos.respuesta=="success")
                {
                    if(datos.data !="vacio")
                    {   
                        if(datos.data.aulas != "0")
                        {   
                            //PERMISO PARA REGINA
                            $.ajax({
                                url: path + "AtencionAlumno/carnetMedioPasaje",
                                type: "POST",
                                data: {
                                        op_canbiarEstadoAdmin: op,
                                        cambiarEstadoAdmin: '0',
                                        observacionAdmin: '',
                                        opcion: 'grabarCambiarEstadoCarnetAdmin'},
                                success: function(data)
                                {
                                    console.log(data);
                                    var datos = JSON.parse(data);
                                    if(datos.respuesta=="success")
                                    {
                                        Notiflix.Report.Success("Aviso","Se ha eliminado con exito.","Cerrar");
                                        listaCarnetMedioPasaje.ajax.reload(null, false);
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

                        }else{
                            //PERMISO PARA COORDINADORAS
                            Notiflix.Report.Info("Aviso", "Comuniquese con el Área Matrícula y Notas para realizar esta accion.","Cerrar");
                            return;
                            $("#modalCambiarEstadoCordina").modal({backdrop: 'static', keyboard: false});
                            $("#cambiarEstadoCordi").val(estado);
                        }
                    }else{
                        Notiflix.Report.Warning('Aviso', 'Ocurrio un error, no se encontro el OP',"Cerrar");
                    }

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
        // No button callbackalert('If you say so...');
    });
}

function grabarCambiarEstadoCarnetAdmin()
{
    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Desea continuar?',
        'Si',
        'No',
        function(){

            if($("#cambiarEstadoAdmin").val() == "4" && ($("#observacionAdmin").val() == "")){

                Notiflix.Report.Warning('Advertencia', 'Debe colocar una observacion');
                return

            }else if($("#cambiarEstadoAdmin").val() != "3" && $("#cambiarEstadoAdmin").val() != "4"){

                Notiflix.Report.Warning('Advertencia', 'Debe seleccionar un estado');
                return

            }else{

                var formData = new FormData($("#frmCambiarEstadoAdmin").get(0));
                formData.append('opcion', 'grabarCambiarEstadoCarnetAdmin');

                $.ajax({
                    url: path + "AtencionAlumno/carnetMedioPasaje",
                    type: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function(data)
                    {
                        console.log(data);
                        var datos = JSON.parse(data);
                        if(datos.respuesta=="success")
                        {
                            $("#modalCambiarEstadoAdmin").modal("hide");
                            Notiflix.Report.Success("Cambio Exitoso","Se ha realizado el cambio de estado exitosamente.","Cerrar");
                            listaCarnetMedioPasaje.ajax.reload(null, false);
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
        }
        ,function(){
            // No button callbackalert('If you say so...');
        });
}

function verCarnetSolicitud(op){

    $.ajax({
        url: path + "atencionAlumno/carnetMedioPasaje",
        type: "POST",
        data: {
            op: op,
            opcion: "verCarnetXAlumno"
        },
        success: function(data)
        {   
            var datos = JSON.parse(data);
            console.log("DATOX X ALUMNO", datos);
            if(datos.respuesta=="success")
            {
                if(datos.data !="vacio")
                {   

                    $("#modalVerTramite").modal({backdrop: 'static', keyboard: false});

                    $('#btnCancelar').click()

                    dat = datos.data[0];

                    $('#op_editar').val(dat.Op)
                    $('#dni_foto_editar').val(dat.NroDocumento.trim())
                    $('#dni_foto_editar_jpg').val(dat.Foto.trim())

                    $('#codAlumno_editar').val(dat.CodAlumno)
                    $('#nombres_editar').val(dat.Nombres)
                    $('#apellidoPaterno_editar').val(dat.ApellidoPaterno)
                    $('#apellidoMaterno_editar').val(dat.ApellidoMaterno)
                    $('#docIdentidad_editar').val(dat.NroDocumento.trim())
                    $('#fechaNacimiento_editar').val(dat.FechaNacimiento.substring(0, 10))
                    $('#telefono_editar').val(Number(dat.Telefono))
                    $('#correo_editar').val(dat.Correo)
                    $('#institucion_editar').val(dat.CodLocal.trim())
                    $('#sede_editar').val(dat.CodLocalInst.trim())

                    cambiarEspe_editar("#tipoEspecialidad_editar", dat.CodTipoEspecialidad.trim(), "#especialidad_editar", dat.CodEspecialidad.trim())

                    $('#ciclo_editar').val(dat.Ciclo.trim())
                    $('#turno_editar').val(dat.id_Turno.trim())

                    $("#fotoAlumno").children("img").attr("src", 'https://istalcursos.edu.pe/apiSiga/assets/carnetMedioPasaje/Fotos/'+dat.Foto);
                    
                    
                }else{
                    Notiflix.Report.Warning('Aviso', 'Ocurrio un error, no se encontro el OP',"Cerrar");
                }

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

function mostrarFormCarneMedioPasaje(codAlumno)
{
    $.ajax({
        url: path + "atencionAlumno/carnetMedioPasaje",
        type: "POST",
        data: {
            codAlumno: codAlumno,
            opcion: "validarAlumnoCarnetSemestre"
        },
        success: function(data)
        {   
            var datos = JSON.parse(data);
            console.log("da", datos);
            if(datos.respuesta=="success")
            {
                if(datos.data !="vacio")
                {   
                    

                    dat = datos.data[0];

                    $('#codAlumno').val(dat.cod_alumno)
                    $('#nombres').val(dat.nombres)
                    $('#apellidoPaterno').val(dat.ApeliidoPaterno)
                    $('#apellidoMaterno').val(dat.ApeliidoMaterno)
                    $('#docIdentidad').val(dat.NumDocumento.trim())
                    $('#fechaNacimiento').val(dat.fecha_naci.substring(0, 10))
                    $('#telefono').val(Number(dat.telefono))
                    $('#correo').val(dat.email)
                    $('#institucion').val(dat.cod_local.trim())
                    $('#sede').val(dat.cod_localinst.trim())

                    cambiarEspe("#tipoEspecialidad", dat.tipo_espe.trim(), "#especialidad", dat.cod_espe.trim())

                    $('#ciclo').val(dat.cod_ciclo.trim())
                    //$('#turno').val(dat.cod_turno.trim())
                    
                    
                    /*PARA LA FIRMA*/
                    const $canvas = document.getElementById('canvas');
                    const $canvasblank = document.getElementById('blank');
                    const $btnLimpiar = document.getElementById('btnLimpiar');
                    const contexto = $canvas.getContext('2d');
                    const contextoblank = $canvasblank.getContext('2d');
                    const COLOR_FONDO = 'white';
                    const COLOR_PINCEL = 'black';
                    const GROSOR = 2;
                    const xAnterior = 0, yAnterior = 0, xActual = 0, yActual = 0;
                    const obtenerXReal = (clientX) => clientX - $canvas.getBoundingClientRect().left;
                    const obtenerYReal = (clientY) => clientY - $canvas.getBoundingClientRect().top;
                    const inicioDibujo = false;
                    /*PARA DESKTOP*/
                    precargarFirmaDesktop($canvas, $btnLimpiar, contexto, contextoblank, COLOR_FONDO, COLOR_PINCEL, GROSOR, xAnterior, yAnterior, xActual, yActual, obtenerXReal, obtenerYReal, inicioDibujo);
                    /** PARA MÓVIL*/
                    precargarFirmarMobile($canvas, contexto, COLOR_PINCEL, GROSOR, xAnterior, yAnterior, xActual, yActual, obtenerXReal, obtenerYReal, inicioDibujo);
                }else{
                    Notiflix.Report.Warning('Aviso', 'Este tramite es unicamente para alumnos del semestre 2024-I',"Cerrar");
                }

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

function descargarZIPFotos(){
    $.ajax({
        url: path + "atencionAlumno/carnetMedioPasaje",
        type: "POST",
        data: {
            periodo: $('#semestres').val(),
            opcion: "descargarZipCarnetMP"
        },
        success: function(r)
        {
            
            var $a = $("<a>");
            $a.attr("href", r.data);
            $("body").append($a);
            $a.attr("download", "fotos_comprimidas.zip");
            $a[0].click();
            console.log("si");
            $a.remove();
            
        }
    });
}

/**********************
*VALIDAR FOTO DE CARNET
***********************/
function validarImagen(idArchivo, idImagen)
{   
    const foto = $("#"+idArchivo)
    //VALIDAR EXTENSION
    extensiones = /(.jpg)$/i
    if(!extensiones.exec(foto.val())){
        Notiflix.Report.Failure('Error',"El formato de la imagen debe de ser .jpg","Cerrar")
        foto.val("")
        document.getElementById(idImagen).src = "imagenotfound";
        return
    }
    //VALIDAR PESO 
    const size = foto[0].files[0].size
    if (size > 100000) {
        Notiflix.Report.Failure('Error',"El peso de su foto debe ser  máximo de 100kb ","Cerrar")
        foto.val("")
        document.getElementById(idImagen).src = "imagenotfound";
        return
    }
    //VALIDAR ALTO - ANCHO
    let img = new Image();
    img.onload = function dimension() {
        if (this.width.toFixed(0) > 307  || this.width.toFixed(0) < 250 ) {
            Notiflix.Report.Failure('Error',"Verifique que las medidas de alto y ancho estén en el rango de lo sugerido","Cerrar")
            foto.val("")
            document.getElementById(idImagen).src = "imagenotfound";
            return
        } 
        if (this.height.toFixed(0) > 378 || this.height.toFixed() < 300) {
            Notiflix.Report.Failure('Error',"Verifique que las medidas de alto y ancho estén en el rango de lo sugerido","Cerrar")
            foto.val("")
            document.getElementById(idImagen).src = "imagenotfound";
            return
        } 
    };
    
    setTimeout(() => {
        img.src = URL.createObjectURL(document.getElementById(idArchivo).files[0]);
        //VISTA PREVIA
        var reader = new FileReader();         
        reader.readAsDataURL(document.getElementById(idArchivo).files[0]);         
        reader.onload = function (e) {             
            document.getElementById(idImagen).src = e.target.result;         
        };
    }, 300);
        
}

function validarImagenes(file) {
    const foto = $(file);
    //VALIDAR EXTENSION
    extensiones = /(.jpg)$/i
    if (!extensiones.exec(foto.val())) {
        Notiflix.Report.Failure('Error', "El formato de la imagen debe de ser .jpg", "Cerrar")
        foto.val("")       
        return
    }
    //VALIDAR PESO 
    /**const size = foto[0].files[0].size
    if (size < 4000 || size > 50000) {
        Notiflix.Report.Failure('Error', "El peso de su foto debe ser mínimo de 4kb y máximo de 50kb ", "Cerrar")
        foto.val("")       
        return
    }**/
    //VALIDAR ALTO - ANCHO
    /** let img = new Image();
        img.onload = function dimension() {
        if (this.width.toFixed(0) < 180 || this.width.toFixed(0) > 240 || this.height.toFixed(0) < 240 || this.height.toFixed() > 290) {
            Notiflix.Report.Failure('Error', "Verifique que las medidas de alto y ancho estén en el rango de lo sugerido", "Cerrar")
            foto.val("")           
            return
        }
    };**/    
}

function cambiarEspe(text2, tipo2, text3, tipo3){
    $(text2).val(tipo2)
    cargarEspecialidades()
    setTimeout(() => {
        $(text3).val(tipo3)
    }, 300);
    
}

function cambiarEspe_editar(text2, tipo2, text3, tipo3){
    $(text2).val(tipo2)
    cargarEspecialidades_editar()
    setTimeout(() => {
        $(text3).val(tipo3)
    }, 300);
    
}

function cargarDistritos()
{
    $.ajax({
        url: path + "Ubigeo/Ubigeo",
        type: "POST",
        data: {
            opcion: "selectDistritosByIdProvincia",
            idProvincia: $("#provincia").val()
        },
        success: function (data)
        {
            //console.log(data);
            var cboDistrito = $("#distrito");

            cboDistrito.find('option').remove();

            var datos = JSON.parse(data);

            if (datos.respuesta == "success")
            {
                if (datos.distritos != "vacio")
                {
                    var distritos = datos.distritos;

                    cboDistrito.append('<option value="00" selected disabled="">SELECCIONE UNA OPCIÓN</option>');

                    for (i = 0; i < distritos.length; i++)
                    {
                        var distrito = distritos[i];
                        cboDistrito.append("<option value=\"" + distrito.id_Distrito + "\" >" + distrito.Descripcion + "</option>");
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}
function grabarTramiteCarneMedioPasaje()
{
    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Desea continuar?',
        'Si',
        'No',
        function(){

            let $canvas = document.getElementById('canvas');
            let $canvasblank = document.getElementById('blank');

            if($("#codAlumno").val() == null || $("#codAlumno").val() == "")
            {
                Notiflix.Report.Warning("Advertencia","Debe brindar su código de alumno","Cerrar");

            }else if($("#nombres").val() == null || $("#nombres").val() == "")
            {
                Notiflix.Report.Warning("Advertencia","Debe brindar sus nombres","Cerrar");

            }else if($("#apellidoPaterno").val() == null || $("#apellidoPaterno").val() == "")
            {
                Notiflix.Report.Warning("Advertencia","Debe brindar su apellido paterno","Cerrar");

            }else if($("#apellidoMaterno").val() == null || $("#apellidoMaterno").val() == "")
            {
                Notiflix.Report.Warning("Advertencia","Debe brindar su apellido materno","Cerrar");

            }else if(!Number.isInteger(parseInt($("#docIdentidad").val())))
            {
                Notiflix.Report.Warning('Error','Ingrese un documento de identificación válido',"Cerrar");

            }else if($("#docIdentidad").val().length < 8)
            {
                Notiflix.Report.Warning('Error','El mínimo de caracteres númericos en el documento de identificación es 8',"Cerrar");

            }else if($("#docIdentidad").val().length > 12)
            {
                Notiflix.Report.Warning('Error','Se ha superado la cantidad de caracteres númericos en el documento de identificación',"Cerrar");

            }else if($("#fechaNacimiento").val() == null || $("#fechaNacimiento").val() == "")
            {
                Notiflix.Report.Warning("Advertencia","Debe brindar su fecha de nacimiento","Cerrar");

            }else if($("#telefono").val() == null || $("#telefono").val() == "")
            {
                Notiflix.Report.Warning("Advertencia","Debe brindar su teléfono","Cerrar");

            }else if($("#correo").val() == null || $("#correo").val() == "")
            {
                Notiflix.Report.Warning("Advertencia","Debe brindar su correo","Cerrar");

            }else if($("#ciclo").val() == null || $("#ciclo").val() == "")
            {
                Notiflix.Report.Warning("Advertencia","Debe seleccionar su ciclo","Cerrar");

            }else if($("#turno").val() == null || $("#turno").val() == "")
            {
                Notiflix.Report.Warning("Advertencia","Debe seleccionar su turno","Cerrar");

            }else if($("#foto").val() == "")
            {
                Notiflix.Report.Warning('Advertencia', 'Debe subir su foto tamaño pasaporte');
            }

            else if (($("#firma_").val() == "" || $("#firma_").val() == null) && ($canvas.toDataURL() === $canvasblank.toDataURL())) {
                Notiflix.Report.Warning('Advertencia', 'Debe colocar su firma en formato jpg');
            // }
            // else if ($("#pago_").val() == "" || $("#pago_").val() == null) {
            //     Notiflix.Report.Warning('Advertencia', 'Debe subir su pago en formato jpg');
            
            }else if($("#tipoPago").val() == "1" && ($("#transaccion").val() == "" || $("#pagoFecha").val() == "")){

                Notiflix.Report.Warning('Advertencia', 'Falta VERIFICAR el pago');

            }else{
                console.log("son amores");
                document.getElementById('firma').value = $canvas.toDataURL();

                var formData = new FormData($("#frmCarneMedioPasaje").get(0));
                formData.append('opcion', 'grabarTramiteCarneMedioPasaje');

                $.ajax({
                    url: path + "AtencionAlumno/carnetMedioPasaje",
                    type: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function(data)
                    {
                        console.log(data);
                        var datos = JSON.parse(data);
                        if(datos.respuesta=="success")
                        {
                            $("#modalTramite").modal("hide");
                            Notiflix.Report.Success("Registro Exitoso","Se ha registrado exitosamente el trámite de carné de medio pasaje.","Cerrar");
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
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
        }
        ,function(){
            // No button callbackalert('If you say so...');
        });
}

function editarFotoCarnet()
{
    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Desea continuar?',
        'Si',
        'No',
        function(){

            if($("#foto_editar").val() == "")
            {
                Notiflix.Report.Warning('Advertencia', 'Debe subir su foto tamaño pasaporte');
            }else{

                var formData = new FormData($("#frmEditarFotoCarnet").get(0));
                formData.append('opcion', 'editarFoto');

                $.ajax({
                    url: path + "AtencionAlumno/carnetMedioPasaje",
                    type: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function(data)
                    {
                        console.log(data);
                        var datos = JSON.parse(data);
                        if(datos.respuesta=="success")
                        {
                            $("#modalVerTramite").modal("hide");
                            Notiflix.Report.Success("Cambio Exitoso","Se ha cambiado la foto del alumno.","Cerrar");
                            listaCarnetMedioPasaje.ajax.reload(null, false);
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
        }
        ,function(){
            // No button callbackalert('If you say so...');
        });
}

function editarDatosCarnet()
{
    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Desea continuar?',
        'Si',
        'No',
        function(){

                var formData = new FormData($("#frmEditarDatosCarnet").get(0));
                formData.append('opcion', 'editarTramiteCarneMedioPasaje');

                $.ajax({
                    url: path + "AtencionAlumno/carnetMedioPasaje",
                    type: "POST",
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function(data)
                    {
                        console.log(data);
                        var datos = JSON.parse(data);
                        if(datos.respuesta=="success")
                        {
                            $("#modalVerTramite").modal("hide");
                            Notiflix.Report.Success("Cambio Exitoso","Se ha editado exitosamente el trámite de carné de medio pasaje.","Cerrar");
                            listaCarnetMedioPasaje.ajax.reload(null, false);
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
            // No button callbackalert('If you say so...');
        });
}

function cargarGrafico1(){

    $.ajax({
        url: path + "AtencionAlumno/carnetMedioPasaje",
        type: "POST",
        data: {semestre: $('#semestres').val() , opcion: "graficoCarnet"},
        success: function(data)
        {
            var datos = JSON.parse(data);
            if(datos.respuesta=="success")
            {
               data = datos.data
               console.log(data);
                $("#divGraficoAlumnosNoPagantes").html("<canvas id='graficoAlumnoNoPagantes' width='300' height='190'></canvas>")
                const ctx = $('#graficoAlumnoNoPagantes');

                let datachart = [];
                let labels = [];
                data.forEach(function(value){
                    labels.push( value.Faltantes );
                    datachart.push( value.Regitrados );
                    datachart.push( value.Faltantes );
                    //datachart.push( value.TotalAlumnos.toFixed(2) );
                });

                const dataGrafico = {
                    labels: ["ALUMNOS REGISTRADOS", "ALUMNOS FALTAN REGISTRAR"],
                    datasets: [{
                        data: datachart,
                        backgroundColor: [
                            'rgb(112, 173, 70)',
                            'rgb(54, 162, 235)',
                            'rgb(230, 148, 92)',
                            'rgb(54, 162, 235)',
                            'rgb(75, 192, 192)',
                            'rgb(255, 205, 86)',
                            'rgb(255, 99, 132)',
                            'rgb(201, 203, 207)',
                            'rgb(83, 211, 87)',
                            'rgb(237, 208, 98)'
                        ],
                        hoverOffset: 5,
                        borderColor: "white",
                        borderWidth: 0.5
                    }] 
                }
                const opcionesGrafico = {
                    plugins: {
                        title: {
                            display: true,
                            text: 'ALUMNOS REGISTRADOS CARNET MEDIO PASAJE --- TOTAL ALUMNOS ' + $('#semestres').val() + ' : ' + data[0].TotalAlumnos
                        },
                        legend: {
                            display: true,
                            position : "left",
                        },
                        datalabels: {                         
                            anchor: "center",
                            formatter: (dato) => dato,
                            color: "white",
                            font: {
                                family: '"Arial"',
                                size: "13",
                                weight: "700",
                            },
                        }
                    },
                    layout: {
                        padding: 5
                    },
                    reponsive : false,
                    maintainAspectRatio : false
                }
                var chartx =  new Chart( ctx , {
                    plugins: [ChartDataLabels],
                    type: 'pie',
                    data: dataGrafico,
                    options : opcionesGrafico
                });

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

function cargarEspecialidades_editar( enlazado , todos = false , func = null ) {
    var institucion = $("#institucion_editar").val();
    var tipoEspecialidad = $("#tipoEspecialidad_editar").val();

    $.ajax({
        url: path + "especialidad/getEspecialidades",
        type: "POST",
        data: {
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad
        },
        success: function (data) {
            //console.log(data);
            var cboEspecialidad = $("#especialidad_editar");
            cboEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.especialidades != "vacio") {
                    var especialidades = datos.especialidades;
                    
                    if(todos){
                        cboEspecialidad.append("<option value='0'>TODOS</option>");
                    }

                    for (i = 0; i < especialidades.length; i++) {
                        var especialidad = especialidades[i];
                        cboEspecialidad.append("<option value=\"" + especialidad.cod_espe + "\" >" + especialidad.cod_espe + " - " + especialidad.descripcionM + "</option>");
                    }

                    if (func !== null) {
                        func();
                    }

                    if (enlazado == true) {
                        cargarMallaCurriculares(enlazado);
                    }                    

                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

/**
 * PARA FIRMA DIGITAL
*/
function precargarFirmaDesktop($canvas, $btnLimpiar, contexto, contextoblank, COLOR_FONDO, COLOR_PINCEL, GROSOR, xAnterior, yAnterior, xActual, yActual, obtenerXReal, obtenerYReal, inicioDibujo)
{

    const limpiarCanvas = () => {
        //Colocar color blanco en fondo de canvas
        contexto.fillStyle = COLOR_FONDO;
        contexto.fillRect(0, 0, $canvas.width, $canvas.height);

        contextoblank.fillStyle = COLOR_FONDO;
        contextoblank.fillRect(0, 0, $canvas.width, $canvas.height);
    };

    $btnLimpiar.addEventListener('click', () => {
        contexto.fillStyle = COLOR_FONDO;
        contexto.fillRect(0, 0, $canvas.width, $canvas.height);
    });

    $canvas.addEventListener(["mousedown"], evento => {
        //En este evento solo se ha iniciado el clic, así que dibujamos un punto
        xAnterior = xActual;
        yAnterior = yActual;
        xActual = obtenerXReal(evento.clientX);
        yActual = obtenerYReal(evento.clientY);
        contexto.beginPath();
        contexto.fillStyle = COLOR_PINCEL;
        contexto.fillRect(xActual, yActual, GROSOR, GROSOR);
        contexto.closePath();
        // Y establecemos la bandera
        inicioDibujo = true;
    });

    $canvas.addEventListener("mousemove", (evento) => {
        if (!inicioDibujo) {
            return;
        }
        //El mouse se está moviendo y el usuario está presionando el botón, así que dibujamos todo
        xAnterior = xActual;
        yAnterior = yActual;
        xActual = obtenerXReal(evento.clientX);
        yActual = obtenerYReal(evento.clientY);
        contexto.beginPath();
        contexto.moveTo(xAnterior, yAnterior);
        contexto.lineTo(xActual, yActual);
        contexto.strokeStyle = COLOR_PINCEL;
        contexto.lineWidth = GROSOR;
        contexto.stroke();
        contexto.closePath();
    });

    $btnLimpiar.addEventListener('click', limpiarCanvas);

    ["mouseup", "mouseout"].forEach(nombreDeEvento => {
        $canvas.addEventListener(nombreDeEvento, () => {
            inicioDibujo = false;
        });
    });
}

function precargarFirmarMobile($canvas, contexto, COLOR_PINCEL, GROSOR, xAnterior, yAnterior, xActual, yActual, obtenerXReal, obtenerYReal, inicioDibujo)
{

    $canvas.addEventListener("touchstart", (evento) => {

        xAnterior = xActual;
        yAnterior = yActual;
        xActual = obtenerXReal(evento.touches[0].clientX);
        yActual = obtenerYReal(evento.touches[0].clientY);
        contexto.beginPath();
        contexto.fillStyle = COLOR_PINCEL;
        contexto.fillRect(xActual, yActual, GROSOR, GROSOR);
        contexto.closePath();
        inicioDibujo = true;

    });

    $canvas.addEventListener("touchend", (evt) => {

        inicioDibujo = false;

    });

    $canvas.addEventListener("touchcancel", (evt) => {

        inicioDibujo = false;

    });

    $canvas.addEventListener("touchleave", (evt) => {

        inicioDibujo = false;

    });

    $canvas.addEventListener("touchmove",  (evento) => {

        if (!inicioDibujo) {
            return;
        }
        //El mouse se está moviendo y el usuario está presionando el botón, así que dibujamos todo
        xAnterior = xActual;
        yAnterior = yActual;
        xActual = obtenerXReal(evento.touches[0].clientX);
        yActual = obtenerYReal(evento.touches[0].clientY);
        contexto.beginPath();
        contexto.moveTo(xAnterior, yAnterior);
        contexto.lineTo(xActual, yActual);
        contexto.strokeStyle = COLOR_PINCEL;
        contexto.lineWidth = GROSOR;
        contexto.stroke();
        contexto.closePath();

    });

}


