$(document).ready(function () {


	/* ------------- Main ---------- */
	cargarPisos();
	activarBotonesRptIndividuales(true);
	var fecha = new Date();
	var anio = fecha.getFullYear();
	var anioAntes = fecha.getFullYear() - 1;

	$("#anioProg").append('<option value=' + anio + '>' + anio + '</option>');
	$("#anioProg").append('<option value=' + anioAntes + '>' + anioAntes + '</option>');

	listarTutores();


	/* ------------- Tutor ---------- */
	$("#btnNuevoUsuario").click(function () {
		limpiarCamposModalTutor();
		$("#accion").val("C");
		$("#divBuscar").show();

		$("#tituloModal").html("Nuevo Registro");
		$("#divContrasenia").show();
		$("#modalNuevoEditUsuario").modal({
			backdrop: 'static',
			keyboard: false
		});
	});

	$("#btnNuevoHorario").click(function () {

		$("#tituloModal").html("Nuevo Registro");
		$("#modalNuevoHorario").modal({
			backdrop: 'static',
			keyboard: false
		});

	});


	/* ------------- Tutor Aula ---------- */
	$("#btnNuevoTutorAula").click(function () {

		$("#tituloModal").html("Nuevo Registro");
		$("#modalNuevoTutorAula").modal({
			backdrop: 'static',
			keyboard: false
		});

		$('#divTutor').show();
		$("#opciones").val("agregar");
		limpiarCampos();
		cargarComboAulas();

	});




});

$("#btnReporte").click(function () {
	
	anio = $('#anio').val();
	mes = $('#mes').val();
	pabellon = $('#pabellon').val();
	piso = $('#piso').val();
	id_tutor = $("#idTutor").val();

    let formData = new FormData();
    formData.append('institucion', '10');
    formData.append('mesProg', mes);
    formData.append('anioProg', anio);
    formData.append('pabellon', pabellon);
    formData.append('piso', piso);
    formData.append('id_tutor', id_tutor);

    $.ajax({
        type:'POST',
        url:`${path}tutores/reporteTutorPiso`,
        data: formData,
        dataType:'json',
        contentType:false,
        processData:false,
        cache:false,
        beforeSend: function(){
            $('.text-loader').text('Estamos creando tu reporte, por favor espere...');
            $("#modalLoader").modal();
        },
        success: function(data){
            console.log(data);
            $("#modalLoader").modal("hide");
            $("#modalCargarVoucher").modal("hide");
            var $a = $("<a>");
            $a.attr("href",data.file);
            $("body").append($a);
            $a.attr("download","file.xls");
            $a[0].click();
            $a.remove();
        },
        error: function(error, text, hq){
            $("#modalLoader").modal("hide");
            $("#modalCargarVoucher").modal("hide");
			console.log(hq);
            Notiflix.Notify.Failure('Ocurrió un error al crear el reporte!');
        }
    });

});

/* ------------- Main Filtros ---------- */

function activarListadoIndividual() {
	if ($("#cbxPorAula").prop("checked") == true) {
		$("#pabellon").attr("disabled", false);
		$("#piso").attr("disabled", false);
		$("#aula").attr("disabled", false);
		$("#btnImprimir").attr("disabled", true);
		$("#tipoListado").attr("disabled", true);

	} else {
		var tbody = $("#tablaProgramacion tbody");
		tbody.find('tr').remove();
		$("#pabellon").attr("disabled", true);
		$("#piso").attr("disabled", true);
		$("#aula").attr("disabled", true);
		$("#btnImprimir").attr("disabled", false);
		$("#tipoListado").attr("disabled", false);
	}
}

function activarBotonesRptIndividuales(activar) {
	$("#tablaProgramacion tbody").find("tr").each(function () {
		if (activar == true) {
			$(this).find("button").eq(0).attr("disabled", false);
			$(this).find("button").eq(1).attr("disabled", false);
			$(this).find("button").eq(2).attr("disabled", false);
		} else {
			$(this).find("button").eq(0).attr("disabled", true);
			$(this).find("button").eq(1).attr("disabled", true);
			$(this).find("button").eq(2).attr("disabled", true);
		}
	});
}

$("#institucion").change(function () {
	if ($("#cbxPorAula").prop("checked") == true) {
		cargarComboAulas();
	}
});

$("#sede").change(function () {
	if ($("#cbxPorAula").prop("checked") == true) {
		cargarComboAulas();
	}
});

$("#pabellon").change(function () {
	if ($("#cbxPorAula").prop("checked") == true) {
		cargarComboAulas();
	}
});

$("#piso").change(function () {
	if ($("#cbxPorAula").prop("checked") == true) {
		cargarComboAulas();
	}

});

$("#tutor").change(function () {
	var nombres = $("#tutor option:selected").text();
	$("#tutorNombre").val(nombres);

});


function cargarComboAulas() {
	var institucion = $("#institucion").val();
	var sede = $("#sede").val();
	var pabellon = $("#pabellon").val();
	var piso = $("#piso").val();
	var idUsuario = $("#idTutor").val();

	if (institucion != null && sede != null && pabellon != null && piso != null) {
		$.ajax({
			url: path + "tutorAula/getAulasVirtuales",
			type: "POST",
			data: {
				institucion: institucion,
				sede: sede,
				pabellon: pabellon,
				piso: piso,
				idUsuario: idUsuario,
			},
			success: function (data) {
				$("#aula").html("");
				var datos = JSON.parse(data);
				if (datos.respuesta == "success") {
					if (datos.aulas != "vacio") {
						var aulas = datos.aulas;
						for (i = 0; i < aulas.length; i++) {
							var aula = aulas[i];
							//	$("#aula").append("<option value='" + aula.cod_aula + "'>" + aula.cod_aula + "</option>");
							$("#aula").append(" <label class='radio-btn'><input class='input-check-aulas' type='checkbox' name='aula[]' value='" + aula.cod_aula + "'> " + aula.cod_aula + " </label>   ");
						}

					} else {
						var tbody = $("#tablaProgramacion tbody");
						tbody.find('tr').remove();
					}
				} else {
					mostrarMensaje("error", "ERROR", datos.errores);
				}
			}
		});
	}
}

function cargarTutores() {
	$.ajax({
		url: path + "tutorAula/tutorAula",
		type: "POST",
		data: {},
		success: function (data) {
			console.log(data);
			var cboTutor = $("#tutor");
			cboTutor.find('option').remove();
			var datos = JSON.parse(data);
			if (datos.respuesta == "success") {
				if (datos.tutoress != "vacio") {
					var tutoress = datos.tutoress;
					cboTutor.append("<option value=\"0\">--Selecione--<option>");

					for (i = 0; i < tutoress.length; i++) {
						var tutor = tutoress[i];

						cboTutor.append("<option value=\"" + tutor.id + "\" >" + tutor.nombres + " " + tutor.apellidos + "</option>");
					}

				} else {
					cboTutor.append("<option value=\"0\">Registro vacio<option>");

				}
			} else {
				mostrarMensaje("error", "ERROR", datos.errores);
			}
		}
	});
}

$("#buscarTutorAula").keyup(function () {

	var val = $('#buscarTutorAula').val();
	$("#grid").data("kendoGrid").dataSource.filter({
		logic: "or",
		filters: [{
				field: "id_Tutor",
				operator: "contains",
				value: val
			},
			{
				field: "nombres",
				operator: "contains",
				value: val
			},
			{
				field: "apellidos",
				operator: "contains",
				value: val
			},
			{
				field: "correo",
				operator: "contains",
				value: val
			},
		]

	});
});

$('#buscarTutorAula').on('search', function (e) {
	if ('' == this.value) {
		$("#grid").data("kendoGrid").dataSource.filter({});
	}
});


/* ------------- Tutor ---------- */

/*01 Buscar */
$("#buscarTutor").keyup(function () {

	var val = $('#buscarTutor').val();
	$("#grid").data("kendoGrid").dataSource.filter({
		logic: "or",
		filters: [{
				field: "id_usuario",
				operator: "contains",
				value: val
			},
			{
				field: "nombres",
				operator: "contains",
				value: val
			},
			{
				field: "apellidos",
				operator: "contains",
				value: val
			},
		]

	});
});

$('#buscarTutor').on('search', function (e) {
	if ('' == this.value) {
		$("#grid").data("kendoGrid").dataSource.filter({});
	}
});

/*02 Listar */
function listarTutores() {
	target = "Tutores/tutores";
	$.ajax({
		url: path + target,
		type: "POST",
		data: {},
		
		beforeSend: function () {
			$("#labelL").html("Consultando Datos...");
			$("#divAlumnos").css({"display": "none"});
			$("#modalLoader").modal({backdrop: 'static', keyboard: false});
		},
		dataType: "json",
		success: function (data) {
			var data = data.tutores;
			$("#modalLoader").modal("hide");
			$("#grid").kendoGrid({

				reorderable: true,
				sortable: true,
				resizable: false,
				search: {
					fields: ["CodEmpleado", "nombres", "apellidos"]
				},
				columns: [{
						field: "id_Tutor",
						hidden: true,
						width: 60,
					},
					{
						field: "CodEmpleado",
						title: "Usuario",
						filterable: false,
						width: 60,
					},
					{
						field: "nombres",
						title: "Nombres",
						filterable: false,
						width: 110
					},
					{
						field: "apellidos",
						title: "Apellidos",
						filterable: false,
						width: 150
					},
					{
						field: "id_turno",
						title: "Id Turno",
						hidden: true,
					},
					{
						field: "turno",
						title: "Turno",
						width: 100,
						filterable: {
							multi: true
						},
					},
					{
						field: "id_horario",
						title: "Id Horario",
						hidden: true,
					},
					{
						field: "horario1",
						title: "Horario Lunes-Viernes | Sabado",
						template: "#= dia1 + ' '+ horario1 + ' | ' + dia2 +' '+ horario2 #",
						filterable: false,
						width: 330
					},
					{
						field: "correo",
						title: "Horario Sábado",
						hidden: true,
					},
					{
						field: "contrasenia",
						title: "Horario Sábado",
						hidden: true,
					},
					{
						field: "id_Estado",
						title: "Estado",
						hidden: true

					},
					{
						field: "estado_descripcion",
						title: "Estado",
						template: "<button class=\"btn boton-tabla boton-plomo\" type=\"button\" onclick=\"desactivarTutor(this)\" title=\"Desactivar\"><span class=\" # if(id_Estado == 1){# icon-checkmark #}else{ #  # }# \"></span></button>",
						width: 80,
						filterable: {
							multi: true
						},
					},
					{
						field: "",
						title: "Operaciones",
						template: "<button class=\"btn boton-tabla boton-celeste\" type=\"button\" onclick=\"verTutorAulas(this)\" title=\"Aulas asignadas\"><span class=\"icon-home\"></span></button>" +
							"<button class=\"btn boton-tabla boton-celeste\" type=\"button\" onclick=\"editarUsuario(this)\" title=\"Editar\"><span class=\"icon-pencil\"></span></button>",
						width: 80,
						attributes: {
							"style": "text-align:center",
						},
					}
				],
				filterable: {
					mode: "menu"
				},
				dataSource: {

					type: "odata",
					data,
					schema: {
						model: {
							fields: {
								cod_emp: {
									type: "int"
								},
								nombres: {
									type: "string"
								},
								apellidos: {
									type: "string"
								},
								turno: {
									type: "string"
								},
								horario: {
									type: "string"
								}
							}
						},

					}
				},
				pageable: {
					pageSizes: false,
					numeric: false,
					previousNext: false,
					messages: {
						display: "Total: {2}"
					},
				},
				filterMenuInit: function (e) {
					var container = e.container;
					var checkAll = container.find(".k-check-all").closest("li");
					var selectedItems = container.find(".k-filter-selected-items");
					checkAll.remove();
					selectedItems.remove();
				},

			});

		}
	});
}

/*03 Registrar */
$("#btnRegistrarDatos").click(function () {

	var accion = $("#accion").val();
	var idTutor = $("#idTutor").val();
	var idUsuario = $("#codigoObtenidoParaCompletarCampo").val();
	var idTurno = $("#idTurno").val();
	var idHorario = $("#idHorario").val();
	var correo = $("#correo").val();
	var contrasenia = $("#contrasenia").val();
	var contraseniaHidden = $("#contraseniaHidden").val();
	var target = "";
	
	if (accion == "C") {
		target = "tutores/registrar";
		$.ajax({
			url: path + target,
			type: "POST",
			data: {
				accion: accion,
				opcion: 'agregar',
				idUsuario: idUsuario,
				idTurno: idTurno,
				idHorario: idHorario,
				correo: correo,
				contrasenia: contrasenia

			},
			success: function (data) {
				var datos = JSON.parse(data);
				if (datos.respuesta == "success") {
					listarTutores();
					/*AQUÍ AGREAGR MENSAJE DE SUCCESS */
					$("#modalNuevoEditUsuario").modal("hide");
					 regisarNewUsuario();
					 registrarPermisos(67);
					 registrarPermisos(65);
					 registrarPermisos(64);
					
				} else {
					mostrarMensaje("error", "ERROR", datos.errores);
				}
			}
		});

	}
	if (accion == "U") {
		target = "tutores/actualizar";
		$.ajax({
			url: path + target,
			type: "POST",
			data: {
				accion: accion,
				opcion: 'actualizar',
				idTutor: idTutor,
				idTurno: idTurno,
				idHorario: idHorario,
				correo: correo,
				contrasenia: contrasenia,
				contraseniaHidden: contraseniaHidden,
			},
			success: function (data) {
				var datos = JSON.parse(data);
				if (datos.respuesta == "success") {
					listarTutores();
					$("#modalNuevoEditUsuario").modal("hide");
				} else {
					mostrarMensaje("error", "ERROR", datos.errores);
				}
			}
		});
	}


});

function regisarNewUsuario() {
	var accion = "C";
	var usuario = $("#codigoObtenidoParaCompletarCampo").val();
	var contrasenia = $("#contrasenia").val();
	var apellidos = $("#apellidos").val();
	var nombres = $("#nombres").val();
	var area = 15;
	var estado = 0;
	var target = "";

	if (accion == "C") {
		target = "seguridad/registrarUsuario"
	}
	if (accion == "U") {
		target = "seguridad/actualizarUsuario"
	}

	$.ajax({
		url: path + target,
		type: "POST",
		data: {
			accion: accion,
			usuario: usuario,
			contrasenia: contrasenia,
			apellidos: apellidos,
			nombres: nombres,
			area: area,
			estado: estado
		},
		success: function (data) {
			var datos = JSON.parse(data);
			if (datos.respuesta == "success") {
				console.log("Succes");
			} else if (datos.errores == "El nombre de usuario ya se encuentra registrado") {
				console.log("El usuario ya ha sido registrado antes");
			} else {
				mostrarMensaje("error", "ERROR", datos.errores);
			}
		}
	});


}

function registrarPermisos(aula) {

	var idUsuario = $("#codigoObtenidoParaCompletarCampo").val();
	var idAula = aula;

	$("idTurno").val(idTurno);

	$.ajax({
		url: path + "tutores/insertarPermisoAlTutor",
		type: "POST",
		data: {
			idAula: idAula,
			idUsuario: idUsuario,
		},
		success: function (data) {

			var datos = JSON.parse(data);

			if (datos.respuesta == "success") {

				console.log("Success");

			} else {
				console.log(datos.errores);
			}
		}
	});
}

/*04 Editar */
function editarUsuario(btn) {

	limpiarCamposModalTutor();
	$("#accion").val("U");
	$("#divBuscar").hide();
	$("#tituloModal").html("Actualizar Registro");

	var idTutor = $(btn).parent().parent().find("td").eq(0).html();
	var nombres = $(btn).parent().parent().find("td").eq(2).html();
	var apellidos = $(btn).parent().parent().find("td").eq(3).html();
	var idTurno = $(btn).parent().parent().find("td").eq(4).html();
	var idHorario = $(btn).parent().parent().find("td").eq(6).html();
	var correo = $(btn).parent().parent().find("td").eq(8).html();
	var contrasenia = $(btn).parent().parent().find("td").eq(9).html();

	$("#idTutor").val(idTutor);
	$("#apellidosNombres").val($.trim(nombres) + ' ' + $.trim(apellidos));
	$("#idTurno").val(idTurno);

	cargarHorarios(idTurno);

	$("#idHorario").val(idHorario);

	$("#correo").val(correo);
	$("#contraseniaHidden").val(contrasenia);

	$("#modalNuevoEditUsuario").modal({
		backdrop: 'static',
		keyboard: false
	});
}

/*05 Desactivar */
function confirmarDesactivarTutor() {

	var estado = null;
	var idTutor = $("#idTutorDesactivar").val();
	var estado = 0;

	if (idTutor != null || idTutor != "") {

		$.ajax({
			url: path + "tutores/desactivar",
			type: "POST",
			data: {
				idTutor: idTutor,
				estado: estado,
			},
			success: function (data) {
				var datos = JSON.parse(data);
				if (datos.respuesta == "success") {
					$("#modalMensaje").modal("hide");
					listarTutores();
				} else {
					var errores = "";
					for (i = 0; i < datos.errores.length; i++) {
						errores += datos.errores[i] + "<br>";
					}
					mostrarMensaje("error", "ERROR", errores);
				}
			}
		});


	} else {
		mostrarMensaje("error", "ERROR", "Tutor no seleccionado");
	}


}

function desactivarTutor(btn) {

	$("#idTutorDesactivar").val($(btn).parent().parent().find("td").eq(0).html());
	$("#valorEliminarDesactivar").val("desactivarTutor");
	var mensaje = "¿ESTÁ SEGURO QUE DESEA DEACTIVAR EL TUTOR?";
	mostrarMensaje("confirmacion", "CONFIRMAR", mensaje);
}

/*06 Operaciones */
function limpiarCamposModalTutor() {

	$("#apellidosNombres").val("");
	$("#codigoObtenidoParaCompletarCampo").val("");
	$("#idTurno").val(0);
	$("#idHorario").val(0);
	$("#correo").val("");
	$("#contrasenia").val("");
	$("#contraseniaHidden").val("");
}

$("#idTurno").change(function () {

	var turno = $(this).val();
	//$( "#myselect" ).val();

	cargarHorarios(turno);

	/*
	if (turno == 1) {

		

		$("#horario1").val("LUNES-VIERNES 8:00 AM - 5:00 PM");
		$("#horario2").val("SABADO 8:00 AM a 1:00 PM");
		$("#idHorario1").val(1);
		$("#idHorario2").val(1);
	} else if (turno == 2) {

		$("#horario1").val("LUNES-VIERNES 2:00 PM - 10:00 PM");
		$("#horario2").val("SABADO 8:00 AM a 1:00 PM");
		$("#idHorario1").val(2);
		$("#idHorario2").val(2);
	} else {
		$("#horario1").val("");
		$("#horario2").val("");
		$("#idHorario1").val(0);
		$("#idHorario2").val(0);

	}*/

});

$("#mensaje-boton-aceptar").click(function () {

	var valor = $("#valorEliminarDesactivar").val();
	if (valor == 'eliminarAulaAsignada') {
		confirmarEliminarTutorAulaAsignada();
	} else if (valor == 'desactivarTutor') {
		confirmarDesactivarTutor();
	} else {
		alert("Sin valor");
	}

});

/*Combobox */
function cargarHorarios(idTurno) {

	$.ajax({
		url: path + "tutores/cargar_horarios",
		type: "POST",
		data: {
			idTurno: idTurno,
		},
		success: function (data) {

			$("#idHorario").html("");
			var datos = JSON.parse(data);
			if (datos.respuesta == "success") {
				if (datos.horarios != "vacio") {
					var horarios = datos.horarios;
					for (i = 0; i < horarios.length; i++) {
						var horario = horarios[i];
						$("#idHorario").append("<option value='" + horario.id + "'>" + horario.dia1 + ' ' + horario.horario1 + ' | ' + horario.dia2 + ' ' + horario.horario2 + "</option>");
					}
				} else {

				}
			} else {
				mostrarMensaje("error", "ERROR", datos.errores);
			}

		}

	});
}

/*Buscar / Seleccionar Usuario */
function buscarUsuarios() {

	var datosDeBusqueda = $("#datosDeBusqueda").val().trim();

	$.ajax({
		url: path + "tutores/cargarUsuarios",
		type: "POST",
		data: {
			datosDeBusqueda: datosDeBusqueda,
			opcion: "buscar"
		},
		success: function (data) {

			var tbody = $("#tablaModalUsuario tbody");
			tbody.find('tr').remove();
			var datos = JSON.parse(data);

			if (datos.respuesta == "success") {

				if (datos.usuarios != "vacio") {

					if (datos.usuarios.length == 1) {
						var usuario = datos.usuarios[0];
						$("#codigoObtenidoParaCompletarCampo").val(usuario.cod_emp);

						seleccionarUsuario2();

					} else {

						$("#modalbuscarUsuario").modal({
							backdrop: 'static',
							keyboard: false
						});

						var usuarios = datos.usuarios;
						for (i = 0; i < usuarios.length; i++) {
							var usuario = usuarios[i];
							var tr = "<tr ondblclick=\"seleccionarUsuario(this);\">" +
								"<td class=\"celda-centrada\">" + usuario.cod_emp + "</td>" +
								"<td>" + usuario.nombres_apellidos + "</td>" +
								"</tr>";
							tbody.append(tr);
						}

					}

				} else {
					mostrarAlertas("error", "ERROR", "El registro no existe o ya está registrado como tutor");
					$("#apellidosNombres").val("");

				}

			} else {
				var errores = "";
				for (i = 0; i < datos.errores.length; i++) {
					errores += datos.errores[i] + "<br>";
				}
				mostrarAlertas("error", "ERROR", errores);
			}


		}

	});

}

$("#btnBuscar").click(function () {
	buscarUsuarios();
});

function seleccionarUsuario(tr) {
	var codUsuario = $(tr).find("td").eq(0).html();

	$.ajax({
		url: path + "tutores/cargarUsuarios",
		type: "POST",
		data: {
			codUsuario: codUsuario,
			opcion: "seleccionar"
		},
		success: function (data) {
			var datos = JSON.parse(data);
			if (datos.respuesta == "success") {
				$("#modalbuscarUsuario").modal("hide");
				$("#correo").val('');
				if (datos.usuario != "vacio") {
					var usuario = datos.usuario[0];
					$("#apellidosNombres").val(usuario.nombres_apellidos.trim());
					$("#codigoObtenidoParaCompletarCampo").val(usuario.cod_emp.trim());
					$("#nombres").val(usuario.nombres.trim());
					$("#apellidos").val(usuario.apellidos.trim());
					$("#contrasenia").val(usuario.cod_emp.trim());

					if (usuario.Correo != null) {
						$("#correo").val(usuario.Correo.trim());
					}
					$("#datosDeBusqueda").val("");
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

function seleccionarUsuario2() {

	var codUsuario = $("#codigoObtenidoParaCompletarCampo").val();

	$.ajax({
		url: path + "tutores/cargarUsuarios",
		type: "POST",
		data: {
			codUsuario: codUsuario,
			opcion: "seleccionar"
		},
		success: function (data) {

			var datos = JSON.parse(data);
			if (datos.respuesta == "success") {
				$("#modalbuscarUsuario").modal("hide");
				$("#correo").val('');
				if (datos.usuario != "vacio") {
					var usuario = datos.usuario[0];

					$("#apellidosNombres").val(usuario.nombres_apellidos.trim());
					$("#nombres").val(usuario.nombres.trim());
					$("#apellidos").val(usuario.apellidos.trim());
					$("#contrasenia").val(usuario.cod_emp.trim());
					
					if (usuario.Correo != null) {
						$("#correo").val(usuario.Correo.trim());
					}
					$("#datosDeBusqueda").val("");
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

/* ------------- Horario ---------- */

/*Registrar*/

$("#btnRegistrarHorario").click(function () {

	var idTurno = $("#idTurnoHorario").val();
	var horario1 = $("#horario1").val();
	var horario2 = $("#horario2").val();

	$("idTurno").val(idTurno);

	$.ajax({
		url: path + "tutores/insertar_horario",
		type: "POST",
		data: {
			idTurno: idTurno,
			horario1: horario1,
			horario2: horario2
		},
		success: function (data) {

			var datos = JSON.parse(data);

			if (datos.respuesta == "success") {

				cargarHorarios(idTurno);
				$("#modalNuevoHorario").modal("hide");

			} else {
				mostrarMensaje("error", "ERROR", datos.errores);
			}
		}
	});


});


function listarXturno(idTurno) {

	target = "horario/listarXturno";
	$.ajax({
		url: path + target,
		type: "POST",
		data: {
			idTurno: idTurno,
		},
		success: function (data) {
			$("#idHorario").html("");
			var datos = JSON.parse(data);
			if (datos.respuesta == "success") {
				if (datos.horarios != "vacio") {
					var horarios = datos.horarios;
					for (i = 0; i < horarios.length; i++) {
						var horario = horarios[i];
						/*LUNES -VIERNES */
						$("#idHorario").append("<option value='" + horario.id + "'>" + horario.dia1 + ' ' + horario.horario1 + ' | ' + horario.dia2 + ' ' + horario.horario2 + "</option>");
					}
				} else {


				}
			} else {
				mostrarMensaje("error", "ERROR", datos.errores);
			}

		}

	});
}






/* ------------- Tutor Aula ---------- */


/*Listar*/
function cargarAulasAsignadas() {

	var idTutor = $("#idTutor").val();

	$.ajax({
		url: path + "tutorAula/listarAulasAsignadas",
		type: "POST",
		data: {
			idTutor: idTutor
		},
		dataType: "json",
		success: function (data) {

			var validar = data.respuesta;
			var data = data.aulasAsignadas;

			$("#gridAulasAsignadas").html("");

			if (validar == "success") {
				if (data != "vacio") {

					$("#gridAulasAsignadas").kendoGrid({

						reorderable: true,
						sortable: true,
						resizable: false,
						pageable: false,
						height: 300,
						filterable: false,
						columns: [{
								field: "id_TutorAula",
								title: "Aula",
								hidden: false,
								hidden: true
							},
							{
								field: "Nro_Aula",
								title: "Aula",
								filterable: false,
								width: 70
							},
							{
								field: "mes",
								title: "Mes",
								filterable: {
									multi: true
								},
								width: 100
							},

							{
								field: "",
								title: "Docente",
								filterable: false,
								hidden: true,
								width: 200
							},
							{
								field: "",
								title: "Curso",
								filterable: false,
								hidden: true,
								width: 100,

							},
							{
								field: "AnoProgramado",
								title: "Año",
								filterable: {
									multi: true
								},
								width: 100
							},
							{
								field: "",
								title: "Estado",
								filterable: false,
								template: "<button class=\"btn boton-tabla boton-plomo\" type=\"button\" onclick=\"desactivarTutorAula(this)\" title=\"# if(estado == 1){# Activo #}else{ # Inactivo # }# \"><span class=\" # if(estado == 1){# icon-checkmark #}else{ #  # }# \"></span></button>",
								width: 40
							},
							{
								field: "",
								title: "Eliminar",
								filterable: false,
								template: "<button class=\"btn boton-tabla\"  style=\"color: red\" type=\"button\" onclick=\"eliminarAulaAsignada(this)(this)\" title=\"Eliminar\"><span class=\"icon-cross\"></span></button>",
								width: 40
							},
							{
								field: "estado",
								title: "estado",
								hidden: true,
								width: 100
							},


						],
						filterable: {
							mode: "menu"
						},
						dataSource: {

							type: "odata",
							data,
							schema: {
								model: {
									fields: {
										id_Tutor: {
											type: "int"
										},
										nombres: {
											type: "string"
										},
										apellidos: {
											type: "string"
										},
										Descripcion: {
											type: "string"
										},
										pabellon: {
											type: "string"
										},
										cod_aula: {
											type: "string"
										},
									}
								},

							}
						},
						pageable: {
							pageSizes: false,
							numeric: false,
							previousNext: false,
							messages: {
								display: "Total: {2}"
							},
						},

						filterMenuInit: function (e) {
							var container = e.container;
							var checkAll = container.find(".k-check-all").closest("li");
							var selectedItems = container.find(".k-filter-selected-items");
							checkAll.remove();
							selectedItems.remove();
						},


					});

				} else {

					$("#gridAulasAsignadas").kendoGrid({
						columns: [{
								field: "",
								title: "AÚN NO SE HAN ASIGNADO AULAS",
								width: 70
							},

						],

					});

				}

			} else {
				mostrarMensaje("error", "ERROR", datos.errores);
			}

		}

	});


}

/*Registrar*/
$("#btnRegistrarAulaTutor").click(function () {

	var accion = $("#opciones").val();
	var anio = $("#anio").val();
	var mes = $("#mes").val();
	var tutor = $("#idTutor").val();

	var aula = [];
	$(".input-check-aulas").each(function () {
		if ($(this).is(":checked")) {
			$.trim(aula.push($(this).val()));
		}
	});

	$.each(aula, function (index, value) {

		$.ajax({
			url: path + "tutorAula/registrar",
			type: "POST",
			data: {
				accion: accion,
				tutor: tutor,
				aula: value,
				anio: anio,
				mes: mes
			},

			success: function (data) {

				var datos = JSON.parse(data);
				if (datos.respuesta == "success") {

					$("#idTutor").val(tutor);
					$("#opciones").val("actualizar");
					$("#divTutor").hide();
					cargarTutores();
					titulo = $("#tutorNombre").val();
					$("#tituloModal").html("Agregar aulas para el tutor: " + titulo);
					cargarAulasAsignadas();
					cargarComboAulas();

				} else {

					mostrarMensaje("error", "ERROR", datos.errores);

				}
			}
		});


	});



});

/*Desactivar*/
function desactivarTutorAula(btn) {

	var idTutorAula = $(btn).parent().parent().find("td").eq(0).html();
	var idEstado = $(btn).parent().parent().find("td").eq(8).html();




	if (idTutorAula != null || idTutorAula != "") {

		if (idEstado == 1) {
			estado = 0;
		} else {
			estado = 1
		}

		$.ajax({
			url: path + "tutorAula/desactivar",
			type: "POST",
			data: {
				idTutorAula: idTutorAula,
				estado: estado,
			},
			success: function (data) {
				var datos = JSON.parse(data);
				if (datos.respuesta == "success") {
					cargarAulasAsignadas();
				} else {
					var errores = "";
					for (i = 0; i < datos.errores.length; i++) {
						errores += datos.errores[i] + "<br>";
					}
					mostrarMensaje("error", "ERROR", errores);
				}
			}
		});
	} else {
		mostrarMensaje("error", "ERROR", "REGISTRO NO SELECCCIONADO");
	}

}

/*Eliminar*/
function confirmarEliminarTutorAulaAsignada(btn) {

	var idTutorAula = $("#idTutorAulaDelete").val();
	if (idTutorAula != null || idTutorAula != "") {

		$.ajax({
			url: path + "tutorAula/eliminar",
			type: "POST",
			data: {
				idTutorAula: idTutorAula
			},
			success: function (data) {
				console.log(data);
				var datos = JSON.parse(data);
				console.log(datos);
				if (datos.respuesta == "success") {
					$("#modalMensaje").modal("hide");
					cargarAulasAsignadas();
					cargarComboAulas();
					//Notiflix.Notify.Success('Aula eliminado');
					Notiflix.Notify.Success('Aula eliminado.', {
						ID: 'MKA',
						timeout: 1200,
						showOnlyTheLastOne: true,
						});

					//Notiflix.Notify.Failure('Ocurrió un error al actualizar los permisos');

			
				} else {
					var errores = "";
					for (i = 0; i < datos.errores.length; i++) {
						errores += datos.errores[i] + "<br>";
					}
					mostrarMensaje("error", "ERROR", errores);
				}
			}
		});

	} else {
		mostrarMensaje("error", "ERROR", "REGISTRO NO SELECCIONADO");
	}

}

function eliminarAulaAsignada(btn) {
	var idTutorAula = $(btn).parent().parent().find("td").eq(0).html();
	$("#idTutorAulaDelete").val(idTutorAula);
	$("#valorEliminarDesactivar").val("eliminarAulaAsignada");
	var mensaje = "¿ESTÁ SEGURO QUE DESEA QUITAR EL AULA ASIGNADO AL TUTOR..?";
	mostrarMensaje("confirmacion", "CONFIRMAR", mensaje);
}

/*Ver Aulas*/
function verTutorAulas(btn) {

	var idTutor = $(btn).parent().parent().find("td").eq(0).html();
	var nombres = $(btn).parent().parent().find("td").eq(2).html();
	var apellidos = $(btn).parent().parent().find("td").eq(3).html();

	$("#idTutor").val(idTutor);
	$("#tutor").val(idTutor);
	$("#divTutor").hide();
	$("#opciones").val("actualizar");

	$("#modalNuevoTutorAula").modal({
		backdrop: 'static',
		keyboard: false
	});

	$("#tituloModalAsignarAula").html("Asignar aulas al tutor: " + nombres + apellidos);

	cargarAulasAsignadas();
	cargarComboAulas();

}

function limpiarCampos() {
	$("#opciones").val("agregar");
	$("#aula").val(0);
	$("#gridAulasAsignadas").html("");
	$("#idTutor").val("");
	$("#idTutorAula").val("");
	$("#tutor").val(0);

}


/* ------------- Otros ---------- */
/*Ultimo regitro de Tutor aula */
function ultimoRegistro() {

	target = "tutorAula/selectUltimoRegitro";

	$.ajax({
		url: path + target,
		type: "POST",
		data: {},
		dataType: "json",
		success: function (data) {

			var data = data.ultimoRegistro;
			for (i = 0; i < data.length; i++) {
				var da = data[i];
				$("#idTutorAula").val(da.id_TutorAula);
			}

			//$("#tituloModal").val();


		}

	});
}


function mostrarAlertas(estilo, titulo, mensaje) {
	asignarEstiloModal(estilo);
	$("#mensaje-titulo").html(titulo);
	$("#mensaje-contenido").html(mensaje);
	$("#modalMensaje").modal({
		backdrop: 'static',
		keyboard: false
	});
}
