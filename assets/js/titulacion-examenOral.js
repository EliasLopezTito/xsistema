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
}

$(document).ready(function(){

    $("#tablaListado").DataTable({
        data : [],
        language : language
    })
    autocomplete();  
    autocomplete2();   

})

function autocomplete2() {

    $("#alumno_").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "Programacion/descargarBoleta",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function (data) {
                    
                    $("#alumno_").attr("codigo", "");
                    $("#alumno_").next('i').removeClass('glyphicon-ok');
                    $("#alumno_").next('i').addClass('glyphicon-remove');
                    $("#alumno_").parent().removeClass('has-success');
                    $("#alumno_").parent().addClass('has-error');

                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos;
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {

                $("#alumno_").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#alumno_").attr('codigo', ui.item.cod_alumno);
                $("#alumno_").next('i').removeClass('glyphicon-remove');
                $("#alumno_").next('i').addClass('glyphicon-ok');
                $("#alumno_").parent().removeClass('has-error');
                $("#alumno_").parent().addClass('has-success');

                //cargarListadoTabla();

            }
            return false;
        }
    })
    .autocomplete("instance")._renderItem = function (ul, item) {

        if (item.hasOwnProperty('vacio')) {
            return $("<li>")
                .append("<div>No se encontraron resultados</div>")
                .appendTo(ul);
        }

        return $("<li>")
            .append("<div>" + item.cod_alumno + " - " + item.nombre + "</div>")
            .appendTo(ul);
    };
    $("#alumno_").focus();

}

$("#alumno_").keyup(function(){
    if($(this).val().length < 1){
        $("#alumno_").attr("codigo", "");
        $("#alumno_").next('i').removeClass('glyphicon-ok');
        $("#alumno_").next('i').addClass('glyphicon-remove');
        $("#alumno_").parent().removeClass('has-success');
        $("#alumno_").parent().addClass('has-error');
    }
})

$("#btnBuscar").click(function(){
    cargarListadoTabla();
})

function cargarListadoTabla(){

    $("#tablaListado").empty();
    $('#tablaListado').dataTable().fnDestroy();
    $("#tablaListado").DataTable({
        ordering:  false,
        ajax: {
            url: path + "titulacion/examenOral",
            type: 'post',
            beforeSend: function(){
                $('.text-loader').text('Cargando información, por favor espere..');
                $("#modalLoader").modal();
            },
            data:{                
                opcion: 'cargarListado',
                fecha_1 : $("#fecha_1").val(),
                fecha_2 : $("#fecha_2").val(),
                especialidad : $("#especialidad_lista").val(),
                codigo : $("#alumno_").attr("codigo")
            },
            dataSrc: function(data){                    
                if(data.respuesta === "success"){
                    return data.data;
                }else{
                    return [];
                }
            },
            complete: function(data){
                $("#modalLoader").modal("hide");
            }
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        columns: [
            { 
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },            
            { data: 'CodAlumno' },
            { data: 'Alumnp' },
            { data: 'LugarExamen' },
            { data: 'TituloTrabajo' },
            { 
                data: null, 
                render: function(data){
                    return data.FechaDoc.substring(0,10);
                }
            },
            { 
                data: null, 
                render: function(data){
                    return data.Hora.substring(11,19);
                }
            },
            { data: 'Instituto' },
            { data: 'Especialidad' },
            { data: 'Material' },
            { data: 'TipoTrabajo' },
            { data: 'Presidente' },
            { data: 'Vocal' },
            { data: 'Secretario' },
            {
                data : null ,
                render : function(data){
                    return `
                        <button class='btn boton-tabla boton-rojo' codigo="${data.CodAlumno.trim()}" type='button' onclick='cursoTitulacionPdf(this, "formatoAntes")'><span class='icon-file-pdf'></span></button>
                        <button class='btn boton-tabla boton-verde' codigo="${data.CodAlumno.trim()}" type='button' onclick='cursoTitulacionPdf(this, "formatoNuevo")'><span class='icon-file-pdf'></span></button> 
                        <button class='btn boton-tabla boton-rojo' type='button' codigo="${data.CodAlumno.trim()}" onclick='eliminar(this)'><span class='icon-bin'></span></button>
                    `;
                }
            },
            {
                data: null,
                render: function (data) {

                    return "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"editarCursoTitulacion('"+data.CodAlumno.trim()+"');\" title=\"Editar Curso\"><span class=\"icon-pencil\"></span></button>";
                }
            },
                        
        ],        
        language: language
    });
    
}

function cursoTitulacionPdf( btn, tipo ){

    const codigoAlumno = $(btn).attr("codigo");
    $.ajax({
        url: path + "titulacion/examenOral",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion : "generarCertificado",
            codigo : codigoAlumno,
            tipo : tipo
        } ,
        beforeSend: function () {
            //$('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            //$("#modalLoader").modal();
        },
        complete : function(){
            //$("#modalLoader").modal("hide");
        },
        success: function (response) {

            if(response.respuesta === "success" ){
                if(tipo == "formatoNuevo"){                    
                    $('#vistaPrevia').html("VISTA PREVIA DE DECLARACIÓN JURADA");
                }else{
                    $('#vistaPrevia').html("VISTA PREVIA DEL ACTA DE EXÁMEN");
                }
                $("#modalVistaPreviaCertificado").modal("show")                
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                let pdf  = '<iframe src="'+response.certificado+'" frameborder="0" width="100%" style="height: 80vh;"></iframe>'
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);   

            }else{  

                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");                   
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado","Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }    
        },
    })

}

$("#cerraModal2").click(function(){
    $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
    $("#modalVistaPreviaCertificado").modal("hide");
    $("body").css({"padding-right" : 0 })
})

$("#btnRegistrar").click(function(){
    $.ajax({
        url: path + "titulacion/examenOral",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "validar",
            tipo: 1,
            ruta: "titulacion/examenOral"  
        },
        success: function(data) {
            /* console.log(response) */
            if (data.respuesta === "success" && data.validarUsuario === "SI") {
                $("#modalExamenOral").modal({ backdrop: 'static', keyboard: false });
                $('#seccion_alumno').show()
                $('#tituloModal').html('REGISTRAR EXÁMEN ORAL')
            } else {
                Notiflix.Report.Warning("AVISO","No tienes permiso para realizar esta acción.", "Aceptar");;
            }
        },
        error: function() {
            Notiflix.Report.Failure("ERROR","Ocurrió un error al validar los permisos. Por favor, intenta de nuevo.", "Cerrar");
        }
    });  
});

function autocomplete (){

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

                    limpiarFormulario()
                    $("#alumno").attr("codigo","");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');
                        
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
                
                cargarDataAlumnoSeleccionadoNuevo(ui.item.cod_alumno);

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

}

function cargarDataAlumnoSeleccionadoNuevo(codigo){   

    const tRegulares = $("#tRegulares").prop('checked') ? 2 : 1 ;
    $.ajax({
        url: path + "Titulacion/examenOral",
        dataType: "json",
        type: 'post',
        data: {
            opcion : "cargarDataAlumno",
            tRegulares : tRegulares,
            codigo : codigo
        },
        beforeSend: function(){
            limpiarFormulario()
        },
        success: function(response){              

            if(response.respuesta === "success"){

                if(response.dataAlumno.length > 0){
                    const d1 = response.dataAlumno[0];
                    $("#codLocal").val(d1.cod_local.trim());
                    $("#tipoEspe").val(d1.tipo_espe.trim());
                    $("#codEspe").val(d1.cod_espe.trim());
                    $("#telefono").val(d1.telefono.trim());
                }else{

                    $("#alumno").val('');
                    $("#alumno").attr('codigo', '');
                    Notiflix.Notify.Failure('NO SE ENCONTRO DATA INTERNA DEL ALUMNO');
                    return;
                }

                $("#btnGrabar").prop("disabled",false);

                if(response.dataEditar.length > 0){
                        $("#alumno").val('');
                        $("#alumno").attr('codigo', '');
                    
                    Notiflix.Notify.Failure('ESTE ALUMNO YA HA SIDO REGISTRADO');
                    return;   
                            
                }else{
                    $("#accion").val("N")
                }
            }else{

                Notiflix.Notify.Failure('Ocurrio un error inesperado :'+response.error);

            }

        }
    });      
}

function cargarDataAlumnoSeleccionado(codigo){  
    
    $.ajax({
        url: path + "titulacion/examenOral",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "validar",
            tipo: 2,
            ruta: "titulacion/examenOral"  
        },
        success: function(data) {
            /* console.log(response) */
            if (data.respuesta === "success" && data.validarUsuario === "SI") {

                $("#modalExamenOral").modal({ backdrop: 'static', keyboard: false });
                $("#alumno").attr("codigo", codigo);
                $('#seccion_alumno').hide()
                $('#tituloModal').html('EDITAR EXÁMEN ORAL')

                const tRegulares = $("#tRegulares").prop('checked') ? 1 : 1 ;
                $.ajax({
                    url: path + "Titulacion/examenOral",
                    dataType: "json",
                    type: 'post',
                    data: {
                        opcion : "cargarDataAlumno",
                        tRegulares : tRegulares,
                        codigo : codigo
                    },
                    beforeSend: function(){
                        limpiarFormulario()
                    },
                    success: function(response){              

                        if(response.respuesta === "success"){

                            if(response.dataAlumno.length > 0){
                                const d1 = response.dataAlumno[0];
                                $("#codLocal").val(d1.cod_local.trim());
                                $("#tipoEspe").val(d1.tipo_espe.trim());
                                $("#codEspe").val(d1.cod_espe.trim());
                                $("#telefono").val(d1.telefono.trim());
                            }else{
                                Notiflix.Notify.Failure('NO SE ENCONTRO DATA INTERNA DEL ALUMNO');
                                return;
                            }

                            $("#btnGrabar").prop("disabled",false);

                            if(response.dataEditar.length > 0){
                                
                                            const d2 = response.dataEditar[0];
                                            $("#codLocal").val(d2.CodLocal.trim());
                                            $("#tipoEspe").val(d2.TipoEspe.trim());
                                            $("#codEspe").val(d2.CodEspe.trim());
                                            $("#presidente").val(d2.Presidente.trim());
                                            $("#vocal").val(d2.Vocal.trim());
                                            $("#vocalsecre").val(d2.Secretario.trim());
                                            $("#tituloTrabajo").val(d2.TituloTrabajo.trim() )
                                            $("#lugarExamen").val(d2.LugarExamen.trim())
                                            $("#fechaExamen").val(d2.FechaDoc.substring(0,10))
                                            $("#nota1").val(d2.NotaJ1);
                                            $("#nota2").val(d2.NotaJ2);
                                            $("#nota3").val(d2.NotaJ3);
                                            $("#notaPromedio").val(d2.Promedio);                    
                                            if( d2.tIPO.trim() === "T" ){
                                                $("#para1").prop("checked",true);
                                                $("#para2").prop("checked",false);
                                            }else{
                                                $("#para2").prop("checked",true);
                                                $("#para1").prop("checked",false);
                                            }
                                            $("#hora").val( d2.Hora.trim() );
                                            $("#accion").val("E")
                                        
                            }else{
                                $("#accion").val("N")
                            }
                        }else{

                            Notiflix.Notify.Failure('Ocurrio un error inesperado :'+response.error);

                        }

                    }
                });        

            } else {
                Notiflix.Report.Warning("AVISO","No tienes permiso para realizar esta acción.", "Aceptar");;
            }
        },
        error: function() {
            Notiflix.Report.Failure("ERROR","Ocurrió un error al validar los permisos. Por favor, intenta de nuevo.", "Cerrar");
        }
    });  

}

function editarCursoTitulacion(codigo){
    cargarDataAlumnoSeleccionado(codigo)
}

$("#alumno").keyup(function(){
    if($(this).val() === ""){
        $("#alumno").attr("codigo","");
        $("#alumno").next('i').removeClass('glyphicon-ok');
        $("#alumno").next('i').addClass('glyphicon-remove');
        $("#alumno").parent().removeClass('has-success');
        $("#alumno").parent().addClass('has-error');
        limpiarFormulario()
    }
})

$("#frmExamenOral").submit(function(e){

    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"registrar"});
    data.push({name:"alumno",value:$("#alumno").attr("codigo")})

    $.ajax({
        url: path + "Titulacion/examenOral",
        dataType: "json",
        type: 'post',
        data: $.param(data),
        success: function(response){
        
            if(response.respuesta === "success"){

                Notiflix.Notify.Success("EL EXÁMEN ORAL SE REGISTRO CON ÉXITO",{timeout:5000});
                limpiarFormulario();
                $("#alumno").val("");
                $("#alumno").attr("codigo", "");
                $("#alumno").next('i').removeClass('glyphicon-ok');
                $("#alumno").next('i').addClass('glyphicon-remove');
                $("#alumno").parent().removeClass('has-success');
                $("#alumno").parent().addClass('has-error');
                $("#modalExamenOral").modal("hide");
                $("#tRegulares").prop("checked",false)

            }else if(response.respuesta === "warning"){

                Notiflix.Notify.Warning( response.error );

            }else{

                Notiflix.Notify.Failure('Ocurrio un error inesperado :'+response.error);

            }

        }
    });

})

function limpiarFormulario(){
    $("#codLocal").val("");
    $("#tipoEspe").val("");
    $("#codEspe").val("");
    $("#presidente").val("");
    $("#vocal").val("");
    $("#vocalsecre").val("");
    $("#tituloTrabajo").val("")
    $("#lugarExamen").val("")
    $("#fechaExamen").val("")
    $("#nota1").val("0");
    $("#nota2").val("0");
    $("#nota3").val("0");
    $("#notaPromedio").val("0");                                
    $("#para2").prop("checked",false);
    $("#para1").prop("checked",true);            
    $("#hora").val("");
    $("#accion").val("")
    $("#btnGrabar").prop("disabled",true);
}

function calcularPromedio(input){

    if( $(input).val() === "" || isNaN(Number($(input).val())) ){ 
        $(input).val("0"); 
    };
    
    const nota1 = Number($("#nota1").val());
    const nota2 = Number($("#nota2").val());
    const nota3 = Number($("#nota3").val());
    
    if( !isNaN(nota1) && !isNaN(nota2) && !isNaN(nota3) ){    
                
        const promedio = ((nota1+nota2+nota3)/3).toFixed();
        $("#notaPromedio").val(promedio);

    }   
    
}

function validarPromedio(input){
    if( isNaN(Number( $(input).val() )) || $(input).val() === "" ){        
        const nota1 = Number($("#nota1").val());
        const nota2 = Number($("#nota2").val());
        const nota3 = Number($("#nota3").val());                 
        const promedio = ((nota1+nota2+nota3)/3).toFixed();
        $(input).val(promedio);    
    }
}

$("#cerrar-modal").click(function(){
    $("#alumno").val("");
    $("#alumno").attr("codigo","");
    $("#alumno").next('i').removeClass('glyphicon-ok');
    $("#alumno").next('i').addClass('glyphicon-remove');
    $("#alumno").parent().removeClass('has-success');
    $("#alumno").parent().addClass('has-error');
    limpiarFormulario();
})

function eliminar(btn){
    $.ajax({
        url: path + "titulacion/examenOral",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "validar",
            tipo: 3,
            ruta: "titulacion/examenOral"  
        },
        success: function(response) {
            /* console.log(response) */
            if (response.respuesta === "success" && response.validarUsuario === "SI") {
                Notiflix.Confirm.Show(
                    'Confirmación',
                    '¿Está seguro de eliminar el registro seleccionado?',
                    'Si',
                    'No',
                    function () {           
                        const codigo = $(btn).attr("codigo").trim();            
                        $.ajax({
                            url: path + "titulacion/examenOral",
                            dataType: "JSON",
                            type: 'POST',
                            data: {
                                opcion: "eliminar",
                                codigo: codigo
                            },
                            success: function (data) {
            
                                if (data.respuesta === "success") {
                                    
                                    Notiflix.Notify.Success("LA INFORMACIÓN SE ELIMINO CON ÉXITO.");                        
                                    cargarListadoTabla()
                                }else{
            
                                    Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR VUELVA A INTENTARLO.");
            
                                }
            
                            }
                        });
            
                    }
                    , function () {            
                    }
                );
            } else {
                Notiflix.Report.Warning("AVISO","No tienes permiso para realizar esta acción.", "Aceptar");;
            }
        },
        error: function() {
            Notiflix.Report.Failure("ERROR","Ocurrió un error al validar los permisos. Por favor, intenta de nuevo.", "Cerrar");
        }
    });

    
    
}