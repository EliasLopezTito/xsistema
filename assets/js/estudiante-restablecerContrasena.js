$(document).ready(function(){

})

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
                            
                $("#tablaAlumno tbody").html("");
                                
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
            $("#alumno").attr('codigo', ui.item.cod_alumno);
            $("#alumno").next('i').removeClass('glyphicon-remove');
            $("#alumno").next('i').addClass('glyphicon-ok');
            $("#alumno").parent().removeClass('has-error');
            $("#alumno").parent().addClass('has-success');

            cargarTabla( ui.item.cod_alumno , ui.item.nombre );

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

function cargarTabla(codigo,alumno){
    $("#tablaAlumno tbody").html(`
        <tr> 
            <td class="text-center">${codigo.trim()}</td>
            <td class="text-center">${alumno.trim()}</td>
            <td class="text-center"> 
                <button class="btn btn-success btn-sm" type="button" codigo="${codigo.trim()}" onclick="restablecerContrasena(this)"><span class="icon-loop2" style="margin-right:10px"></span>RESTABLECER</button>
            </td>
        </tr>
    `);
}

function restablecerContrasena( btn ){

    $.ajax({
        url: path + "estudiante/restablecerContrasena",
        type: "POST",
        dataType: 'json',
        data: {            
            opcion: 'restablecer',
            codigo: $(btn).attr("codigo")
        },
        beforeSend: function(){
            $('.text-loader').text('RESTABLECIENDO CONTRASEÑA, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function(data){

            if(data.respuesta === "success"){
                Notiflix.Notify.Success('CONTRASEÑA RESTABLECIDA CON ÉXITO.');            
            }else{
                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO : " + data.error , {
                    timeout: 5000,
                });
            }

        },
        error: function(error){
            
        },
        complete: function(data){
            $("#modalLoader").modal("hide");
        }
    });

}