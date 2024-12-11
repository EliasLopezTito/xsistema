document.addEventListener("DOMContentLoaded", () => {
    
    autompleteAlumno();
    autompleteAlumnoAgregar();     
    autompleteAlumnoEditar();
});

$("#btnRegistrar").click(function () {
    cargarCodigoTramite();    
})

$("#btnReporte").click(function () {
    reporteTramites();
})

$("#alumnoAgregar").keyup(function(){
    if( $(this).val().length < 1 ){
        $("#institutoM").val("");
        $("#especialidadM").val("");
        $("#tipoEspe").val(""); 
        $("#alumnoAgregar").attr("codigo", "");
        $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
        $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
        $("#alumnoAgregar").parent().removeClass('has-success');
        $("#alumnoAgregar").parent().addClass('has-error');

        $("#semestre1").val("1988-II");
        $("#semestre2").val("1988-II");
        $("#semestre3").val("1988-II");
        $("#semestre4").val("1988-II");
        $("#semestre5").val("1988-II");
        $("#semestre6").val("1988-II");
    }
})

$('#modalNuevoTramite').on('hidden.bs.modal', function () {
    $('#seccion_fechaEntrega').hide()
    $('#seccion_fechaEntrega_editar').hide()
    $('#fechaEntrega').val('')
    $('#seccionModuloFormativo').hide()
    $('#moduloFormativo').val(null)

    $('#fechaInicio').val(null)
    $('#fechaFinal').val(null)
    $('#Horas').val('')
    $('#creditos').val('')
    console.log("cerrar modal");
    
});

$(document).on("change", "#estadoRegistrar", function () {
    if($('#estadoRegistrar').val() == "ENTREGADO"){
        $('#seccion_fechaEntrega').show()
    }else{
        $('#seccion_fechaEntrega').hide()
        $('#fechaEntrega').val('')
    }
});

$(document).on("change", "#estadoRegistrar_editar", function () {
    if($('#estadoRegistrar_editar').val() == "ENTREGADO"){
        $('#seccion_fechaEntrega_editar').show()
    }else{
        $('#seccion_fechaEntrega_editar').hide()
        $('#fechaEntrega_editar').val('')
    }
});

$("#formulario").submit(function(e){
    e.preventDefault("");

    let data = $(this).serializeArray();
    data.push({ name: "opcion", value: "agregar" });
    data.push({ name: "codigoAlumno", value: $("#alumnoAgregar").attr("codigo") })    

    if (data[12].value === "" || data[3].value === "" || data[4].value === "" ){
        Notiflix.Notify.Warning("POR FAVOR SELECCIONE UN ALUMNO.");
        return;
    }

    $.ajax({
        url: path + "titulacion/solicitudTitulacion",
        dataType: "JSON",
        type: 'POST',
        data: $.param(data),
        beforeSend: function (){

        },
        complete: function () {

        },
        success: function (data) {
            
            if(data.respuesta === "success"){

                cargarDataAlumno()

                $("#institutoM").val("");
                $("#especialidadM").val("");
                $("#tipoEspe").val("");
                $("#alumnoAgregar").val("");
                $("#alumnoAgregar").attr("codigo", "");
                $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
                $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
                $("#alumnoAgregar").parent().removeClass('has-success');
                $("#alumnoAgregar").parent().addClass('has-error');
                $("#modalAgregar").modal("hide");

                Notiflix.Notify.Success("OPERACIÓN EXITOSA");
            }else{
                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, PORFAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO");
            }

        }
    });

})

function autompleteAlumno(){

    $("#usuarios").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "titulacion/solicitudTitulacion",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function (data) {
                    $("#usuarios").attr("codigo","");
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
                $("#usuarios").attr("codigo", ui.item.cod_alumno.trim());
                $("#usuarios").val(ui.item.cod_alumno.trim() + " - " + ui.item.nombre.trim());
                $("#usuarios").next('i').removeClass('glyphicon-remove');
                $("#usuarios").next('i').addClass('glyphicon-ok');
                $("#usuarios").parent().removeClass('has-error');
                $("#usuarios").parent().addClass('has-success');
                //cargarDataAlumno(ui.item.cod_alumno);
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

}

$("#usuarios").keyup(function(){
    if ($("#usuarios").val().length < 1){
        $("#usuarios").attr("codigo", "");
        $("#usuarios").next('i').removeClass('glyphicon-ok');
        $("#usuarios").next('i').addClass('glyphicon-remove');
        $("#usuarios").parent().removeClass('has-success');
        $("#usuarios").parent().addClass('has-error');
    }
})

function autompleteAlumnoAgregar() {

    $("#alumnoAgregar").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "titulacion/solicitudTitulacion",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function (data) {
                    
                    $("#institutoM").val("");
                    $("#especialidadM").val(""); 
                    $("#tipoEspe").val(""); 
                    $("#alumnoAgregar").attr("codigo","");

                    $("#semestre1").val("1988-II");
                    $("#semestre2").val("1988-II");
                    $("#semestre3").val("1988-II");
                    $("#semestre4").val("1988-II");
                    $("#semestre5").val("1988-II");
                    $("#semestre6").val("1988-II");

                    $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
                    $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
                    $("#alumnoAgregar").parent().removeClass('has-success');
                    $("#alumnoAgregar").parent().addClass('has-error');
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

                $("#institutoM").val(ui.item.Cod_local+" - "+ui.item.Local.trim());   
                $("#especialidadM").val(ui.item.Cod_espe + " - " + ui.item.Especialidad.trim());       
                $("#tipoEspe").val(ui.item.Tipo_espe); 
                $("#alumnoAgregar").attr("codigo", ui.item.cod_alumno.trim());                

                $("#alumnoAgregar").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#alumnoAgregar").next('i').removeClass('glyphicon-remove');
                $("#alumnoAgregar").next('i').addClass('glyphicon-ok');
                $("#alumnoAgregar").parent().removeClass('has-error');
                $("#alumnoAgregar").parent().addClass('has-success');    
                
                cargarSemestres(ui.item.cod_alumno.trim());

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
    $("#alumnoAgregar").focus();

}

let backgroundColor = [
    'rgb(255, 99, 132,0.2)',
    'rgb(54, 162, 235,0.2)',
    'rgb(255, 205, 86,0.2)',
    'rgb(112, 173, 70,0.2)',
    'rgb(230, 148, 92,0.2)',
    'rgb(54, 162, 235,0.2)',
    'rgb(75, 192, 192,0.2)',
    'rgb(255, 205, 86,0.2)',
    'rgb(255, 99, 132,0.2)',
    'rgb(201, 203, 207,0.2)',
    'rgb(83, 211, 87,0.2)',
    'rgb(237, 208, 98,0.2)'
];

$('#buscarTitulacion').click(function(){
    cargarDataAlumno()
})

function cambiarEstadoTitulo(corre, estado){
    $('#correlativo').val(corre);
    $('#cambiarEstadoTitulo').val(estado);
    $("#modalCambiarEstado").modal({ backdrop: 'static', keyboard: false });  
}

// function cargarDataAlumnoBefore(){

//     $.ajax({
//         url: path + "titulacion/solicitudTitulacion",
//         dataType: 'JSON',
//         type: 'POST',
//         data: {
//             opcion: 'cargarData',
//             cod_alumno: $('#usuarios').attr('codigo'),
//             fecha_1: $('#fecha_1').val(),
//             fecha_2: $('#fecha_2').val()
//         },
//         beforeSend: function(){
//             $('.text-loader').text('CONSULTANDO INFORMACIÓN, POR FAVOR ESPERE...');
//             $("#modalLoader").modal();
//             $("#tablaListado tbody").html("");
//         },
//         complete: function(){
//             $("#modalLoader").modal("hide");
//         },
//         success: function(data) {

//             /* console.log("da", data); */
                                 
//             if (data.respuesta === 'success') {    
                        
//                 const longitud = data.data.length;
                
//                 if ( longitud > 0 ) {

//                     data.data.forEach( (el,key) => {                        
                        
//                         el.forEach( (e,k) => {

//                             const rowspan = ` 
//                             <td class='text-center' rowspan="${el.length}">
//                                 <form method='post' target="_blank">  
//                                     <span>${e.Tipo}</span>
//                                 </form>
//                                 <form method='post' target="_blank">
//                                     <input type="hidden" name="codigo" value="${e.codtramite}"></input>   
//                                     <button class='btn boton-tabla boton-azul' type='submit' title='Descargar Solicitud'><span class='icon-download3'></span></button>
//                                 </form>
//                                 <form method='post' target="_blank">
//                                     <input type="hidden" name="codigo" value="${e.codtramite}"></input>
//                                     <input type="hidden" name="formatoAntiguo" value="${e.codtramite}"></input>   
//                                     <button class='btn boton-tabla boton-verde' type='submit' title='Descargar Solicitud'><span class='icon-download3'></span></button>
//                                 </form>
//                                 <div>
//                                     <button class='btn boton-tabla boton-naranja' type='button' codigo="${e.codtramite}" onclick='editarSolicitud(this)' title='Editar Solicitud'><span class='icon-pencil2'></span></button>
//                                 </div>
//                                 <div>
//                                     <button class='btn boton-tabla boton-rojo' type='button' codigo="${e.codtramite}" onclick='eliminarSolicitud(this)' title='Eliminar Solicitud'><span class='icon-bin'></span></button>
//                                 </div>
//                             </td>`;
//                             const correlativo = `<td class='text-center' rowspan="${el.length}"><b>${e.codtramite}</b></td>`;                                                                                                         

//                             $("#tablaListado tbody").append(`<tr style="background:${backgroundColor[key]}">
//                                 ${k === 0 ? correlativo : ""}                                                             
//                                 <td class='text-center'>${e.Alumno.trim()}</td>
//                                 <td class='text-center'>${e.Especialidad.trim()}</td>
//                                 <td class='text-center'>${e.Semestre.trim()}</td>                                                                    
//                                 <td class='text-center'>${e.Ciclo.trim()}</td>
//                                 <td class='text-center'>${e.Turno.trim()}</td> 
//                                 ${k===0?rowspan:""}                                                             
//                             </tr>`);

//                         });

//                     });
                                        
//                 } else{

//                     $("#tablaListado tbody").html(`<tr><td class='text-center' colspan="6">NO SE ENCONTRÓ INFORMACIÓN</td></tr>`)

//                 }

//             } else{

//                 Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR VUELVA A INTENTARLO");
//                 $("#tablaListado tbody").html("");

//             }
       
//         }
//     });

// }

function cargarDataAlumno()
{

    tablaTramite = $("#tablaListado").DataTable({
        destroy: 'true',
        searching: true,
        processing: false,
        responsive: true,
        ordering:  false,
        dom: 'frtip',
        // buttons: [
        //     // { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'},
        //     { "extend": 'pdf', "text":'Reporte PDF',"className": 'btn-important'}
        // ],
        lengthMenu: [
            [20, 50, -1], 
            [20, 50, 'TODO']
        ],
        ajax: {
            url: path + "titulacion/solicitudTitulacion",
            type: "POST",
            data: {
                opcion: 'cargarData',
                cod_alumno: $('#usuarios').attr('codigo'),
                fecha_1: $('#fecha_1').val(),
                fecha_2: $('#fecha_2').val(),
                cod_espe: $('#especialidad_lista').val(),
                tipo: $('#tipo').val(),
                estado: $('#estado').val(),
            },
            dataSrc: function(data){      
                console.log("dataListBuscarAlumnos", data) 
                mostrar = true
                if(data.user == "UserName"){
                    mostrar = false
                }
                if(data.respuesta == "success" && data.lista !== "vacio"){
                    return data.lista; 
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
                    return data.codtramite;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Alumno.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Especialidad.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Turno.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Fecha.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Tipo.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    //return data.EstadoTitulo ?? '';
                    if (data.EstadoTitulo == "INGRESADO") {
                        return "<span class=\"badge badge-pill badge-primary\" onclick=\"cambiarEstadoTitulo('"+ data.codtramite +"','"+ data.EstadoTitulo +"');\" style=\"background-color: #eab308\">" + data.EstadoTitulo + "</span>"
                    } else if (data.EstadoTitulo == "TRAMITADO"){
                        return "<span class=\"badge badge-pill badge-primary\" onclick=\"cambiarEstadoTitulo('"+ data.codtramite +"','"+ data.EstadoTitulo +"');\" style=\"background-color: #3b82f6\">" + data.EstadoTitulo + "</span>"
                    } else if (data.EstadoTitulo == "REGISTRADO"){
                        return "<span class=\"badge badge-pill badge-primary\" onclick=\"cambiarEstadoTitulo('"+ data.codtramite +"','"+ data.EstadoTitulo +"');\" style=\"background-color: #22c55e\">" + data.EstadoTitulo + "</span>"
                    }else{
                        return "<span class=\"badge badge-pill badge-primary\" onclick=\"cambiarEstadoTitulo('"+ data.codtramite +"','"+ data.EstadoTitulo +"');\" style=\"background-color: #198754\">" + data.EstadoTitulo + "</span>"
                    }
                }
            },
            {
                data: null,
                render: function(data){       
                    if(mostrar){
                        return   `   
                        <div style="display: flex; text-align: center; justify-content: center;">
                        
                            <form method='post' target="_blank">
                                <input type="hidden" name="codigo" value="${data.codtramite}"></input>   
                                <button class='btn boton-tabla boton-azul' type='submit' title='Descargar Solicitud'><span class='icon-download3'></span></button>
                            </form>&nbsp;&nbsp;&nbsp;&nbsp;
                            <form method='post' target="_blank">
                                <input type="hidden" name="codigo" value="${data.codtramite}"></input>
                                <input type="hidden" name="formatoAntiguo" value="${data.codtramite}"></input>   
                                <button class='btn boton-tabla boton-verde' type='submit' title='Descargar Solicitud'><span class='icon-download3'></span></button>
                            </form>&nbsp;&nbsp;&nbsp;&nbsp;
                            <div>
                                <button class='btn boton-tabla boton-naranja' type='button' codigo="${data.codtramite}" onclick='editarSolicitud(this)' title='Editar Solicitud'><span class='icon-pencil2'></span></button>
                            </div>&nbsp;&nbsp;&nbsp;&nbsp;
                            <div>
                                <button class='btn boton-tabla boton-rojo' type='button' codigo="${data.codtramite}" onclick='eliminarSolicitud(this)' title='Eliminar Solicitud'><span class='icon-bin'></span></button>
                            </div>
                        </div>`;
                    }else{
                        return   `   
                        <div style="display: flex; text-align: center; justify-content: center;">                    
                            <div>
                                <button class='btn boton-tabla boton-naranja' type='button' codigo="${data.codtramite}" onclick='editarSolicitud(this)' title='Editar Solicitud'><span class='icon-pencil2'></span></button>
                            </div>&nbsp;&nbsp;&nbsp;&nbsp;
                            <div>
                                <button class='btn boton-tabla boton-rojo' type='button' codigo="${data.codtramite}" onclick='eliminarSolicitud(this)' title='Eliminar Solicitud'><span class='icon-bin'></span></button>
                            </div>
                        </div>`;
                    }
                

                
                        
                                        
                }
            },
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

function editarSolicitud(btn) {
    const codigo = $(btn).attr("codigo").trim();
    $.ajax({
        url: path + "titulacion/solicitudTitulacion",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "validar",
            tipo: 2,
            ruta: "titulacion/solicitudTitulacion"  
        },
        success: function(response) {
            /* console.log(response) */
            if (response.respuesta === "success" && response.validarUsuario === "SI") {
                $.ajax({
                    url: path + "titulacion/solicitudTitulacion",
                    dataType: "JSON",
                    type: 'POST',
                    data: {
                        opcion: "editar",
                        cod_alumno: codigo
                    },
                    success: function(data) {
                        /* console.log(data); */
                        if (data.respuesta === "success") {
                            const info = data.data[0];
                            $('#codigoRTramiteE').val(info[0].codtramite);
                            const fechaTramite = info[0].Fecha.split(' ')[0];
                            $('#fechaTramiteE').val(fechaTramite);
                            $('#turnoE').val(info[0].CodTurno);
                            $('#modalidadE').val(info[0].TipoTram);
                            $('#alumno').val(info[0].CodAlumno + " - " + info[0].Alumno.trim() + " (" + info[0].Especialidad.trim() + ")");
                            $('#alumno').next('i').removeClass('glyphicon-remove').addClass('glyphicon-ok');
                            $('#alumno').parent().removeClass('has-error').addClass('has-success');
                            $('#institutoE').val(info[0].codlocal + " - " + info[0].DescripcionLocal.trim());
                            $('#tipoEspecialidadE').val(info[0].TipoEspe);
                            $('#especialidadE').val(info[0].CodEspe + " - " + info[0].Especialidad.trim());
                            $('#semestres1').val(info[0].Semestre);
                            $('#semestres2').val(info[1].Semestre);
                            $('#semestres3').val(info[2].Semestre);
                            $('#semestres4').val(info[3].Semestre);
                            $('#semestres5').val(info[4].Semestre);
                            $('#semestres6').val(info[5].Semestre);

                            $("#estadoRegistrar_editar").val(info[0].EstadoTitulo);
                            if(info[0].EstadoTitulo == "ENTREGADO"){
                                $('#seccion_fechaEntrega_editar').show()
                                $("#fechaEntrega_editar").val(info[0].fechaEntrega);
                            }else{
                                $('#seccion_fechaEntrega_editar').hide()
                                $("#fechaEntrega_editar").val(null);
                            }
                            
                            $('#modalEditar').modal('show');
                        } else {
                            console.error("Error: " + data.error);
                        }
                    }
                });
            } else {
                Notiflix.Report.Warning("AVISO","No tienes permiso para realizar esta acción.", "Aceptar");;
            }
        },
        error: function() {
            Notiflix.Report.Failure("ERROR","Ocurrió un error al validar los permisos. Por favor, intenta de nuevo.", "Cerrar");
        }
    });
}

function autompleteAlumnoEditar() {
    $("#alumno").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "titulacion/solicitudTitulacion",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function (data) {
                    $("#institutoE").val("");
                    $("#especialidadE").val(""); 
                    $("#tipoEspeE").val(""); 
                    $("#alumno").attr("codigo","");

                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');
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
                $("#institutoE").val(ui.item.Cod_local + " - " + ui.item.Local.trim());   
                $("#especialidadE").val(ui.item.Cod_espe + " - " + ui.item.Especialidad.trim());       
                $("#tipoEspeE").val(ui.item.Tipo_espe); 
                $("#alumno").attr("codigo", ui.item.cod_alumno.trim());                

                $("#alumno").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');    

                cargarSemestres2(ui.item.cod_alumno.trim());
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
    $("#alumno").focus();
}
function cargarSemestres2(codigo){

    $.ajax({
        url: path + "titulacion/solicitudTitulacion",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "cargarSemestres",
            codigo: codigo
        },        
        success: function (data) {

            if (data.respuesta === "success") {

                /* console.log(data); */
                        
                data.data.forEach( (el,key) => {
        
                    $( "#semestres"+(key+1) ).val(el.Semestre.trim());

                });
                    
            }             

        }
    });

}

$("#formularioEditar").submit(function(e){
    e.preventDefault("");

    let data = $(this).serializeArray();
    const codigoCompleto = $("#alumno").val();
    const codigo = codigoCompleto.split(' ')[0];
    data.push({ name: "opcion", value: "actualizar" });
    data.push({ name: "codigoAlumno", value: codigo })    
    /* console.log(data) */

    if (data[12].value === "" || data[3].value === "" || data[4].value === "" ){
        Notiflix.Notify.Warning("POR FAVOR SELECCIONE UN ALUMNO.");
        return;
    }

    $.ajax({
        url: path + "titulacion/solicitudTitulacion",
        dataType: "JSON",
        type: 'POST',
        data: $.param(data),
        beforeSend: function (){

        },
        complete: function () {

        },
        success: function (data) {
            
            if(data.respuesta === "success"){

                $("#modalEditar").modal("hide");

                Notiflix.Notify.Success("OPERACIÓN EXITOSA");
                cargarDataAlumno()
            }else{
                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, PORFAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO");
            }

        }
    });

})

function eliminarSolicitud(btn){

    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de eliminar el registro seleccionado?',
        'Si',
        'No',
        function () {           

            const codigo = $(btn).attr("codigo").trim();            
            $.ajax({
                url: path + "titulacion/solicitudTitulacion",
                dataType: "JSON",
                type: 'POST',
                data: {
                    opcion: "eliminar",
                    codigo: codigo
                },
                success: function (data) {

                    if (data.respuesta === "success") {
                        
                        Notiflix.Notify.Success("LA INFORMACIÓN SE ELIMINO CON ÉXITO.");                        
                        cargarDataAlumno()
                    }else{

                        Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR VUELVA A INTENTARLO.");

                    }

                }
            });

        }
        , function () {            
        }
    );
    
}

function cargarCodigoTramite() {
    $.ajax({
        url: path + "titulacion/solicitudTitulacion",
        dataType: "JSON",
        type: 'POST',
        data: {            
            opcion: 'cargarCodigoTramite'
        },
        complete: function(){
            $("#modalAgregar").modal({ backdrop: 'static', keyboard: false });    
        },
        success: function (data) {            
            const correlativo = data.data.length === 0 ? 0 : data.data[0].codigo;
            $("#codigoRTramiteM").val( Number(correlativo) + 1 );

        }
    });
}

function cargarSemestres(codigo){

    $.ajax({
        url: path + "titulacion/solicitudTitulacion",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "cargarSemestres",
            codigo: codigo
        },        
        success: function (data) {

            if (data.respuesta === "success") {

                /* console.log(data); */
                        
                data.data.forEach( (el,key) => {
        
                    $( "#semestre"+(key+1) ).val(el.Semestre.trim());

                });
                    
            }             

        }
    });

}

$("#btnRecargar").click(function(){
    
    if ($("#usuarios").attr("codigo") !== ""){
                
        cargarDataAlumno( $("#usuarios").attr("codigo") );

    }

})

function reporteTramites() {
    const cod_alumno = $("#inputBuscar").val();
    const local = $("#institucion2").val();
    const tipo_espe = $("#tipoEspecialidad2").val();
    const especialidad = $("#especialidad_lista").val();

    const fecha_1 = $("#fecha_1").val();
    const fecha_2 = $("#fecha_2").val();

    const tipo = $('#tipo').val()
    const estado = $("#estadoFiltro").val();

    $.ajax({
        url: path + "titulacion/solicitudTitulacion",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "exportarReporteTramites",
            cod_alumno: cod_alumno,
            local_lista: local,
            tipo_lista: tipo_espe,
            especialidad: especialidad,
            fecha_1: fecha_1,
            fecha_2: fecha_2,
            tipo: tipo,
            estado: estado,
        },
        beforeSend: function () {
            $('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            $("#modalLoader").modal();
            $("body").css({ "padding": 0 });
        },
        complete: function () {
            $("#modalLoader").modal("hide");
        },
        success: function (response) {
            console.log(response);

            if (response.respuesta === "success") {

                $("#modalVistaPreviaCertificado").modal("show")
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                let pdf = '<iframe src="' + response.reporte + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html(pdf);

            } else {

                $('#modalVistaPreviaCertificado .modal-body #divIframeCertificado').html("");
                Notiflix.Notify.Failure("No hay datos la fecha seleccionada");

            }
        },
    })
}

$("#guardarEstado").click(function () {


    // Notiflix.Confirm.Show(
    //     'Confirmación',
    //     '¿Desea guardar los cambios?',
    //     'Si',
    //     'No',
    //     function () {           

            const estado = $('#cambiarEstadoTitulo').val()   
            const correlativo = $('#correlativo').val()            
            $.ajax({
                url: path + "titulacion/solicitudTitulacion",
                dataType: "JSON",
                type: 'POST',
                data: {
                    opcion: "updateEstado",
                    estado: estado,
                    correlativo: correlativo

                },
                success: function (data) {

                    if (data.respuesta === "success") {
                        
                        Notiflix.Notify.Success("Cambio de estado con exito.");      
                        $("#modalCambiarEstado").modal('hide');                    
                        cargarDataAlumno()
                    }else{

                        Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR VUELVA A INTENTARLO.");

                    }

                }
            });

        // }
        // , function () {            
        // }
    //);
    
})