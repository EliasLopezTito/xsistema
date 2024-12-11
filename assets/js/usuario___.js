/*var path='http://istalcursos.edu.pe/siga/';*/
$(document).ready(function() {
	listausuario();
	
	$('#nuevousuario').on('click', function() {
		$('#idmodalnuevousuario').modal({backdrop: 'static', keyboard: false});
		$("#idmodalnuevousuario").draggable({handle: ".modal-header"});
		$('#btnguardar').show();
		$('#btnactualizar').hide();
		$('#usuario').removeAttr('disabled');
		$('#estado').attr('disabled', true);
		$('#idpersona').val('');
		$('#idformusuario')[0].reset();
	});

	$('#usuariobuscar').keyup(function() {
		listausuario();
	});

	$('#btnguardar').on('click', function() {
		$.ajax({
			url: path+'usuario/insert',
			type: 'POST',
			// dataType: 'JSON',
			data: $('#idformusuario').serialize(),
			success: function (data) {
				$("#errorGuardar").html(data);
		        $("#errorGuardar").css({"display":"block"});
		        $('#errorGuardar').removeClass('alert alert-danger');
		        $('#errorGuardar').addClass('alert alert-info');
		        setTimeout(function() {
		            	$("#errorGuardar").html('');
		        }, 3000);
		        var datos = JSON.parse(data); 
		        if(datos.respuesta == "success"){
		        	setTimeout(function() {
		            	$("#idmodalnuevousuario").modal("hide");
		        	}, 2000);
		            listausuario();
		        }else{                                      
		            var errores = "<ul style='list-style: none'>";
		            for(i=0;i<datos.errores.length;i++){
		                errores += "<li>" + datos.errores[i] + "</li>";
		            }
		            errores += "<ul>";
		            $('#errorGuardar').removeClass('alert alert-info');
		            $('#errorGuardar').addClass('alert alert-danger');
		            $("#errorGuardar").html(errores);
		            $("#errorGuardar").css({"display":"block"});
		            setTimeout(function() {
		            	$("#errorGuardar").html('');
		            }, 3000);
		        }
			}
		});

	});

	$('#btnactualizar').on('click', function() {
		$.ajax({
			url: path+'usuario/editar',
			type: 'POST',
			// dataType: 'JSON',
			data: $('#idformusuario').serialize(),
			success: function (data) {
				$("#errorGuardar").html(data);
		        $("#errorGuardar").css({"display":"block"});
		        $('#errorGuardar').removeClass('alert alert-danger');
		        $('#errorGuardar').addClass('alert alert-info');
		        setTimeout(function() {
		            	$("#errorGuardar").html('');
		        }, 3000);
		        var datos = JSON.parse(data); 
		        if(datos.respuesta == "success"){
		        	setTimeout(function() {
		            	$("#idmodalnuevousuario").modal("hide");
		        	}, 2000);
		            listausuario();
		        }else{                                      
		            var errores = "<ul style='list-style: none'>";
		            for(i=0;i<datos.errores.length;i++){
		                errores += "<li>" + datos.errores[i] + "</li>";
		            }
		            errores += "<ul>";
		            $('#errorGuardar').removeClass('alert alert-info');
		            $('#errorGuardar').addClass('alert alert-danger');
		            $("#errorGuardar").html(errores);
		            $("#errorGuardar").css({"display":"block"});
		            setTimeout(function() {
		            	$("#errorGuardar").html('');
		            }, 3000);
		        }
			}
		});
		
	});		


});


function listausuario() {
	var usuarioBuscar=$('#usuariobuscar').val();
	$.ajax({
		url: path+'usuario/listaUruario',
		type: 'POST',
		dataType: 'JSON',
		data: {usuario: usuarioBuscar},
		success: function (data) {
			var tbody = $("#listausuario tbody");
            tbody.find('tr').remove();
            if (data.respuesta!='error') {
	        	$.each(data.usuario, function(i, listado) {
	        		if (listado.ESTADO==0) {
	        			var estado='Activo';
	        		}else{
	        			var estado='Inactivo';
	        		}
	        		 var tr="<tr>"+
	        			 	"<td class='text-center'>"+(i+1)+"</td>"+
	        			 	"<input type='hidden' value='"+listado.USUARIO+"'>"+
	        			 	"<td class='text-center'>"+listado.USUARIO+"</td>"+
	        			 	"<td class='text-left'>"+listado.APELLIDO_PATERNO +' '+listado.APELLIDO_MATERNO+', '+listado.NOMBRES +"</td>"+
	        			 	"<td class='text-center'>"+listado.GRUPO_USUARIO_DES+"</td>"+
	        			 	"<td class='text-center'>"+estado+"</td>"+
	        			 	"<td class='text-center'>"+
	        			 		"<button type='button' onclick='listaeditarusuario("+'"'+listado.USUARIO+'"'+");' class='btn boton-tabla boton-verde btn-sm'> <span class='icon-pencil'></span></button>"+
	        			 		/*"<button type='button' onclick='verdetalles("+'"'+listado.USUARIO+'"'+");' class='btn boton-tabla boton-azul btn-sm'> <span class='icon-file-text2'></span></button>"+
	        			 		"<button type='button' onclick='eliminar("+'"'+listado.USUARIO+'"'+");' class='btn boton-tabla boton-rojo btn-sm'> <span class='icon-bin'></span></button>"+*/
	        			 	"</td>"+
        		 			"</tr>";
        		 tbody.append(tr);
	        	});
	        }
	    }
	});	
}

function listaeditarusuario(idusuario) {
	$('#idmodalnuevousuario').modal({backdrop: 'static', keyboard: false});
	$("#idmodalnuevousuario").draggable({handle: ".modal-header"});
	$('#btnactualizar').show();;
	$('#btnguardar').hide();
	$('#usuario').attr('disabled', true);
	$('#estado').removeAttr('disabled');
	$('#idformusuario')[0].reset();
	$.ajax({
		url: path+'usuario/listaUruarioEditar',
		type: 'POST',
		dataType: 'JSON',
		data: {usuario: idusuario},
		success: function (data) {
			if (data.respuesta!='error') {
				$.each(data.usuario, function(i, listado) {
					$('#idpersona').val(listado.PERSONA);
					$('#persona').val(listado.APELLIDO_PATERNO+' '+listado.APELLIDO_MATERNO+', '+listado.NOMBRES);
					$('#grupousuario').val(listado.GRUPO_USUARIO);
					$('#usuario').val(listado.USUARIO);
					$('#usuarioE').val(listado.USUARIO);
					$('#estado').val(listado.ESTADO);
				});
			}else{
				var errores = "<ul style='list-style: none'>";
	            for(i=0;i<datos.errores.length;i++){
	                errores += "<li>" + datos.errores[i] + "</li>";
	            }
	            errores += "<ul>";
	            $('#errorGuardar').removeClass('alert alert-info');
	            $('#errorGuardar').addClass('alert alert-danger');
	            $("#errorGuardar").html(errores);
	            $("#errorGuardar").css({"display":"block"});
	            setTimeout(function() {
	            	$("#errorGuardar").html('');
	            }, 3000);
			}

		}

	});
	
}


function verdetalles(idusuario) {
	alert(idusuario);
}

function eliminar(idusuario) {
	if (confirm('¿Estas Seguro de Eliminar al Alumno?')) {
		$.ajax({
			url: path+'usuario/eliminar',
			type: 'POST',
			dataType: 'JSON',
			data: {usuario: idusuario},
			success: function (data) {
				alert(data.respuesta);
				listausuario();
			}
		});
	}
	
}


$('#idbtnseleccionarpersona').on('click', function() {
	$('#idmodalpersona').modal({backdrop: 'static', keyboard: false});
	$("#idmodalpersona").draggable({handle: ".modal-header"});
	// $( "#idmodalpersona" ).draggable({ cursor: "move", cursorAt: { top: 0, left: 0 } });
});

/*idpaternoBusP
idmaternoBusP
idnombresBusP
idtablaBuscarPersona*/


$("#idpaternoBusP").keyup(function () {
    sleccionarPersona();
});
$("#idmaternoBusP").keyup(function () {
    sleccionarPersona();
});
$("#idnombresBusP").keyup(function () {
    sleccionarPersona();
});


function sleccionarPersona() {
    var apellidopaterno = $("#idpaternoBusP").val();
    var apellidomaterno = $("#idmaternoBusP").val();
    var nombres = $("#idnombresBusP").val();
    $.ajax({
        url: path + 'usuario/listarPersona',
        type: 'POST',
        dataType: 'JSON',
        data: {apellidopaterno: apellidopaterno, apellidomaterno: apellidomaterno, nombres: nombres},
        success: function (data) {

           	var tbody = $("#idtablaBuscarPersona tbody");
            tbody.find('tr').remove();
             if (data != 'error') {
             	if (data.personas!='vacio') {
	                $.each(data.personas, function (key, listado) {
	                    var tr = "<tr class='selectPersona' onclick=\"cargarpersona('" + listado.PERSONA + "','"+ listado.APELLIDO_PATERNO + " " + listado.APELLIDO_MATERNO + ", " + listado.NOMBRES +"')\">" +
	                            "<td>" + listado.APELLIDO_PATERNO + " " + listado.APELLIDO_MATERNO + ", " + listado.NOMBRES + "</td>" +
	                            "</tr>";
	                    tbody.append(tr);
	                    $("#msjError").empty();
	                });
             	}else{
	         		$("#msjError").html('<span>No hay Ningun Resultado</span>');
	            	$("#msjError").css('color', 'red');	
             	}
            } else {
                $("#msjError").html('<span>No hay Ningun Resultado</span>');
                $("#msjError").css('color', 'red');
            }
        }
    });
}

function cargarpersona(persona,ApeNombres) {	 
    $("#idmodalpersona").slideUp(400);
    $("#idmodalpersona").modal('hide');
	$('#idpersona').val(persona);
	$('#persona').val(ApeNombres);
}

