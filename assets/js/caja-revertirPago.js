$(function(){
    getPaganteCorregir();
    getBeneficiarioCorregir();

    $('#pagante').focus(function() {
        $('#pagante').select();
    })

    $('#beneficiario').focus(function() {
        $('#beneficiario').select();
    })

})

let meses = {
    '01' : 'ENERO',
    '02' : 'FEBRERO',
    '03' : 'MARZO',
    '04' : 'ABRIL',
    '05' : 'MAYO',
    '06' : 'JUNIO',
    '07' : 'JULIO',
    '08' : 'AGOSTO',
    '09' : 'SEPTIEMBRE',
    '10' : 'OCTUBRE',
    '11' : 'NOVIEMBRE',
    '12' : 'DICIEMBRE',
}

let pago_id = null, cuota_verdadera_id = null, cuota_fallida_id = null;

$( "#btnCorregir" ).click(function() {
    let pagante = $('#pagante'),
        beneficiario = $('#beneficiario');

    if (pagante.attr('data-code')) {

        if (beneficiario.attr('data-code')) {
            Notiflix.Confirm.Show(
                'Confirmación',
                '¿Está seguro que desea reasignar el pago?',
                'Si',
                'No',
                function(){

                    if (pago_id !== null && cuota_verdadera_id !== null && cuota_fallida_id !== null) {
                        reasignarPago();
                    } else{
                        Notiflix.Report.Failure("Advertencia","Por favor seleccione la cuota y el pago a reasignar", "Aceptar");
                    }
                },
                function(){
                    
                }
            );
        } else{
            Notiflix.Notify.Failure('Por favor seleccione un beneficiario');
            beneficiario.focus();
        }

    } else{
        // Notiflix.Report.Failure("Por favor seleccione un pagante", "Aceptar");
        Notiflix.Notify.Failure('Por favor seleccione un pagante');
        pagante.focus();
    }

});

document.addEventListener('click', (e) => {

    if (e.target.matches('#tablaPagante tr td') && e.target.parentNode.classList.contains('active')) {
        let tr = e.target.parentNode;
        marcarFilaPagante(tr);
    }

    if (e.target.matches('#tablaBeneficiario tr td') && e.target.parentNode.classList.contains('active')) {
        let tr = e.target.parentNode;
        marcarFilaBeneficiario(tr);
    }

})

function getPaganteCorregir() {
    $("#pagante").autocomplete({
        
        source: function(request, response){
            $.ajax({
                url: path + "caja/revertirPago",
                method: 'post',
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'getPagante'
                },
                success: function(data){
                    console.log(data);
                    let tabla = $('#tablaPagante');
                    limpiarFilasTabla(tabla);
                    $("#pagante").removeAttr("data-code");
                    $("#pagante").next('i').removeClass('glyphicon-ok');
                    $("#pagante").next('i').addClass('glyphicon-remove');
                    $("#pagante").parent().removeClass('has-success');
                    $("#pagante").parent().addClass('has-error');

                    let result = (data.pagantes.length === 0) ? [{ vacio: true }] : data.pagantes;
                    
                    response(result);

                }
            });
        },
        minLength: 3,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                $("#pagante").val(ui.item.nombre);
                $("#pagante").attr('data-code', ui.item.codigo);
                $("#pagante").next('i').removeClass('glyphicon-remove');
                $("#pagante").next('i').addClass('glyphicon-ok');
                $("#pagante").parent().removeClass('has-error');
                $("#pagante").parent().addClass('has-success');
                selectCuotasPagante(ui.item.codigo);
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
            .append( "<div><b>Usuario: </b>" + item.codigo + "<br><b>Nombre: </b> " +item.nombre + "</div>" )
            .appendTo( ul );
    };
}

function getBeneficiarioCorregir() {

    $("#beneficiario").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "caja/revertirPago",
                method: 'post',
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'getBeneficiario'
                },
                success: function(data){
                    console.log(data);
                    let tabla = $('#tablaBeneficiario');
                    limpiarFilasTabla(tabla);
                    $("#beneficiario").removeAttr("data-code");
                    $("#beneficiario").next('i').removeClass('glyphicon-ok');
                    $("#beneficiario").next('i').addClass('glyphicon-remove');
                    $("#beneficiario").parent().removeClass('has-success');
                    $("#beneficiario").parent().addClass('has-error');
                    // $("#divDesactivarCuota").hide();
                    // $("#divDesactivarCuota").prop('checked', true);

                    let result = (data.beneficiarios.length === 0) ? [{ vacio: true }] : data.beneficiarios;
                    response(result);

                }
            });
        },
        minLength: 3,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                $("#beneficiario").val(ui.item.nombre);
                $("#beneficiario").attr('data-code', ui.item.codigo);
                $("#beneficiario").next('i').removeClass('glyphicon-remove');
                $("#beneficiario").next('i').addClass('glyphicon-ok');
                $("#beneficiario").parent().removeClass('has-error');
                $("#beneficiario").parent().addClass('has-success');
                selectPagosBeneficiario(ui.item.codigo);
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
            .append( "<div><b>Usuario: </b>" + item.codigo + "<br><b>Nombre: </b> " +item.nombre + "</div>" )
            .appendTo( ul );
    };
}

function selectCuotasPagante(cod_alumno) {

    let tbody = $("#tablaPagante tbody");
        tbody.find('tr').remove();

    $.ajax({
        url: path + "caja/revertirPago",
        type: 'POST',
        dataType: 'json',
        data: {
            cod_alumno: cod_alumno,
            opcion: 'selectCuotasPagante'
        },
        success: function(data) {
            console.log(data);
            if (data.respuesta === 'success') {
                if (data.cuotas !== 'vacio') {
                    $.each(data.cuotas, function(i, item) {
        
                        let tr=`<tr class='active' data-cuotaVerdaderaId='${item.idCuota}'>
                                <td class='text-center'>${item.cod_alumno}</td>
                                <td class='text-center'>${meses[item.mes]}</td>
                                <td class='text-center'>${item.anio}</td>
                                <td class='text-center'>S/.${item.monto}.00</td>
                                <td class='text-center'><span class='label label-default fuente'>PENDIENTE</span></td>
                                </tr>`;
                        tbody.append(tr);
                    });
                } else{
                    let tr = "<tr><td class='text-center' colspan='6'>No se encontraron cuotas pendientes del alumno.</td></tr>";
                    tbody.append(tr);
                }
            } else{
                Notiflix.Notify.Failure('Ocurrio un error, por favor vuelva a intentarlo!');
            }

        },
        error: function(e) {
            console.error("No es posible completar la operación");
        },
        complete: function() {

        }
    });
}

function selectPagosBeneficiario(cod_alumno) {

    let tbody = $("#tablaBeneficiario tbody");
        tbody.find('tr').remove();

    $.ajax({
        url: path + "caja/revertirPago",
        type: 'POST',
        dataType: 'json',
        data: {
            cod_alumno: cod_alumno,
            opcion: 'selectPagosBeneficiarios'
        },
        success: function(data) {

            console.log(data);
            if (data.respuesta === 'success') {
                if (data.pagos !== 'vacio') {
                    
                    $.each(data.pagos, function(i, item) {
        
                        let tr=`<tr class='active' data-idPago='${item.id_pago}' data-cuotaFallidaId='${item.id_cuota}'>
                                <td class='text-center'>${item.codigo}</td>
                                <td class='text-center'>${meses[item.mes]}</td>
                                <td class='text-center'>${item.anio}</td>
                                <td class='text-center'>${item.fechaPago}</td>
                                <td class='text-center'>S/.${item.monto}.00</td>
                                <td class='text-center'><span class='label label-success'>PAGADO</span></td>
                                </tr>`;
                        tbody.append(tr);
                    });
                    $('#divDesactivarCuota').show();
                } else{
                    let tr = "<tr><td class='text-center' colspan='6'>No se encontraron pagos del alumno.</td></tr>";
                    tbody.append(tr);
                }
            } else{
                Notiflix.Notify.Failure('Ocurrio un error, por favor vuelva a intentarlo!');
            }

        },
        error: function(e) {
            console.error("No es posible completar la operación");
        },
        complete: function() {

        }
    });
}

function reasignarPago() {

    let desactivarCuota = $('#cbxDesactivarCuota').prop('checked');

    $.ajax({
        url: path + "caja/revertirPago",
        method: "POST",
        dataType: 'json',
        data: {
            pago_id: pago_id,
            cuota_fallida_id: cuota_fallida_id,
            cuota_verdadera_id: cuota_verdadera_id,
            desactivar_cuota: desactivarCuota,
            opcion: "reasignarPago"
        },
        success: function(data){
            if (data.respuesta === 'success') {
                Notiflix.Report.Success("Proceso correcto","El pago fue reasignado correctamente", "Aceptar");

                tabla = $('#tablaPagante');
                limpiarFilasTabla(tabla);
                tabla = $('#tablaBeneficiario');
                limpiarFilasTabla(tabla);

                /* Limpiamos inputs */
                $('#pagante').val('');
                $("#pagante").removeAttr("data-code");
                $("#pagante").next('i').removeClass('glyphicon-ok');
                $("#pagante").next('i').addClass('glyphicon-remove');
                $("#pagante").parent().removeClass('has-success');
                $("#pagante").parent().addClass('has-error');

                $("#beneficiario").val();
                $("#beneficiario").removeAttr("data-code");
                $("#beneficiario").next('i').removeClass('glyphicon-ok');
                $("#beneficiario").next('i').addClass('glyphicon-remove');
                $("#beneficiario").parent().removeClass('has-success');
                $("#beneficiario").parent().addClass('has-error');

            } else{
                Notiflix.Report.Failure("Error","Ocurrió un error, por favor recargar la página e intentar nuevamente.", "Aceptar");
            }
        }
    });

}

function limpiarFilasTabla(tabla) {
    let tbody = tabla.find('tbody');
    tbody.find('tr').remove();
    let tr=`<tr><td class='text-center' colspan='9'>Seleccione un alumno</td></tr>`;
    tbody.append(tr);
    pago_id = null, cuota_verdadera_id = null, cuota_fallida_id = null;

    if (tabla.hasClass('beneficiario')) {
        let div = document.getElementById('divDesactivarCuota'),
            cbo = document.getElementById('cbxDesactivarCuota');
        div.style.display = 'none';
        cbo.checked = false;
    }
}

function marcarFilaPagante(tr) {
    let tbody = tr.parentNode,
        clase = 'success';
        cuota_verdadera_id = tr.getAttribute('data-cuotaverdaderaid');

    limpiarClaseTabla(tbody, clase);
    tr.classList.add(clase);

}

function marcarFilaBeneficiario(tr) {
    let tbody = tr.parentNode,
        clase = 'danger';

    pago_id = tr.getAttribute('data-idpago');
    cuota_fallida_id = tr.getAttribute('data-cuotafallidaid')

    limpiarClaseTabla(tbody, clase);
    tr.classList.add(clase);

}

function limpiarClaseTabla(tbody, clase) {
    for (let i = 0, row; row = tbody.rows[i]; i++) {
        row.classList.remove(clase);
    }
}
