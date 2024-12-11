document.addEventListener("DOMContentLoaded", () => {
    $("#docentes").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "programacion/datosDocente",
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
                    $("#tablaInformacionInterna tbody").find('tr').remove();
                    $("#tablaCursos tbody").find('tr').remove();
                    $("#rowButton").css('display','none');
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
                
                cargarInformacionDocentes(ui.item.cod_emp);
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
    $("#docentes").focus();
});

function cargarInformacionDocentes(usuario){
    $.ajax({
        url: path + "programacion/datosDocente",
        dataType: "JSON",
        method : "POST",
        data: {
            docente: usuario,
            opcion: 'cargarInformacion'
        },
        beforeSend: function(){
            $('.text-loader').text('Cargando información, por favor espere..');
            $("#modalLoader").modal();
        },
        success: function(response){

            if(response.respuesta1 === "success"){

                $("#tablaInformacionInterna tbody").html("")
                
                if(response.consulta1 === "vacio"){
                    $("#tablaInformacionInterna tbody").html("<tr><td colspan='13' class='text-center'><b>NO SE ENCONTRARON RESULTADOS</b></td></tr>")
                }else{
                    response.consulta1.forEach(function(index,key){                
                        plantilla = `<tr>
                            <td>${key+1}</td>
                            <td>${index.Aula.trim()}</td>
                            <td>${index.CodA}</td>
                            <td>${index.Espec.trim()}</td>
                            <td>${index.Ciclo.trim()}</td>
                            <td>${index.Local.trim()}</td>
                            <td>${index.Año.trim()}</td>
                            <td>${index.Mes.trim()}</td>
                            <td>${index.T.trim()}</td>
                            <td>${index.Hr}</td>
                            <td>${index.Programacion.trim()}</td>
                            <td>${index.NumHr.trim()}</td>
                            <td>${index.Ministerio.trim()}</td>
                        </tr>`
    
                        $("#tablaInformacionInterna tbody").append(plantilla)
    
                    });
                }
                
            }else{
                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO AL CARGAR LA INFORMACIÓN INTERNA DEL DOCENTE");
                Notiflix.Notify.Failure(response.error1);
            }

            if(response.respuesta2 === "success"){

                $("#tablaCursos tbody").html("")

                if(response.consulta2 === "vacio"){
                    $("#tablaCursos tbody").html("<tr><td colspan='13' class='text-center'><b>NO SE ENCONTRARON RESULTADOS</b></td></tr>")
                }else{
                    response.consulta2.forEach(function(index,key){                
                        plantilla = `<tr>
                            <td>${key+1}</td>
                            <td>${index.Aula.trim()}</td>
                            <td>${index.Año.trim()}</td>
                            <td>${index.Mes.trim()}</td>
                            <td>${index.Turno.trim()}</td>
                            <td>${index.Ministerio.trim()}</td>
                            <td>${index.Hora.trim()}</td>                       
                        </tr>`

                        $("#tablaCursos tbody").append(plantilla)

                    });
                }

            }else{
                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO AL CARGAR LA INFORMACIÓN INTERNA DEL DOCENTE");
                Notiflix.Notify.Failure(response.error2);
            }

            if(response.respuesta3 === "success"){

                if(response.consulta3 === "vacio"){                     
                    $("#profesion").html("")
                }else{
                    $("#profesion").html(response.consulta3[0].Profesion.trim())
                }
               
            }else{
                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO AL CARGAR LA INFORMACIÓN INTERNA DEL DOCENTE");
                Notiflix.Notify.Failure(response.error3);
            }
                       
        },
        complete: function(data){
            $("#modalLoader").modal("hide");
        }
    });
}