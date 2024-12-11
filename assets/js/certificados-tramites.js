$(document).ready(function () {

    Notiflix.Loading.Init({
        clickToClose: true
    });

    $('#seccion_fechaEntrega').hide()

    cargarInstituciones(true);
    cargarInstituciones2(true);

    $('#inputBuscar').focus();
    $("#inputBuscar").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "Certificados/tramites",
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarCodigoAndAlumnos'
                },
                success: function (data) {
                    $("#alumno").removeAttr("data-code");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');

                    response(data.alumnos);
                }
            });
        },
        minLength: 3,
        select: function (event, ui) {
            $('#inputBuscar').attr('data-code', ui.item.codigo);
            $("#inputBuscar").val(ui.item.nombre);
            $("#inputBuscar").next('i').removeClass('glyphicon-remove');
            $("#inputBuscar").next('i').addClass('glyphicon-ok');
            $("#inputBuscar").parent().removeClass('has-error');
            $("#inputBuscar").parent().addClass('has-success');

            $('#codigo_alumno_lista').val(ui.item.codigo.trim());

            return false;
        }
    })
    .autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.codigo + " - " + item.nombre + "</div>")
            .appendTo(ul);
    };
    // $('#tablaListado').DataTable();
    $("#alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Certificados/tramites",
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarCodigoAndAlumnos'
                },
                success: function(data){
                    $("#alumno").removeAttr("data-code");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');

                    response(data.alumnos);
                }
            });
        },
        minLength: 3,
        select: function(event, ui){
            $('#alumno').attr('data-code', ui.item.codigo);
            $("#alumno").val(ui.item.nombre);
            $("#alumno").next('i').removeClass('glyphicon-remove');
            $("#alumno").next('i').addClass('glyphicon-ok');
            $("#alumno").parent().removeClass('has-error');
            $("#alumno").parent().addClass('has-success');

            $('#codigo_alumno').val(ui.item.codigo.trim());
            seleccionarEspecialidadAutomatico(ui.item.codigo.trim(), null);

            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .append( "<div>" + item.codigo + " - " +item.nombre + "</div>" )
            .appendTo( ul );
    };
    
});

$(document).on("change", "#institucion", function () {
    cargarTipoEspecialidades(true);
});

$(document).on("change", "#tipoEspecialidad", function () {
    cargarEspecialidades(true);
});

$(document).on("change", "#especialidad, #tipoCertificado", function () {
    modularDatos()
});

$(document).on("change", "#Semestre", function () {
    $.ajax({
        url: path + "Certificados/tramites",
        type: "POST",
        data: {
            opcion: 'fechasSemestres',
            Semestre: $('#Semestre').val()
        },
        beforeSend: function(){
        },
        success: function(data){            
            let datos = JSON.parse(data);
            console.log("fecha", datos);
            
            if (datos.respuesta === 'success') {         
                $('#fechaInicio').val(datos.data[0].inicio_periodo_cert)
                $('#fechaFinal').val(datos.data[0].fin_periodo_cert)
            } else{
                $('#fechaInicio').val(null)
                $('#fechaFinal').val(null)
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

});

$(document).on("change", "#estado", function () {
    if($('#estado').val() == "ENTREGADO"){
        $('#seccion_fechaEntrega').show()
    }else{
        $('#seccion_fechaEntrega').hide()
        $('#fechaEntrega').val('')
    }
});

$('#modalNuevoTramite').on('hidden.bs.modal', function () {
    $('#seccion_fechaEntrega').hide()
    $('#fechaEntrega').val('')
    $('#seccionModuloFormativo').hide()
    $('#moduloFormativo').val(null)

    $('#fechaInicio').val(null)
    $('#fechaFinal').val(null)
    $('#Horas').val('')
    $('#creditos').val('')
    console.log("cerrar modal");
    
});


document.addEventListener('click', (e) => {
    if (e.target.matches('#btnVerModalNuevo')) {
        Notiflix.Report.Success("Ooops, Aviso", "Tiene que ir al modulo Tramites Certificados", "Aceptar");
        return
        $("#tituloModal").html("REGISTRAR TRÁMITE");
        $("#btn_modal").addClass("btn-info").removeClass("btn-primary")
        $("#btn_modal").html("Registrar");

        $("#codigoTramite").val("");
        $("#alumno").prop("readonly", false);
        document.getElementById("form-tramite").reset();

        $("#modalNuevoTramite").modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    if (e.target.matches("#btnBuscar")) {
        Notiflix.Report.Success("Ooops, Aviso", "Tiene que ir al modulo Tramites Certificados", "Aceptar");
        return
        mostrarData();
    }

    if (e.target.matches('#btnCancelar')) {
        $("#modalEditarOficio").modal('hide');
        $("#alumno_edit").next('i').removeClass('glyphicon-remove');
        $("#alumno_edit").parent().removeClass('has-error');
    }

    if (e.target.matches('#selectAll')) {
        $(".column input[type=checkbox]").trigger('click');
    }

    if (e.target.matches("#btnReporte")) {
        reporteTramites();
    }

});


$('#form-tramite').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "registrar" });
    console.log("data", form)

    $.ajax({
        url: path + "Certificados/tramites",
        type: "POST",
        data: form,
        beforeSend: function(){
            $(".text-loader").html("Guardando informacion...");
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("body").css({ "padding": 0 });
        },
        success: function(data){
            $("#modalLoader").modal("hide");

            let datos = JSON.parse(data);
            if (datos.respuesta === 'success') {         
                $("#modalNuevoTramite").modal("hide");
                $("#codigoTramite").val("");
                Notiflix.Notify.Success('Registrado correctamente');
                document.getElementById("form-tramite").reset();
            } else{
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

})


function seleccionarEspecialidadAutomatico(codigo, cod_sede) {

    $.ajax({
        url: path + "certificados/tramites",
        type: "POST",
        dataType: "JSON",
        data: {
            codigo: codigo,
            opcion: 'cargarEspecialidadesPorAlumno'
        },
        beforeSend: function () {
            Notiflix.Loading.Hourglass('Cargando...');
            $("#especialidad").html("<option value='NINGUNO'>NINGUNO</option>");
        },
        complete: function (data) {
            $("#NotiflixLoadingWrap").trigger("click");
        },
        success: function (data) {
            console.log("dataprra",data)
            if (data.respuesta === 'success') {  
                data.data2.forEach(e => {
                    $("#especialidad").append(`                            
                            <option value="${e.cod_espe.trim()}">${e.descripcionM.trim()}</option>
                        `);
                });        
                if (data.dataEspAlum != "vacio"){
                    $('#especialidad').val(data.dataEspAlum[0].cod_espe.trim());
                    
                    data.dataEspAlum.forEach(a => {
                    //var selected = a.cod_localinst.trim() === "01" ? "selected" : "";
                    $("#sede").append(`                            
                            <option value="${a.cod_localinst.trim()}">${a.Sede.trim()}</option>
                        `);
                    }); 

                    if(cod_sede === null){
                        $("#sede").val("01");
                    }else if(cod_sede != ''){
                        $('#sede').val(cod_sede);
                    }
                    
                }else{
                    Notiflix.Notify.Failure('No se encontro la especialidad, por favor coloque manualmente');
                }
                
            }

        }
    });

}

function mostrarData()
{   
    const cod_alumno = $("#inputBuscar").val();
    const local = $("#institucion2").val();
    const tipo_espe = $("#tipoEspecialidad2").val();
    const especialidad = $("#especialidad_lista").val();

    const fecha_1 = $("#fecha_1").val();
    const fecha_2 = $("#fecha_2").val();

    const estado = $("#estadoFiltro").val();
    const tipoCert = $("#tipoCertificadoFiltro").val();


    tablaTramite = $("#tablaListado").DataTable({
        destroy: 'true',
        searching: true,
        processing: false,
        responsive: true,
        ordering:  false,
        dom: 'frtip',
        // buttons: [
        //     // { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'},
        //     { "extend": 'pdf', "text":'Reporte PDF',"className": 'btn-important'}
        // ],
        lengthMenu: [
            [20, 50, -1], 
            [20, 50, 'TODO']
        ],
        ajax: {
            url: path + "Certificados/tramites",
            type: "POST",
            data: {
                cod_alumno: cod_alumno,
                local_lista: local,
                tipo_lista: tipo_espe,
                especialidad: especialidad,
                fecha_1: fecha_1,
                fecha_2: fecha_2,
                estado: estado,
                tipoCert: tipoCert,
                opcion: 'listaBuscarAlumnos'
            },
            dataSrc: function(data){      
                console.log("dataListBuscarAlumnos", data) 
                if(data.respuesta == "success" && data.lista !== "vacio"){
                    return data.lista; 
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
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.numero;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.tipoCertificado;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Especialidad.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.CodAlumno.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Alumno.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FechaTramite.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FechaExpedicion.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.UltSemestre;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Costo.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    let marca = '';
                    if(data.c1 == '1'){
                        marca += '<b> 1(☑) </b> '
                    }
                    if(data.c2 == '1'){
                        marca += '<b>2(☑) </b> '
                    }
                    if(data.c3 == '1'){
                        marca += '<b>3(☑) </b> '
                    }
                    if(data.c4 == '1'){
                        marca += '<b>4(☑) </b> '
                    }
                    if(data.c5 == '1'){
                        marca += '<b>5(☑) </b> '
                    }
                    if(data.c6 == '1'){
                        marca += '<b>6(☑) </b> '
                    }

                    return marca;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.observaciones.trim();
                }
            },
            {
                data: null,
                render: function (data) {

                    if (data.Estado == "TRAMITE") {
                        return "<span class=\"badge badge-pill badge-primary\" style=\"background-color: #eab308\">" + data.Estado + "</span>"
                    } else if (data.Estado == "PROCESO"){
                        return "<span class=\"badge badge-pill badge-primary\" style=\"background-color: #3b82f6\">" + data.Estado + "</span>"
                    } else if (data.Estado == "ENTREGADO"){
                        return "<span class=\"badge badge-pill badge-primary\" style=\"background-color: #22c55e\">" + data.Estado + "</span>"
                    }else{
                        return "<span class=\"badge badge-pill badge-primary\" style=\"background-color: #198754\">" + data.Estado + "</span>"
                    }
                }
            },          
            {
                data: null,
                render: function (data) {
                    return data.FechaReg.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Usuario.trim();
                }
            },   
            {
                data: null,
                render: function (data) {
                    return data.codtramite;
                }
            },
            {
                data: null,
                render: function(data){                    

                    if(data.tipoCertificado == "ESTUDIO"){
                            return  "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"editarTramite('"+ data.codtramite +"','"+ data.Alumno.trim() +"');\" title=\"Editar Trámite\"><span class=\"icon-pencil\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                             "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"eliminarTramite('"+ data.codtramite +"','"+ data.numero +"');\" title=\"Eliminar Trámite\"><span class=\"icon-cross\"></span></button>"+
                              "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"verReportePDF('"+ data.codtramite +"','"+ data.Alumno.trim() +"','"+ data.Especialidad.trim() +"');\" title=\"Ver Trámite\"><span class=\"icon-file-pdf\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
                                        
                    }else{
                        return   "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"verReportePDF('"+ data.codtramite +"','"+ data.Alumno.trim() +"','"+ data.Especialidad.trim() +"');\" title=\"Ver Trámite\"><span class=\"icon-file-pdf\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                             "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"editarTramite('"+ data.codtramite +"','"+ data.Alumno.trim() +"');\" title=\"Editar Trámite\"><span class=\"icon-pencil\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                             "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"eliminarTramite('"+ data.codtramite +"','"+ data.numero +"');\" title=\"Eliminar Trámite\"><span class=\"icon-cross\"></span></button>";
                                        
                    }
                }
            },
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

function editarTramite(cod_tramite, alumnoData) {

    //var codigo_tramite = $(btn).parent().parent().find("td").eq(15).html();
    var codigo_tramite = cod_tramite;

    //var alumno = $(btn).parent().parent().find("td").eq(6).html();
    var alumno = alumnoData;

    $.ajax({
        url: path + "Certificados/tramites",
        type: "POST",
        data: {
            codigo_tramite: codigo_tramite,
            opcion: 'buscar_editar'
        },
        success: function (data) {
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                console.log(datos)

                const datex = datos.datex[0];
                
                $("#codigoTramite").val(codigo_tramite);

                $("#codigo_alumno").val(datex.Cod_Alumno);
                $("#alumno").val(alumno);
                $("#institucion").val(datex.Cod_Local);
                $("#tipoEspecialidad").val(datex.Tipo_Espe);
                $("#especialidad").val(datex.Cod_Espe);
                $("#nro_certificado").val(datex.numero);
                $("#fecha").val(datex.FechaTramite.substr(0, 10));
                $("#fecha_expedicion").val(datex.FechaExpedicion.substr(0, 10));
                $("#costo").val(datex.Costo);

                datex.c1 == "1" ? $("#c1").prop("checked", true) : $("#c1").prop("checked", false)
                datex.c2 == "1" ? $("#c2").prop("checked", true) : $("#c2").prop("checked", false)
                datex.c3 == "1" ? $("#c3").prop("checked", true) : $("#c3").prop("checked", false)
                datex.c4 == "1" ? $("#c4").prop("checked", true) : $("#c4").prop("checked", false)
                datex.c5 == "1" ? $("#c5").prop("checked", true) : $("#c5").prop("checked", false)
                datex.c6 == "1" ? $("#c6").prop("checked", true) : $("#c6").prop("checked", false)

                $("#observaciones").val(datex.Observaciones);
                $("#estado").val(datex.Estado);
                if(datex.Estado == "ENTREGADO"){
                    $('#seccion_fechaEntrega').show()
                }else{
                    $('#seccion_fechaEntrega').hide()
                }
                $("#fechaEntrega").val(datex.fechaEntrega);
                $("#Semestre").val(datex.semestre);
                $("#fechaInicio").val(datex.fechaInicio);
                $("#fechaFinal").val(datex.fechaFinal);
                $("#Horas").val(datex.horas);
                $("#creditos").val(datex.creditos);
                $('#tipoCertificado').val(datex.tipoCertificado)
                setTimeout(() => {
                    modularDatos()
                    if(datex.tipoCertificado != 'ESTUDIO'){
                        setTimeout(() => {
                            $("#moduloFormativo").val(datex.moduloFormativo);
                        }, 300);
                    }                    
                }, 500);
                

                $("#btn_modal").addClass("btn-primary").removeClass("btn-info")
                $("#btn_modal").html("Editar");

                seleccionarEspecialidadAutomatico(datex.Cod_Alumno, datex.Cod_LocalInst)

            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });

    $("#alumno").prop("readonly", true);

    //$("#alumno").focus();
    $("#tituloModal").html("Editando Trámite");
    $("#modalNuevoTramite").modal({ backdrop: 'static', keyboard: false });

}

function reporteTramites() {
    const cod_alumno = $("#inputBuscar").val();
    const local = $("#institucion2").val();
    const tipo_espe = $("#tipoEspecialidad2").val();
    const especialidad = $("#especialidad_lista").val();

    const fecha_1 = $("#fecha_1").val();
    const fecha_2 = $("#fecha_2").val();

    const estado = $("#estadoFiltro").val();
    const tipoCert = $("#tipoCertificadoFiltro").val();

    $.ajax({
        url: path + "Certificados/tramites",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "exportarReporteTramites",
            cod_alumno: cod_alumno,
            local_lista: local,
            tipo_lista: tipo_espe,
            especialidad: especialidad,
            fecha_1: fecha_1,
            fecha_2: fecha_2,
            estado: estado,
            tipoCert: tipoCert            
        },
        beforeSend: function () {
            $('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            $("#modalLoader").modal();
            $("body").css({ "padding": 0 });
        },
        complete: function () {
            $("#modalLoader").modal("hide");
        },
        success: function (response) {
            console.log(response);

            if (response.respuesta === "success") {

                $("#modalVistaPreviaCertificado").modal("show")
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                let pdf = '<iframe src="' + response.reporte + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);

            } else {

                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                Notiflix.Notify.Failure("No hay datos la fecha seleccionada");

            }
        },
    })
}

function eliminarTramite(cod_tramite, numero) {

    var codigo_tramite = cod_tramite;

    var nro_certificado = numero;
    //var alumno = $(btn).parent().parent().find("td").eq(6).html();

    Notiflix.Confirm.Show(
        'Eliminar Tramite',
        '¿Esta segura de eliminar el certificado? Nro. : '+ nro_certificado +'',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "Certificados/tramites",
                type: "POST",
                data: {
                    codigo_tramite: codigo_tramite,
                    opcion: 'eliminar_trami'
                },
                success: function (data) {
                    var datos = JSON.parse(data);
                    if (datos.respuesta == "success") {
                        tablaTramite.ajax.reload(null, false);
                        console.log(datos)

                    } else {
                        var errores = "";
                        for (i = 0; i < datos.errores.length; i++) {
                            errores += datos.errores[i] + "<br>";
                        }
                        mostrarMensaje("error", "ERROR", errores);
                    }
                }
            });

            $("#alumno").prop("readonly", true);
        },
        function cancelCb() {

        },
        {
        },
    );

}

function modularDatos(){
    if($('#tipoCertificado').val() == "MODULAR 2020") {
        $('#seccionModuloFormativo').show()
        if($('#especialidad').val() == "03") {
            $("#moduloFormativo").html(
                "<option value='PROMOCIÓN DE LA SALUD'>PROMOCIÓN DE LA SALUD</option>"+    
                "<option value='ATENCIÓN PRIMARIA EN SALUD'>ATENCIÓN PRIMARIA EN SALUD</option>"+
                "<option value='ASISTENCIA EN LAS NECESIDADES BÁSICAS DE SALUD DE LA PERSONA'>ASISTENCIA EN LAS NECESIDADES BÁSICAS DE SALUD DE LA PERSONA</option>"+    
                "<option value='ASISTENCIA EN LOS CUIDADOS INTEGRALES DE SALUD DE LA PERSONA'>ASISTENCIA EN LOS CUIDADOS INTEGRALES DE SALUD DE LA PERSONA</option>"
            );
        }
        if($('#especialidad').val() == "04") {
            $("#moduloFormativo").html(
                "<option value='FARMACIA COMUNITARIA Y PREVENCIÓN EN SALUD'>FARMACIA COMUNITARIA Y PREVENCIÓN EN SALUD</option>"+    
                "<option value='EXPENDIO DE MEDICAMENTOS EN ESTABLECIMIENTOS FARMACÉUTICOS'>EXPENDIO DE MEDICAMENTOS EN ESTABLECIMIENTOS FARMACÉUTICOS</option>"+
                "<option value='ASISTENCIA DOCUMENTARIA Y ADMINISTRATIVA DE LOS ESTABLECIMIENTOS FARNACÉUTICOS'>ASISTENCIA DOCUMENTARIA Y ADMINISTRATIVA DE LOS ESTABLECIMIENTOS FARNACÉUTICOS</option>"+
                "<option value='ASISTENCIA EN LA ELABORACIÓN DEE PRODUCTOS FARMACÉUTICOS, FÓRMULAS MAGISTRALES Y PREPARADOS OFICINALES'>ASISTENCIA EN LA ELABORACIÓN DEE PRODUCTOS FARMACÉUTICOS, FÓRMULAS MAGISTRALES Y PREPARADOS OFICINALES</option>"
            );
        }
        if($('#especialidad').val() == "06") {
            $("#moduloFormativo").html(
                "<option value='PREVENCIÓN DE LA SALUD FÍSICA'>PREVENCIÓN DE LA SALUD FÍSICA</option>"+    
                "<option value='ASISTENCIA EN LA EVALUACIÓN FISIOTERAPÉUTICA'>ASISTENCIA EN LA EVALUACIÓN FISIOTERAPÉUTICA</option>"+
                "<option value='TÉCNICAS DE TRATAMIENTOS CON MASAJES Y APLICACION DE EJERCICIOS TERAPÉUTICOS'>TÉCNICAS DE TRATAMIENTO CON MASAJES Y APLICACION DE EJERCICIOS TERAPÉUTICOS</option>"+
                "<option value='TERAPIAS DE REHABILITACIÓN  Y MANEJO DE AGENTES FÍSICOS'>TERAPIAS DE REHABILITACIÓN  Y MANEJO DE AGENTES FÍSICOS</option>"
            );
        }
        if($('#especialidad').val() == "05") {
            $("#moduloFormativo").html(
                "<option value='PROCEDIMIENTOS PREANALÍTICOS, ANÁLISIS INSTRUMENTAL Y EQUIPOS EN LABORATORIO Y ANATOMÍA PATÓLOGICA'>PROCEDIMIENTOS PREANALÍTICOS, ANÁLISIS INSTRUMENTAL Y EQUIPOS EN LABORATORIO Y ANATOMÍA PATÓLOGICA</option>"+    
                "<option value='ASISTENCIA EN LOS PROCEDIMIENTOS DE ANÁLISIS DE MUESTRAS BIOLÓGICAS HUMANAS'>ASISTENCIA EN LOS PROCEDIMIENTOS DE ANÁLISIS DE MUESTRAS BIOLÓGICAS HUMANAS</option>"
            );
        }
        if($('#especialidad').val() == "09") {
            $("#moduloFormativo").html(
                "<option value='DISEÑO DE APARATOLOGÍA DENTAL, APARATO DE ORTODONCIA Y ORTOPEDIA FUNCIONAL Y PROSTÉTICO DENTALES'>DISEÑO DE APARATOLOGÍA DENTAL, APARATO DE ORTODONCIA Y ORTOPEDIA FUNCIONAL Y PROSTÉTICO DENTALES</option>"+    
                "<option value='ELABORACIÓN DE APARATOLOGÍA DENTAL, PARCIAL Y TOTAL'>ELABORACIÓN DE APARATOLOGÍA DENTAL, PARCIAL Y TOTAL</option>"+
                "<option value='ELABORACIÓN DE APARATOS DE ORTODONCIA, ORTOPÉDIA FUNCIONAL Y PROSTÉTICOS DENTALES'>ELABORACIÓN DE APARATOS DE ORTODONCIA, ORTOPÉDIA FUNCIONAL Y PROSTÉTICOS DENTALES</option>"+
                "<option value='REPARACIÓN Y MANTENIMIENTO DE APARATOLOGÍA DENTAL'>REPARACIÓN Y MANTENIMIENTO DE APARATOLOGÍA DENTAL</option>"
            );
        }
    }else if($('#tipoCertificado').val() == "MODULAR 2014-2019") {
        $('#seccionModuloFormativo').show()
        if($('#especialidad').val() == "03") {
            $("#moduloFormativo").html(
                "<option value='ATENCIÓN PRIMARIA EN SALUD'>ATENCIÓN PRIMARIA EN SALUD</option>"+  
                "<option value='SERVICIOS TÉCNICOS DE ENFERMERÍA ASISTENCIAL'>SERVICIOS TÉCNICOS DE ENFERMERÍA ASISTENCIAL</option>"+
                "<option value='SERVICIOS TÉCNICOS DE ENFERMERÍA ESPECIALIZADA'>SERVICIOS TÉCNICOS DE ENFERMERÍA ESPECIALIZADA</option>"
            );
        }
        if($('#especialidad').val() == "04") {
            $("#moduloFormativo").html(
                "<option value='ATENCIÓN DE URGENCIAS Y ADMINISTRACIÓN EN UNA OFICINA FARMACÉUTICA'>ATENCIÓN DE URGENCIAS Y ADMINISTRACIÓN EN UNA OFICINA FARMACÉUTICA</option>"+    
                "<option value='DISPENSACIÓN DE MEDICAMENTOS Y ATENCIÓN EN FARMACIA'>DISPENSACIÓN DE MEDICAMENTOS Y ATENCIÓN EN FARMACIA</option>"+
                "<option value='ELABORACIÓN Y COMERCIALIZACIÓN DE PRODUCTOS FARMACÉUTICOS Y AFINES'>ELABORACIÓN Y COMERCIALIZACIÓN DE PRODUCTOS FARMACÉUTICOS Y AFINES</option>"
            );
        }
        if($('#especialidad').val() == "06") {
            $("#moduloFormativo").html(
                "<option value='TRATAMIENTOS EN PEDIATRIA Y APRESTAMIENTO PSICOMOTOR'>TRATAMIENTOS EN PEDIATRIA Y APRESTAMIENTO PSICOMOTOR</option>"+    
                "<option value='TERAPIAS DE REHABILITACIÓN INDIVIDUAL, GRUPAL Y MASOTERAPIA'>TERAPIAS DE REHABILITACIÓN INDIVIDUAL, GRUPAL Y MASOTERAPIA</option>"+
                "<option value='TRATAMIENTOS EN REUMATOLOGÍA, TRAUMATOLOGIA, ORTOPEDIA Y NEUROLOGIA'>TRATAMIENTOS EN REUMATOLOGÍA, TRAUMATOLOGIA, ORTOPEDIA Y NEUROLOGIA</option>"+
                "<option value='TERAPIAS CON AGENTES FISICOS Y APARATOS MECANICOS O TRACCION'>TERAPIAS CON AGENTES FISICOS Y APARATOS MECANICOS O TRACCION</option>"+
                "<option value='TRATAMIENTOS EN GERIATRÍA, GINECOLOGÍA Y MEDICINA INTERNA'>TRATAMIENTOS EN GERIATRÍA, GINECOLOGÍA Y MEDICINA INTERNA</option>"
            );
        }
        if($('#especialidad').val() == "05") {
            $("#moduloFormativo").html(
                "<option value='INSTRUMENTACIÓN Y LABORATORIO CLINICO EN SALUD PÚBLICA'>INSTRUMENTACIÓN Y LABORATORIO CLINICO EN SALUD PÚBLICA</option>"+    
                "<option value='MICROBIOLOGIA, PARASITOLOGIA, UROANALISIS Y CITOLOGIA EN SALUD'>MICROBIOLOGIA, PARASITOLOGIA, UROANALISIS Y CITOLOGIA EN SALUD</option>"+
                "<option value='BIOQUÍMICA, INMUNOLOGÍA, HEMATOLOGÍA, HEMOTERAPIA Y BANCO DE SANGRE EN SALUD'>BIOQUÍMICA, INMUNOLOGÍA, HEMATOLOGÍA, HEMOTERAPIA Y BANCO DE SANGRE EN SALUD</option>"
            );
        }
        if($('#especialidad').val() == "09") {
            $("#moduloFormativo").html(
                "<option value='PRÓTESIS FIJA'>PRÓTESIS FIJA</option>"+    
                "<option value='PRÓTESIS PARCIAL REMOVIBLE'>PRÓTESIS PARCIAL REMOVIBLE</option>"+
                "<option value='APARATOS DE ORTODONCIA Y ORTOPEDIA FUNCIONAL'>APARATOS DE ORTODONCIA Y ORTOPEDIA FUNCIONAL</option>"+
                "<option value='PRÓTESIS TOTAL'>PRÓTESIS TOTAL</option>"
            );
        }
    }else{
        $('#seccionModuloFormativo').hide()
        $('#moduloFormativo').val(null)

        $('#fechaInicio').val(null)
        $('#fechaFinal').val(null)
        $('#Horas').val('')
        $('#creditos').val('')
    }
}

function verReportePDF(cod_tramite, nombre, especialidad) {
    //const op = $(btn).attr("codigo");
    $.ajax({
        url: path + "Certificados/tramites",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "solicitudPDF",
            codigo_tramite: cod_tramite,
            nombre: nombre,
            especialidad: especialidad
        },
        beforeSend: function () {
            //$('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            //$("#modalLoader").modal();
        },
        complete: function () {
            //$("#modalLoader").modal("hide");
        },
        success: function (response) {

            if (response.respuesta === "success") {

                $("#modalVistaPreviaCertificado").modal("show")
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                let pdf = '<iframe src="' + response.solicitud + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);

            } else {

                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado", "Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }
        },
    })
}