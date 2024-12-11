var tablaRT;
var coloresAsesores = {};
const coloresFondo  = [ 
    "rgba(54, 162, 235, 0.3)",
    "rgba(75, 192, 192, 0.3)",
    "rgba(255, 205, 86, 0.3)",
    "rgba(255, 99, 132, 0.3)",
    "rgba(201, 203, 207, 0.3)",
    "rgba(83, 211, 87, 0.3)",
    "rgba(237, 208, 98, 0.3)"  
]
var cicloMapping = {
    "01": "I",
    "02": "II",
    "03": "III",
    "04": "IV",
    "05": "V",
    "06": "VI"
};
$(document).ready(function () {
    validarPermisosXUsuariosNuevo()
    cargarInstituciones2(true);
    $("#institucion2").change(function () {
        cargarTipoEspecialidades2(true, true);
    })
    //buscarRT()
    $("#tipoEspecialidad2").change(function(){
        cargarEspecialidades2(true,true, function() {
            var cboEspecialidad = $("#especialidad2");
            cboEspecialidad.find('option[value="0"]').remove();
        });
    })

    // $("#inputBuscar").autocomplete({
    //     source: function(request, response){
    //         $.ajax({
    //             url: path + "Programacion/descargarBoleta",
    //             dataType: "json",
    //             type: 'post',
    //             data: {
    //                 term: request.term,
    //                 opcion: 'searchAlumnos'
    //             },
    //             success: function(data){
    //                 $("#inputBuscar").attr("codigo","");
    //                 $("#inputBuscar").next('i').removeClass('glyphicon-ok');
    //                 $("#inputBuscar").next('i').addClass('glyphicon-remove');
    //                 $("#inputBuscar").parent().removeClass('has-success');
    //                 $("#inputBuscar").parent().addClass('has-error');
    //                 let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos; 
    //                 response(result);
    //             }
    //         });
    //     },
    //     minLength: 2,
    //     select: function(event, ui){
    //         if (ui.item.vacio) {
    //             event.preventDefault();
    //         } else{
    //             $("#inputBuscar").val(ui.item.cod_alumno + " - " + ui.item.nombre);
    //             $("#inputBuscar").attr('codigo', ui.item.cod_alumno);
    //             $("#inputBuscar").next('i').removeClass('glyphicon-remove');
    //             $("#inputBuscar").next('i').addClass('glyphicon-ok');
    //             $("#inputBuscar").parent().removeClass('has-error');
    //             $("#inputBuscar").parent().addClass('has-success');
    //         }
    //         return false;
    //     }
    // })
    // .autocomplete( "instance" )._renderItem = function( ul, item ) {

    //     if (item.hasOwnProperty('vacio')) {
    //         return $( "<li>" )
    //         .append( "<div>No se encontraron resultados</div>" )
    //         .appendTo( ul );
    //     }

    //     return $( "<li>" )
    //         .append( "<div>"+item.nombre+"</div>" )
    //         .appendTo( ul );
    // };
    $("#inputBuscar").focus();
    
});
function generarColorAleatorio() {
    return coloresFondo[Math.floor(Math.random() * coloresFondo.length)];
}
function getColorAsesor(asesor) {
    if (!coloresAsesores[asesor]) {
        coloresAsesores[asesor] = generarColorAleatorio();
    }
    return coloresAsesores[asesor];
}


$("#btnBuscar").click(function(){
    buscarRT()
})

function buscarRT() {
    var alumno = $('#inputBuscar').val().trim();
    var anio2 = $('#anio2').val();
    var mes2 = $('#mes2').val();
    var tipos = $('#lista_tipos').val();
    var cod_espe = $('#especialidad_lista').val();
    var semestre2 = $('#semestre2').val();
    var modalidad2 = $('#modalidad2').val();
    var zona3 = $('#zona3').val();
    
    
            tablaRT = $("#tablaReincorporaTras").DataTable({
                //serverSide: true,
                //processing: true,
                deferRender: true,
                destroy: true,
                 ordering: false,
                responsive: true,
                dom: 'lBfrtip',
                buttons: [
                    { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
                ],
                ajax: {
                    url: path + "areaReincorporacion/ReincorporaTras",
                    type: "POST",
                    data: {
                        alumno: alumno,
                        anio2: anio2,
                        mes2: mes2,
                        tipos: tipos,
                        cod_espe:cod_espe,
                        semestre2:semestre2,
                        modalidad2:modalidad2,
                        zona3:zona3,
                        opcion: "listar"
                    },
                    dataSrc: function(data) {
                        /* console.log("data", data); */
                        if (data.respuesta === "success" && data.data !== "vacio") {
                            var lista = data.data;
                            return lista
                        } else {
                            return [];
                        }
                    }            
                },
                columnDefs: [
                    {
                        targets: '_all',
                        className: 'celda-centrada'
                    }
                ],
                scrollX: true,
                columns: [
                    { data: 'Op', title: 'Op' },
                    {   
                        data: 'Encargada', 
                        title: 'Encargada',  
                        render: function (data) {
                            var displayText = data === "0" ? "NINGUNO" : data.toUpperCase();
                            var colorAsesor = getColorAsesor(data);
                            return "<div class=\"celda-centrada\" style=\"background-color: " + colorAsesor + "; font-weight: bold;\">" + displayText + "</div>";
                        }
                    },            
                    { data: 'anio', title: 'Año' },
                    { data: 'Mes', title: 'Mes' },
                    { data: 'Fecha', title: 'Fecha' },
                    { data: 'Tipo', title: 'Tipo' },
                    { data: 'Cod_alumno', title: 'Código' },
                    { data: 'ALumno', title: 'Alumno' },
                    { data: 'Sede', title: 'Sede' },
                    { data: 'Especialidad', title: 'Especialidad' },
                    { 
                        data: 'UltimoCiclo', 
                        title: 'Último Ciclo',
                        render: function(data) {
                            return cicloMapping[data] || data;
                        }
                    },
                    { data: 'Semestre', title: 'Semestre' },
                    { 
                        data: 'CicloReinicio', 
                        title: 'Ciclo Reinicio',
                        render: function(data) {
                            return cicloMapping[data] || data;
                        }
                    },            
                    { data: 'SemestreReinicio', title: 'Semestre Reinicio' },
                    { data: 'MesReinicio', title: 'Mes Reinicio' },
                    { data: 'Conformidad', title: 'Conformidad' },
                    { data: 'CursoSubsanar', title: 'Curso Subsanar' },
                    { data: 'TipoDocumento', title: 'T. Doc.' },
                    { data: 'NumDocumento', title: 'N. Doc.' },
                    { data: 'Modalidad', title: 'Modalidad' },
                    { data: 'Zona', title: 'Zona' },
                    { data: 'Horario', title: 'Horario' },
                    { data: 'Celular', title: 'Celular' },
                    { data: 'Observaciones', title: 'Observaciones' },
                    { data: 'UsuarioReg', title: 'Usuario R.' },
                    { data: 'FechaReg', title: 'Fecha R.' },
                    {
                        data: null,
                        render: function(data) {
                            return "<button class=\"btn boton-tabla boton-verde\" type=\"button\" onclick=\"verDato('"+data.anio+"','"+data.CodMes+"','"+data.Cod_alumno+"');\" title=\"Ver\"><span class=\"icon-eye\"></span></button>" +
                                "<button class=\"btn boton-tabla boton-naranja buttonEditar\" type=\"button\" onclick=\"obtenerDatos("+data.Op+");\" title=\"Editar\"><span class=\"icon-pencil\"></span></button>" +
                                "<button class=\"btn boton-tabla btn-danger buttonEliminar\" style=\"margin-left: 2px;\" type=\"button\" onclick=\"eliminarRT("+data.Op+");\" title=\"Eliminar\"><span class=\"icon-cross\"></span></button>";
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
                },
                columnDefs: [
                    {
                        targets: '_all',
                        className: 'celda-centrada',
                        orderable: false
                    }
                ],
                lengthMenu: [
                    [20, 50, 75, 100],
                    [20, 50, 75, 100]
                ]
            })
    

}

$("#btnVerModalNuevo").click(function(){
    
    $("#tituloModal").html("REGISTRAR REINCORPORACIÓN O TRASLADO");
    $("#btn_modal").addClass("btn-info").removeClass("btn-primary")
    $("#btn_modal").html("Registrar");
    $("#codigo_alumno").prop("readonly", false);
    $("#op").val("");
    document.getElementById("form-RT").reset();

    $("#modalNuevoRT").modal({
        backdrop: 'static',
        keyboard: false
    });

    $("#codigo_alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "areaReincorporacion/ReincorporaTras",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function(data){
                    $("#codigo_alumno").attr("codigo","");
                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos; 
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                /* console.log("data proce",ui.item) */
                $("#codigo_alumno").val(ui.item.cod_alumno);
                $("#nombreCompleto").val(ui.item.nombre);
                $('#celular').val(ui.item.telefono);
                $('#tipoDoc').val(ui.item.TipoDocumento);
                $('#numDoc').val(ui.item.NumDocumento);
                $('#email').val(ui.item.email);
                $('#institucion').val(ui.item.Cod_local);
                $('#sede').val(ui.item.Sede);
                $('#tipoEspecialidad').val(ui.item.Tipo_espe);
                $('#especialidad').val(ui.item.Cod_espe);
                $("#codigo_alumno").next('i').removeClass('glyphicon-remove');
                $("#codigo_alumno").next('i').addClass('glyphicon-ok');
                $("#codigo_alumno").parent().removeClass('has-error');
                $("#codigo_alumno").parent().addClass('has-success');
            }
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {

        if (item.hasOwnProperty('vacio')) {
            return $( "<li>" )
            .append( "<div>No se encontraron resultados</div>" )
            .appendTo( ul );
        }

        return $( "<li>" )
            .append( "<div><b>"+item.cod_alumno+"</b>"+" - "+item.nombre+"</div>" )
            .appendTo( ul );
    };
    $("#codigo_alumno").focus();
})

$('#form-RT').submit(function (e) {
    e.preventDefault(); 

    var op = $('#op').val();
    var tipo = $('#codTipo').val();
    var fecha = $('#fecha').val();
    var mes = $('#mes').val();
    var encargada = $('#encargada').val();
    var codigo_alumno = $('#codigo_alumno').val();
    var nombreCompleto = $('#nombreCompleto').val();
    var tipoDoc = $('#tipoDoc').val();
    var numDoc = $('#numDoc').val();
    var institucion = $('#institucion2').val();
    var sede = $('#sede').val();
    var tipoEspecialidad = $('#tipoEspecialidad2').val();
    var especialidad = $('#especialidad2').val();
    var semestre = $('#semestre').val();
    var resemestre = $('#reSemestre').val();
    var ulCiclo = $('#ulCiclo').val();
    var reCiclo = $('#reCiclo').val();
    var conformidad = $('#conformidad').val();
    var curSubsanar = $('#curSubsanar').val();
    var mesReinicio = $('#mes_reinicio').val();
    // var horarioI = $('#hora_inicio').val();
    // var horarioF = $('#hora_fin').val();

    if (!tipo || !fecha || !mes || !encargada || !codigo_alumno || !nombreCompleto || !tipoDoc || !numDoc || !institucion || !sede || !tipoEspecialidad || !especialidad || !semestre || !resemestre || !ulCiclo || !reCiclo || !conformidad || !curSubsanar || !mesReinicio) {
        Notiflix.Report.Warning('AVISO',"Todos los campos marcados con (*) son obligatorios. Por favor, complete los campos requeridos.", "Cerrar");
        return; 
    }
    let form = new FormData(this)

    if(op === ""){
        form.append("opcion", "registrar");
        /* console.log("data", form); */
    
        $.ajax({
            url: path + "areaReincorporacion/ReincorporaTras",
            type: "POST",
            dataType: "JSON",
            data: form,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function(){
                $(".text-loader").html("Guardando informacion...");
                $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
                $("body").css({ "padding": 0 });
            },
            success: function(data){
                $("#modalLoader").modal("hide");
                if (data.respuesta === 'success') {
                    $("#modalNuevoRT").modal("hide");
                    $("#op").val("");
                    Notiflix.Notify.Success('Registrado correctamente');
                    document.getElementById("form-RT").reset();
                    location.reload();
                } else{
                    Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la página');
                }
            }
        });
    }else{
        
        form.append("opcion", "registrar")
        /* console.log("data", form) */

        $.ajax({
            url: path + "areaReincorporacion/ReincorporaTras",
            type: "POST",
            dataType: "JSON",
            data: form,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function(){
                $(".text-loader").html("Guardando informacion...");
                $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
                $("body").css({ "padding": 0 });
            },
            success: function(data){
                $("#modalLoader").modal("hide");
                if (data.respuesta === 'success') {
                    $("#modalNuevoRT").modal("hide");
                    $("#op").val("");
                    Notiflix.Notify.Success('Registrado correctamente');
                    document.getElementById("form-RT").reset();
                    tablaRT.ajax.reload(null, false);
                } else{
                    Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
                }
            }
        });
    }

    
});

function verDato(anio, mes,codAlumno){

    $.ajax({
        url: path + "areaReincorporacion/ReincorporaTras",
        type: "POST",
        data: {
            anio: anio,
            mes: mes,
            codAlumno: codAlumno,
            opcion: "verDatoLista",
        },
        beforeSend: function()
        {


        },
        success: function(data)
        {   
           
            tbody = $('#tablaVerPagos tbody');
            tbody.find('tr').remove();

            var datos = JSON.parse(data);
            console.log("dataos", datos);

            if(datos.respuesta=="success")
            {
                var resp = datos.listaAulas;
                    if(resp == "vacio"){
                        Notiflix.Report.Warning('Aviso','No se encontro ningun aula',"Cerrar");
                        return;
                    }else{

                        $('.operacion_').html("  "+ codAlumno)

                        for (i = 0; i < resp.length; i++) 
                        {
                            var datax = resp[i];                       

                            var tr = "<tr class=\"fila_programacion\">" +
                                        "    <td class=\"celda-centrada\">" + datax.cod_aula + "</td>" +
                                        "    <td class=\"celda-centrada\">" + datax.cod_curso + "</td>" +
                                        "    <td class=\"celda-centrada\">" + datax.Curso + "</td>" +
                                        "    <td class=\"celda-centrada\">" + datax.cod_turno + "</td>" +
                                        "    <td class=\"celda-centrada\">" + datax.Turno + "</td>" +                                        
                                        "    <td class=\"celda-centrada\">" + datax.Hora + "</td>" +
                                    "</tr>";
                                tbody.append(tr);
                        }

                        $("#modalVerPagos").modal({backdrop: 'static', keyboard: false});
                    }

            }else
            {
                var errores = "";

                for(i = 0; i < datos.errores.length; i++){
                    errores += datos.errores[i] + "<br>";
                }

                Notiflix.Report.Failure('Error',errores,"Cerrar");
            }
        }
    });
}

function obtenerDatos(Op) {
    var Op = Op;
    let formData = new FormData();
    formData.append('Op', Op);
    formData.append('opcion', 'obtenerDatos');

    $.ajax({
        url: path + "areaReincorporacion/ReincorporaTras",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "validar",
            tipo: 2,
            ruta: "areaReincorporacion/ReincorporaTras"
        },
        success: function(response) {
            console.log(response); 
            if (response.respuesta === "success" && response.validarUsuario === "SI") {
                $.ajax({
                    url: path + "areaReincorporacion/ReincorporaTras",
                    type: "POST",
                    dataType: "JSON",
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function (data) {
                        if (data.respuesta == "success") {
                            const rt = data.rt[0];
            
                            $("#op").val(Op);
                            $("#codTipo").val(rt.codTipo.trim());
                            $("#mes").val(rt.Mes.trim());
                            $("#encargada").val(rt.codEncargada);
                            $("#codigo_alumno").val(rt.Cod_alumno.trim());
                            $("#nombreCompleto").val(rt.ApellidosNombres.trim());
                            $("#tipoDoc").val(rt.TipoDocumento.trim());
                            $("#numDoc").val(rt.NumDocumento.trim());
                            $("#celular").val(rt.Celular.trim());
                            $("#email").val(rt.Correo.trim());
                            $("#institucion2").val(rt.cod_local.trim());
                            $("#sede").val(rt.cod_localinst.trim());
                            $("#tipoEspecialidad2").val(rt.tipo_espe.trim());
                            $("#especialidad2").val(rt.cod_espe.trim());
                            $("#fecha").val(rt.Fecha.substr(0, 10));
                            $("#semestre").val(rt.Semestre.trim());
                            $("#reSemestre").val(rt.SemestreReinicio.trim());
                            $("#ulCiclo").val(rt.UltimoCiclo.trim());
                            $("#reCiclo").val(rt.ReinicioCiclo.trim());
                            $("#conformidad").val(rt.Conformidad.trim());
                            $("#curSubsanar").val(rt.CursosSubsanar.trim());
                            let horario = rt.Horario.trim();
                            let [hora_inicio, hora_fin] = horario.split(' - ');
                            $("#hora_inicio").val(hora_inicio);
                            $("#hora_fin").val(hora_fin);
                            $("#observacion").val(rt.Observaciones);

                            $("#semestre").val(rt.Semestre.trim());
                            $("#modalidad").val(rt.codModalidad.trim());
                            $("#zonas").val(rt.codZona.trim());
                            $("#anio").val(rt.Año.trim());

                            $("#mes_reinicio").val(rt.MesReinicio.trim());
            
                            $("#btn_modal").addClass("btn-primary").removeClass("btn-info")
                            $("#btn_modal").html("Editar");
            
                        } else {
                            
                        }
                    }
                });
            
                $("#codigo_alumno").prop("readonly", true);
                $("#tituloModal").html("EDITAR REINCORPORACIÓN O TRANSLADO");
                $("#modalNuevoRT").modal({ backdrop: 'static', keyboard: false });
            } else {
                $("#modalNuevoRT").hide()
                Notiflix.Report.Warning("AVISO","No tienes permiso para realizar esta acción.", "Aceptar");
            }
        },
        error: function() {
            Notiflix.Report.Failure("ERROR", "Ocurrió un error al validar los permisos. Por favor, intenta de nuevo.", "Cerrar");
        }
    });
}

function eliminarRT(op) {
    $.ajax({
        url: path + "areaReincorporacion/ReincorporaTras",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "validar",
            tipo: 3,
            ruta: "areaReincorporacion/ReincorporaTras"
        },
        success: function(response) {
            console.log(response); 
            if (response.respuesta === "success" && response.validarUsuario === "SI") {
                var op = op;
                Notiflix.Confirm.Show(
                    'Eliminar Tramite',
                    '¿Esta segura de eliminar el certificado? Nro. : '+ op +'',
                    'Si',
                    'No',
                    function okCb() {
                        $.ajax({
                            url: path + "areaReincorporacion/ReincorporaTras",
                            type: "POST",
                            data: {
                                op: op,
                                opcion: 'eliminar'
                            },
                            success: function (data) {
                                var datos = JSON.parse(data);
                                if (datos.respuesta == "success") {
                                    location.reload();
                                    /* console.log(datos) */
                                } else {
                                    var errores = "";
                                    for (i = 0; i < datos.errores.length; i++) {
                                        errores += datos.errores[i] + "<br>";
                                    }
                                    mostrarMensaje("error", "ERROR", errores);
                                }
                            }
                        });
                        $("#alumno").prop("readonly", true);
                    },
                    function cancelCb() {
                    },
                    {
                    },
                );
            } else {
                Notiflix.Report.Warning("AVISO","No tienes permiso para realizar esta acción.", "Aceptar");
            }
        },
        error: function() {
            Notiflix.Report.Failure("ERROR", "Ocurrió un error al validar los permisos. Por favor, intenta de nuevo.", "Cerrar");
        }
    });
    

}
function validarPermisosXUsuariosNuevo(){
    $.ajax({
        url: path + "areaReincorporacion/ReincorporaTras",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "validar",
            tipo: 1,
            ruta: "areaReincorporacion/ReincorporaTras"  
        },
        success: function(response) {
            console.log(response)
            if (response.respuesta === "success" && response.validarUsuario === "SI") {
                $("#btnVerModalNuevo").attr('disabled', false);
            } else {
                $("#btnVerModalNuevo").attr('disabled', true);
            }
        },
        error: function() {
            Notiflix.Report.Failure("ERROR","Ocurrió un error al validar los permisos. Por favor, intenta de nuevo.", "Cerrar");
        }
    });
}

function validarPermisosXUsuariosEditar(){
    $.ajax({
        url: path + "areaReincorporacion/ReincorporaTras",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "validar",
            tipo: 2,
            ruta: "areaReincorporacion/ReincorporaTras"
        },
        success: function(response) {
            console.log(response); // Verificar la respuesta
            if (response.respuesta === "success" && response.validarUsuario === "SI") {
                $(".buttonEditar").each(function() {
                    $(this).prop('disabled', false); // Habilitar los botones
                });
            } else {
                $(".buttonEditar").each(function() {
                    $(this).prop('disabled', true); // Deshabilitar los botones
                });
            }
        },
        error: function() {
            Notiflix.Report.Failure("ERROR", "Ocurrió un error al validar los permisos. Por favor, intenta de nuevo.", "Cerrar");
        }
    });
}
