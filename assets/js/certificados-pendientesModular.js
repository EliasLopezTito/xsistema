var id_lista = 1;
var id_lista_editar = 1;

$(document).ready(function () {

    results = []
    allDetalles = []
    listaFinal = []

    importeTotal = 0

    temporal = []

    Notiflix.Loading.Init({
        clickToClose: true
    });

    cargarInstituciones(true);
    
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
        id = e.getAttribute('id'),
    )
    results = planilla;

    DataDetalles()
}

function DataDetalles(){
    if (results.length){
        op = results[0].split("-")[0]
        $('#especialidad').val(results[0].split("-")[2])
        $.ajax({
            url: path + "certificados/pendientesModular",
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
                $('#codigo_alumno').val(dat[0].cod_alumno+ " - " + dat[0].Alumno)                
                for (let i = 0; i < dat.length; i++) {
                    importeTotal += Number(dat[i].Precio);
                    allDetalles.push(dat[i]);                
                }
                results.shift();
                DataDetalles() 
            }
        })
    }else{
        //listaFinal.push(sumaCantidadArticulo(allDetalles))
        $('#importe_completo').val(importeTotal)
        mostrarJefeTotalArticulos(allDetalles)
        console.log("allDetalles", allDetalles);
        //console.log("LISTA FINAL 2", listaFinal);
        allDetalles = []
        listaFinal = []
        importeTotal = 0
        
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

    plantilla = listaFinal.map(e => 
            `<tr>
                <td class="text-center"><input type="hidden" value="${e.Op}" name="detalleOpEf[]"><input type="hidden" value="${e.codmodulo}" name="codmodulo[]">${e.Op}</td>
                <td class="text-center"><input type="date" class="form-control" name="fechaIni[]"/></td>
                <td class="text-center"><input type="date" class="form-control" name="fechaFinal[]"/></td>
                <td class="text-center"><input type='hidden' class='ciclo' name='ciclo[]' id='ciclo[]' value="${e.ciclo}">${e.ciclo}</td>
                <td class="text-center"><input type='hidden' class='horas' name='horas[]' id='horas[]' value="${e.horas}">${e.horas}</td>
                <td class="text-center"><input type='hidden' class='creditos' name='creditos[]' id='creditos[]' value="${e.creditos}">${e.creditos}</td>
                <td class="text-center"><input type='hidden' class='Precio' name='Precio[]' id='Precio[]' value="${e.Precio}">${e.Precio}</td>
            </tr>`
    )

    $('#tablaListadoJefe tbody').append(plantilla);
    $('#anydates').hide();

    $("#articulo").val(null);

}

document.addEventListener('click', (e) => {
    if (e.target.matches('#btnVerModalNuevo')) {
        $('#tituloModal').html('REGISTRAR NUEVO');
        $("#btn_modal").addClass("btn-info").removeClass("btn-success")
        $('#btn_modal').html('REGISTRAR');
        $('#seccion_cato').show();
        $('#listaNormal').show();
        $('#tablaListadoJefe tbody').html("");
        $('#tablaListado tbody').html("");
        $("#modalNuevaSolicitud").modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    if (e.target.matches('#btnModalConsolidado')) {
        $('#tituloModal').html('GENERAR TRAMITE');
        $("#btn_modal").addClass("btn-success").removeClass("btn-info")
        $('#btn_modal').html('REGISTRAR');
        $('#seccion_cato').hide();
        $('#listaNormal').show();
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
        url: path + "certificados/pendientesModular",
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
        url: path + "certificados/pendientesModular",
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
                // if(temporal.length !== 0){
                //     temporal.forEach(element => {
                //         eliminarArticulo(element)
                //     });
                //     temporal = [];
                //     console.log("SE ELIMINARON LOS DETALLES ", temporal);
                // }
                
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
    const alumno = $("#alumno").val();
    const especialidad_lista = $("#especialidad_lista").val();

    listaReq = $("#listaReq").DataTable({
        destroy: 'true',
        searching: true,
        processing: false,
        responsive: true,
        ordering:  false,
        lengthMenu: [
            [15, 50, -1], 
            [15, 50, 'TODO']
        ],
        ajax: {
            url: path + "certificados/pendientesModular",
            type: "POST",
            data: {
                alumno: alumno,
                especialidad_lista: especialidad_lista,
                opcion: 'listarPendientes'
            },
            dataSrc: function(data){
                
                $('#btnModalConsolidado').show();

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
                    return "<input type=\"checkbox\" id="+data.Op+"-"+data.cod_alumno+"-"+data.Cod_espe+"  class=\"btn mipanel-btn-img-texto marcarCabeza\">";                    
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Op;
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
                    return data.codmodulo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Modulo;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.NroOficio;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.creditos;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.dias;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.horas;
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
                    return data.FechaReg;
                }
            }
            // {
            //     data: null,
            //     render: function (data) {
            //             return "<button class=\"btn boton-tabla btn-primary\" disabled type=\"button\" onclick=\"verReque('" + data.Op + "',this);\" title=\"Ver solicitud\"><span class=\"icon-eye\"></span></button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"              
            //     }
            // }
            
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
        url: path + "certificados/pendientesModular",
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
        url: path + "certificados/pendientesModular",
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