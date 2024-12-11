document.addEventListener("DOMContentLoaded", () => {
    $("#docentes").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "programacion/recordProgramacion",
                dataType: "json",
                method : "post",
                data: {
                    docente: request.term,
                    opcion: 'buscarDocente'
                },
                success: function(data){

                    $("#docentes").removeAttr("data-code");
                    $("#docentes").next('i').removeClass('glyphicon-ok');
                    $("#docentes").next('i').addClass('glyphicon-remove');
                    $("#docentes").parent().removeClass('has-success');
                    $("#docentes").parent().addClass('has-error');

                    let result = (!data.docentes) ? [{ vacio: true }] : data.docentes;
                    response(result);   

                }
                    
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{

                $("#docentes").val( ui.item.cod_emp+" - "+ui.item.nombre);
                $("#docentes").next('i').removeClass('glyphicon-remove');
                $("#docentes").next('i').addClass('glyphicon-ok');
                $("#docentes").parent().removeClass('has-error');
                $("#docentes").parent().addClass('has-success');
                
                cargarInformacionDocentes(ui.item);
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
            .append( "<div><b>Docente: </b>" + item.cod_emp + "<br><b>Nombre: </b> " +item.nombre + "</div>" )
            .appendTo( ul );
    };

});

function cargarInformacionDocentes(docente){
    
    let plantilla = `<tr>
        <td class="text-center" >${1}</td>
        <td class="text-center" >${docente.nombre.trim()}</td>
        <td class="text-center" >${docente.Correo.trim()}</td>
        <td class="text-center" >${docente.Telefonos.trim()}</td>
        <td class="text-center" >
            <button class="btn boton-tabla boton-verde" codigo="${docente.cod_emp}" type="button" onclick="descargarPdf(this)"><span class="icon-download3"></span></button>
        </td>                           
    </tr>`;
    $("#tablaDocente tbody").html(plantilla)
       
}

function descargarPdf(btn){

    const codigo = $(btn).attr("codigo");
    $.ajax({
        url: path + "programacion/recordProgramacion",
        type: "POST",
        dataType:"JSON",
        data: {
            "opcion" : "descargarPdf",
            "docente" : codigo
        } ,
        beforeSend: function () {
            $('.text-loader').text('GENERANDO DOCUMENTO, PORFAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function (response) {
            console.log(response)
            if(response.respuesta === "success" ){

                $("#modalVistaPreviaPdf").modal("show")
                $('#modalVistaPreviaPdf .modal-body #divIframeContrato').html("");
                let pdf  = '<iframe src="'+response.pdf+'" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaPdf .modal-body #divIframeContrato').html(pdf);
                
                $("#modalLoader").modal("hide");

            }else if(response.respuesta == "warning"){

                $("#modalLoader").modal("hide");
                Notiflix.Report.Warning("Mensaje", "No se encontro información referente al docente" ,"Aceptar");

            }else{

                $("#modalLoader").modal("hide");
                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado","Por favor recargue la página y vuelva a intentarlo.", "Aceptar");

            }   

        }
    });

}