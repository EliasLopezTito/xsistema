//dat = $(this).serializeArray()
//dat.push({name:"especialidad",value:$("#especialidad").val()})

document.addEventListener("DOMContentLoaded", () => {

    $("#docentes").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "docentes/datosDocentes",
                dataType: "json",
                method : "post",
                data: {
                    docente: request.term,
                    opcion: 'buscar',
                    profesion: $("#profesion").val()
                },
                success: function(data){
                    
                    if(data.respuesta === "success"){
                        let result = (data.docentes.length < 1) ? [{ vacio: true }] : data.docentes;
                        response(result);   
                    }
                }
                    
            });
        },
        minLength: 2,
        select: function(event, ui){

            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                
                data = [ui.item]
                cargarInformacionDocentes(data);
            
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
            .append( "<div><b>Docente: </b>" + item.CodEmpleado + "<br><b>Nombre: </b> " +item.Personal + "</div>" )
            .appendTo( ul );
    };
    
    $("#docentes").focus();
});

$("#btnBuscar").click(function(){

    $('.text-loader').text('Cargando información, por favor espere..');
    $("#modalLoader").modal();

    $.ajax({
        url: path + "docentes/datosDocentes",
        dataType: "json",
        method : "post",
        data: {
            docente: $("#docentes").val(),
            opcion: 'buscar',
            profesion: $("#profesion").val()
        },
        success: function(data){
            
            if(data.respuesta === "success"){
                cargarInformacionDocentes(data.docentes)
            } 
            
            $("#modalLoader").modal("hide");

        }
            
    });

})

function cargarInformacionDocentes(data){

    const count = data.length

    if( count > 0 ){

        $("#tablaListadoDocentes tbody").find('tr').remove();  
        data.forEach(function(index,key){

            let plantilla = `<tr>
                <td>${key+1}</td>
                <td>${index.Personal}</td>
                <td>${index.CodEmpleado}</td>
                <td>${index.DNI}</td>
                <td>${index.Profesion}</td>
                <td>${index.Correo}</td>
                <td>${index.Telefonos}</td>
                <td>${index.Empleador}</td>
                <td>${index.Estado.toUpperCase()}</td>    
                <td>${index.FNacimiento}</td> 
            </tr>`;

            $("#tablaListadoDocentes tbody").append(plantilla)

        });

    }else{

        $("#tablaListadoDocentes tbody").html("<tr><td class='text-center' colspan='9'><b>SIN RESULTADOS</b></td></tr>")

    }

}