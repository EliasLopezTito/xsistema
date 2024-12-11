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

setInterval(function(){
		//showTypingStatus();
		updateUserChat();			
	}, 3000);

function verChat(btn) {
    $('#conversation').html("");
    $("#respuestaTramite").html("");
    const op = $(btn).attr("op");
    let alumno = $(btn).attr("alumno");
    let CodAlumno = $(btn).attr("CodAlumno");

    let nombre = alumno.split(' ')
    
    $('#profile_nombre').html(CodAlumno +" - "+ nombre[0]+' '+nombre[2])
    let plantilla = '';

        plantilla += '<ul>';                        
                $status = 'online';					
                $activeUser = "active";
            plantilla += '<li id="'+CodAlumno+'" class="contact '+$activeUser+'" data-touserid="'+CodAlumno+'" op="'+op+'" data-tousername="'+CodAlumno+'">';
            plantilla += '<div class="wrap">';
            plantilla += '<span id="status_'+CodAlumno+'" class="contact-status '+$status+'"></span>';
            plantilla += '<img src="../assets/userpics/user2.jpg" alt="" />';
            plantilla += '<div class="meta">';
            plantilla += '<p class="name">'+CodAlumno+'<span id="unread_'+CodAlumno+'" class="unread"></span></p>';
            plantilla += '<p class="name">'+nombre[0]+' '+nombre[1] +' \n &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+nombre[2]+'<span class="unread"></span></p>';

            plantilla += '<p class="preview"><span class="isTyping"></span></p>';
            plantilla += '</div>';
            plantilla += '</div>';
            plantilla += '</li>'; 
        
        plantilla += '</ul>';
    
    $('#contacts').html(plantilla)

    replySection =   $(`<div class="wrap">
                        <input type="text" class="chatMessage" id="chatMessage" placeholder="Escribe tu mensaje..." />
                        <button class="submit chatButton`+CodAlumno+`" id="chatButton`+CodAlumno+`" op="`+op+`"><i class="icon-upload"></i></button>	
                    </div>`)

    $('#replySection').html(replySection)
    // showUserChat(CodAlumno);
    $("#modalChat").modal()    

    $(".chatMessage").keyup(function (e) {
        if (e.which == 13) {
            console.log("enviar");
            $('.submit').click()
        }
    });

}

$(".messages").animate({ 
    scrollTop: $(document).height() 
}, "fast");

// $(document).on('click', '.contact', function(){		
//     $('.contact').removeClass('active');
//     $(this).addClass('active');
//     var to_user_id = $(this).data('touserid');
//     showUserChat(to_user_id);
//     $(".chatMessage").attr('id', 'chatMessage'+to_user_id);
//     $(".chatButton").attr('id', 'chatButton'+to_user_id);
// });	

$(document).on("click", '.submit', function(event) { 
    var Op = $(this).attr('op');
    var to_user_id = $(this).attr('id');
    to_user_id = to_user_id.replace(/chatButton/g, "");
    sendMessage(to_user_id, Op);
});

function updateUserChat() {
	$('li.contact.active').each(function(){
		var to_user_id = $(this).attr('data-touserid');
        var op = $(this).attr('op');
		$.ajax({
			url: path + "programacion/administrarFut",
			method:"POST",
            dataType: "json",
			data:{op: op, to_user_id:to_user_id, opcion: "update_user_chat"},
			success:function(response){			
				$('#conversation').html(response.conversation);			
			}
		});
	});
}

// function showUserChat(to_user_id){
// 	$.ajax({
// 		url: path + "programacion/administrarFut",
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

function sendMessage(to_user_id, Op) {
	message = $(".message-input input").val();
	$('.message-input input').val('');
	if($.trim(message) == '') {
		return false;
	}
	$.ajax({
		url: path + "programacion/administrarFut",
		method:"POST",
        data:{Op: Op, to_user_id:to_user_id, chat_message:message, opcion: "insert_chat"},
		dataType: "json",
		success:function(response) {
            console.log("MESSAGE ENVIAR", response);
			// var resp = $.parseJSON(response);			
			// $('#conversation').html(resp.conversation);				
			$(".messages").animate({ scrollTop: $('.messages').height() }, "fast");
		}
	});	
}

$("#btn-buscar").click(function(){
    cargarSolicitudes();
})

function notificacionChat() {

    let data = Array()

	$('#tablaSoliitudes tbody tr').each(function(){
        data.push($(this).find('td:eq(0)').text())
	});

    console.log("asd", data);
}

function cargarSolicitudes(){

    const desde = $("#desde").val();
    const hasta = $("#hasta").val();
    const sede = $("#sede").val();
    const especialidad = $("#especialidad").val();
    $('#tablaSoliitudes').empty();
    $('#tablaSoliitudes').dataTable().fnDestroy();

    $.ajax({
        url: path + "programacion/administrarFut",
        type: "POST",
        dataType: "JSON",
        data: { 
            opcion: "cargarTramites",
            desde: desde,
            hasta: hasta,
            sede: sede,
            especialidad: especialidad
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
                            render: function (data) { return data.cod_interno.trim() }
                        },
                        {data: null,
                            render: function (data) { return data.Area.trim() } 
                        }, 
                        {data: null,
                            render: function (data) { return data.Sede } 
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
                                if(data.estadoCod === 3){ display = "display:none"; noty = "display:none"; }else{ if(data.Noti < 1){ noty = "display:none"; display = "display:none"}else{ noty = ""; display = "" } }
                                return `                                
                                <button class="btn boton-tabla boton-rojo" type="button" style="${display};" op="${data.Op}" CodAlumno="${data.CodAlumno.trim()}" alumno="${data.Alumno.trim()}" onclick="verChat(this)" ><span class="icon-bubbles"></span></button>
                                <span class="badge" title="Tiene un mensaje" style="${noty}; background: #d14;"><i class="fa fa-bell-o" aria-hidden="true"></i>${data.Noti}</span>
                                <button class="btn boton-tabla boton-verde" type="button" op="${data.Op}" onclick="administrarSolicitud(this)" ><span class="/**icon-files-empty**/ icon-bubbles3"></span></button>
                                <button class="btn boton-tabla boton-azul" type="button" op="${data.Op}" onclick="cursoFormatoFutPdf(this)" ><span class="icon-download"></span></button>`;
                            } 
                        }, 
                    ],
                    language : language,                    
                });

                notificacionChat()

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

function administrarSolicitud( btn ) {

    const op = $(btn).attr("op");
    $(".tr-bg").removeClass("info");
    $(btn).parent().parent(".tr-bg").addClass("info"); 
    $("#respuesta-modal").val("").prop("disabled",false).prop("placeholder","Escribir aqui la respuesta para el alumno");   

    $.ajax({
        url: path + "programacion/administrarFut",
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
                        
                        // Uso:
                        const url = 'https://istalcursos.edu.pe/apiSiga/' + archivos[0]
                        verificarImagen(url)
                            .then(result => {
                                if (result) {
                                    console.log('La URL contiene una imagen.');
                                } else {
                                    console.log('La URL no contiene una imagen o hubo un error al cargarla.');
                                }
                            });

                        archivos.forEach((elem, index) => {
                            $("#archivos-modal").append(
                                $('<a/>', {
                                    'html': 'Descargar Archivos ' + (Number(index) + 1),
                                    'download': true,
                                    'target': '_blank',
                                    'href': "https://istalcursos.edu.pe/apiSiga/" + elem
                                }),
                                $('<br>')
                            );
                        });
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
        url: path + "programacion/administrarFut",
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
        url: path + "programacion/administrarFut",
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