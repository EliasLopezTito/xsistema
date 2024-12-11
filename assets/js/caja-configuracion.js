document.addEventListener('DOMContentLoaded', () => {

    cargarConfiguraciones();

})

document.addEventListener('change', (e) => {

    if (e.target.matches('#select-estado')) {
        cargarConfiguraciones();
    }

})

$("#modalNuevaConfiguracion").on("hidden.bs.modal", function () {
    $('#config_monto').val('');
    $('#config_mora').val('');
    $('#config_tipo').prop('selectedIndex',0);
});

document.addEventListener('click', (e) => {

    if (e.target.matches('#btnNuevo')) {
        $("#modalNuevaConfiguracion").modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    if (e.target.matches('#btnGuardarConfiguracion')) {
        validarConfiguracion();
    }
})

function cargarConfiguraciones() {

    let tbody = $("#tablaConfiguraciones tbody");
    tbody.find('tr').remove();

    $.ajax({
        url: path + "caja/configuracion",
        type: 'POST',
        dataType: 'json',
        data: {
            opcion: 'selectConfiguraciones'
        },
        success: function(data) {

            console.log(data);

            $.each(data.configuraciones, function(i, item) {

                // $estado = ;
                let activo = item.activo === 1 ? 'ACTIVO' : 'INACTIVO';
                let tipo = item.fechaBaja === null ? 'PRINCIPAL' : 'SECUNDARIO';

                 let tr=`<tr>
                            <td class='text-center'>${i+1}</td>
                            <td class='text-center'>S/. ${item.monto}.00</td>
                            <td class='text-center'>S/. ${item.mora}.00</td>
                            <td class='text-center'>${activo}</td>
                            <td class='text-center'>${tipo}</td>
                            <td class='text-center'>${item.fechaAlta}</td>
                            <td class='text-center'>${item.fechaBaja}</td>
                            <td class='text-center'>
                                <button class='btn boton-tabla boton-rojo' id='btnDeshabilitar' type='button' title='Desactivar' onclick='confirmDesactivarConfiguracion(this)' data-id='${item.id}'><span class='icon-arrow-down'></span></button>
                            </td>
                         </tr>`;
             tbody.append(tr);
            });

        },
        error: function(e) {
            console.error("No es posible completar la operación");
        },
        complete: function() {

        }
    });

}

function confirmDesactivarConfiguracion(btn) {
    
    Notiflix.Confirm.Show(
        'Advertencia',
        '¿Estas seguro que quieres deshabilitar la configuración seleccionada?',
        'Si',
        'No',
        function(){
            desactivarConfiguracion(btn);
        },
        function(){
           
        }
    );

}

function desactivarConfiguracion(btn) {

    let id = btn.getAttribute('data-id');
    $.ajax({
        url: path + "caja/configuracion",
        type: 'POST',
        dataType: 'json',
        data: {
            opcion: 'bajaConfiguracion',
            id: id
        },
        success: function(data) {

            if (data.respuesta === 'success') {

                Notiflix.Notify.Success('Configuración desactivada con éxito!');

                cargarConfiguraciones();

            } else{

                Notiflix.Notify.Failure('Ocurrio un error, por favor vuelva a intentarlo!');

            }

        },
        error: function(e) {
            console.error("No es posible completar la operación");
        },
        complete: function() {
            // console.log('completado');
        }
    });

}

function validarConfiguracion() {
    let monto = $('#config_monto').val();
    let mora = $('#config_mora').val();
    let tipo = $('#config_tipo').val();

    if (monto != '' && mora != '') {
        if (tipo == '1') {
            
            $.ajax({
                url: path + "caja/configuracion",
                type: 'POST',
                dataType: 'json',
                data: {
                    opcion: 'validarConfiguracion'
                },
                success: function(data) {
                    
                    if (data.respuesta === 'success' && data.configuracion === 'vacio') {
        
                        guardarConfiguracion(monto,mora,tipo);
        
                    } else{
        
                        Notiflix.Notify.Failure('No puede registrar dos cuotas principales!');
        
                    }
        
                },
                error: function(e) {
                    console.error("No es posible completar la operación");
                },
                complete: function() {
                    
                }
            });

        } else{

            guardarConfiguracion(monto,mora,tipo);

        }

    } else{
        Notiflix.Notify.Failure('Ingrese todos los datos!');
    }
}

function guardarConfiguracion(monto,mora,tipo) {
   
    $.ajax({
        url: path + "caja/configuracion",
        type: 'POST',
        dataType: 'json',
        data: {
            opcion: 'guardarConfiguracion',
            monto: monto,
            mora: mora,
            tipo: tipo
        },
        success: function(data) {

            if (data.respuesta === 'success') {

                Notiflix.Notify.Success('Configuración desactivada con éxito!');

                cargarConfiguraciones();

            } else{

                Notiflix.Notify.Failure('Ocurrio un error, por favor vuelva a intentarlo!');

            }
            $("#modalNuevaConfiguracion").modal("hide");

        },
        error: function(e) {
            console.error("No es posible completar la operación");
        },
        complete: function() {
            
        }
    });

}

// function comprobarEstado(){
//     return new Promise(function(resolve, reject) {

//         var req = new XMLHttpRequest();
//         req.open('GET', 'https://jsonplaceholder.typicode.com/posts');

//         req.onload = function() {
//           if (req.status == 200) {
//             resolve(JSON.parse(req.response));
//           }
//           else {
//             reject();
//           }
//         };

//         req.send();

//     })
// }
