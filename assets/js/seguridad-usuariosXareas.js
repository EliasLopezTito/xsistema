$(document).ready(function () {

	cargarTablaUsuarios( $("#filtrar__usuarios").val() , $("#filtrar__area").val() , $("#filtrar__estado").val() )

    $('#btn__filtrar__usuarios').click(function(){  

        tabla_lista_usuarios.destroy();
		$('#tabla__lista__usuarios body').empty();
        cargarTablaUsuarios( $("#filtrar__usuarios").val() , $("#filtrar__area").val() , $("#filtrar__estado").val() );
    });

});

function cargarTablaUsuarios(usuario, area, estado) {
    tabla_lista_usuarios = $('#tabla__lista__usuarios').DataTable({
        destroy: true,
        dom: 'Bfrtip',
        buttons: [
            {
                extend: 'excel',
                text: 'Exportar Excel',
                className: 'btn_excel_datatable',
                filename: function () {
                    var fecha = new Date();
                    var dia = String(fecha.getDate()).padStart(2, '0');
                    var mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
                    var anio = fecha.getFullYear();
                    return 'USUARIOS - ' + anio + '-' + mes + '-' + dia;
                }
            }
        ],
        lengthMenu: [
            [25, 50, 100],
            [25, 50, 100]
        ],
        pageLength: 25,
        ajax: {
            url: path + "Seguridad/usuariosXareas",
            type: 'post',
            data: {
                "opcion": "",
                "usuario": usuario,
                "area": area,
                "estado": estado
            },
            dataSrc: function (r) {
                if (r.success === true) {
                    if (r.result === "vacio") {
                        return [];
                    }
                    return r.result;
                } else {
                    return [];
                }
            }
        },
        columnDefs: [
            {
                defaultContent: "-",
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        columns: [
            { data: {}, render: function (data, type, row, meta) { return meta.row + meta.settings._iDisplayStart + 1; }, "className": "" },
            { data: null, render: function (data) { return data.id_usuario; }, "className": "" },
            { data: null, render: function (data) { return data.Usuario; }, "className": "" },
            { data: null, render: function (data) { return data.area_descripcion; }, "className": "" },
            { data: null, render: function (data) { return data.estado === 0 ? "ACTIVO" : "INACTIVO"; }, "className": "text-center" },
            {
                data: null, render: function (data) {
                    return `
                        <button class="btn boton-tabla boton-rojo"  type="button" onclick="cambiarEstado(this)" title="Cambiar Estado"><span class="icon-spinner9"></span></button>
                        <button class="btn boton-tabla boton-verde" type="button" onclick="cambiarContrasenia(this)" title="Cambiar Contraseña"><span class="icon-key2"></span></button>
                    `;
                }, "className": "text-center"
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

$("#btnCambiarContrasenia").click(function () {
	var usuario = $("#usuarioC").val();
	var contrasenia = $("#contraseniaC").val();
	var contrasenia2 = $("#contrasenia2C").val();
	var target = "seguridad/cambiarContrasenia"

	$.ajax({
		url: path + target,
		type: "POST",
		data: {
			usuario: usuario,
			contrasenia: contrasenia,
			contrasenia2: contrasenia2,
		},
		success: function (data) {
			var datos = JSON.parse(data);
			if (datos.respuesta == "success") {
				$("#modalCambiarContrasenia").modal("hide");
				mostrarMensaje("exito", "Ok", "La contraseña se cambio correctamente");
			} else {
				mostrarMensaje("error", "ERROR", datos.errores);
			}
		}
	});
});

$("#btnCambiarEstado").click(function () {
	var usuario = $("#usuarioCa").val();
	var estado = $("#estadoC").val();
	var target = "seguridad/cambiarEstado"

	$.ajax({
		url: path + target,
		type: "POST",
		data: {
			usuario: usuario,
			estado: estado,
		},
		success: function (data) {
			var datos = JSON.parse(data);
			if (datos.respuesta == "success") {
				$("#modalCambiarEstado").modal("hide");
                location.reload();
			} else {
				mostrarMensaje("error", "ERROR", datos.errores);
			}
		}
	});
});

$("#buscarUsuarios").keyup(function () {

	var val = $('#buscarUsuarios').val();
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
			{
				field: "area_descripcion",
				operator: "contains",
				value: val
			},
			{
				field: "estado",
				operator: "contains",
				value: val
			},

		]

	});
});

$('#buscarUsuarios').on('search', function (e) {
	if ('' == this.value) {
		$("#grid").data("kendoGrid").dataSource.filter({});
	}
});

$(function () {
	$("[data-toggle='tooltip']").tooltip();
});

function cargarUsuarios() {
	target = "seguridad/usuariosXareas"
	$.ajax({
		url: path + target,
		type: "POST",
		data: {usuario:"todo"},
		dataType: "json",
		success: function (data) {

			var validar = data.success;
			var data = data.result;

			$("#grid").html("");

			if (validar === true) {
				if (data.usuarios != "vacio") {
					$("#grid").kendoGrid({

						reorderable: true,
						sortable: true,
						resizable: false,
						search: {
							fields: ["id_usuario", "nombres", "apellidos", "area_descripcion"]
						},
						columns: [{
								field: "id_usuario",
								title: "Usuario",
								filterable: false,
								width: 100,
							},
							{
								field: "apellidos",
								title: "Apellidos",
								filterable: false,
								with: 250
							},
							{
								field: "nombres",
								title: "Nombres",
								filterable: false,
								width: 250
							},

							{
								field: "id_area",
								hidden: true,
							},
							{
								field: "area_descripcion",
								title: "Area",
								filterable: false,
								width: 200,
								filterable: {
									multi: true
								},
							},
							{
								field: "estado",
								hidden: true,
							},
							{
								field: "estado",
								title: "Estado",
								template: '# if (estado == 0) {#ACTIVO#} else {#INACTIVO#}#',
								filterable: false,
								width: 100,
							},
							{
								field: "",
								title: "Operaciones",
								template: "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" data-area=\"\" onclick=\"editarUsuario(this)\" title=\"Editar Usuario\"><span class=\"icon-pencil\"></span></button>" +
									"<!--<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"cambiarEstado(this)\" title=\"Cambiar Estado\"><span class=\"icon-spinner9\"></span></button>-->" +
									"<button class=\"btn boton-tabla boton-verde\" type=\"button\" onclick=\"cambiarContrasenia(this)\" title=\"Cambiar Contraseña\"><span class=\"icon-key2\"></span></button>",
								width: 100,
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
										id_usuario: {
											type: "int"
										},
										nombres: {
											type: "string"
										},
										apellidos: {
											type: "string"
										},
										area_descripcion: {
											type: "string"
										},
										estado: {
											type: "int"
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
			} else {
				mostrarMensaje("error", "ERROR", datos.errores);
			}
		}
	});
}


function cambiarContrasenia(btn) {
	limpiarCamposModalCambiarContrasenia();

	var usuario = $(btn).parent().parent().find("td").eq(1).html();

	$("#usuarioC").val(usuario);
	$("#usuarioC").attr("disabled", true);
	$("#modalCambiarContrasenia").modal({
		backdrop: 'static',
		keyboard: false
	});
}

function cambiarEstado(btn) {
	limpiarCamposModalCambiarEstado();

	var usuario = $(btn).parent().parent().find("td").eq(1).html();
    var estado = $(btn).parent().parent().find("td").eq(4).html();
    var resultado = (estado.trim() === "INACTIVO") ? 1 : 0;

	$("#usuarioCa").val(usuario);
    $("#estadoC").val(resultado);
	$("#usuarioCa").attr("disabled", true);
	$("#modalCambiarEstado").modal({
		backdrop: 'static',
		keyboard: false
	});
}

function limpiarCamposModalUsuario() {
	$("#accion").val("");
	$("#usuario").attr("disabled", false);
	$("#usuario").val("");
	$("#contrasenia").val("");
	$("#apellidos").val("");
	$("#nombres").val("");
	$("#area").val("1");
	$("#estado").val("0");
}

function limpiarCamposModalCambiarContrasenia() {
	$("#usuarioC").attr("disabled", false);
	$("#usuarioC").val("");
	$("#contraseniaC").val("");
	$("#contrasenia2C").val("");
}

function limpiarCamposModalCambiarEstado() {
	$("#usuarioCa").attr("disabled", false);
	$("#usuarioCa").val("");
	$("#estadoC").val("");
}