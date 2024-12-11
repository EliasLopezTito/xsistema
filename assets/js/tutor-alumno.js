$(document).ready(function () {


	// $("#institucion").attr("disabled", "disabled");

	// $("#sede").attr("disabled", "disabled");
	// $("#pabellon").attr("disabled", "disabled");
	cargarPisos();


	var fecha = new Date();
	var anio = fecha.getFullYear();
	var anioAntes = fecha.getFullYear() - 1;

	$("#anioProg").append('<option value=' + anio + '>' + anio + '</option>');
	$("#anioProg").append('<option value=' + anioAntes + '>' + anioAntes + '</option>');

	ObtenerIdTutor();

	cargarComboAulas();



});


/* ------------------------ Opciones de filtro ----------------------------- */
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


$("#aula").change(function () {
	alumnos();
});


$("#anoProg").change(function () {
	alumnos();
});

$("#mesProg").change(function () {
	alumnos();
});

function cargarComboAulas() {

	var institucion = $("#institucion").val();
	var pabellon = $("#pabellon").val();
	var piso = $("#piso").val();
	var idTutor = $("#SessionIdTutor").val();
	var idUsuario = $("#SessionIdUsuario").val();

	if (institucion != null && pabellon != null && piso != null) {

		if (idUsuario == 'FVASQUEZ') {
			$.ajax({
				url: path + "tutorAula/cboAulasAsignadas2",
				type: "POST",
				data: {
					institucion: institucion,
					pabellon: pabellon,
					piso: piso,

				},
				success: function (data) {
					$("#aula").html("");
					var datos = JSON.parse(data);
					if (datos.respuesta == "success") {
						if (datos.aulas != "vacio") {
							var aulas = datos.aulas;

							$("#aula").append("<option value='ALL'>TODO</option>");
							for (i = 0; i < aulas.length; i++) {
								var aula = aulas[i];
								$("#aula").append("<option value='" + aula.cod_aula + "'>" + aula.cod_aula + "</option>");
							}

						} else {
							var tbody = $("#tablaProgramacion tbody");
							tbody.find('tr').remove();
						}

						alumnos();
					} else {
						mostrarMensaje("error", "ERROR", datos.errores);
					}

				}
			});


		} else {
			$.ajax({
				url: path + "tutorAula/cboAulasAsignadas",
				type: "POST",
				data: {
					institucion: institucion,
					pabellon: pabellon,
					piso: piso,
					idTutor: idTutor
				},
				success: function (data) {
					$("#aula").html("");
					var datos = JSON.parse(data);
					if (datos.respuesta == "success") {
						if (datos.aulas != "vacio") {
							var aulas = datos.aulas;

							for (i = 0; i < aulas.length; i++) {
								var aula = aulas[i];
								$("#aula").append("<option value='" + aula.cod_aula + "'>" + aula.cod_aula + "</option>");
							}

						} else {
							var tbody = $("#tablaProgramacion tbody");
							tbody.find('tr').remove();
						}

						alumnos();
					} else {
						mostrarMensaje("error", "ERROR", datos.errores);
					}

				}
			});

		}

	}
}


/* ----------------------------- Mantenimiento ------------------------- */

$("#btnExcelExportAlumnos").click(function (e) {
	
	if ($('#aula').val() === 'ALL') {

		let formulario = new FormData(document.getElementById('frmListados'));

		$.ajax({
			type:'POST',
			url:`${path}tutores/reporteExcel`,
			data: formulario,
			dataType:'json',
			contentType:false,
            processData:false,
            cache:false,
			beforeSend: function(){
                $('.text-loader').text('Estamos creando tu reporte, por favor espere...');
                $("#modalLoader").modal();
            },
			success: function(data){
				$("#modalLoader").modal("hide");
                $("#modalCargarVoucher").modal("hide");
				var $a = $("<a>");
				$a.attr("href",data.file);
				$("body").append($a);
				$a.attr("download","file.xls");
				$a[0].click();
				$a.remove();
			},
			error: function(error){
                // mostrarMensaje("error", "ERROR", data.errores);
                $("#modalLoader").modal("hide");
                $("#modalCargarVoucher").modal("hide");
				Notiflix.Notify.Failure('Ocurrió un error al crear el reporte!');
            }
		});
	} else{
		var grid = $("#grid").data("kendoGrid");
		grid.saveAsExcel();
	}

});

$("#buscar").keyup(function () {

	var val = $('#buscar').val();
	$("#grid").data("kendoGrid").dataSource.filter({
		logic: "or",
		filters: [{
				field: "cod_alumno",
				operator: "contains",
				value: val
			},
			{
				field: "DNI",
				operator: "contains",
				value: val
			},
			{
				field: "alumno",
				operator: "contains",
				value: val
			},
			{
				field: "telefono",
				operator: "contains",
				value: val
			},
			{
				field: "email",
				operator: "contains",
				value: val
			},
		]

	});
});

$('#buscar').on('search', function (e) {
	if ('' == this.value) {
		$("#grid").data("kendoGrid").dataSource.filter({});
	}
});

$(function () {
	$("[data-toggle='tooltip']").tooltip();
});

function alumnos() {

	var institucion = $("#institucion").val();
	var anioProg = $("#anioProg").val();
	var mesProg = $("#mesProg").val();
	var pabellon = $("#pabellon").val();
	var piso = $("#piso").val();
	var aula = $("#aula").val();

	$.ajax({
		url: path + "tutores/alumnos",
		type: "POST",
		data: {
			institucion: institucion,
			anioProg: anioProg,
			mesProg: mesProg,
			pabellon: pabellon,
			piso: piso,
			aula: aula
		},
		dataType: "json",
		beforeSend: function(){
			$('.text-loader').text('Cargando alumnos...');
			$("#modalLoader").modal();
		},
		success: function (datos) {

			console.log(data);
			var validar = datos.respuesta;
			var data = datos.alumnos;
			
			$("#grid").html("");
			$("#modalLoader").modal("hide");
			if (validar == "success") {
				if (data != "vacio") {

					var grid = $("#grid").kendoGrid({

						reorderable: true,
						sortable: true,
						resizable: true,
						pageable: false,
						filterable: false,
						height: 350,
						excel: {
							fileName: "Alumnos.xlsx",
							name: "Lista de alumnos",
							filterable: true,
							creator: "Loayza",
							avoidLinks: true,
							title: "Alumnos",
						},
						excelExport: function (e) {

							var sheet = e.workbook.sheets[0];
							sheet.frozenRows = 2;
							//sheet.mergedCells = ["A1:K1"];
							sheet.name = "Lista de alumnos"
							/*
														var myHeaders = [{
															value: "Lista de Alumnos",
															fontSize: 25,
															textAlign: "center",
															background: "#ffffff",
															color: "#000000"
														}];
														sheet.rows.splice(0, 0, {
															cells: myHeaders,
															type: "header",
															height: 50
														});*/
						},
						search: {
							fields: ["cod_alumno", "DNI", "alumno", "telefono", "email"]
						},
						columns: [{
								field: "cod_alumno",
								title: "Código",
								filterable: false,
								width: 70
							},
							{
								field: "DNI",
								title: "DNI",
								filterable: false,
								width: 60,
							},
							{
								field: "alumno",
								title: "Alumno",
								filterable: false,
								width: 210,
							},
							{
								field: "telefono",
								title: "Celular",
								filterable: false,
								width: 75,
							},
							{
								field: "email",
								title: "Correo",
								filterable: false,
								width: 250,
							},
							{
								field: "curso",
								title: "Curso",
								filterable: false,
								width: 250,
								filterable: {
									multi: true
								},
							},
							{
								field: "cod_aula",
								title: "aula",
								filterable: false,
								width: 40,
							},
							{
								field: "profesor",
								title: "Profesor",
								width: 220,
								filterable: {
									multi: true
								},
							},
							{
								field: "ciclo",
								title: "Ciclo",
								filterable: false,
								width: 60,
							},
							{
								field: "especialidad",
								title: "Especialidad",
								width: 180,
								filterable: {
									multi: true
								},
							},
							{
								field: "turno",
								title: "Turno",
								width: 70,
								filterable: {
									multi: true
								},
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
										cod_alumno: {
											type: "string"
										},
										DNI: {
											type: "string"
										},
										alumno: {
											type: "string",
										},
										telefono: {
											type: "string",
										},
										email: {
											type: "string",
										},
										cod_aula: {
											type: "string",
										},
										profesor: {
											type: "string",
										},
										ciclo: {
											type: "string",
										},
										especialidad: {
											type: "string",
										},
										turno: {
											type: "string",
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


					}).getKendoGrid();

					var toolbar = $("#toolBar").kendoToolBar().getKendoToolBar();
					toolbar.add({
						id: "ColumnMenu",
						template: "<div id='columnMenuButton' class='a-gridstate-button k-state-default' title='Configure visible columns and save the grid state'></div>",
						overflow: "never"
					});

					$("#columnMenuButton").kendoColumnMenu({
						filterable: false,
						sortable: false,
						dataSource: grid.dataSource,
						columns: true,
						owner: grid
					});

				} else {
					$("#grid").kendoGrid({
						columns: [{
								field: "",
								title: "no se ha encontrado los registros",
								width: 70
							},

						],

					});

				}

			} else {
				// mostrarMensaje("error", "ERROR", datos.errores);
			}

		},
		error: function(){
			$("#modalLoader").modal("hide");
		}

	});


}

function ObtenerIdTutor() {

	var idUsuario = $("#SessionIdUsuario").val();

	$.ajax({
		url: path + "tutores/obtenerIdUsuarioSession",
		type: "POST",
		data: {
			idUsuario: idUsuario
		},
		dataType: "json",
		success: function (data) {

			var validar = data.respuesta;
			var data = data.usuarioSession;

			if (validar == "success") {
				for (i = 0; i < data.length; i++) {
					var dat = data[i];
					valor = dat.id_Tutor;
				}
				$("#SessionIdTutor").val(valor);
			} else {

			}

		}





	});


}
