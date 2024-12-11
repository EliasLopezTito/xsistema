document.addEventListener("DOMContentLoaded", () => {
    $("#usuarios").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Programacion/descargarBoleta",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function(data){

                    $("#usuarios").removeAttr("data-code");
                    $("#usuarios").next('i').removeClass('glyphicon-ok');
                    $("#usuarios").next('i').addClass('glyphicon-remove');
                    $("#usuarios").parent().removeClass('has-success');
                    $("#usuarios").parent().addClass('has-error');
                    $("#tablaPermisos tbody").find('tr').remove();
                    $("#rowButton").css('display','none');
                    
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
                $("#usuarios").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#usuarios").attr('data-code', ui.item.usuario);
                $("#usuarios").next('i').removeClass('glyphicon-remove');
                $("#usuarios").next('i').addClass('glyphicon-ok');
                $("#usuarios").parent().removeClass('has-error');
                $("#usuarios").parent().addClass('has-success');
                
                mostrarBoletas(ui.item.cod_alumno);
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
            .append( "<div>"+item.cod_alumno+" - "+item.nombre+"</div>" )
            .appendTo( ul );
    };
    
    $("#usuarios").focus();
});

function mostrarBoletas(cod_alumno){

    $.ajax({
        url: path + "Programacion/descargarBoleta",
        dataType: 'json',
        type: 'POST',
        data: {
            opcion: 'select_boleta',
            cod_alumno: cod_alumno,
        },
        beforeSend: function(){
            $('.text-loader').text('CONSULTANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function(data) {

            let tbody = $("#tablaBoletas tbody");
            tbody.find('tr').remove();

            if (data.respuesta === 'success') {

                if (data.boleta !== 'vacio') {
                    
                    $.each(data.boleta, function(i, listado) {

                        let asesora = listado.Asesora.trim() === "" ? "-" : listado.Asesora.trim();
                        let observacion = listado.Observacion.trim() === "" ? "-" : listado.Observacion.trim();

                        let tipo_doc = listado.Doc.trim() === 'BV' ? 'BOLETA' : 'FACTURA';

                        if(listado.countenvio > 0){
                            botoncolor = "boton-verde";
                            styles="font-size:10px;font-weigth:400;margin-left:1px;margin-top:-28px;background:green"
                        }else{
                            botoncolor = "boton-rojo";
                            styles="font-size:10px;font-weigth:400;margin-left:1px;margin-top:-28px;background:red"
                        }

                        let tr=`<tr>
                                    <td class='text-center'>${i+1}</td>
                                    <td class='text-center'>${tipo_doc}</td>
                                    <td class='text-center'>${listado.Fecha}</td>
                                    <td class='text-center'>${listado.NDoc}</td>
                                    <td class='text-center'>${listado.Concepto}</td>
                                    <td class='text-center'>S/. ${listado.Monto}.00</td>
                                    <td class='text-center'>${listado.Especialidad}</td>
                                    <td class='text-center'>${listado.Ciclo}</td>
                                    <td class='text-center'>${listado.Ano}</td>
                                    <td class='text-center'>${listado.Mes}</td>
                                    <td class='text-center'>
                                        <form method='post' id='frmDescargarBoleta' target="_blank">
                                            <button class='btn boton-tabla boton-plomo' data-talon='${listado.Talon}' data-recibo='${listado.Recibo}' type='button' onclick='descargarBoleta(this)' title='Descargar Boleta'><span class='icon-download3'></span></button>
                                        </form>
                                    </td>
                                    <td class='text-center' style="padding:10px">
                                        <a class="btn boton-tabla ${botoncolor}" data-codigo='${listado.CodigoAlumno}' data-talon='${listado.Talon}' data-recibo='${listado.Recibo}' onclick="enviarBoletaCorreo(this)">
                                            <span class="icon-envelop" style="margin-left: 2px;"></span>
                                            <span class="badge badge-red" style="${styles}">${listado.countenvio}</span>
                                        </a>
                                    </td>
                                    <td class='text-center'>${listado.Correo}</td>
                                    <td class='text-center'>${asesora}</td>
                                    <td class='text-center'>${observacion}</td>

                                </tr>`;                         
                        tbody.append(tr);

                    });

                } else{

                    let tr = `<tr>
                            <td class='text-center' colspan='12'><b>EL ALUMNO NO TIENE BOLETAS REGISTRADAS</b></td>
                            </tr>`;
                    tbody.append(tr);

                }

            } else{
                Notiflix.Notify.Failure('Ocurrió un error al actualizar los permisos');
            }

            $("#modalLoader").modal("hide");

        },
        error: function(e) {
            Notiflix.Notify.Failure(e);
            $("#modalLoader").modal("hide");
        }
    });

}

function enviarBoletaCorreo(btn){
    
    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro se envíar el comprobante al alumno?',
        'Si',
        'No',
        function(){
            
            const talon = btn.getAttribute('data-talon');
            const recibo = btn.getAttribute('data-recibo');
            
            $.ajax({

                url: path + "programacion/descargarBoleta",
                type: "POST",
                dataType:"JSON",
                data: {
                    opcion : "enviar",
                    talon : talon,
                    recibo : recibo,
                } ,
                beforeSend: function () {
                    $('.text-loader').text('ENVIANDO EL COMPROBANTE, POR FAVOR ESPERE...');
                    $("#modalLoader").modal();
                },
                success: function (response) {
                    console.log(response)

                    
                    if(response.respuesta === "success" ){
                        
                        Notiflix.Notify.Success('EL COMPROBANTE HA SIDO ENVIADO DE MANERA SATISFACTORIA');
                        mostrarBoletas(btn.getAttribute('data-codigo'));

                    }else{

                        Notiflix.Notify.Failure(response.error);

                    }   
                    
                    $("#modalLoader").modal("hide");
                },
            });

        },
        function(){
           
        }
    );

}

function descargarBoleta(btn){
    let talon = btn.getAttribute('data-talon');
    let recibo = btn.getAttribute('data-recibo');
    document.getElementById('talon').value = talon;
    document.getElementById('recibo').value = recibo;
    // console.log(document.getElementById('talon').value);
    // console.log(document.getElementById('recibo').value);
    document.getElementById("frmDescargarBoleta").submit();
}

// $("#usuarios").on('keyup', function (e) {
//     var keycode = e.keyCode || e.which;
//       if (keycode == 13) {
//           console.log("enter");
//       }
//   });

  $('#usuarios').keypress(function(e) {
    var keycode = (e.keyCode ? e.keyCode : e.which);
    if (keycode == '13') {

        $('#usuarios').val().length == '9' ?  mostrarBoletas($('#usuarios').val()) : console.log("asdasd");
       
        e.preventDefault();
        return false;
    }
});
// document.addEventListener('change', (e) => {
//     if (e.target.matches('#checkMenu')) {
//         if (e.target.checked) {
//             $label = e.target.parentNode;
//             $celda = $label.parentNode;
//             $celda.classList.add('true');
//         }else{
//             $label = e.target.parentNode;
//             $celda = $label.parentNode;
//             $celda.classList.remove('true');
//         }
//     }

// });

// document.addEventListener('click', (e) => {

//     if (e.target.matches('#btnGuardarPermisos')) {
//         actualizarPermisos();
//     }
//     if (e.target.matches('#usuarios')) {
//         document.getElementById('usuarios').select();
//     }
// });


// function actualizarPermisos(){
    
//     let id_usuario = document.getElementById('usuarios').getAttribute("data-code");
//     const checkboxs = document.querySelectorAll('#checkMenu');
//     const permisos = new Array();
//     checkboxs.forEach(element => {
//         if(element.checked) permisos.push(element.dataset.id);
//     });
    
//     $.ajax({
//         url: path + "seguridad/permisos",
//         type: 'POST',
//         data: {
//             opcion: 'actualizarPermisos',
//             id_usuario: id_usuario,
//             permisos: permisos
//         },
//         success: function(data) {
//             console.log(data);
//             let resp = JSON.parse(data);

//             if (resp.respuesta == "success") {
//                 window.scrollTo({ top: 0, behavior: 'smooth' });
//                 Notiflix.Notify.Success('Permisos actualizados correctamente');
//             } else {
//                 Notiflix.Notify.Failure('Ocurrió un error al actualizar los permisos');
//             }
//         },
//         error: function(e) {
//             console.error("No es posible completar la operación");
//         }
//     });
// }

// function getRowspanMenuUno(id_uno, menus_nivel_2, menus_nivel_3){
//     let cont = 0;

//     menus_nivel_2.forEach(menu_n2 => {
//         menus_nivel_3.forEach(menu_n3 => {
//             if(menu_n2.padre === id_uno && menu_n3.padre === menu_n2.id_menu) cont++;
//         });
//     });

//     return cont;
// }

// function getRowspanMenuDos(id_dos, menus_nivel_3) {
//     let cont = 0;
//     menus_nivel_3.forEach(menu_n3 => {
//         if(menu_n3.padre === id_dos) cont++;
//     });

//     return cont;
// }
