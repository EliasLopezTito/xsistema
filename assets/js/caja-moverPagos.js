$(document).ready(function() {
    document.getElementById('usuarios').focus();
    getAlumno();

})

document.addEventListener('change', e => {
    if (e.target.matches('#cboCuotaMover')) {
        let mes = e.target.options[e.target.selectedIndex].text;

        Notiflix.Confirm.Show(
            'Confirmación',
            `¿Está seguro que desea asignar el pago para el mes de ${mes}?`,
            'Si',
            'No',
            function(){
                actualizarPago(e.target);
            },
            function(){
                e.target.selectedIndex = 0;
            }
        );

    }
})

document.addEventListener('click', (e) => {

    if (e.target.matches('#usuarios')) {
        document.getElementById('usuarios').select();
    }

});

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

function getAlumno() {

    $("#usuarios").autocomplete({
        
        source: function(request, response){
            $.ajax({
                url: path + "caja/moverPagos",
                method: 'post',
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'getAlumno'
                },
                success: function(data){
                    // console.log(data);
                    
                    $("#usuarios").removeAttr("data-cod");
                    $("#usuarios").next('i').removeClass('glyphicon-ok');
                    $("#usuarios").next('i').addClass('glyphicon-remove');
                    $("#usuarios").parent().removeClass('has-success');
                    $("#usuarios").parent().addClass('has-error');

                    let result = (data.alumnos.length === 0) ? [{ vacio: true }] : data.alumnos;

                    response(result);

                }
            });
        },
        minLength: 3,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                $("#usuarios").val(ui.item.nombre);
                $("#usuarios").attr('data-cod', ui.item.codigo);
                $("#usuarios").next('i').removeClass('glyphicon-remove');
                $("#usuarios").next('i').addClass('glyphicon-ok');
                $("#usuarios").parent().removeClass('has-error');
                $("#usuarios").parent().addClass('has-success');

                consultarPagos();

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

function getPagos() {

    return new Promise(function(resolve, reject) {
        let $cod_alumno = document.getElementById('usuarios').getAttribute('data-cod');
    
        $.ajax({
            url: path + "caja/moverPagos",
            method: 'post',
            dataType: "json",
            data: {
                cod_alumno: $cod_alumno,
                opcion: 'getPagos'
            },
            success: function(data){
                console.log(data);
                if (data.respuesta === 'success') {

                    llenarTablaPagos(data.pagos);

                    setTimeout(() => {
                        resolve(JSON.parse(1));
                    }, 500);
                } else{
                    Notiflix.Notify.Failure('Ocurrió un error al realizar el pago de la cuota, por favor recargue y vuelva a intentarlo.');
                }
            }
        });
    })

}

function getCuotas() {

    let $cod_alumno = document.getElementById('usuarios').getAttribute('data-cod');

    $.ajax({
        url: path + "caja/moverPagos",
        method: 'post',
        dataType: "json",
        data: {
            cod_alumno: $cod_alumno,
            opcion: 'getCuotas'
        },
        success: function(data){
            console.log(data);
            if (data.respuesta === 'success') {
                llenarTablaCuotas(data.cuotas);
            } else{
                Notiflix.Notify.Failure('Ocurrió un error al realizar el pago de la cuota, por favor recargue y vuelva a intentarlo.');
            }
        }
    });

}

function getCuotasMover() {

    // let $cod_alumno = $('#usuarios').data('cod');
    let $cod_alumno = document.getElementById('usuarios').getAttribute('data-cod');

    $.ajax({
        url: path + "caja/moverPagos",
        method: 'post',
        dataType: "json",
        data: {
            cod_alumno: $cod_alumno,
            opcion: 'getCuotasMover'
        },
        success: function(data){
            console.log('La data para llenar select mover');
            console.log(data);
            if (data.respuesta === 'success') {
                llenarSelectCuotaMover(data.cuotas);
            }
            
        }
    });

}

function llenarTablaPagos(pagos) {
    return new Promise(function(resolve, reject) {
        let tbody = $("#tablaPagos tbody");
                tbody.find('tr').remove();
    
                if (pagos !== 'vacio') {
                    $.each(pagos, function(i, listado) {
        
                        let tr=`<tr>
                            <td class='text-center'>${i+1}</td>
                            <td class='text-center'>${listado.nombre}</td>
                            <td class='text-center'>${meses[listado.periodoDeuda]}</td>
                            <td class='text-center'>${listado.yearDeuda}</td>
                            <td class='text-center'>S/. ${listado.total}.00</td>
                            <td class='text-center'>
                                <select class="selectpicker form-control mipanel-combo" id="cboCuotaMover" data-idCuotaActual='${listado.id_cuotaActual}' data-idPago='${listado.id}'>
                                </select>
                            </td>
                            </tr>`;
                        tbody.append(tr);
                    });
                    resolve(JSON.parse(1));
                } else{
                    let tr=`<tr>
                            <td class='text-center' colspan='6'>No hay pagos registrados.</td>
                            </tr>`;
                        tbody.append(tr);
                }
    })

}

function llenarTablaCuotas(cuotas) {
    let tbody = $("#tablaCuotas tbody");
    tbody.find('tr').remove();

    if (cuotas !== 'vacio') {

        $.each(cuotas, function(i, listado) {
    
            est_clase = listado.estado == '1' ? 'success' : 'danger';
            est_texto = listado.estado == '1' ? 'PAGADO' : 'PENDIENTE';
    
            act_clase = listado.activo == '1' ? 'success' : 'danger';
            act_texto = listado.activo == '1' ? 'ACTIVO' : 'ELIMINADO';
    
            let tr=`<tr>
                <td class='text-center'>${i+1}</td>
                <td class='text-center'>${listado.nombre}</td>
                <td class='text-center'>S/.${listado.montoDeuda}.00</td>
                <td class='text-center'>${meses[listado.periodoDeuda]}</td>
                <td class='text-center'>${listado.yearDeuda}</td>
                <td class='text-center'><span class='label label-${est_clase} fuente'>${est_texto}</span></td>
                <td class='text-center'><span class='label label-${act_clase} fuente'>${act_texto}</span></td>
                </tr>`;
            tbody.append(tr);
        });
        
    } else{
        let tr=`<tr>
                <td class='text-center' colspan='7'>No hay cuotas registradas.</td>
                </tr>`;
        tbody.append(tr);
    }
}

function llenarSelectCuotaMover(cuotas) {

    let cboCuotas = $('#cboCuotaMover');
    cboCuotas.find('option').remove();
    cboCuotas.append(`<option value='' selected>Seleccione..</option>`);
    if (cuotas !== 'vacio') {
        for (i = 0; i < cuotas.length; i++) {
            let cuota = cuotas[i];
            cboCuotas.append(`<option value='${cuota.id}'>${meses[cuota.periodoDeuda]}</option>`);
        }
    }
}

function consultarPagos() {
    $('.text-loader').text('Consultando datos, por favor espere...');
    $("#modalLoader").modal();
    getPagos().then(r => {
        getCuotasMover();
        $("#modalLoader").modal("hide");
    })
    getCuotas();
}

function actualizarPago(select) {

    let id_pago = select.getAttribute('data-idpago')
    let idCuotaActual = select.getAttribute('data-idCuotaactual')
    let idCuotaNueva = select.value;

    $.ajax({
        url: path + "caja/moverPagos",
        method: 'post',
        dataType: "json",
        data: {
            pago_id: id_pago,
            cuota_actual: idCuotaActual,
            cuota_nueva: idCuotaNueva,
            opcion: 'actualizarPagos'
        },
        success: function(data){
            
            if (data.respuesta === 'success') {
                consultarPagos();
                Notiflix.Report.Success("Operación exitosa","El pago ha sido actualizado correctamente!", "Aceptar");
            } else{
                Notiflix.Report.Failure("Operación fallida","Ocurrió un error al actualizar el pago, por favor intentar nuevamente", "Aceptar");
            }
            
        }
    });

}
