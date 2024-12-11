const language = {
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
};

const meses = ["ENERO","FEBRERO","MARZO","ABRIL","MAYO","JUNIO","JULIO","AGOSTO","SEPTIEMBRE","OCTUBRE","NOVIEMBRE","DICIEMBRE"];

$(document).ready(function(){
    
    cargarLiistadoLiquidacion();
    //$("#modalEditarLiquidacion").modal({ backdrop: "static", keyboard: false })

})

$("#empleador").change(function(){
    listadoLiquidacion.destroy();
    cargarLiistadoLiquidacion();
})

$("#anio").change(function(){    
    listadoLiquidacion.destroy();
    cargarLiistadoLiquidacion();
})

function cargarLiistadoLiquidacion(){ 
    
    listadoLiquidacion = $("#tablaListados").DataTable({
        ordering: true,
        dom: 'lBfrtip',
        buttons: [
            { "extend": 'excel', "text": 'Exportar Excel', "className": 'btn_excel_datatable' }
        ],
        ajax: {
            url: path + "planilla/liquidacion",
            type: "POST",
            dataType: "JSON",
            data: {
                opcion: "listadoLiquidacion",
                empleador: $("#empleador").val().trim(),
                anio: $("#anio").val().trim()                
            },
            beforeSend: function () {
                $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
                $("#modalLoader").modal();
            },
            dataSrc: function (dat) {

                if (dat.respuesta === "success") {
                    return dat.res;
                } else {
                    return [];
                }

            },
            complete: function () {
                $("#modalLoader").modal("hide");
                Notiflix.Notify.Success("INFORMACIÓN CARGADA CON ÉXITO.");
            }
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        lengthMenu: [[10, 20, 50, 100, - 1], [10, 20, 50, 100, "Todos"]],
        iDisplayLength: 20,
        columns: [            
            {
                data: null,
                render: function (data) {
                    return data.numliquidacion.trim();
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cod_emp;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.Empleado;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.TipoPago;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.cheque;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.fechaPago;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.totalpagar;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.fecplanilla;
                }
            },
            {
                data: null,
                render: function (data) {
                    return data.feccese;
                }
            },
            {
                data: null,
                render: function (data) {
                    const data_ = JSON.stringify(data);
                    return `
                        <button class='btn boton-tabla boton-naranja' disabled data='${data_}' tipo="pago" type='button' onclick='editarLiquidacion(this)'><span class='icon-price-tag'></span></button>
                        <button class='btn boton-tabla boton-amarillo' disabled data='${data_}' tipo="general" type='button' onclick='editarLiquidacion(this)'><span class='icon-pencil'></span></button>
                        <button class='btn boton-tabla boton-rojo' id_liquidacion='${data.codLiquidacion}' tipo="general" type='button' onclick='eliminarLiquidacion(this)'><span class='icon-bin'></span></button>
                    `;
                }
            }
        ],
        language: language
    });

}

function formatoFechaInput(fecha) {    
    if( fecha !== null && fecha !== "" ){
        return fecha.split('/').reverse().join('-');    
    }else{
        return "";
    }
}

function editarLiquidacion(btn){

    const data = JSON.parse($(btn).attr("data"));
    const tipoEdicion = $(btn).attr("tipo");
    console.log(data);
    if( tipoEdicion === "general" ){    
    
        $("#num_liquidacion_edit").html(data.numliquidacion);
        //INFORMACIÓN BASE        
        $("#fecha_planilla").val( formatoFechaInput(data.fecplanilla) );
        $("#motivo_cese").html( `<option>${data.motivo.trim()}</option>` );
        $("#fecha_cese").val( formatoFechaInput(data.feccese) );
        $("#afp").val( data.afp );
        $("#porcentaje_afp").val( data.porcentajeafp );
        $("#remuneracion").val( data.remuneracion );
        $("#movilidad").val( data.movilidad );
        $("#prom_bono").val( data.promBono );
        $("#horas_extras").val( data.he );
        $("#refrigerio").val( data.refrigerio );
        $("#prom_grati").val( data.promGrati );
        $("#asig_familiar").val( data.asignacion );  
        //total base
        const total_base = (parseFloat(data.remuneracion) + parseFloat(data.promGrati)).toFixed(2);               
        $(".total_base").val( total_base );
        $(".total_base_span").html( total_base )
        const remuneracion = data.remuneracion;
        $(".remuneracion_span").html(remuneracion);

        //CTS
        $("#fecha_inicio_pago_directo_cts").val( formatoFechaInput(data.fecUltimaCTS) );
        $("#mes_cts").val( data.mesCTS );
        $("#monto_mes_cts").val( data.montoMesCTS )
        $("#dias_cts").val( data.diasCTS );
        $("#monto_dias_cts").val( data.montoDiasCTS );  
        const total_cts = (parseFloat(data.montoMesCTS) + parseFloat(data.montoDiasCTS)).toFixed(2);       
        $("#total_cts").val( total_cts ) 

        //VACACIONES
        $("#fin_vacaciones_canceladas").val( formatoFechaInput( data.fecfinvacCanceladas ) );
        $("#anios_pagados_vacaciones").val( data.nroPagadasVAC );
        $("#fin_vacaciones_vencidas").val( formatoFechaInput( data.fecfinvacVencidas) );
        $("#anio_vacaciones").val( data.anio_vac );
        $("#monto_anio_vacaciones").val( data.montoAnioVAC );
        $("#mes_vacaciones").val(data.mesVAC);
        $("#monto_mes_vacaciones").val(data.montoMesVAC);
        $("#dias_vacaciones").val(data.diasVAC);
        $("#monto_dias_vacaciones").val(data.montoDiasVAC);
        const total_vacaciones = ((parseFloat(data.montoAnioVAC) + parseFloat(data.montoMesVAC) + parseFloat(data.montoDiasVAC)) - parseFloat(data.montoDiasVAC)).toFixed(2);

        //GRATIFICACIÓN
        //$("#grati_canceladas_desde").val( formatoFechaInput(data.as) )
        $("#modalEditarLiquidacion").modal({backdrop:"static",keyboard:false})
        //edicionGeneral(data);

    }else{
        edicionPago(data);
    }

}

function edicionGeneral() {
    
    $.ajax({
        url: path + "planilla/liquidacion",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "eliminar",
            id: id
        },
        beforeSend: function () {
            //$(".text-loader").text("Esto puede tardar unos minutos, por favor espere...");
            //$("#modalLoader").modal({ backdrop: 'static', keyboard: false });
        },
        complete: function () {
            //$("#modalLoader").modal("hide");
        },
        success: function (datos) {

            if (datos.respuesta === "success") {

                Notiflix.Notify.Success('LA LIQUIDACIÓN SELECCIONADA SE ACTUALIZO CON ÉXITO.', { timeout: 5000 })
                listadoLiquidacion.ajax.reload(null, false);

            } else {

                Notiflix.Notify.Failure('Ocurrio un error inesperado, por favor recargue la página y vuelva a intentarlo', { timeout: 5000 });

            }

        }
    });

}

function edicionPago(data) {    

}

function eliminarLiquidacion(btn) {
    const id = JSON.parse($(btn).attr("id_liquidacion"));
    Notiflix.Confirm.Show(
        'Advertencia',
        '¿Seguro que desea eliminar la liquidación seleccionada?',
        'Si',
        'No',
        function () {    
            $.ajax({
                url: path + "planilla/liquidacion",
                type: "POST",
                dataType: "JSON",
                data: {
                    opcion: "eliminar",
                    id: id
                },
                beforeSend: function () {
                    //$(".text-loader").text("Esto puede tardar unos minutos, por favor espere...");
                    $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
                },
                complete: function () {
                    //$("#modalLoader").modal("hide");
                },
                success: function (datos) {
                    if (datos.respuesta === "success") {
                        Notiflix.Notify.Success('LA LIQUIDACIÓN SELECCIONADA SE ELIMINO CON ÉXITO.', { timeout: 5000 })
                        listadoLiquidacion.ajax.reload(null, false);
                    } else {
                        Notiflix.Notify.Failure('Ocurrio un error inesperado, por favor recargue la página y vuelva a intentarlo', { timeout: 5000 });
                    }
                }
            });
        },
        function () {
        }
    );
}