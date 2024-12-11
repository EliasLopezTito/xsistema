document.addEventListener("DOMContentLoaded", () => {
    //cargarUbicacion();

});
$(document).ready(function() {
    Notiflix.Loading.Init({
        clickToClose: true
    });


    listaTurnosHorarios();
});

document.addEventListener('click', (e) => {

    //TURNO HORARIO
    if (e.target.matches('#agregar_turno_horario')) {
        $("#modalAgregarHorarios").modal({ backdrop: 'static', keyboard: false });
    }

});



function listaTurnosHorarios() {
    tablaTurnosHorarios = $("#tablaTurnosHorarios").DataTable({
        destroy: 'true',
        searching: false,
        processing: false,
        responsive: true,
        ordering: false,
        bLengthChange: false,
        lengthMenu: [
            [50, 100, -1],
            [50, 100, 'TODO']
        ],
        ajax: {
            url: path + "EFSRT/empleador",
            type: "POST",
            data: {
                opcion: 'listaTurnosHorarios'
            },
            dataSrc: function (data) {
                $("body").css({ "padding": 0 });
                console.log("data", data)
                if (data.respuesta == "success") {
                    return data.turnosHora == "vacio" ? {} : data.turnosHora;
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
                    return data.Turno;
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
                    return data.H1;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.H2;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.H3;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.H4;
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
                $("#seccionDetalles").show();
                //document.getElementsByClassName("form-requerimiento").reset();
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
    form.push({ name: "opcion", value: "insertarVacantes" });
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
                    return "<button class=\"btn boton-tabla btn-warning\" type=\"button\" onclick=\"editarEmpleador('" + data.Op + "','" + data.Estado + "');\" title=\"Ver solicitud\"><span class=\"icon-pencil2\"></span></button>&nbsp;&nbsp;&nbsp;" + 
                           "<button class=\"btn boton-tabla btn-danger\" type=\"button\" onclick=\"eliminarEmpleador('" + data.Op + "')\"><span class=\"icon-cross\"></span></button>";
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
                $('#editar_distrito').val(data.coddistrito)
                $('#editar_zona').val(data.codZona)
                $('#editar_telefono').val(data.Telefono)
                $('#editar_correo').val(data.Correo)
                $('#editar_pagina_web').val(data.PaginaWeb)
                $('#editar_observacion').val(data.Observacion)
                $('#editar_usuario_reg').val(data.UsuarioReg)

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

$("#paisM").change(function () {
    cargarUbicacion(false);
})

$("#departamentoM").change(function () {
    cargarUbicacion(false, false);
})

$("#provinciaM").change(function () {
    cargarUbicacion(false, false, false);
})

$("#distritosM").change(function () {
    cargarUbicacion(false, false, false, false);
})

//FUNCIONES PAISES - DEPARTAMENTO - PROVINCIA - DISTRITOS
async function cargarUbicacion(pais_ = true, departamento_ = true, provincia_ = true, distrito_ = true) {

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
        paises.paises.forEach(pais => {
            $("#paisM").append(`<option value="${pais.ID}" ${pais.ID === "20" ? "selected" : ""} > ${pais.Nombre.toUpperCase()} </option>`);
        });
    }

    //DEPARTAMENTOS
    if (departamento_) {
        let departamentos = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarDepartamentos", pais: $("#paisM").val() })
        });
        departamentos = await departamentos.json();
        $("#departamentoM").html("");
        departamentos.departamentos.forEach(departamento => {
            $("#departamentoM").append(`<option value="${departamento.ID}" ${departamento.ID === "23" ? "selected" : ""} > ${departamento.Nombre.toUpperCase()} </option>`);
        });
    }

    //PROVINCIAS
    if (provincia_) {
        let provincias = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarProvincias", departamento: $("#departamentoM").val() })
        });
        provincias = await provincias.json();
        $("#provinciaM").html("");
        provincias.provincias.forEach(provincia => {
            $("#provinciaM").append(`<option value="${provincia.ID}" ${provincia.ID === "20" ? "selected" : ""} > ${provincia.Nombre.toUpperCase()} </option>`);
        });
    }

    //DISTRITOS
    if (distrito_) {
        let distritos = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarDistritos", provincia: $("#provinciaM").val() })
        });
        distritos = await distritos.json();
        $("#distritosM").html("");
        distritos.distritos.forEach(distrito => {
            $("#distritosM").append(`<option value="${distrito.ID}" > ${distrito.Nombre.toUpperCase()} </option>`);
        });
    }

}