/*var path = "http://istalcursos.edu.pe/siga/";*/

$(document).ready(function() {

	$('ul.nav li.dropdown').hover(function() {
	  $(this).find('.menu-nav').stop(true, true).delay(200).fadeIn(500);
	}, function() {
	  $(this).find('.menu-nav').stop(true, true).delay(200).fadeOut(500);
	});

	$('ul.dropdown-menu li.dropdown-submenu').hover(function() {
	  $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeIn(100);
	}, function() {
	  $(this).find('.dropdown-menu').stop(true, true).delay(100).fadeOut(100);
	});


});

$('#openmodalconfiguser').on('click', function() {
	$("#modalconfigusuarios").modal({backdrop: 'static', keyboard: false});
	$("#modalconfigusuarios").draggable({handle: ".modal-header"});
});


$('#actualizausuario').on('click', function() {
	$.ajax({
		url: path+'Auth/actualizarusuario',
		type: 'POST',
		data: $("#frmActualizarUsuario").serialize(),
		success:function (data) {
			$("#errorConfig").html('');
			$("#errorConfig").css('display', 'none');
			$('#errorConfig').removeClass('alert alert-danger');
			var datos=JSON.parse(data);
			if (datos.respuesta=='success') {
	            $("#errorConfig").css({"display": "block"});
	            $('#errorConfig').addClass('alert alert-info');
	            $('#errorConfig').html('Se Actualizo Correctamente el Usuario: ' + datos.usuario);
	            setTimeout(function() {
	            	$('#errorConfig').html('');
	            	$("#errorConfig").css('display', 'none');
	            }, 5000);
			}else{
				var errores = "<ul style='list-style: none'>";
	            for (i = 0; i < datos.errores.length; i++) {
	                errores += "<li>" + datos.errores[i] + "</li>";
	            }
	            errores += "<ul>";
	            $("#errorConfig").html(errores);
	            $("#errorConfig").css({"display": "block"});
	            $('#errorConfig').addClass('alert alert-danger');
	            setTimeout(function() {
	            	$('#errorConfig').html('');
	            	$("#errorConfig").css('display', 'none');
	            }, 2000);
			}
		}
	});
		
});


/*$(document).ready(main);

var contador = 1;

function main () {
	// Mostramos y ocultamos submenus
	$('.dropdown-toggle').click(function(){
		$(this).children('.dropdown-menu').slideToggle();
	});
}*/