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

document.addEventListener("DOMContentLoaded", () => {
    $("#docentes").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "programacion/recordProgramacion",
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

    $("#curso-modal").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "programacion/pendientesFutSegundaMa",
                dataType: "JSON",
                method: "POST",
                data: {
                    curso: request.term,
                    opcion: 'buscarCurso'
                },
                success: function (data) {
                    $("#curso-modal").attr("codigo", "");
                    $("#curso-modal").css({ "border": "1px solid red" })
                    let result = (!data.cursos) ? [{ vacio: true }] : data.cursos;
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {
                $("#curso-modal").val(ui.item.Descripcion);
                $("#curso-modal").css({ "border": "1px solid green" })
                $("#curso-modal").attr("codigo", ui.item.Cod_Curso);
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
            .append("<div>" + item.Descripcion + "</div>")
            .appendTo(ul);
    };

});

$(document).ready(function(){

    

    //$('#modalAvisoChat').modal('show')

    $('#tablaSoliitudes').DataTable({
        data : {},
        language : language,
        dom: 'lBfrtip',
        buttons: [
            {
                "extend": 'excel',
                "text": 'Exportar Excel',
                "className": 'btn_excel_datatable',
                'filename': 'Reporte'
            }
        ],
    });

})

// function showUserChat(to_user_id){
// 	$.ajax({
// 		url: path + "programacion/pendientesFutSegundaMa",
// 		method:"POST",
// 		data:{to_user_id:to_user_id, opcion: "update_user_chat"},
// 		dataType: "json",
// 		success:function(response){
// 			//$('#userSection').html(response.userSection);
// 			$('#conversation').html(response.conversation);	
// 			$('#unread_'+to_user_id).html('');
// 		}
// 	});
// }

$("#btn-buscar").click(function(){
    cargarSolicitudes();
})

function cargarSolicitudes(){

    // const desde = $("#desde").val();
    // const hasta = $("#hasta").val();
    // const sede = $("#sede").val();
    //const especialidad = $("#especialidad").val();
    $('#tablaSoliitudes').empty();
    $('#tablaSoliitudes').dataTable().fnDestroy();

    $.ajax({
        url: path + "programacion/pendientesFutSegundaMa",
        type: "POST",
        dataType: "JSON",
        data: { 
            fechaIni: $("#desde").val(),
            fechaHasta: $("#hasta").val(),
            opcion: "cargarTramites",
        },
        beforeSend: function () {
            $('.text-loader').text('CARGANDO SOLICITUDES, POR FAVOR ESPERE...');
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });        
        },
        complete: function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {
                        
            if(response.respuesta === "success"){
                        
                if(response.solicitudes.length < 1){
                    Notiflix.Notify.Warning('NO SE ENCONTRARON SOLICITUDES EN EL RANGO DE FECHAS INGRESADOS.',{timeout:3000});                    
                }
                
                $("#tablaSoliitudes").DataTable({
                    data : response.solicitudes , 
                    ordering: false ,           
                    columnDefs: [
                        {
                            targets: '_all',
                            className: 'celda-centrada',
                            orderable: false
                        }
                    ],
                    dom: 'lBfrtip',
                    buttons: [
                        {
                            "extend": 'excel',
                            "text": 'Exportar Excel',
                            "className": 'btn_excel_datatable',
                            'filename': 'Reporte'
                        }
                    ],
                    lengthMenu: [
                        [20, 25, 50, 75, 100], 
                        [20, 25, 50, 75, 100]
                    ],
                    columns: [
                        {data: null,
                            render: function (data,type, row, meta) { return data.Op }
                        },
                        {data: null,
                            render: function (data) { return data.Alumno.trim() } 
                        },
                        {data: null,
                            render: function (data) { return data.CodAlumno.trim() } 
                        }, 
                        {data: null,
                            render: function (data) { return data.Area.trim() } 
                        }, 
                        {data: null,
                            render: function (data) { return data.especialidad.trim() } 
                        },
                         {data: null,
                            render: function (data) { return data.Tramite.trim() } 
                        },
                        {data: null,
                            render: function (data) { return data.Solicitud.trim().toUpperCase() } 
                        },                    
                        {data: null ,
                            render: function (data) { return data.Fecha } 
                        },
                        {data: null,
                            render: function (data) { return (data.usuarioRecibido === null || data.usuarioRecibido === "" ) ? "-" : data.usuarioRecibido.toUpperCase() } 
                        },                    
                        {data: null ,
                            render: function (data) { return (data.usuarioCerrado === null || data.usuarioCerrado === "" ) ? "-" : data.usuarioCerrado.toUpperCase() } 
                        },
                        {data: null,
                            render: function (data) {
                                let color = '';
                                if(data.estadoCod === 1){ color = "color:red"; }else if(data.estadoCod === 2){ color = "color:orange" }else{ color = "color:#00b300" }
                                return `<span style="${color}">${data.Estado.toUpperCase()}</span>`;
                            } 
                        }, 
                        {data: null,
                            render: function (data) {
                                return `                                
                                <button class="btn boton-tabla boton-verde" type="button" onclick="respuestaFormulario('${data.Op}','${data.Fecha}','${data.CodAlumno}', '${data.Cod_espe} - ${data.especialidad}', '${data.codciclo}', '${data.Turno}', '${data.CodCurso} - ${data.Curso}', '${data.Docente}')" ><span class="icon-files-empty"></span></button>`;
                            } 
                        }, 
                    ],
                    language : language,                    
                });

            }else{
                
                Notiflix.Notify.Failure('OCURRIÓ UN ERROR AL CARGAR LA INFORMACIÓN!');              
                $('#tablaSoliitudes').DataTable({
                    data : {},
                    language : language
                });

            }
    
        }
    })
}

$(document).on('click', '#tablaSoliitudes tbody tr', function () {    
    $('#tablaSoliitudes tbody tr').removeClass("info");
    $(this).addClass("info");
});

function respuestaFormulario(opFut, fecha, cod_alumno, cod_espe, cod_ciclo, cod_turno, curso, cod_docente){

    $('#opFut').val(null)
    $('#fecha').val(null)
    $('#codigo_alumno').val(null)
    $('#programa_estudio').val(null)
    $('#ciclo').val(null)
    $('#turno').val(null)
    $('#curso-modal').val(null)
    $('#docentes').val(null)

    $('#horario').val(null)
    $('#aula').val(null)
    $('#tutor').val(null)
    $('#solicitud').val(null)

    setTimeout(() => {
        $('#opFut').val(opFut)
        $('#fecha').val(fecha)
        $('#codigo_alumno').val(cod_alumno)
        $('#programa_estudio').val(cod_espe)
        $('#ciclo').val(cod_ciclo)
        $('#turno').val(cod_turno)
        $('#curso-modal').val(curso)
        $('#docentes').val(cod_docente)

        $("#modalRespuestaAdmin").modal({backdrop: 'static', keyboard: false})
    }, 250);
    
    
}

$("#formRespuestaAdmin").submit(function (e) {

    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"registrarRespuesta"});    

    $.ajax({
        url: path + "programacion/pendientesFutSegundaMa",
        type: "POST",
        dataType: "JSON",
        data: $.param(data),
        success: function (data) {
            console.log("REGISTRO");
            
            if (data.respuesta === "success") {
                
                Notiflix.Notify.Success('RESPUESTA ENVIADA CORRECTAMENTE');
                $("#modalRespuestaAdmin").modal('hide')
            } else {
                
                Notiflix.Notify.Failure('OCURRIO UN ERROR INESPERADO, POR FAVOR VUELVA A INTENTARLO MAS TARDE');

            }
        }
    });
});

function administrarSolicitud( btn ) {

    const op = $(btn).attr("op");
    $(".tr-bg").removeClass("info");
    $(btn).parent().parent(".tr-bg").addClass("info"); 
    $("#respuesta-modal").val("").prop("disabled",false).prop("placeholder","Escribir aqui la respuesta para el alumno");   

    $.ajax({
        url: path + "programacion/pendientesFutSegundaMa",
        type: "POST",
        dataType: "JSON",
        data: { 
            opcion: "cargarTramitesIndividual",
            id: op            
        },
        beforeSend: function name(params) {
            $("#archivos-modal").html("");  
        },
        success: function (response) {
                 
            if(response.respuesta === "success"){
            
                const dat = response.data[0];
                $("#operacion-modal").html( dat.Op );
                $("#alumno-modal").html( dat.Alumno.toUpperCase() );
                $("#codigo-modal").html( dat.CodAlumno );
                $("#area-modal").html( dat.Area.toUpperCase() );
                $("#tramite-modal").html( dat.Tramite.toUpperCase() );
                $("#fecha-modal").html( dat.Fecha );
                $("#documento-modal").html( dat.TipoDoc+" - "+dat.Documento );
                $("#telefono-modal").html( dat.telefonoo );
                $("#correo-modal").html( dat.Correo );

                $("#aula-modal").html(  (dat.Aula === "" || dat.Aula === null) ? "-" : dat.Aula  );
                $("#docente-modal").html(  (dat.Docente === "" || dat.Docente === null) ? "-" : dat.Docente  );
                $("#ciclo-modal").html(  (dat.codciclo === "" || dat.codciclo === null) ? "-" : dat.codciclo  );                
                $("#curso-modal").html(  (dat.Curso === "" || dat.Curso === null) ? "-" : dat.Curso  );
                $("#turno-modal").html(  (dat.Turno === "" || dat.Turno === null) ? "-" : dat.Turno  );
                
                $("#solicitud-modal").html( dat.Solicitud.toUpperCase() );

                if (dat.rutasArchivos !== "" && dat.rutasArchivos !== null){
                    archivos = dat.rutasArchivos.split("?");
                    archivos = archivos.slice(0, archivos.length - 2)
                    if (archivos.length == 0){
                        $("#archivos-modal").html("No hay archivos")
                    }else{
                        console.log("rata",archivos[0]);

                        function verificarImagen(url) {
                            return new Promise((resolve, reject) => {
                                const img = new Image();
                                img.onload = function() {
                                    // La imagen se cargó correctamente
                                    resolve(true);
                                };
                                img.onerror = function() {
                                    // Hubo un error al cargar la imagen
                                    resolve(false);
                                };
                                img.src = url;
                            });
                        }
                        
                    }   
                }else{
                    $("#archivos-modal").html("No hay archivos")
                }

                if(dat.estadoCod === 1){
                    $(".div-respuesta").css({'display':'none'});                    
                    $("#boton-modal").html(`<button class="btn btn-primary mipanel-btn-img-texto btn-block btnCambiarEstado" enviarEmail="0" estado="2" op="${dat.Op}" style="max-width: 230px;margin:auto"><span class="icon-close" style="padding-right: 10px;"></span> EN PROCESO </button>`);
                }else if(dat.estadoCod === 2){
                    $(".div-respuesta").css({'display':'block'});
                    $("#boton-modal").html(`<button class="btn btn-success mipanel-btn-img-texto btn-block btnCambiarEstado" enviarEmail="1" estado="3" op="${dat.Op}" style="max-width: 230px;margin:auto"><span class="icon-close" style="padding-right: 10px;"></span> ATENDIDO </button>`);
                }else if(dat.estadoCod === 3){                    
                    $("#boton-modal").html(`<button class="btn btn-warning mipanel-btn-img-texto btn-block btnCambiarEstado" enviarEmail="0"  estado="0" op="${dat.Op}" style="max-width: 230px;margin:auto"><span class="icon-close" style="padding-right: 10px;"></span> Actualizar Respuesta </button>`);
                    $(".div-respuesta").css({'display':'block'});
                    $("#respuesta-modal").val( ( dat.Respuesta === null ? "" : dat.Respuesta ) ).prop( "disabled" , false ).prop( "placeholder" , "" );
                }

                $("#modalAdministrarTramite").modal()

            }    
        }
    })

}

$(document).on("click",".btnCambiarEstado",function(){

    const id = $(this).attr("op");
    const estado = $(this).attr("estado");
    const enviarEmail = $(this).attr("enviarEmail");
  
    if (estado === "3" || estado === 3 || estado === "0" || estado === 0 ){
        if($("#respuesta-modal").val() === "" || $("#respuesta-modal").val() === null){
            Notiflix.Notify.Warning('INGRESE UNA RESPUESTA');       
            return;
        }
    }
    
    $.ajax({
        url: path + "programacion/pendientesFutSegundaMa",
        type: "POST",
        dataType: "JSON",
        data: { 
            opcion: "actualizarEstado",
            id: id,
            estado: estado,
            respuesta: $("#respuesta-modal").val(),
            enviarEmail: enviarEmail 
        },
        beforeSend: function () { 
            $(".btnCambiarEstado").prop("disabled",true); 
        },
        complete: function(){ 
            $("#modalAdministrarTramite").modal("hide")
            $(".btnCambiarEstado").prop("disabled",false);
        },
        success: function (response) {
                   
            if(response.respuesta === "success"){
                                
                if( estado === "3" || estado === 3 ){
                    Notiflix.Notify.Success('LA SOLICITUD HA SIDO CERRADA, SE ENVIO UN CORREO DE RESPUESTA AL ALUMNO.',{timeout:6000});                                           
                }else if(estado === 0 || estado === "0"){
                    Notiflix.Notify.Success('LA RESPUESTA SE ACTUALIZO CON ÉXITO');                
                }else{
                    Notiflix.Notify.Success('LA SOLICITUD ESTÁ EN PROCESO');              
                }
                cargarSolicitudes(); 
                
            }else{
                
                Notiflix.Notify.Failure('OCURRIÓ UN ERROR INESPERADO, POR FAVOR ACTUALICE LA PÁGINA Y VUELVA A INTENTARLO.');              
            
            }
    
        }
    })

})

function cursoFormatoFutPdf( btn ){

    const op = $(btn).attr("op");

    $.ajax({
        url: path + "programacion/pendientesFutSegundaMa",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion : "descargarPdf",
            op : op
        } ,
        beforeSend: function (){            
        },
        complete : function(){            
        },
        success: function (response) {

            console.log(response);
            
            if(response.respuesta === "success" ){

                $("#modalVistaPreviaFormularioFut").modal({backdrop: 'static', keyboard: false})
                $('#modalVistaPreviaFormularioFut .modal-body #divIframeFormularioFut').html("");
                let pdf  = '<iframe src="'+response.certificado+'" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaFormularioFut .modal-body #divIframeFormularioFut').html(pdf);   

            }else{  

                $('#modalVistaPreviaFormularioFut .modal-body #divIframeFormularioFut').html("");                   
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado","Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }    
        },
    })

}

$("#cerraModal2").click(function(){
    $('#modalVistaPreviaFormularioFut .modal-body #divIframeFormularioFut').html("");
    $("#modalVistaPreviaFormularioFut").modal("hide");
    //$("body").css({"padding-right" : 0 })
})