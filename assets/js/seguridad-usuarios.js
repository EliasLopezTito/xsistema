$(document).ready(function () {

	$("#btnNuevoUsuario").click(function () {
		limpiarCamposModalUsuario();
		$("#accion").val("C");
		$("#divContrasenia").show();
		$("#modalNuevoEditUsuario").modal({
			backdrop: 'static',
			keyboard: false
		});
	});
	
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
            url: path + "Seguridad/usuarios",
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
            { data: null, render: function (data) { return data.apellidos; }, "className": "" },
            { data: null, render: function (data) { return data.nombres; }, "className": "" },
            { data: null, render: function (data) { return data.area_descripcion; }, "className": "" },
            { data: null, render: function (data) { return data.estado === 0 ? "ACTIVO" : "INACTIVO"; }, "className": "text-center" },
            {
                data: null, render: function (data) {
                    return `
                        <button class="btn boton-tabla boton-celeste" data-area="${data.id_area}" data-estado="${data.estado}" type="button" onclick="editarUsuario(this)" title="Editar Usuario"><span class="icon-pencil"></span></button>
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

$("#btnRegistrarDatos").click(function () {

	var accion = $("#accion").val();
	var usuario = $("#usuario").val();
	var contrasenia = $("#contrasenia").val();
	var apellidos = $("#apellidos").val();
	var nombres = $("#nombres").val();
	var area = $("#area").val();
	var estado = $("#estado").val();

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
				tabla_lista_usuarios.ajax.reload(null,false);
				$("#modalNuevoEditUsuario").modal("hide");
				if (accion == "C") {
					mostrarMensaje("exito", "Ok", "Datos grabados correctamente");
				} else {
					mostrarMensaje("exito", "Ok", "Datos actualizados correctamente");
				}
			} else {
				mostrarMensaje("error", "ERROR", datos.errores);
			}
		}
	});
});

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
	target = "seguridad/usuarios"
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
								template: "<button class=\"btn boton-tabla boton-celeste\" type=\"button\" data-area=\"\" onclick=\"editarUsuario(this)\" title=\"Editar Usuario\"><span class=\"icon-pencil\"></span></button>" +
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

function editarUsuario(btn) {
	limpiarCamposModalUsuario();
	$("#accion").val("U");
	$("#divContrasenia").hide();
	var usuario = $(btn).parent().parent().find("td").eq(1).html();
	var apellidos   = $(btn).parent().parent().find("td").eq(2).html();
	var nombres = $(btn).parent().parent().find("td").eq(3).html();
	var area = btn.getAttribute('data-area');
	var estado = btn.getAttribute('data-estado')
	$("#usuario").val(usuario);
	$("#usuario").attr("disabled", true);
	$("#apellidos").val(apellidos);
	$("#nombres").val(nombres);
    $("#area option[value='"+area+"']").prop("selected",true)
    console.log(estado)
	if(estado === "0" ){
        $("#estado option[value='0']").prop("selected",true)
    }else{
        $("#estado option[value='1']").prop("selected",true)
    }
	$("#modalNuevoEditUsuario").modal({
		backdrop: 'static',
		keyboard: false
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

/*
function activarListadoIndividual(){
    if($("#cbxPorAula").prop("checked") == true){
        $("#pabellon").attr("disabled",false);
        $("#piso").attr("disabled",false);
        $("#aula").attr("disabled",false);
        $("#btnImprimir").attr("disabled",true);
        $("#tipoListado").attr("disabled",true);
        cargarProgramacion();
    }else{
        var tbody = $("#tablaProgramacion tbody");
        tbody.find('tr').remove();
        $("#pabellon").attr("disabled", true);
        $("#piso").attr("disabled", true);
        $("#aula").attr("disabled", true);
        $("#btnImprimir").attr("disabled",false);
        $("#tipoListado").attr("disabled",false);
    }
}

function activarBotonesRptIndividuales(activar){
    $("#tablaProgramacion tbody").find("tr").each(function(){        
        if(activar == true){
            $(this).find("button").eq(0).attr("disabled",false);
            $(this).find("button").eq(1).attr("disabled",false);
            $(this).find("button").eq(2).attr("disabled",false);
        }else{
            $(this).find("button").eq(0).attr("disabled",true);
            $(this).find("button").eq(1).attr("disabled",true);
            $(this).find("button").eq(2).attr("disabled",true);
        }
    }); 
}

$("#institucion").change(function(){
    if($("#cbxPorAula").prop("checked") == true){
        cargarComboAulas();
    }
});

$("#sede").change(function(){
    if($("#cbxPorAula").prop("checked") == true){
        cargarComboAulas();
    }
});

$("#anioProg").change(function(){
    if($("#cbxPorAula").prop("checked") == true){
        cargarProgramacion();
    }
});

$("#mesProg").change(function(){
    if($("#cbxPorAula").prop("checked") == true){
        cargarProgramacion();
    }
});

$("#pabellon").change(function(){
    if($("#cbxPorAula").prop("checked") == true){
        cargarComboAulas();
    }
});

$("#piso").change(function(){
    if($("#cbxPorAula").prop("checked") == true){
        cargarComboAulas();
    }
});

$("#aula").change(function(){
    if($("#cbxPorAula").prop("checked") == true){
        cargarProgramacion();
    }
});

function cargarProgramacion(){
    var institucion = $("#institucion").val();
    var sede = $("#sede").val();
    var anioProg = $("#anioProg").val();
    var mesProg = $("#mesProg").val();
    var pabellon = $("#pabellon").val();
    var piso = $("#piso").val();
    var aula = $("#aula").val();
    
    if(institucion != null && sede != null && anioProg != null && mesProg != null && pabellon != null && piso != null && aula != null){
        var tbody = $("#tablaProgramacion tbody");
        tbody.find('tr').remove();
        $.ajax({
            url: path + "programacion/getProgramacionParaListados",
            type: "POST",
            data: {
                institucion: institucion,
                sede: sede,
                anioProg: anioProg,
                mesProg: mesProg,
                pabellon: pabellon,
                piso: piso,
                aula: aula
            },
            success: function(data){
                console.log(data);
                var datos = JSON.parse(data);
                if(datos.respuesta=="success"){
                    if(datos.programacion != "vacio"){
                        var programaciones = datos.programacion;
                        for(i=0;i<programaciones.length;i++){
                            var programacion = programaciones[i];
                            var tr = "<tr>" + 
                                     "<td class=\"celda-centrada\">" + programacion.ciclo + "</td>" +
                                     "<td class=\"celda-centrada\">" + programacion.hora + "</td>" +
                                     "<td class=\"celda-centrada\">" + programacion.cod_turno + "</td>" +
                                     "<td class=\"celda-izquierda\">" + programacion.curso + "</td>" +
                                     "<td class=\"celda-izquierda\">" + programacion.profesor + "</td>" +
                                     "<td class=\"celda-centrada\">" + programacion.fecha_inicio + "</td>" +
                                     "<td class=\"celda-centrada\">" + programacion.fecha_final + "</td>" +
                                     "<td class=\"celda-centrada\">" + programacion.cod_prof + "</td>" +
                                     "<td class=\"celda-centrada\">" + programacion.num_horas + "</td>" +
                                     "<td class=\"celda-centrada\">" +
                                     "<button class=\"btn boton-tabla boton-azul\" type=\"button\" onclick=\"imprimirListadoIndividual(this,1);\" title=\"Alumnos matriculados\"><span class=\"icon-user-check\"></span></button>" +
                                     "<button class=\"btn boton-tabla boton-verde\" type=\"button\" onclick=\"imprimirListadoIndividual(this,2);\" title=\"Alumnos pagantes\"><span class=\"icon-user-plus\"></span></button>" +
                                     "<button class=\"btn boton-tabla boton-rojo\" type=\"button\" onclick=\"imprimirListadoIndividual(this,3);\" title=\"Alumnos no pagantes\"><span class=\"icon-user-minus\"></span></button>" +
                                     "</td>" +
                                     "<td style=\"display: none;\">" + programacion.cod_curso + "</td>" +
                                     "</tr>";
                            tbody.append(tr);
                        }
                    }
                }else{
                    mostrarMensaje("error","ERROR",datos.errores);
                }
            }
        });
    }
}

function imprimirListadoIndividual(btn,tipo){
    var turno = $(btn).parent().parent().find("td").eq(2).html();
    var curso = $(btn).parent().parent().find("td").eq(10).html();
    var docente = $(btn).parent().parent().find("td").eq(7).html();
    var ciclo = $(btn).parent().parent().find("td").eq(0).html();
    var hora = $(btn).parent().parent().find("td").eq(1).html();
        
    $("#turno").val(turno);
    $("#curso").val(curso);
    $("#docente").val(docente);
    $("#ciclo").val(ciclo);
    $("#hora").val(hora);
    $("#tipo").val(tipo);
    $("#frmListados").submit();
}

function cargarComboAulas(){
    var institucion = $("#institucion").val();
    var sede = $("#sede").val();
    var pabellon = $("#pabellon").val();
    var piso = $("#piso").val();
    if(institucion != null && sede != null && pabellon != null && piso != null){
        $.ajax({
            url: path + "programacion/getAulas",
            type: "POST",
            data: {
                institucion: institucion,
                sede: sede,
                pabellon: pabellon,
                piso: piso
            },
            success: function(data){
                console.log(data);
                $("#aula").html("");
                var datos = JSON.parse(data);                
                if(datos.respuesta=="success"){
                    if(datos.aulas != "vacio"){            
                        var aulas = datos.aulas;
                        for(i=0;i<aulas.length;i++){
                            var aula = aulas[i];
                            $("#aula").append("<option value='" + aula.cod_aula + "'>" + aula.cod_aula + "</option>");
                        }
                        cargarProgramacion();
                    }else{
                        var tbody = $("#tablaProgramacion tbody");
                        tbody.find('tr').remove();
                    }
                }else{
                    mostrarMensaje("error","ERROR",datos.errores);
                }
            }
        });
    }
}
*/
