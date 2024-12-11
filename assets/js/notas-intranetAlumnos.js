$(document).ready(function(){   
    
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

                    $("#tablaPagantes tbody").html("");
                    $("#tablaNoPagantes tbody").html("");
                    $("#alumno").attr("codigo","");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');
                                                           
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

                $("#alumno").attr("codigo", "ui.item.cod_alumno");
                $("#alumno").val(ui.item.cod_alumno + " - " + ui.item.nombre);                
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');

                cargarInfoAlumno(ui.item.cod_alumno);

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

$("#alumno").keyup(function () {
    if($(this).val().length < 1){
        $("#tablaPagantes tbody").html("");
        $("#tablaNoPagantes tbody").html("");
        $("#alumno").attr("codigo","");
        $("#alumno").next('i').removeClass('glyphicon-ok');
        $("#alumno").next('i').addClass('glyphicon-remove');
        $("#alumno").parent().removeClass('has-success');
        $("#alumno").parent().addClass('has-error');
    }
})

function cargarInfoAlumno(codigo){
    
    $.ajax({
        url: path + "notas/intranetAlumnos",
        type: "POST",
        dataType : "JSON",
        data: {           
            opcion: "select",
            alumno: codigo,            
        },
        beforeSend : function(){
            $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
            $("#tablaPagantes tbody").html("");
            $("#tablaNoPagantes tbody").html("");
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {
           
            if (response.respuesta == "success") {                             

                response.pagantes.forEach( e => {
                    $("#tablaPagantes tbody").append(`
                        <tr>
                            <td class="text-center">${e.cod_curso.trim()}</td>
                            <td class="text-center">${e.Curso.trim()}</td>
                            <td class="text-center">${e.cod_turno.trim()}</td>
                            <td class="text-center">${e.cod_ciclo.trim()}</td>
                            <td class="text-center">${e.cod_aula.trim()}</td>
                            <td class="text-center">${e.anio}</td>
                            <td class="text-center">${e.Mes.trim()}</td>
                            <td class="text-center">${e.semestre.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ap1) < 13) || (e.ap1.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ap1.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ed1) < 13) || (e.ed1.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ed1.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ep) < 13) || (e.ep.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ep.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ac1) < 13) || (e.ac1.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ac1.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.pr1) < 13) || (e.pr1.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.pr1.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ap2) < 13) || (e.ap2.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ap2.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ed2) < 13) || (e.ed2.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ed2.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ef) < 13) || (e.ef.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ef.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ac2) < 13) || (e.ac2.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ac2.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.pr2) < 13) || (e.pr2.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.pr2.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.pr) < 13) || (e.pr.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.pr.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.er) < 13) || (e.er.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.er.trim()}</td>
                            <td class="text-center">${e.CodDocente.trim()}</td>
                            <td class="text-center">${e.Docente.trim()}</td>                                                     
                        </tr>
                    `);
                });

                response.nopagantes.forEach(e => {
                    $("#tablaNoPagantes tbody").append(`
                        <tr>
                            <td class="text-center">${e.cod_curso.trim()}</td>
                            <td class="text-center">${e.Curso.trim()}</td>
                            <td class="text-center">${e.cod_turno.trim()}</td>
                            <td class="text-center">${e.cod_ciclo.trim()}</td>
                            <td class="text-center">${e.cod_aula.trim()}</td>
                            <td class="text-center">${e.anio}</td>
                            <td class="text-center">${e.Mes.trim()}</td>
                            <td class="text-center">${e.semestre.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ap1) < 13) || (e.ap1.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ap1.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ed1) < 13) || (e.ed1.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ed1.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ep) < 13) || (e.ep.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ep.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ac1) < 13) || (e.ac1.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ac1.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.pr1) < 13) || (e.pr1.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.pr1.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ap2) < 13) || (e.ap2.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ap2.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ed2) < 13) || (e.ed2.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ed2.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ef) < 13) || (e.ef.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ef.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.ac2) < 13) || (e.ac2.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.ac2.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.pr2) < 13) || (e.pr2.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.pr2.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.pr) < 13) || (e.pr.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.pr.trim()}</td>
                            <td class="text-center" style="${( ((Number(e.er) < 13) || (e.er.trim() === "NSP")) ? "color:red" : "color:blue")}">${e.er.trim()}</td>
                            <td class="text-center">${e.CodDocente.trim()}</td>
                            <td class="text-center">${e.Docente.trim()}</td>                                                     
                        </tr>
                    `);
                });

            } else {  
                
            }

        }
    });
}