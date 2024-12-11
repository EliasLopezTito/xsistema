document.addEventListener("DOMContentLoaded", () => {
    cargarUbicacion();

});
$(document).ready(function() {
    Notiflix.Loading.Init({
        clickToClose: true
    });
});

document.addEventListener('click', (e) => {
    if (e.target.matches('#buscarEmpleador')) {
        listadoEmpleador();
    }

    if (e.target.matches('#btn__agregar__empleador')) {
        cargarUbicacion("new", false);
        $("#modal__agregar__empleador").modal("show")
    }

    if (e.target.matches("#btnBuscar")) {
        mostrarData();
    }

    //TURNO HORARIO
    if (e.target.matches('#agregar_turno_horario')) {
        $("#modalAgregarHorarios").modal({ backdrop: 'static', keyboard: false });
    }

    //VACANTES
    if (e.target.matches('#agregar_vacantes')) {
        $("#modalAgregarVacantes").modal({ backdrop: 'static', keyboard: false });
    }

    if (e.target.matches('#cerrar__modal__agregar')) {
        $("#seccionDetalles").hide();
        $('#form__agregar__empleador')[0].reset();
    }
    //CONTACTOS
    if (e.target.matches('#agregar_contactos')) {
        $("#modalAgregarContactos").modal({ backdrop: 'static', keyboard: false });
    }

});

function listaContactos(op) {
    tablaContactos = $(".tablaContactos").DataTable({
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
                opcion: 'listaContactos'
            },
            dataSrc: function (data) {
                console.log("listaContactos", data)
                if (data.respuesta == "success") {
                    return data.contactos == "vacio" ? {} : data.contactos;
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
                    return data.RazonSocial;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Contacto;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Documento;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Cargo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Telefono;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Correo;
                }
            },
            {
                data: null,
                render: function (data) {
                    let color = '';
                    if (data.Estado === "Activo") { color = "color:#00b300"; descrip = "Activo"; } else { color = "color:red"; descrip = "Inactivo"; }
                    return `<span style="${color}">${descrip}</span>`;

                }
            },
            {
                data: null,
                render: function (data) {
                    return "<button class=\"btn boton-tabla btn-warning\" type=\"button\" onclick=\"editarContacto('" + data.ID + "');\" title=\"Ver solicitud\"><span class=\"icon-pencil\"></span></button>&nbsp;&nbsp;&nbsp;" +
                        "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"eliminarContacto('" + data.ID + "')\"><span class=\"icon-cross\"></span></button>";
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

function editarContacto(idC) {

    // if (estado === 'Activo') {
    //     $("#editar_estado option[value='1']").prop("selected", true)
    // } else {
    //     $("#editar_estado option[value='0']").prop("selected", true)
    // }

    $.post(path + "EFSRT/empleador", { idC: idC, opcion: 'editarDataContacto' })
        .done(function (r) {
            response = JSON.parse(r)
            if (response.respuesta === 'Exito') {

                data = response.lista[0]
                console.log("data_contacto", data)
                Notiflix.Notify.Success(response.respuesta);
                //$("#form__editar__asesor").trigger("reset")
                //$("#modal__editar__asesor").modal("hide")      
                //tabla_lista_asesores.ajax.reload(null, false)

                $('#idContacto').val(data.ID.trim())
                $('#opEmpContac').val(data.Op.trim())
                $('#editar_apellidoPaterContact').val(data.ApellidoPaterno)
                $('#editar_apellidoMaterContact').val(data.ApellidoMaterno)
                $('#editar_nombresContact').val(data.Nombres)
                $('#editar_documentoContact').val(data.documento)
                $('#editar_cargoContact').val(data.Cargo)
                $('#editar_telefonoContact').val(data.Telefono)
                $('#editar_correoContact').val(data.Correo)
                $('#editar_estadoContact').val(data.Estado)

                $("#modalEditarContactos").modal("show")

            } else {
                Notiflix.Notify.Failure('Ocurrio un error inesperado, vuela a intentarlo');
            }
        })
        .fail(function (r) {
            Notiflix.Notify.Failure('Ocurrio un error inesperado,por favor recargue la página y vuela a intentarlo');
        })


}

function eliminarContacto(cod_temporal) {
    Notiflix.Confirm.Show(
        'Eliminar Contacto',
        '¿Esta segura de eliminar el Contacto?',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "EFSRT/empleador",
                type: "POST",
                data: {
                    cod_temporal: cod_temporal,
                    opcion: 'eliminarContacto'
                },
                beforeSend: function () {

                },
                success: function (data) {
                    let datos = JSON.parse(data);
                    if (datos.respuesta === 'success') {
                        Notiflix.Notify.Success("Contacto Eliminado");
                        tablaContactos.ajax.reload(null, false);
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
                render: function (data) {
                    return data.Especialidad;
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
            },
            {
                data: null,
                render: function (data) {
                    return data.UsuarioReg;
                }
            },
            {
                data: null,
                render: function (data) {
                    return "<button class=\"btn boton-tabla btn-warning\" type=\"button\" onclick=\"editarVacante('" + data.idv + "');\" title=\"Ver solicitud\"><span class=\"icon-pencil\"></span></button>&nbsp;&nbsp;&nbsp;" +
                        "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"eliminarVacante('" + data.idv + "')\"><span class=\"icon-cross\"></span></button>";
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

function editarVacante(idV) {

    // if (estado === 'Activo') {
    //     $("#editar_estado option[value='1']").prop("selected", true)
    // } else {
    //     $("#editar_estado option[value='0']").prop("selected", true)
    // }

    $.post(path + "EFSRT/empleador", { idV: idV, opcion: 'editarDataVacante' })
        .done(function (r) {
            response = JSON.parse(r)
            if (response.respuesta === 'Exito') {

                data = response.lista[0]
                console.log("data_vacante", data)
                Notiflix.Notify.Success(response.respuesta);
                //$("#form__editar__asesor").trigger("reset")
                //$("#modal__editar__asesor").modal("hide")      
                //tabla_lista_asesores.ajax.reload(null, false)

                $('#idV').val(data.idV)
                $('#opEmp').val(data.opEmp)
                $('#editar_cod_espe').val(data.cod_espe)
                $('#editar_cod_turno').val(data.cod_turno)
                $('#editar_numeroVacantes').val(data.NroVac)
                $('#editar_fechaI').val(data.FechaI.trim().substring(0, 10))
                $('#editar_fechaF').val(data.FechaF.trim().substring(0, 10))
                $('#editar_estado_vacante').val(data.Estado)

                Turnos_TurnosHorarios(data.cod_turno, "editar", data.cod_Horario)
                         
                $("#modalEditarVacantes").modal("show")

            } else {
                Notiflix.Notify.Failure('Ocurrio un error inesperado, vuela a intentarlo');
            }
        })
        .fail(function (r) {
            Notiflix.Notify.Failure('Ocurrio un error inesperado,por favor recargue la página y vuela a intentarlo');
        })


}

function eliminarVacante(cod_temporal) {
    Notiflix.Confirm.Show(
        'Eliminar Tramite',
        '¿Esta segura de eliminar el Vacante?',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "EFSRT/empleador",
                type: "POST",
                data: {
                    cod_temporal: cod_temporal,
                    opcion: 'eliminarVacante'
                },
                beforeSend: function () {

                },
                success: function (data) {
                    let datos = JSON.parse(data);
                    if (datos.respuesta === 'success') {
                        Notiflix.Notify.Success("Vacante Eliminado");
                        tablaVacantes.ajax.reload(null, false);
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

$('#form__agregar__empleador').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "registrar" });
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
                Notiflix.Notify.Success(datos.msj);
                //$("#modal__agregar__empleador").modal("hide");
                $('#op').val(datos.resultado.Op);
                $("#seccionDetalles").show();
                listaVacantes(datos.resultado.Op)
                listaContactos(datos.resultado.Op)
                //document.getElementsById("form__agregar__empleador").reset();
                
                tablaEmpleador.ajax.reload(null, false);
            } else {
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

})

$('#form__editar__empleador').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "editarGuardarEmpleado" });
    console.log("data", form)

    $.ajax({
        url: path + "EFSRT/empleador",
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
                $("#modal__editar__empleador").modal("hide");
                //document.getElementsByClassName("form-requerimiento").reset();
                tablaEmpleador.ajax.reload(null, false);
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

$('#form__editar__vacante').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "editarGuardarVacantes" });
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
                Notiflix.Notify.Success(datos.msj);
                $("#modalEditarVacantes").modal("hide");
                //document.getElementsByClassName("form-requerimiento").reset();
                tablaVacantes.ajax.reload(null, false);
            } else {
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

})

$('#formRegistrarContactos').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    codigo_op = $('#op').val();
    form.push({ name: "opcion", value: "insertarContactos" });
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
                Notiflix.Notify.Success("Se agrego el nuevo contacto");
                $("#modalAgregarContactos").modal("hide");
                //document.getElementsByClassName("form-requerimiento").reset();
                tablaContactos.ajax.reload(null, false);
            } else {
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

})

$('#form__editar__contacto').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "editarGuardarContacto" });
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
                Notiflix.Notify.Success(datos.msj);
                $("#modalEditarContactos").modal("hide");
                //document.getElementsByClassName("form-requerimiento").reset();
                tablaContactos.ajax.reload(null, false);
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

function listadoEmpleador()
{
    const razonSocial = $("#razonSocial").val();

    tablaEmpleador = $("#tablaEmpleador").DataTable({
        destroy: 'true',
        searching: true,
        processing: false,
        responsive: true,
        ordering:  false,
        lengthMenu: [
            [20, 100, -1], 
            [20, 100, 'TODO']
        ],
        ajax: {
            url: path + "EFSRT/empleador",
            type: "POST",
            data: {
                razonSocial: razonSocial,
                opcion: 'listarEmpleador'
            },
            beforeSend: function () {
                Notiflix.Loading.Hourglass('Cargando...');
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
                render: function (data) {
                    return data.Op;
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
                    return data.NombreComercial;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.RUC;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Zona;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Telefono;
                }
            },
            {
                data: null, render: function (data, type, row) {
                    if (data.Estado === 'Inactivo') {
                        return "<span style='color:red;font-weight:900'>DESABILITADO</span>";
                    } else if (data.Estado === 'Activo') {
                        return "<span style='color:green;font-weight:900'>ACTIVO</span>";
                    }
                }, "className": "text-center"
            },
            {
                data: null,
                render: function (data) {
                    return data.UsuarioReg;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Fechareg;
                }
            },
            {
                data: null,
                render: function (data) {
                    return "<button class=\"btn boton-tabla btn-warning\" type=\"button\" onclick=\"editarEmpleador('" + data.Op + "','" + data.Estado + "');\" title=\"Ver solicitud\"><span class=\"icon-pencil2\"></span></button>&nbsp;&nbsp;&nbsp;";
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

function editarEmpleador(op, estado) {

    if (estado === 'Activo') {
        $("#editar_estado option[value='1']").prop("selected", true)
    } else {
        $("#editar_estado option[value='0']").prop("selected", true)
    }

    $.post(path + "EFSRT/empleador", { op: op, opcion: 'editarDataEmple' })
        .done(function (r) {
            response = JSON.parse(r)
            if (response.respuesta === 'Exito') {

                data = response.lista[0]
                console.log(data)
                Notiflix.Notify.Success(response.respuesta);
                //$("#form__editar__asesor").trigger("reset")
                //$("#modal__editar__asesor").modal("hide")      
                //tabla_lista_asesores.ajax.reload(null, false)

                $('#op').val(data.Op)
                $('#TipoPersona').val(data.TipoPersona)
                $('#editar_razon_social').val(data.RazonSocial.trim())
                $('#editar_comercial').val(data.NombreComercial.trim())
                $('#editar_ruc').val(data.RUC)
                $('#editar_paterno').val(data.ApePaterno)
                $('#editar_materno').val(data.ApeMaterno)
                $('#editar_nombres').val(data.Nombres)
                $('#editar_direccion').val(data.Direccion)
                $('#editar_cod_pais').val(data.codpais)
                $('#editar_cod_departamento').val(data.coddepa)
                $('#editar_provincia').val(data.codprov)
                setTimeout(() => {
                    cargarUbicacion("edit", false, false, false);
                    setTimeout(() => {
                        $('#editar_distrito').val(data.coddistrito)
                    }, 300);
                }, 500);
                
                $('#editar_zona').val(data.codZona < 10 ? data.codZona.toString().padStart(2, 0) : data.codZona)
                $('#editar_telefono').val(data.Telefono)
                $('#editar_correo').val(data.Correo)
                $('#editar_pagina_web').val(data.PaginaWeb)
                $('#editar_observacion').val(data.Observacion)
                $('#editar_usuario_reg').val(data.UsuarioReg)

                listaVacantes(data.Op)
                listaContactos(data.Op)
                $("#modal__editar__empleador").modal("show")

            } else {
                Notiflix.Notify.Failure('Ocurrio un error inesperado, vuela a intentarlo');
            }
        })
        .fail(function (r) {
            Notiflix.Notify.Failure('Ocurrio un error inesperado,por favor recargue la página y vuela a intentarlo');
        })

    
}

function eliminarEmpleador(cod_temporal){
    Notiflix.Confirm.Show(
        'Eliminar Tramite',
        '¿Esta segura de eliminar el Empleador?',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "EFSRT/empleador",
                type: "POST",
                data: {
                    cod_temporal: cod_temporal,
                    opcion: 'eliminarEmpleador'},
                beforeSend: function () {
                    
                },
                success: function (data) {
                    let datos = JSON.parse(data);
                    if (datos.respuesta === 'success') {
                        Notiflix.Notify.Success("Empleado Eliminado");        
                        tablaEmpleador.ajax.reload(null, false);
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

$("#cod_turno").change(function () {
    var idTurno = $("#cod_turno").val()
    Turnos_TurnosHorarios(idTurno, "nuevo", null);
})
$("#editar_cod_turno").change(function () {
    var idTurno = $("#editar_cod_turno").val()
    Turnos_TurnosHorarios(idTurno, "editar", null);
})

async function Turnos_TurnosHorarios(idTurno, tipo, selected) {

    const headers = { "Content-Type": "application/json", 'Accept': 'application/json' };

        let turnos = await fetch(`${path}EFSRT/turnos`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "selectturnosHorarios", idTurno: idTurno })
        });
        turnos = await turnos.json();
        if(tipo == "nuevo"){
            $("#cod_Horario").html("");
            turnos.data.forEach(tur => {
                $("#cod_Horario").append(`<option value="${tur.IDH}"> ${tur.Nombre.toUpperCase()} </option>`);
            });
        }else if(tipo == "editar"){
            $("#editar_cod_Horario").html("");
            turnos.data.forEach(tur => {

                select = selected == tur.IDH ? "selected" : ""

                $("#editar_cod_Horario").append(`<option ${select} value="${tur.IDH}"> ${tur.Nombre.toUpperCase()} </option>`);
            });
        }

        

}

$("#paisM").change(function () {
    cargarUbicacion("new", false);
})

$("#departamentoM").change(function () {
    cargarUbicacion("new", false, false);
})

$("#provinciaM").change(function () {
    cargarUbicacion("new", false, false, false);
})

$("#distritosM").change(function () {
    cargarUbicacion("new", false, false, false, false);
})
/////////////////////////////////////////////////////////////////////////
$("#editar_cod_pais").change(function () {
    cargarUbicacion("edit", false);
})

$("#editar_cod_departamento").change(function () {
    cargarUbicacion("edit", false, false);
})

$("#editar_provincia").change(function () {
    cargarUbicacion("edit", false, false, false);
})

$("#editar_distrito").change(function () {
    cargarUbicacion("edit", false, false, false, false);
})

//FUNCIONES PAISES - DEPARTAMENTO - PROVINCIA - DISTRITOS
async function cargarUbicacion(tipo_, pais_ = true, departamento_ = true, provincia_ = true, distrito_ = true) {

    const headers = { "Content-Type": "application/json", 'Accept': 'application/json' };

    //PAISES
    if (pais_) {
        let paises = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarPaises" })
        });
        paises = await paises.json();
        $("#paisM").html("");
        $("#editar_cod_pais").html("");
        paises.paises.forEach(pais => {
            $("#paisM").append(`<option value="${pais.ID}" ${pais.ID === "20" ? "selected" : ""} > ${pais.Nombre.toUpperCase()} </option>`);
            $("#editar_cod_pais").append(`<option value="${pais.ID}" ${pais.ID === "20" ? "selected" : ""} > ${pais.Nombre.toUpperCase()} </option>`);
        });
    }

    //DEPARTAMENTOS
    if (departamento_) {

        pais_ = tipo_ === "new" ? $("#paisM").val() : $("#editar_cod_pais").val();

        let departamentos = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarDepartamentos", pais: pais_ })
        });
        departamentos = await departamentos.json();
        $("#departamentoM").html("");
        $("#editar_cod_departamento").html("");
            departamentos.departamentos.forEach(departamento => {
                $("#departamentoM").append(`<option value="${departamento.ID}" ${departamento.ID === "23" ? "selected" : ""} > ${departamento.Nombre.toUpperCase()} </option>`);
                $("#editar_cod_departamento").append(`<option value="${departamento.ID}" ${departamento.ID === "23" ? "selected" : ""} > ${departamento.Nombre.toUpperCase()} </option>`);
            });
    }

    //PROVINCIAS
    if (provincia_) {

        departamento_ = tipo_ === "new" ? $("#departamentoM").val() : $("#editar_cod_departamento").val();

        let provincias = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarProvincias", departamento: departamento_ })
        });
        provincias = await provincias.json();
        $("#provinciaM").html("");
        $("#editar_provincia").html("");
        provincias.provincias.forEach(provincia => {
            $("#provinciaM").append(`<option value="${provincia.ID}" ${provincia.ID === "20" ? "selected" : ""} > ${provincia.Nombre.toUpperCase()} </option>`);
            $("#editar_provincia").append(`<option value="${provincia.ID}" ${provincia.ID === "20" ? "selected" : ""} > ${provincia.Nombre.toUpperCase()} </option>`);
        });
    }

    //DISTRITOS
    if (distrito_) {

        provincia_ = tipo_ === "new" ? $("#provinciaM").val() : $("#editar_provincia").val();

        let distritos = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarDistritos", provincia: provincia_ })
        });
        distritos = await distritos.json();
        $("#distritosM").html("");
        $("#editar_distrito").html("");
        distritos.distritos.forEach(distrito => {
            $("#distritosM").append(`<option value="${distrito.ID}" > ${distrito.Nombre.toUpperCase()} </option>`);
            $("#editar_distrito").append(`<option value="${distrito.ID}" > ${distrito.Nombre.toUpperCase()} </option>`);
        });
    }

}