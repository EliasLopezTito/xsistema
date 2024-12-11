$(document).ready(function(){
    mostrarBoletasInicial();
    $("#usuarios").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "marketing/comprobantesPorAsesor",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'buscar'
                },
                success: function(data){

                    if(data.respuesta === "success"){

                        $("#usuarios").removeAttr("data-code");
                        $("#usuarios").next('i').removeClass('glyphicon-ok');
                        $("#usuarios").next('i').addClass('glyphicon-remove');
                        $("#usuarios").parent().removeClass('has-success');
                        $("#usuarios").parent().addClass('has-error');
                        
                        let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos;
                        
                        response(result);

                    }else{

                        Notiflix.Notify.Failure("Ocurrio un error inesperado, por favor vuelva a intentarlo.");

                    }

                }
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {

                event.preventDefault();

            } else{

                $("#usuarios").val(ui.item.cod_alumno + " - " + ui.item.nombre);
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
            .append( "<div>"+item.cod_alumno + " - " +item.nombre +"</div>" )
            .appendTo( ul );
        
    };
    $("#usuarios").focus();
})

function mostrarBoletasInicial(){

    $.ajax({
        url: path + "marketing/comprobantesPorAsesor",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion : "mostrarComprobantesInicial"
        } ,
        beforeSend: function () {
            $('.text-loader').text('CARGANDO COMPROBANTES, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function (response) {
            console.log(response)
            $("#tablaListado tbody").html("");
            $.each(response.alumnos, function(i, listado) {

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
                            <td class='text-center'>${listado.CodigoAlumno}</td>
                            <td class='text-center'>${listado.Alumno}</td>
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

                $("#tablaListado tbody").append(tr);

            });

        },
        complete : function(){
            $("#modalLoader").modal("hide");
        }
    })

}

function mostrarBoletas(codigo){
    
    $.ajax({
        url: path + "marketing/comprobantesPorAsesor",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion : "mostrarComprobantes",
            codigo : codigo
        } ,
        beforeSend: function () {
            $('.text-loader').text('CARGANDO COMPROBANTES, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function (response) {
            
            $("#tablaListado tbody").html("");
            $("#columCodigo").hide();
            $("#columAlumno").hide();
            $.each(response.alumnos, function(i, listado) {

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

                $("#tablaListado tbody").append(tr);

            });

        },
        complete : function(){
            $("#modalLoader").modal("hide");
        }
    })

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

                url: path + "marketing/comprobantesPorAsesor",
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