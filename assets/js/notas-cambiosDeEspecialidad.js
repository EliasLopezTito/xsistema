document.addEventListener("DOMContentLoaded", () => {
    $("#alumno").autocomplete({
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

                    $("#alumno").attr("codigo","");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');
                    $("#btnGrabar").prop("disabled",true)
                    $("#espeActual").html("")

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

                $("#alumno").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#alumno").attr('codigo', ui.item.cod_alumno );
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');            
                
                cargarEspecialidadesActual(ui.item.cod_alumno);
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
    $("#alumno").focus();
});

$("#formCambioEspecialidad").submit(function(e){
    
    e.preventDefault();
    let form = $(this).serializeArray();
    form.push({name: "opcion", value: "cambiarEspecialidad"});
    form.push({name: "codigo", value: $("#alumno").attr('codigo') });
    console.log(form);

    $.ajax({
        url: path + "notas/cambiosDeEspecialidad",
        type: "POST",
        data: $.param(form),
        dataType: "JSON",
        beforeSend: function () {
            $('.text-loader').text('PROCESANDO, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete: function(){
            $("#modalLoader").modal("hide");
        }, 
        success: function (res) {
        
            if (res.respuesta == "success") {
                $("#alumno").attr("codigo","");
                $("#alumno").val("");
                $("#alumno").next('i').removeClass('glyphicon-ok');
                $("#alumno").next('i').addClass('glyphicon-remove');
                $("#alumno").parent().removeClass('has-success');
                $("#alumno").parent().addClass('has-error');
                $("#btnGrabar").prop("disabled",true)
                $("#espeActual").html("")
                Notiflix.Notify.Success('OPERACIÓN ÉXITOSA.');
            } else {
                $("#alumno").attr("codigo","");
                $("#alumno").html("");
                $("#alumno").next('i').removeClass('glyphicon-ok');
                $("#alumno").next('i').addClass('glyphicon-remove');
                $("#alumno").parent().removeClass('has-success');
                $("#alumno").parent().addClass('has-error');
                $("#btnGrabar").prop("disabled",true)
                $("#espeActual").html("")
                Notiflix.Notify.Failure('Ocurrio un error inesperado, por favor recargue la página y vuelva a intentarlo.');    
            }

        }
    });

})

function cargarEspecialidadesActual(codigo){
    $.ajax({
        url: path + "notas/cambiosDeEspecialidad",
        type: "POST",
        dataType : "json",
        data: {
            opcion : "cargarEspecialidades",
            codigo : codigo
        },
        success: function (data) {
            if(data.respuesta === "success"){
                $("#especialidadActual").html("<option disabled selected>SELECCIONE</option>")
                data.especialidades.forEach( function(el){
                    $("#espeActual").append(`<option value="${el.cod_espe}">${el.Especialidad}</option>`)
                });

                $("#btnGrabar").prop("disabled",false)
                Notiflix.Notify.Success("Especialidades actuales cargadas");

            }else{

                Notiflix.Notify.Failure("Ocurrio un error inesperado, por favor recargue la página y vuelva a intentarlo.");
            }

        }
    })
}