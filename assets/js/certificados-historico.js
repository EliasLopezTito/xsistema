$(document).ready(function(){

    $("#alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Programacion/descargarBoleta",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function(data){

                    $("#alumno").attr("codigo","");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');
                    
                    $("#btnActivarEdicion").prop("disabled",true);
                    $("#btnGuardarEdicion").prop("disabled",true);
                    $("#btnCancelarEdicion").prop("disabled",true);
                    $("#btnDescargarCertificado").prop("disabled",true);
                    $("#periodo").html("");
                    $("#tablaInformacioCertificado tbody").html("");
                    $(".promfinal").prop("disabled",true)
                    $(".promrec").prop("disabled",true)
                    
                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos; 
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{

                $("#alumno").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#alumno").attr('codigo', ui.item.cod_alumno);
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');

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
            .append( "<div>"+item.cod_alumno+" - "+item.nombre+"</div>" )
            .appendTo( ul );
    };
    $("#alumno").focus();
    
    cargarInstituciones();
});

$("#institucion").change(function(){
  	cargarTipoEspecialidades();
});

$("#tipoEspecialidad").change(function(){
  	cargarEspecialidades();
});

$("#btnHistorico").click(function(){
    descargarHistorico()
});

function cargarInstituciones() {
    $.ajax({
        url: path + "institucion/getInstituciones",
        type: "POST",
        data: {
        },
        success: function (data) {
            //console.log(data);
            var cboInstitucion = $("#institucion");
            cboInstitucion.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.instituciones != "vacio") {
                    var instituciones = datos.instituciones;
                    for (i = 0; i < instituciones.length; i++) {
                        var institucion = instituciones[i];
                        selected = institucion.cod_local == '10' ? 'selected' : '';
                        cboInstitucion.append("<option "+selected+" value=\"" + institucion.cod_local + "\" >" + institucion.cod_local + " - " + institucion.descripcionM + "</option>");
                    }

                    cargarTipoEspecialidades() ;
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarTipoEspecialidades() {
    var institucion = $("#institucion").val();
    $.ajax({
        url: path + "tipoEspecialidad/getTipoEspecialidades",
        type: "POST",
        data: {
            institucion: institucion
        },
        success: function (data) {
            //console.log(data);
            var cboTipoEspecialidad = $("#tipoEspecialidad");
            cboTipoEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.tipoEspecialidades != "vacio") {
                    var tipoEspecialidades = datos.tipoEspecialidades;
                    for (i = 0; i < tipoEspecialidades.length; i++) {
                        var tipoEspecialidad = tipoEspecialidades[i];
                        cboTipoEspecialidad.append("<option value=\"" + tipoEspecialidad.tipo_espe + "\" >" + tipoEspecialidad.tipo_espe + " - " + tipoEspecialidad.descripcion + "</option>");
                    }
                    cargarEspecialidades();
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function cargarEspecialidades() {
    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();

    $.ajax({
        url: path + "especialidad/getEspecialidades",
        type: "POST",
        data: {
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad
        },
        success: function (data) {
            //console.log(data);
            var cboEspecialidad = $("#especialidad");
            cboEspecialidad.find('option').remove();
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.especialidades != "vacio") {
                    var especialidades = datos.especialidades;
                    for (i = 0; i < especialidades.length; i++) {
                        var especialidad = especialidades[i];
                        cboEspecialidad.append("<option value=\"" + especialidad.cod_espe + "\" >" + especialidad.cod_espe + " - " + especialidad.descripcionM + "</option>");
                    }
                }
            } else {
                mostrarMensaje("error", "ERROR", datos.errores);
            }
        }
    });
}

function descargarHistorico(){

    const codAlumno = $('#alumno').attr('codigo');
    const cod_local = $('#institucion').val()
    const tipo_espe = $('#tipoEspecialidad').val()
    const codEspe = $('#especialidad').val()

    console.log("c", codAlumno);

    if($('#alumno').val() != '') {

        $.ajax({
            url: path + "certificados/historico",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "historicoPDF",
                codAlumno: codAlumno,
                cod_local: cod_local,
                tipo_espe: tipo_espe,      
                codEspe: codEspe
            },
            beforeSend: function () {
                // $('.text-loader').text('GENERANDO HISTORICO, PORFAVOR ESPERE...');
                // $("#modalLoader").modal();
            },
            complete: function () {
                // $("#modalLoader").modal("hide");
            },
            success: function (response) {

                console.log(response);

                if (response.respuesta === "success") {

                    $("#modalVistaPreviaCertificado").modal("show")
                    $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                    let pdf = '<iframe src="' + response.historico + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                    $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);

                } else {

                    $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                    Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado", "Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

                }
            },
        })
    }else{
        Notiflix.Report.Info("AVISO", "Por favor seleccione un alumno.", "Aceptar");
    }
}

