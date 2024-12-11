var id_lista = 1;

$(document).ready(function () {

    Notiflix.Loading.Init({
        clickToClose: true
    });
    
    $("#articulo").autocomplete({
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
            $("#articulo").next('i').removeClass('glyphicon-remove');
            $("#articulo").next('i').addClass('glyphicon-ok');
            $("#articulo").parent().removeClass('has-error');
            $("#articulo").parent().addClass('has-success');

            var cod_articulo = ui.item.Codigo.trim()
            var descripcion = ui.item.Descripcion.trim();
            var CodArt = ui.item.CodArt;

            $("#articulo").val(CodArt + " - " + descripcion);
            $("#codigo_Articulo").val(CodArt);

            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, item) {
            return $("<li>")
                .append("<div>" + item.Codigo + " - " + item.Descripcion + "</div>")
                .appendTo(ul);
        };
});

document.addEventListener('click', (e) => {

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

});


$('#form-pendienteRequerimiento').submit(function (e) {
    e.preventDefault();
    var form = $(this).serializeArray();
    form.push({ name: "opcion", value: "registrarDetalleReq" });

    $.ajax({
        url: path + "Administracion/pendientesRequerimientos",
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
                tablaPendientesReq.ajax.reload(null, false);
                $("#modalVerRequerimiento").modal("hide");
                Notiflix.Notify.Success('Guardado correctamente');
            } else{
                Notiflix.Notify.Failure('Ocurrió un error al guardar, recargue la pagina');
            }
        }
    });

})

function mostrarData()
{
    const CodArea = $("#CodArea").val();
    const CodArt = $("#CodArt").val();

    tablaPendientesReq = $("#tablaPendientesReq").DataTable({
        destroy: 'true',
        searching: true,
        processing: false,
        responsive: true,
        ordering:  false,
        dom: 'Bfrtip',
        buttons: [
            { "extend": 'excel', "text":'Exportar Excel',"className": 'btn_excel_datatable'}
        ],
        lengthMenu: [
            [50, 100, -1], 
            [50, 100, 'TODO']
        ],
        ajax: {
            url: path + "Administracion/pendientesRequerimientos",
            type: "POST",
            data: {
                CodArea: CodArea,
                CodArt: CodArt,
                opcion: 'selectPendientesReq'
            },
            dataSrc: function(data){      
                if(data.respuesta == "success"){
                    return data.datex; 
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
                    return data.Fecha;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Solicitante.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Transaccion.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Descripcion.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Pedido;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.CanEntregado;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Observacion;
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
                render: function(data){                    
                    
                    return   "<button class=\"btn boton-tabla boton-naranja\" type=\"button\" onclick=\"opcionRequerimiento('"+data.Op+"',this);\" title=\"opcion\"><span class=\"icon-eye\"></span></button>";
                                        
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

function opcionRequerimiento(opa, btn) {

    $("#modalVerRequerimiento").modal({
        backdrop: 'static',
        keyboard: false
    });

    const op = opa
    const area = $(btn).parent().parent().find("td").eq(1).html();

    $("#tablaListadoDetallesReq").DataTable({
        destroy: 'true',
        searching: false,
        processing: false,
        responsive: true,
        ordering: false,
        // dom: 'Bfrtip',
        // buttons: [
        //     { "extend": 'excel', "text": 'Exportar Excel', "className": 'btn_excel_datatable' }
        // ],
        lengthMenu: [
            [10, 100, -1],
            [10, 100, 'TODO']
        ],
        ajax: {
            url: path + "Administracion/pendientesRequerimientos",
            type: "POST",
            data: {
                op: op,
                opcion: 'opcionDetalleReq'
            },
            dataSrc: function (data) {
                if (data.respuesta == "success") {

                    $('#m_area').val(area)
                    $('#m_fecha').val(data.dataDetalleCabeza[0].Fecha.trim().substring(0, 10))
                    $('#m_serie_numero').val(data.dataDetalleCabeza[0].Serie + " - " + data.dataDetalleCabeza[0].Numero)

                    return data.dataDetalleCabeza;
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
                    return data.Codigo + ' - ' + data.Descripcion.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Cantidad;
                }
            },
            {
                data: null,
                render: function (data) {
                    canEn = data.CanEntregado == null ? '0' : data.CanEntregado;
                    stock = data.Cantidad;
                    faltaEntre = Number(canEn) - Number(stock)
                    id = data.ID

                    if (faltaEntre == "0"){
                        return canEn;
                    }else{
                        return '<input type="number" name="m_cantEntregado[]" id="cant_' + data.ID + '" onkeyup="validarCantidad(' + stock + ',' + id + ')" value="' + canEn + '"><input type="hidden" name="m_id[]" value="' + data.ID + '"><input type="hidden" name="m_op[]" value="' + data.Op + '">';
                    }

                    
                }
            },
            {
                data: null,
                render: function (data) {
                    cant = data.Cantidad
                    cantEntre = data.CanEntregado == null ? '0' : data.CanEntregado;
                    faltaEntre = Number(cant) - Number(cantEntre)
                    return faltaEntre;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Observacion;
                }
            }
        ],
        createdRow: function (row, data, dataIndex) {
            cant = data.Cantidad
            cantEntre = data.CanEntregado == null ? '0' : data.CanEntregado;
            faltaEntre = Number(cant) - Number(cantEntre)
            if (faltaEntre > 0) {
                $(row).css("background-color", "rgb(255 255 38 / 44%)");
            }else{
                $(row).css("background-color", "rgb(48 255 38 / 23%)");
            }
        },
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


function validarCantidad(stock, id){

    valor = $('#cant_'+id).val();
    console.log("valor: ",valor)
    if((stock < valor) || (valor < 0)){
        console.log("SE PASA")
        $('#cant_' + id).val('0');
        Notiflix.Notify.Failure("La cantidad entregada no debe pasar la cantidad pedida")    
    }else{
        console.log("ACEPTADO")    
    }

    
}