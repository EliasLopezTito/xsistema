document.addEventListener("DOMContentLoaded", () => {
    
    autocompleDocente();

});

function autocompleDocente(){
    $("#docentes").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "programacion/imprimirListadoPresencial",
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
                $("#docentes").attr("codigo" , ui.item.cod_emp );
                $("#docentes").val(ui.item.cod_emp + " - " + ui.item.nombre);
                $("#docentes").next('i').removeClass('glyphicon-remove');
                $("#docentes").next('i').addClass('glyphicon-ok');
                $("#docentes").parent().removeClass('has-error');
                $("#docentes").parent().addClass('has-success');                
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
            .append("<div><b>Código</b>: "+item.cod_emp+" <b>Nombre: </b> "+item.nombre+"</div>")
            .appendTo(ul);
    };  
}

$("#docentes").keyup(function(){
    if( $(this).val().length < 1 ){
        $("#docentes").attr("codigo", "");
        $("#docentes").next('i').removeClass('glyphicon-ok');
        $("#docentes").next('i').addClass('glyphicon-remove');
        $("#docentes").parent().removeClass('has-success');
        $("#docentes").parent().addClass('has-error');
    }
})

$("#btnBuscar").click(function(){

    $.ajax({
        url: path + "programacion/imprimirListadoPresencial",
        dataType: "JSON",
        method: "POST",
        data: {          
            opcion: 'cargarInformacionTabla',
            docente: $("#docentes").attr("codigo"),
            anio : $("#anio").val(),
            mes : $("#mes").val()
        },
        beforeSend: function () {
            $('.text-loader').text('CARGANDO INFORMACIÓN...');
            $("#modalLoader").modal();
            $("#tablaData tbody").html("")
        },
        success: function (response) {

            if (response.respuesta === "success") {                

                if(response.res.length > 0){
                    response.res.forEach( (e,i) => {
                        $("#tablaData tbody").append(`
                            <tr>
                                <td class="text-center"> ${e.Turno.trim()} </td>
                                <td class="text-center"> ${e.Horas.trim()} </td>
                                <td class="text-center"> ${e.CursoM.trim()} </td>
                                <td class="text-center"> ${e.Especialidad.trim()} </td>
                                <td class="text-center"> ${e.Ciclo.trim()} </td>
                                <td class="text-center"> ${e.Aula.trim()} </td>
                                <td class="text-center"> ${e.Fec_inicio.trim().substring(0,10)} </td>
                                <td class="text-center"> ${e.Fec_Termino.trim().substring(0, 10) } </td>
                            </tr>
                        `);
                    });
                }else{
                    $("#tablaData tbody").append(
                        `<tr><td class="text-center" colspan="8"> <b>NO SE ENCONTRO INFORMACIÓN</b> </td></tr>`
                    );
                }

                Notiflix.Notify.Success("INFORMACIÓN CARGADA CON ÉXITO"); 

            } else {

                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO AL CARGAR LA INFORMACIÓN INTERNA DEL DOCENTE"); 

            }

        },
        complete: function (data) {
            $("#modalLoader").modal("hide");
        }
    });

})

$("#btnImprimir").click(function () {

    $.ajax({
        url: path + "programacion/imprimirListadoPresencial",
        dataType: "JSON",
        method: "POST",
        data: {
            opcion: 'imprimirPdf',
            docente: $("#docentes").attr("codigo"),
            anio: $("#anio").val(),
            mes: $("#mes").val()
        },
        beforeSend: function () {
            $('.text-loader').text('GENERANDO ARCHIVO PDF...');
            $("#modalLoader").modal();            
        },
        success: function (response) {

            if (response.respuesta === "success") {            

                //Notiflix.Notify.Success("DOCUMENTO PDF GENERADO CON ÉXITO");

                let pdf = '<iframe src="' + response.file + '" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaPdf .modal-body #divIframePdf').html(pdf);
                $("#modalVistaPreviaPdf").modal({ backdrop: 'static', keyboard: false })

            } else {

                Notiflix.Notify.Failure("OCURRIO UN ERROR AL GENERAR EL ARCHIVO");

            }

        },
        complete: function (data) {
            $("#modalLoader").modal("hide");
        }
    });

})

$("#cerraModal").click(function () {
    $("#modalVistaPreviaPdf").modal("hide");
    $("body").css({ "padding-right": 0 })
})