$(document).ready(function(){

    autocompleteDocentes();
    $("#docentes").focus();

})

$("#docentes").keyup(function(){
    if( $(this).val().length < 1 ){
        $("#docentes").attr("codigo", "");
        $("#docentes").next('i').removeClass('glyphicon-ok');
        $("#docentes").next('i').addClass('glyphicon-remove');
        $("#docentes").parent().removeClass('has-success');
        $("#docentes").parent().addClass('has-error');
    }
})

$("#contrato").change(function () {
    let archivo = $(this)[0].files[0];
    if (archivo["type"] === "application/pdf") {
        Notiflix.Notify.Success('DOCUMENTO PDF ACEPTADO');
    } else {
        $(this).val(null);
        Notiflix.Report.Warning('AVISO', "EL ARCHIVO DEBE DE SER UN DOCUMENTO PDF", "Cerrar");
    }
})

$("#formGenerarContratos").on("submit", function (e) {
    
    e.preventDefault();
    let form = document.getElementById('formGenerarContratos');
    let data = new FormData(form);    
    data.append("opcion", "subirFormatoContrato");  
    
    Notiflix.Confirm.Show(        
        'CONFIRMACIÓN',        
        '¿ESTÁ SEGURO DE REGISTRAR EL FORMATO DE CONTRATO PARA LOS DOCENTES SELECCIONADOS?',
        'SI',
        'NO',        
        function () {

            $.ajax({
                url: path + "planilla/generarContratosDocentes",
                type: "POST",
                dataType: "JSON",
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    $('.text-loader').text('PROCESANDO, POR FAVOR ESPERA...');
                    $("#modalLoader").modal({ backdrop: 'static', keyboard: false });
                },
                complete: function () {
                    $("#modalLoader").modal("hide");
                },
                success: function (response) {

                    if (response.respuesta === "success") {

                        //$("#tablaDocentesSeleccionados tbody").html("");
                        $("#contrato").val(null);
                        //$("#btnRegistrarContrato").prop("disabled", true);                                                
                        Notiflix.Report.Success('PROCESO COMPLETADO', "EL CONTRATO SE REGISTRO CON ÉXITO." , "Cerrar");
                        cargarContratosDocente( $("#docentes").attr("codigo") );

                    } else if (response.respuesta === "warning") {

                        Notiflix.Notify.Warning(response.error, { timeout: 10000 });

                    } else {

                        Notiflix.Notify.Failure('OCURRIO UN ERROR INESPERADO.' + response.error, { timeout: 10000 });

                    }

                }
            })

        }
        ,function (){            
        },
        {
            messageMaxLength: 400,
            width: "400px",
            plainText: false
        },
    );
    
})

function autocompleteDocentes(){

    $("#docentes").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "programacion/datosDocente",
                dataType: "json",
                method: "post",
                data: {
                    docente: request.term,
                    opcion: 'buscarDocente'
                },
                success: function (data) {

                    $("#docentes").attr("codigo","");
                    $("#docentes").next('i').removeClass('glyphicon-ok');
                    $("#docentes").next('i').addClass('glyphicon-remove');
                    $("#docentes").parent().removeClass('has-success');
                    $("#docentes").parent().addClass('has-error'); 

                    $("#btnRegistrarContrato").prop("disabled",true);
                    $("#contrato").val(null);
                    $("#tablaDocentesSeleccionados tbody").html("");
                    $("#tablaListadoContratos tbody").html("");

                    let result = (!data.docentes) ? [{ vacio: true }] : data.docentes;
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {
                $("#docentes").attr("codigo", ui.item.cod_emp.trim() );
                $("#docentes").val(ui.item.cod_emp+" - "+ui.item.nombre);
                $("#docentes").next('i').removeClass('glyphicon-remove');
                $("#docentes").next('i').addClass('glyphicon-ok');
                $("#docentes").parent().removeClass('has-error');
                $("#docentes").parent().addClass('has-success');
                cargarInformacionDocente( ui.item.cod_emp.trim() , ui.item.nombre.trim() );
                cargarContratosDocente(ui.item.cod_emp.trim());
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
            .append("<div><b>" + item.cod_emp.trim() +"</b> - "+item.nombre+"</div>")
            .appendTo(ul);
    };   

}

function cargarInformacionDocente(codigo,nombre){    
    const cantidadTr = $("#tablaDocentesSeleccionados tbody tr").length;    
    if(cantidadTr === 0){        
        const plantilla = `<tr>
                    <td class="text-center">${cantidadTr + 1}</td>
                    <td class="text-center">
                        <input name="codigos[]" type="hidden" value="${codigo}" ></input>
                        ${codigo}
                    </td>
                    <td class="text-center">${nombre}</td>
                    <td class="text-center">                        
                    </td>                
                </tr>`;
        /**<button class="btn boton-tabla boton-rojo" type="button" onclick="quitarDocenteSeleccionado(this)"><span class="icon-cross"></span></button>**/
        $("#tablaDocentesSeleccionados tbody").append(plantilla);  
        $("#btnRegistrarContrato").prop("disabled", false);
    }else{
        $("#docentes").attr("codigo", "");
        $("#docentes").val("");
        $("#docentes").next('i').removeClass('glyphicon-ok');
        $("#docentes").next('i').addClass('glyphicon-remove');
        $("#docentes").parent().removeClass('has-success');
        $("#docentes").parent().addClass('has-error');
        Notiflix.Notify.Warning("NO SE PUEDE SELECCIONAR MÁS DE UN DOCENTE");
    }
}

function quitarDocenteSeleccionado(btn){
    
    $(btn).parent().parent('tr').remove();
    const cantidadTr = $("#tablaDocentesSeleccionados tbody tr").length;    
    if(cantidadTr < 1){
        $("#contrato").val(null);
        $("#btnRegistrarContrato").prop("disabled",true);
    }

}

function cargarContratosDocente(codigo) {

    $.ajax({
        url: path + "planilla/generarContratosDocentes",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "cargarContratosPorDocente",
            codigo: codigo
        },            
        beforeSend: function () {
            //$('.text-loader').text('PROCESANDO, POR FAVOR ESPERA...');
            //$("#modalLoader").modal({ backdrop: 'static', keyboard: false });
            $("#tablaListadoContratos tbody").html("");
        },
        complete: function () {
            //$("#modalLoader").modal("hide");
        },
        success: function (response) {

            console.log(response);

            if (response.respuesta === "success") {
            
                response.data.forEach( (val,key) => {
                    
                    const plantilla = `<tr>
                        <td class="text-center">${key + 1}</td>
                        <td class="text-center">${codigo}</td>
                        <td class="text-center">${ $("#docentes").val().split("-")[1].trim() }</td>
                        <td class="text-center">${val.anio}</td> 
                        <td class="text-center">${val.mes}</td>
                        <td class="text-center">
                            <a href="${val.ruta}" download="contrato-enviado-${codigo}-${val.anio}-${val.mes}.pdf" > 
                                ${val.ruta === null ? "" : `<b>contrato-enviado-${codigo}-${val.anio}-${val.mes}.pdf</b>` }
                            </a>
                        </td>
                        <td class="text-center">
                            <a href="${val.rutaRespuesta}" download="contrato-recibido-${codigo}-${val.anio}-${val.mes}.pdf" >
                                ${val.rutaRespuesta === null ? "" : `<b>contrato-recibido-${codigo}-${val.anio}-${val.mes}.pdf</b>`} 
                            </a>
                        </td>
                        <td class="text-center">
                            <span class="badge" style="background:${val.estadoNotificacion ? "green" : "red"}">
                                ${val.estadoNotificacion?"RECIBIDO":"PENDIENTE"}
                            </span>
                        </td>                
                    </tr>`;

                $("#tablaListadoContratos tbody").append(plantilla);

                });

            } else {

                Notiflix.Notify.Failure('OCURRIO UN ERROR INESPERADO.' + response.error, { timeout: 10000 });

            }

        }
    })
            
}