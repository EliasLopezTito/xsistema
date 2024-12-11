var id_lista = 1;
var id_lista_editar = 1;

$(document).ready(function () {

    results = []
    allDetalles = []
    listaFinal = []

    temporal = []

    Notiflix.Loading.Init({
        clickToClose: true
    });

    cargarInstituciones(true);

    //$('#articulo').focus();
    $("#articulo").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "administracion/requerimientos",
                dataType: "json",
                data: {
                    term: request.term,
                    codGrupo: ($('#categoria').val()).toString(),
                    opcion: 'buscarArticulo'
                },
                success: function(data){
                    $("#alumno").removeAttr("data-code");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');

                    response(data.alumnos);
                }
            });
        },
        minLength: 1,
        select: function(event, ui){
            $("#articulo").next('i').removeClass('glyphicon-remove');
            $("#articulo").next('i').addClass('glyphicon-ok');
            $("#articulo").parent().removeClass('has-error');
            $("#articulo").parent().addClass('has-success');

            var cod_articulo = ui.item.Codigo.trim()
            var descripcion = ui.item.Descripcion.trim();
            var CodArt = ui.item.CodArt;
            var unidad = ui.item.DescripCorta.trim();
            var tabla = "#tablaListado tbody";
            agregarArticulo(tabla, CodArt, cod_articulo, descripcion, unidad);

            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li>" )
            .append("<div>" + item.Codigo + " - " + item.DescripCorta + " - " + item.Descripcion + "</div>" )
            .appendTo( ul );
    };


    $("#articulo_editar").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "administracion/requerimientos",
                dataType: "json",
                data: {
                    term: request.term,
                    codGrupo: ($('#categoria').val()).toString(),
                    opcion: 'buscarArticulo'
                },
                success: function (data) {
                    $("#alumno").removeAttr("data-code");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');

                    response(data.alumnos);
                }
            });
        },
        minLength: 3,
        select: function (event, ui) {
            $("#articulo_editar").next('i').removeClass('glyphicon-remove');
            $("#articulo_editar").next('i').addClass('glyphicon-ok');
            $("#articulo_editar").parent().removeClass('has-error');
            $("#articulo_editar").parent().addClass('has-success');

            var cod_articulo = ui.item.Codigo.trim()
            var descripcion = ui.item.Descripcion.trim();
            var CodArt = ui.item.CodArt;
            var unidad = ui.item.DescripCorta.trim();
            var cantidad = "1";
            var id_detalle = "";
            var observa = "";
 
            agregarArticulo_editar(CodArt, cod_articulo, descripcion, unidad, cantidad, id_detalle, observa)

            return false;
        }
    })
    .autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.Codigo + " - " + item.DescripCorta + " - " + item.Descripcion + "</div>")
            .appendTo(ul);
    };
    
});

function agregarArticulo(tabla, CodArt, cod, articulo, unidad) {

    html = '<tr id="id-' + id_lista + '">';
    html += '<td class="text-center">' + '<input type="text" autocomplete="OFF" min="1" class="cantidades" name="cantidades[]" value="1" id="cant_' + id_lista + '" min="1"  style="width:50px;height:25px;text-align: center;padding: 0;"></td>';
    html += '<td class="celda-centrada">' + unidad + '</td>';
    html += '<td>' + "<input type='hidden' class='idArticulos' name='idArticulos[]' id='idArticulos[]' value='" + CodArt + "'>" + cod + ' - ' + articulo + '</td>';
    html += '<td class="text-center"><input type="text" id="detalle_observaciones[]" name="detalle_observaciones[]" class="form-control"/></td>';
    html += '<td class="text-center"><button style="width:50px;height:25px;text-align: center;padding: 0;" class="btn-danger btn-remove-producto fa fa-times f-lg"></button></td>';
    html += '</tr>';

    $(tabla).append(html);
    $('#anydates').hide();

    $("#articulo").val(null);

    id_lista++;
}

function agregarJefeArticulo(td) {

    $("#modalNuevaSolicitud").modal({
        backdrop: 'static',
        keyboard: false
    });

    planilla = td.map(e =>
        id = e.getAttribute('id') 
    )
    results = planilla;

    DataDetalles()
}

function DataDetalles(){
    if (results.length){
        op = results[0]
        $.ajax({
            url: path + "Administracion/pendientesRequerimientos",
            type: "POST",
            data: {
                op: op,
                opcion: 'opcionDetalleReq'
            },
            beforeSend: function () {
                $(".text-loader").html("Guardando informacion...");
                $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
                $("body").css({ "padding": 0 });
            },
            success: function (data) {
                data = JSON.parse(data);
                dat = data.dataDetalleCabeza
                for (let i = 0; i < dat.length; i++) {
                    allDetalles.push(dat[i]);                
                }
                results.shift();
                DataDetalles() 
            }
        })
    }else{
        listaFinal.push(sumaCantidadArticulo(allDetalles))
        mostrarJefeTotalArticulos(listaFinal)
        console.log("allDetalles", allDetalles);
        console.log("LISTA FINAL 2", listaFinal);
        allDetalles = []
        listaFinal = []
        
    }
}

function sumaCantidadArticulo(duplicados) {
    const dataSumaCantidadArticulo = duplicados.reduce((acumulador, valorActual) => {
        const elementoYaExiste = acumulador.find(elemento => elemento.CodArt === valorActual.CodArt);
        if (elementoYaExiste) {
            return acumulador.map((elemento) => {
                if (elemento.CodArt === valorActual.CodArt) {
                    return {
                        ...elemento,
                        Cantidad: Number(elemento.Cantidad) + Number(valorActual.Cantidad)
                    }
                }
                return elemento;
            });
        }

        return [...acumulador, valorActual];
    }, []);

    return dataSumaCantidadArticulo
}

function mostrarJefeTotalArticulos(listaFinal) {
    $('#tablaListadoJefe tbody').html("");
    $("#modalLoader").modal("hide");
    $("#modalConsolidar").modal("hide");

    plantilla = listaFinal[0].map(e => 
            `<tr>
                <td class="text-center"><input type="hidden" value="${e.Op}" name="articuloOp[]"><input type="hidden" value="${e.Cantidad}" name="cantidades[]">${e.Cantidad}</td>
                <td class="text-center">${e.UM}</td>
                <td class="text-center"><input type='hidden' class='idArticulos' name='idArticulos[]' id='idArticulos[]' value="${e.CodArt}">${e.Codigo}" - "${e.Descripcion}</td>
                <td class="text-center"><input type="hidden" name="detalle_observaciones[]" value="${e.Observacion}"/>${e.Observacion}</td>
            </tr>`
    )

    $('#tablaListadoJefe tbody').append(plantilla);
    $('#anydates').hide();

    $("#articulo").val(null);

}

document.addEventListener('click', (e) => {
    if (e.target.matches('#btnVerModalNuevo')) {
        $('#tituloModal').html('REGISTRAR REQUERIMIENTO');
        $("#btn_modal").addClass("btn-info").removeClass("btn-success")
        $('#btn_modal').html('REGISTRAR');
        $('#seccion_cato').show();
        $('#listaNormal').show();
        $('#listaJefe').hide();
        $('#tablaListadoJefe tbody').html("");
        $('#tablaListado tbody').html("");
        $("#modalNuevaSolicitud").modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    if (e.target.matches('#btnModalConsolidado')) {
        $('#tituloModal').html('APROBAR JEFE REQUERIMIENTO');
        $("#btn_modal").addClass("btn-success").removeClass("btn-info")
        $('#btn_modal').html('APROBAR');
        $('#seccion_cato').hide();
        $('#listaNormal').hide();
        $('#listaJefe').show();
        $('#tablaListadoJefe tbody').html("");
        $('#tablaListado tbody').html("");
        
        let valoresCheck = [];

        $("input[type=checkbox]:checked").each(function () {
            valoresCheck.push(this);
        });


        if (valoresCheck.length == 0) {
            Notiflix.Notify.Warning('DEBE SELECCIONAR ALGUN REQUERIMIENTO');
            return;
        }
        agregarJefeArticulo(valoresCheck);
    }

    if (e.target.matches("#btnBuscar")) {
        mostrarData();
    }

    if (e.target.matches('#btnCancelar')) {
        $("#modalEditarOficio").modal('hide');
        $("#alumno_edit").next('i').removeClass('glyphicon-remove');
        $("#alumno_edit").parent().removeClass('has-error');
    }

    if (e.target.matches('#selectAll')) {
        $(".column input[type=checkbox]").trigger('click');
    }

    // if (e.target.matches('#btnModalConsolidado')) {
    //     let valoresCheck = [];

    //     $("input[type=checkbox]:checked").each(function () {
    //         valoresCheck.push(this);
    //     });


    //     if (valoresCheck.length == 0){
    //         Notiflix.Notify.Warning('DEBE SELECCIONAR ALGUN REQUERIMIENTO');
    //         return;
    //     }

    //     console.log("arrayValores",valoresCheck);

    //     verConsolidado(valoresCheck);
    // }

});


$('#form-aprobarReq').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "aprobarReq" });
    console.log("data", form)

    $.ajax({
        url: path + "Administracion/requerimientos",
        type: "POST",
        data: form,
        beforeSend: function () {
            $(".text-loader").html("Guardando informacion...");
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("body").css({ "padding": 0 });
        },
        success: function (data) {
            $("#modalLoader").modal("hide");
            $("#modalConsolidar").modal("hide");
            
            Notiflix.Notify.Success('FUE APROBADO CON EXITO');
            
        }
    });

})


$('.form-requerimiento').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "registrar" });
    console.log("data", form)

    $.ajax({
        url: path + "Administracion/requerimientos",
        type: "POST",
        data: form,
        beforeSend: function(){
            $(".text-loader").html("Guardando informacion...");
            $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("body").css({ "padding": 0 });
        },
        success: function(data){
            $("#modalLoader").modal("hide");

            let datos = JSON.parse(data);
            if (datos.respuesta === 'success') {   
                $("#modalNuevaSolicitud").modal("hide");
                $("#modalEditarSolicitud").modal("hide");
                results = []
                //document.getElementsByClassName("form-requerimiento").reset();
                limpiarTabla();
                if(temporal.length !== 0){
                    temporal.forEach(element => {
                        eliminarArticulo(element)
                    });
                    temporal = [];
                    console.log("SE ELIMINARON LOS DETALLES ", temporal);
                }
                
                listaReq.ajax.reload(null, false);
                Notiflix.Notify.Success('Registrado correctamente');
            } else{
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });

})

function limpiarTabla(){
    tabla = '<tr>'
                + '<td class="text-center text-primary" colspan="5" id="anydates" >'
                + 'agregue un articulo'
                + '</td>'
            + '</tr>';
    $("#tablaListado tbody").html(tabla);
}


$(document).on("click", ".btn-remove-producto", function () {
    $(this).closest("tr").remove();
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

function mostrarData()
{
    const cod_area_inicio = $("#cod_area_inicio").val();
    const fecha_1 = $("#fecha_1").val();
    const fecha_2 = $("#fecha_2").val();

    listaReq = $("#listaReq").DataTable({
        destroy: 'true',
        searching: true,
        processing: false,
        responsive: true,
        ordering:  false,
        lengthMenu: [
            [50, 100, -1], 
            [50, 100, 'TODO']
        ],
        ajax: {
            url: path + "Administracion/requerimientos",
            type: "POST",
            data: {
                cod_area_inicio: cod_area_inicio,
                fecha_1: fecha_1,
                fecha_2: fecha_2,
                opcion: 'listarReque'
            },
            dataSrc: function(data){
                if ($('#jefatura').val() == "1") {
                    $('#btnModalConsolidado').show();
                } else {
                    $('#btnModalConsolidado').hide();
                }   
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
                    return data.Solicitante;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Transaccion;
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
                    return data.Observaciones;
                }
            },
            {
                data: null,
                render: function (data) {
                    if (data.Estado == "Pendiente") {
                        return "<span class=\"badge badge-pill badge-primary\" style=\"background-color: #dc3545\">" + data.Estado + "</span>"
                    } else if (data.Estado == "Atendiendo"){
                        return "<span class=\"badge badge-pill badge-primary\" style=\"background-color: blue\">" + data.Estado + "</span>"
                    } else if (data.Estado == "Enviado"){
                        return "<span class=\"badge badge-pill badge-primary\" style=\"background-color: #ffc107\">" + data.Estado + "</span>"
                    }else{
                        return "<span class=\"badge badge-pill badge-primary\" style=\"background-color: #198754\">" + data.Estado + "</span>"
                    }
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Usuario;
                }
            },
            {
                data: null,
                render: function (data) {

                    if($('#jefatura').val() == "1" && data.Estado == "Pendiente"){
                        return "<button class=\"btn boton-tabla btn-primary\" type=\"button\" onclick=\"verReque('" + data.Op + "',this);\" title=\"Ver solicitud\"><span class=\"icon-eye\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                            "<input type=\"checkbox\" id="+data.Op+" class=\"btn mipanel-btn-img-texto marcarCabeza\">";
                    }else{
                        return "<button class=\"btn boton-tabla btn-primary\" type=\"button\" onclick=\"verReque('" + data.Op + "',this);\" title=\"Ver solicitud\"><span class=\"icon-eye\"></span></button>&nbsp;&nbsp;&nbsp;" + 
                            "<button class=\"btn boton-tabla boton-azul\" type=\"button\" onclick=\"descargarSolicitudPDF('" + data.Op + "')\"><span class=\"icon-download\"></span></button>";
                    }
                    
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

function verReque(opa, btn) {

    $("#modalEditarSolicitud").modal({
        backdrop: 'static',
        keyboard: false
    });

    const op = opa
    const area = $(btn).parent().parent().find("td").eq(1).html();

    $.ajax({
        url: path + "Administracion/pendientesRequerimientos",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "opcionDetalleReq",
            op: op
        },
        beforeSend: function () {
            //$('.text-loader').text('GENERANDO CERTIFICADO, PORFAVOR ESPERE...');
            //$("#modalLoader").modal();
            $("#tablaListadoDetallesReq tbody").html("");
        },
        complete: function () {
            //$("#modalLoader").modal("hide");
        },
        success: function (response) {
            console.log("dataiuta", response);
            if (response.respuesta === "success") {
                datax = response.dataDetalleCabeza;

                $('#modal_op').val(datax[0].Op.trim())

                datax.forEach(element => {
                    var CodArt = element.CodArt
                    var cod_articulo = element.Codigo.trim();
                    var descripcion = element.Descripcion.trim();
                    var unidad = element.UM.trim();

                    var observa = element.Observacion.trim();
                    var id_detalle = element.ID.trim();
                    var cantidad = element.Cantidad.trim();

                    agregarArticulo_editar(CodArt, cod_articulo, descripcion, unidad, cantidad, id_detalle, observa);

                });


            } else {

                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado", "Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }
        },
    })

}

function agregarArticulo_editar(CodArt, cod_articulo, descripcion, unidad, cantidad, id_detalle, observa) {
    
    html = '<tr id="id-' + id_lista_editar + '">';
    html += '<td class="text-center">' + '<input type="text" autocomplete="OFF" min="1" class="cantidades" name="cantidades[]" value="' + cantidad + '" id="cant_' + id_lista_editar + '" min="1"  style="width:50px;height:25px;text-align: center;padding: 0;"></td>';
    html += '<td class="celda-centrada">' + "<input type='hidden' class='idDetalle' name='idDetalle[]' id='idDetalle_"+ id_lista_editar +"' value='" + id_detalle + "'>" + unidad + '</td>';
    html += '<td>' + "<input type='hidden' class='idArticulos' name='idArticulos[]' id='idArticulos[]' value='" + CodArt + "'>" + cod_articulo + ' - ' + descripcion + '</td>';
    html += '<td class="text-center"><input type="text" id="detalle_observaciones[]" name="detalle_observaciones[]" value="' + observa + '" class="form-control"/></td>';
    html += '<td class="text-center"><button onClick="tempDelete(' + id_lista_editar + ',' + id_detalle  +')" style="width:50px;height:25px;text-align: center;padding: 0;" class="btn-danger btn-remove-producto fa fa-times f-lg"></button></td>';
    html += '</tr>';

    $("#tablaListadoDetallesReq tbody").append(html);
    $('#anydates').hide();

    $("#articulo_editar").val(null);

    id_lista_editar++;
}

function tempDelete(key, id_detalle){

    temporal.push(id_detalle)
    console.log("temporal", temporal);

    
}

function eliminarArticulo(cod_temporal){
    $.ajax({
        url: path + "Administracion/requerimientos",
        type: "POST",
        data: {
            cod_temporal: cod_temporal,
            opcion: 'eliminarArticulo'},
        beforeSend: function () {
            
        },
        success: function (data) {
            let datos = JSON.parse(data);
            if (datos.respuesta === 'success') {

            } else {
                Notiflix.Notify.Failure('Ocurrió un error al registrar, recargue la pagina');
            }
        }
    });
}

function descargarSolicitudPDF(Op){
    //const op = $(btn).attr("codigo");
    $.ajax({
        url: path + "Administracion/requerimientos",
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

function verConsolidado(td){

    $('#tablaConsolidar tbody').html("");
    $("#modalConsolidar").modal({
        backdrop: 'static',
        keyboard: false
    });

    planilla = td.map(e =>
        `<tr>
            <td class="text-center"><input type="hidden" value="${$(e).parents("tr").find("td").eq(0).html()}" name="articuloOp[]">${$(e).parents("tr").find("td").eq(0).html()}</td>
            <td class="text-center">${$(e).parents("tr").find("td").eq(1).html()}</td>
            <td class="text-center">${$(e).parents("tr").find("td").eq(2).html()}</td>
            <td class="text-center">${$(e).parents("tr").find("td").eq(3).html()}</td>
            <td class="text-center">${$(e).parents("tr").find("td").eq(4).html()}</td>
            <td class="text-center">${$(e).parents("tr").find("td").eq(5).html()}</td>
        </tr>`
    )

    $('#tablaConsolidar tbody').append(planilla);
}