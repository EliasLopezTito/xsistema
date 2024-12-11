let coloresAsesores = {};
const coloresFondo  = [ 
    "#818cf8",
    "#a78bfa",
    "#2dd4bf",
    "#4ade80",
    "#f472b6",
    "#f43f5e",
    "#ef4444",
    "#10b981",
    "#c084fc"
]
document.addEventListener("DOMContentLoaded", () => {
    //cargarUbicacion();
    autompleteAlumno();

});
$(document).ready(function() {
    Notiflix.Loading.Init({
        clickToClose: true
    });

    verificarModulo(false)
});

document.addEventListener('click', (e) => {

    if (e.target.matches('#btn__agregar__alumnos')) {
        $("#modal__agregar__alumnos").modal("show")
        //listaVacantes()
    }

    if (e.target.matches("#buscarAlumnos")) {
        listadoAlumnos()
    }

    //TURNO HORARIO
    if (e.target.matches('#agregar_turno_horario')) {
        $("#modalAgregarHorarios").modal({ backdrop: 'static', keyboard: false });
    }

    //VACANTES
    if (e.target.matches('#agregar_vacantes')) {
        $("#modalAgregarVacantes").modal({ backdrop: 'static', keyboard: false });
    }
    
    if (e.target.matches('#btnAgruparRegistros')) {

        let valoresCheck = [];
        $("input[type=checkbox]:checked").each(function () {
            valoresCheck.push(this);
        });

        console.log(valoresCheck);


        if (valoresCheck.length == 0) {
            Notiflix.Notify.Warning('DEBE SELECCIONAR ALGUN REGISTRO');
            return;
        }

        planilla = valoresCheck.map(e =>
            id = e.getAttribute('id')
        )
        console.log("pla", planilla);
        
        registroGrupal(planilla)

    }

    

});

$(document).on('click', '#cerrar__modal__alumno', function () {
    var control = $("#estadoHorario");
        console.log("CONTROL")
        if (control.checked) {
            $("#estadoHorario").prop("checked", false);
        }
        else {
            $("#estadoHorario").prop("checked", false);
        }

        $('.mostrarNuevoHorario').hide();
        $('#form__agregar__alumno')[0].reset();
});


$(document).on('click', '#editar_cerrar__modal__alumno', function () {
    var control = $("#editar_estadoHorario");
    console.log("CONTROL")
    if (control.checked) {
        $("#editar_estadoHorario").prop("checked", false);
    }
    else {
        $("#editar_estadoHorario").prop("checked", false);
    }

    $('.mostrarNuevoHorario').hide();

});

$(document).on('change', '#ciclo', function () {

     verificarModulo(false)

});

$(document).on('change', '#cod_espe', function () {

    verificarModulo(false)
    
});

$(document).on('change', '#editar_ciclo', function () {

    verificarModulo(true)

});

$(document).on('change', '#editar_cod_espe', function () {

   verificarModulo(true)
   
});

$(document).on('change', '#estadoHorario', function () {
    if ($(this).is(':checked')) {
        $('.mostrarNuevoHorario').show();
        // $(this).next().next().val("1")
        // $(this).parent().parent().addClass("bg-info")
        // $(this).next().html("DISPONIBLE")
     } else {
        $('.mostrarNuevoHorario').hide();
    //     $(this).next().next().val("0")
    //     $(this).parent().parent().removeClass("bg-info")
    //     $(this).next().html("NO DISPONIBLE")
     }
});

$(document).on('change', '#editar_estadoHorario', function () {
    if ($(this).is(':checked')) {
        $('.mostrarNuevoHorario').show();
        // $(this).next().next().val("1")
        // $(this).parent().parent().addClass("bg-info")
        // $(this).next().html("DISPONIBLE")
    } else {
        $('.mostrarNuevoHorario').hide();
        //     $(this).next().next().val("0")
        //     $(this).parent().parent().removeClass("bg-info")
        //     $(this).next().html("NO DISPONIBLE")
    }
});

function autompleteAlumno() {

    $("#usuarios").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "Programacion/descargarBoleta",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos2'
                },
                success: function (data) {
                    $("#usuarios").attr("codigo", "");
                    $("#usuarios").next('i').removeClass('glyphicon-ok');
                    $("#usuarios").next('i').addClass('glyphicon-remove');
                    $("#usuarios").parent().removeClass('has-success');
                    $("#usuarios").parent().addClass('has-error');
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
                
                $("#num_celular").val(ui.item.telefono.trim().substring(0, 9));
                $("#codAlumno").val(ui.item.cod_alumno.trim());
                $("#usuarios").val(ui.item.cod_alumno.trim() + " - " + ui.item.nombre.trim());
                $("#usuarios").next('i').removeClass('glyphicon-remove');
                $("#usuarios").next('i').addClass('glyphicon-ok');
                $("#usuarios").parent().removeClass('has-error');
                $("#usuarios").parent().addClass('has-success');
                
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
    $("#usuarios").focus();


    ////////////////////////////////////////////////

    $("#empleador").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "EFSRT/registrarAlumno",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchEmpleador'
                },
                success: function (data) {
                    console.log("dataaaa",data);
                    $("#empleador").attr("codigo", "");
                    $("#empleador").next('i').removeClass('glyphicon-ok');
                    $("#empleador").next('i').addClass('glyphicon-remove');
                    $("#empleador").parent().removeClass('has-success');
                    $("#empleador").parent().addClass('has-error');
                    let result = (!data.empleador) ? [{ vacio: true }] : data.empleador;
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {

                //$("#codAlumno").val(ui.item.RazonSocial.trim());
                $("#empleador").val(ui.item.Op + " - " + ui.item.RazonSocial.trim());
                $("#empleador").next('i').removeClass('glyphicon-remove');
                $("#empleador").next('i').addClass('glyphicon-ok');
                $("#empleador").parent().removeClass('has-error');
                $("#empleador").parent().addClass('has-success');

                Emp_Vacantes(ui.item.Op, "nuevo");

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
                .append("<div>" + item.Op + " - " + item.RazonSocial + "</div>")
                .appendTo(ul);
        };
    $("#empleador").focus();

    /////////////////////EDITAR 

    $("#editar_empleador").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "EFSRT/registrarAlumno",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchEmpleador'
                },
                success: function (data) {
                    console.log("dataaaa", data);
                    $("#editar_empleador").attr("codigo", "");
                    $("#editar_empleador").next('i').removeClass('glyphicon-ok');
                    $("#editar_empleador").next('i').addClass('glyphicon-remove');
                    $("#editar_empleador").parent().removeClass('has-success');
                    $("#editar_empleador").parent().addClass('has-error');
                    let result = (!data.empleador) ? [{ vacio: true }] : data.empleador;
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {

                //$("#editar_codAlumno").val(ui.item.RazonSocial.trim());
                $("#editar_empleador").val(ui.item.Op + " - " + ui.item.RazonSocial.trim());
                $("#editar_empleador").next('i').removeClass('glyphicon-remove');
                $("#editar_empleador").next('i').addClass('glyphicon-ok');
                $("#editar_empleador").parent().removeClass('has-error');
                $("#editar_empleador").parent().addClass('has-success');

                Emp_Vacantes(ui.item.Op, "editar");

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
                .append("<div>" + item.Op + " - " + item.RazonSocial + "</div>")
                .appendTo(ul);
        };
    $("#editar_empleador").focus();

}

function listaVacantes(op) {
    tablaVacantes = $(".tablaVacantes").DataTable({
        destroy: 'true',
        searching: false,
        processing: false,
        responsive: true,
        ordering: false,
        bLengthChange: false,
        // lengthMenu: [
        //     [50, 100, -1],
        //     [50, 100, 'TODO']
        // ],
        ajax: {
            url: path + "EFSRT/empleador",
            type: "POST",
            data: {
                op: op,
                opcion: 'listaVacantes'
            },
            dataSrc: function (data) {
                console.log("dataVacantes", data)
                if (data.respuesta == "success") {
                    return data.vacantes == "vacio" ? {} : data.vacantes;
                } else {
                    return {};
                }

            }
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada'
            }
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_espe;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FechaI;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FechaF;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NroVac;
                }
            },
            {
                data: null,
                render: function (data) {
                    let color = '';
                    if (data.Estado === 1) { color = "color:#00b300"; descrip = "Activo"; } else if (data.Estado === 2) { color = "color:orange"; descrip = "Pendiente"; } else { color = "color:red"; descrip = "Inactivo"; }
                    return `<span style="${color}">${descrip}</span>`;
                    
                }
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

$('#form__editar__alumno').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "editarRegistrarAlumno" });
    console.log("data", form)

    $.ajax({
        url: path + "EFSRT/registrarAlumno",
        type: "POST",
        data: form,
        beforeSend: function(){
            $(".text-loader").html("Guardando informacion...");
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("body").css({ "padding": 0 });
        },
        success: function(data){
            $("#modalLoader").modal("hide");
            console.log(data);

            let datos = JSON.parse(data);
            if (datos.respuesta === 'success') {
                Notiflix.Notify.Success(datos.msj);             
                $("#modal__editar__alumnos").modal("hide");
                //document.getElementsByClassName("form-requerimiento").reset();
                tablaAlumnos.ajax.reload(null, false);
            } else{
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

})

$('#formRegistrarHorario').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "insertarTurnoHorario" });
    console.log("data", form)

    $.ajax({
        url: path + "EFSRT/empleador",
        type: "POST",
        data: form,
        beforeSend: function () {
            $(".text-loader").html("Guardando informacion...");
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("body").css({ "padding": 0 });
        },
        success: function (data) {
            $("#modalLoader").modal("hide");
            console.log(data);

            let datos = JSON.parse(data);
            if (datos.respuesta === 'success') {
                Notiflix.Notify.Success("Se agrego el nuevo turno");
                $("#modalAgregarHorarios").modal("hide");
                //document.getElementsByClassName("form-requerimiento").reset();
                tablaTurnosHorarios.ajax.reload(null, false);
            } else {
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

})

$('#formRegistrarVacantes').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    codigo_op = $('#op').val();
    form.push({ name: "opcion", value: "insertarVacantes" });
    form.push({ name: "op", value: codigo_op });
    console.log("data", form)

    $.ajax({
        url: path + "EFSRT/empleador",
        type: "POST",
        data: form,
        beforeSend: function () {
            $(".text-loader").html("Guardando informacion...");
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("body").css({ "padding": 0 });
        },
        success: function (data) {
            $("#modalLoader").modal("hide");
            console.log(data);

            let datos = JSON.parse(data);
            if (datos.respuesta === 'success') {
                Notiflix.Notify.Success("Se agrego el nuevo vacante");
                $("#modalAgregarVacantes").modal("hide");
                //document.getElementsByClassName("form-requerimiento").reset();
                tablaVacantes.ajax.reload(null, false);
            } else {
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

})

function seleccionarEspecialidadAutomatico(codigo) {

    $.ajax({
        url: path + "certificados/tramites",
        type: "POST",
        dataType: "JSON",
        data: {
            codigo: codigo,
            opcion: 'cargarEspecialidadesPorAlumno'
        },
        beforeSend: function () {
            Notiflix.Loading.Hourglass('Cargando...');
            $("#especialidad").html("<option value='NINGUNO'>NINGUNO</option>");
        },
        complete: function (data) {
            $("#NotiflixLoadingWrap").trigger("click");
        },
        success: function (data) {
            if (data.respuesta === 'success') {  
                data.data2.forEach(e => {
                    $("#especialidad").append(`                            
                            <option value="${e.descripcionM.trim()}">${e.descripcionM.trim()}</option>
                        `);
                });        
                if (data.dataEspAlum != "vacio"){
                    $('#especialidad').val(data.dataEspAlum[0].Descripcion.trim());
                }else{
                    Notiflix.Notify.Failure('No se encontro la especialidad, por favor coloque manualmente');
                }
                
            }

        }
    });

}

function listadoAlumnos()
{   
    const fecha_1 = $("#fecha_1").val();
    const fecha_2 = $("#fecha_2").val();
    const empresa = $("#empresa").val();
    const alumno = $("#alumno").val();
    const especialidad = $("#especialidad").val();

    tablaAlumnos = $("#tablaAlumnos").DataTable({
        destroy: 'true',
        searching: true,
        //processing: false,
        responsive: true,
        ordering:  false,
        bLengthChange: false,
        lengthMenu: [
            [20, 100, -1], 
            [20, 100, 'TODO']
        ],
        ajax: {
            url: path + "EFSRT/registrarAlumno",
            type: "POST",
            data: {
                fecha_1: fecha_1,
                fecha_2: fecha_2,
                empresa:empresa,
                alumno:alumno,
                especialidad:especialidad,
                opcion: 'verListaAlumnos'
            },
            beforeSend: function () {
                Notiflix.Loading.Hourglass('Cargando...');
                coloresAsesores = {}
            },
            complete: function (data) {
                $("#NotiflixLoadingWrap").trigger("click");
            },
            dataSrc: function(data){
                console.log("data", data) 
                if(data.respuesta == "success"){
                    return data.lista == "vacio" ? {} : data.lista;
                }else{
                    return {};
                }        
                               
            }
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada'
            }
        ],
        columns: [
            {
                data: null,
                render: function (data, type, row, meta) {
                    return data.Op;
                }
            },
            {
                data: null,
                render: function (data) {

                    return "<input type=\"checkbox\" id=" + data.Op + " class=\"btn mipanel-btn-img-texto marcarCabeza\">";
                }
            },
            {
                data: null,
                render: function (data) {
                    let colorAsesor = getColorAsesor(data);
                    return "<input type=\"text\" disabled id=\'op_"+data.Op+"\' value='"+data.NroOficio+"' class=\"btn mipanel-btn-img-texto\" style=\"background-color: " + colorAsesor + "; font-weight: bold; color: black !important; font-size: 15px;\">"+
                           "<button class=\"btn boton-tabla btnw-warning\" id=\'editar_"+data.Op+"\' data-op=\'"+data.Op+"\' type=\"button\" onclick=\"mostrarEditarNumeroOficio(this)\" title=\"Editar Numero Oficio\"><span class=\"icon-pencil2\"></span></button>"+
                           "<button class=\"btn boton-tabla btnw-success\" id=\'guardar_"+data.Op+"\' data-op=\'"+data.Op+"\' type=\"button\" onclick=\"editarNumeroOficio(this)\" style=\"display: none;\" title=\"Guardar Numero Oficio\"><span class=\"icon-floppy-disk\"></span></button>"
                }   
            },
            {
                data: null,
                render: function (data) {
                    return data.Fecha;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.RazonSocial;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_alumno;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Alumno;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Especialidad;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_ciclo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Turno;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FI;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.FF;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NroVac;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NroVacTotal;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Horario;
                }
            },
            {
                data: null,
                render: function (data) {
                    return "<button class=\"btn boton-tabla btn-warning\" type=\"button\" onclick=\"editarAlumno('" + data.Op + "');\" title=\"Ver registro\"><span class=\"icon-pencil\"></span></button>&nbsp;&nbsp;&nbsp;" + 
                        "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"eliminarAlumno('" + data.Op + "')\" title=\"Eliminar registro\"><span class=\"icon-cross\"></span></button>&nbsp;&nbsp;&nbsp;" +
                           "<button class=\"btn boton-tabla boton-azul\" type=\"button\" onclick=\"descargarOficioPDF('" + data.Op + "')\" title=\"Ver oficio\"><span class=\"icon-download\"></span></button>&nbsp;&nbsp;&nbsp;" +
                           "<button class=\"btn boton-tabla boton-verde\" type=\"button\" onclick=\"descargarOficioPDFnuevoFormato('" + data.Op + "')\" title=\"Ver constancia\"><span class=\"icon-download\"></span></button>";
                }
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

$('#form__agregar__alumno').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "registrarAlumnoNuevo" });
    console.log("data", form)

    $.ajax({
        url: path + "EFSRT/registrarAlumno",
        type: "POST",
        data: form,
        beforeSend: function () {
            $(".text-loader").html("Guardando informacion...");
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("body").css({ "padding": 0 });
        },
        success: function (data) {
            $("#modalLoader").modal("hide");
            console.log(data);

            let datos = JSON.parse(data);
            if (datos.respuesta === 'success') {
                Notiflix.Notify.Success(datos.msj);


                var control = $("#estadoHorario");
                console.log("CONTROL")
                if (control.checked) {
                    $("#estadoHorario").prop("checked", false);
                }
                else {
                    $("#estadoHorario").prop("checked", false);
                }

                $('.mostrarNuevoHorario').hide();
                $('#form__agregar__alumno')[0].reset();
                
                tablaAlumnos.ajax.reload(null, false);
            } else {
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

})

function editarAlumno(op) {

    $.post(path + "EFSRT/registrarAlumno", { op: op, opcion: 'editarDataEmple' })
        .done(function (r) {
            response = JSON.parse(r)
            if (response.respuesta === 'Exito') {

                data = response.lista[0]
                $('#op').val(data.Op)
                $('#editar_codAlumno').val(data.cod_alumno)
                $('#editar_usuarios').val(data.Alumno)
                $('#editar_cod_espe').val(data.cod_espe)
                $('#editar_ciclo').val(data.cod_ciclo)
                $('#editar_fecha').val(data.Fecha.trim().substring(0, 10))
                $('#editar_moduloDesp').val(data.Modulo.trim())
                $('#editar_idModulo').val(data.codmodulo.trim())
                //$('#editar_empleador').val(data.codEmpleador)
                $('#editar_empleador').val(data.codEmpleador.trim()+" - "+data.RazonSocial)
                //$('#editar_vacanteEmp').val(data.codVacante)
                $('#editar_Horas').val(data.Horas)
                $('#editar_Horario').val(data.Horario)
                $('#editar_Fecha_inicio').val(data.FI.trim().substring(0, 10))
                $('#editar_Fecha_final').val(data.FF.trim().substring(0, 10))
                $('#nroOficios').val(data.NroOficio.trim())
                $('#editar_num_celular').val(data.celular)
                
                if (data.estado === '1') {
                    $("#editar_estado option[value='1']").prop("selected", true)
                } else {
                    $("#editar_estado option[value='0']").prop("selected", true)
                }

                $('#editar_observacion').val(data.Observacion)

                if (data.NHorario == "1") {
                    //$("#editar_estadoHorario").prop("checked", true);
                    $('#editar_estadoHorario').click()
                }
                else {
                    $("#editar_estadoHorario").prop("checked", false);
                    $('.mostrarNuevoHorario').hide();
                    //$('#editar_estadoHorario').click()
                    
                }

                $('#editar_descripcion-hora1').val(data.H1)
                $('#editar_descripcion-hora2').val(data.H2)
                $('#editar_descripcion-hora3').val(data.H3)
                $('#editar_descripcion-hora4').val(data.H4)

                Emp_Vacantes(data.codEmpleador, "editar");

                $("#modal__editar__alumnos").modal("show")

            } else {
                Notiflix.Notify.Failure('Ocurrio un error inesperado, vuela a intentarlo');
            }
        })
        .fail(function (r) {
            Notiflix.Notify.Failure('Ocurrio un error inesperado,por favor recargue la página y vuela a intentarlo');
        })

    
}

function eliminarAlumno(cod_temporal){
    Notiflix.Confirm.Show(
        'Eliminar Alumno',
        '¿Esta segura de eliminar el Alumno?',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "EFSRT/registrarAlumno",
                type: "POST",
                data: {
                    cod_temporal: cod_temporal,
                    opcion: 'eliminarAlumno'},
                beforeSend: function () {
                    
                },
                success: function (data) {
                    let datos = JSON.parse(data);
                    if (datos.respuesta === 'success') {
                        Notiflix.Notify.Success("Alumno Eliminado");        
                        tablaAlumnos.ajax.reload(null, false);
                    } else {
                        Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
                    }
                }
            });
        },
        function cancelCb() {

        },
        {
        },
    );
}

function descargarOficioPDF(Op) {
    //const op = $(btn).attr("codigo");
    $.ajax({
        url: path + "EFSRT/registrarAlumno",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "solicitudPDF",
            Op: Op
        },
        beforeSend: function () {
            //$('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            //$("#modalLoader").modal();
        },
        complete: function () {
            //$("#modalLoader").modal("hide");
        },
        success: function (response) {

            if (response.respuesta === "success") {

                $("#modalVistaPreviaCertificado").modal("show")
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                let pdf = '<iframe src="' + response.solicitud + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);

            } else {

                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado", "Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }
        },
    })
}

function descargarOficioPDFnuevoFormato(Op) {
    //const op = $(btn).attr("codigo");
    $.ajax({
        url: path + "EFSRT/registrarAlumno",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "solicitudPDF_2",
            Op: Op
        },
        beforeSend: function () {
            //$('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            //$("#modalLoader").modal();
        },
        complete: function () {
            //$("#modalLoader").modal("hide");
        },
        success: function (response) {

            if (response.respuesta === "success") {

                $("#modalVistaPreviaCertificado").modal("show")
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                let pdf = '<iframe src="' + response.solicitud + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);

            } else {

                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado", "Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }
        },
    })
}

function registroGrupal(idRegis){

    $.ajax({
        url: path + "EFSRT/registrarAlumno",
        type: "POST",
        data: {
            opcion: 'nroOficioAgrupar'
        },
        beforeSend: function () {

        },
        success: function (data) {
            let datos = JSON.parse(data);
            console.log("resp", datos);
            if (datos.respuesta === 'success') {

                nro = datos.resp[0].NroOficio2;

                Notiflix.Confirm.Show(
                    'NUEVO NRO OFICIO: ' + nro,
                    'Esta opcion permitira actualizar el numero de oficio en los registros seleccionados',
                    'Si',
                    'No',
                    function okCb() {
                        $.ajax({
                            url: path + "EFSRT/registrarAlumno",
                            type: "POST",
                            data: {
                                idRegis: idRegis,
                                nroOficio: nro,
                                opcion: 'agruparAlumno'
                            },
                            beforeSend: function () {

                            },
                            success: function (data) {

                                let datos = JSON.parse(data);

                                if (datos.respuesta === 'success') {
                                    //$(".column input[type=checkbox]").trigger('click');}
                                    $(':checkbox').each(function () {
                                        this.checked = false;
                                    });
                                    Notiflix.Notify.Success("AGRUPADO CORRECTAMENTE"); 
                                } else {
                                    Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
                                }
                            }
                        });
                    },
                    function cancelCb() {

                    },
                    {
                    },
                );
            } else {
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

    
}

function mostrarEditarNumeroOficio(data){
    let op = $(data).attr("data-op");
    $('#op_'+op).attr("disabled", false)
   // $('#editar_'+op).hide(300)
    $('#guardar_'+op).show(300)
}

function editarNumeroOficio(data){
    let op = $(data).attr("data-op");
    $('#op_'+op).attr("disabled", true)
    let nro = $('#op_'+op).val()
   // $('#editar_'+op).hide(300)
    $('#guardar_'+op).hide(300)
    
    Notiflix.Confirm.Show(
        'EDITAR NUMERO OFICIO: ',
        'Esta opcion permitira cambiar el numero de oficio',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "EFSRT/registrarAlumno",
                type: "POST",
                data: {
                    op: op,
                    nro: nro,
                    opcion: 'editarNumOficio'
                },
                beforeSend: function () {

                },
                success: function (data) {

                    let datos = JSON.parse(data);

                    if (datos.respuesta === 'success') {
                        tablaAlumnos.ajax.reload(null, false);
                        Notiflix.Notify.Success("MODIFICADO CORRECTAMENTE"); 
                    } else {
                        Notiflix.Notify.Failure('Ocurrió un error al editar, recargue la pagina');
                    }
                }
            });
        },
        function cancelCb() {

        },
        {
        },
    );
}


function verificarModulo(editar){

    if(editar == true){
        codespe = $('#editar_cod_espe').val()
        codciclo = $('#editar_ciclo').val()
    }else{
        codespe = $('#cod_espe').val()
        codciclo = $('#ciclo').val()
    }

    $.ajax({
        url: path + "EFSRT/registrarAlumno",
        type: "POST",
        data: {
            codespe: codespe,
            codciclo: codciclo,
            opcion: 'verificarModulo'
        },
        beforeSend: function () {

        },
        success: function (data) {
            let datos = JSON.parse(data);
            console.log("respMODU", datos);
            if (datos.respuesta === 'success') {
                
                if(datos.lista != "vacio" ){
                    if(editar == true){

                        $('#editar_idModulo').val(datos.lista[0].cod_modulo.trim())
                        $('#editar_moduloDesp').val(datos.lista[0].modulo.trim())
                    }else{
                        $('#idModulo').val(datos.lista[0].cod_modulo.trim())
                        $('#moduloDesp').val(datos.lista[0].modulo.trim())
                    }
                    
                }else{
                    if(editar == true){
                        $('#editar_idModulo').val("")
                        $('#editar_moduloDesp').val("NO EXISTE")
                    }else{
                        $('#idModulo').val("")
                        $('#moduloDesp').val("NO EXISTE")
                    }                    
                }                
                
            } else {
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });
}

// $("#empleador").change(function () {

//     idEmp = $("#empleador").val()
//     Emp_Vacantes(idEmp, "nuevo");
// })

// $("#editar_empleador").change(function () {

//     idEmp = $("#editar_empleador").val()
//     Emp_Vacantes(idEmp, "editar");
// })

$("#vacanteEmp").change(function () {

    vac = $("#vacanteEmp").val()
    const numero = vac.split("-");
    $('#NroVac').val(numero[1])
})

$("#editar_vacanteEmp").change(function () {

    vac = $("#editar_vacanteEmp").val()
    const numero = vac.split("-");
    $('#editar_NroVac').val(numero[1])
})

async function Emp_Vacantes(idEmp, tipo) {

    const headers = { "Content-Type": "application/json", 'Accept': 'application/json' };

    let vacant = await fetch(`${path}EFSRT/registrarAlumno`, {
            method: "POST",
            headers: headers,
        body: JSON.stringify({ opcion: "Vacantes", idEmp: idEmp })
        });
        vacant = await vacant.json();

        if(tipo == "nuevo"){
            $("#vacanteEmp").html("");
            $('#NroVac').val(vacant.vacantes[0].NroVac)
            vacant.vacantes.forEach(vacan => {
                $("#vacanteEmp").append(`<option value="${vacan.idv}-${vacan.NroVac}"> ${vacan.Especialidad} - ${vacan.Turno} - ${vacan.NroVac}</option>`);
            });
        }else if(tipo == "editar"){
            $("#editar_vacanteEmp").html("");
            $('#editar_NroVac').val(vacant.vacantes[0].NroVac)
            vacant.vacantes.forEach(vacan => {
                $('#editar_vacanteEmp').append(`<option value="${vacan.idv}-${vacan.NroVac}"> ${vacan.Especialidad} - ${vacan.Turno} - ${vacan.NroVac}</option>`);
            });
        }
        

}

function generarColorAleatorio() {
    return coloresFondo[Math.floor(Math.random() * coloresFondo.length)];
}
function getColorAsesor(asesor) {
    if (!coloresAsesores[asesor]) {
        coloresAsesores[asesor] = generarColorAleatorio();
    }
    return coloresAsesores[asesor];
}