const language = {
    "processing": "Procesando...",
    "lengthMenu": "Mostrar _MENU_ registros",
    "zeroRecords": "No se encontraron resultados",
    "emptyTable": "No se encontraron registros",
    "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
    "infoFiltered": "(filtrado de un total de _MAX_ registros)",
    "search": "Buscar:",
    "infoThousands": ",",
    "loadingRecords": "Cargando...",
    "paginate": {
        "first": "Primero",
        "last": "Último",
        "next": "Siguiente",
        "previous": "Anterior"
    },
    "info": "Mostrando _START_ a _END_ de _TOTAL_ registros"
};

$(document).ready(function(){
    $("#tablaEncuestasEmpleabilidadRespuesta").DataTable({ 
        data : {}
    })
})

$("#btnBuscarEncuestas").click(function(){
    if($("#desde").val() === "" || $("#hasta").val() === ""){
        Notiflix.Notify.Warning("Por favor ingrese el rango de fechas.");
        return;
    }
    $.ajax({
        url: path + "BolsaTrabajo/reporteEncuestaEmpleabilidad",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion : "cargarEncuestas",
            desde : $("#desde").val(),
            hasta : $("#hasta").val()
        } ,
        beforeSend: function () {
            $('.text-loader').text('Cargando encuestas, por favor espere..');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {
         
            if(response.respuesta === "success" ){

                $("#tablaEncuestasEmpleabilidad tbody").html("");

                if(response.data.length > 0){
                    response.data.forEach(function( value , key ){
                        const tr = `<tr class="tr-cargar-respuestas" style="cursor:pointer" id="${value.idEncuesta}" onclick="cargarRespuestasEncuestas(this)">
                            <td class="text-center">${key + 1}</td>
                            <td class="text-center">${value.titulo.toUpperCase()}</td>
                            <td class="text-center">${value.desde}</td>
                            <td class="text-center">${value.hasta}</td>
                            <td class="text-center">CICLO ${value.codciclo1}</td>
                            <td class="text-center">CICLO ${value.codciclo2}</td>                    
                        </tr>`
                        $("#tablaEncuestasEmpleabilidad tbody").append(tr)    
                    });
                }else{
                    $("#tablaEncuestasEmpleabilidad tbody").html('<tr><td class="text-center" colspan="6"><b>No se encontraron encuestas</b></td></tr>') 
                }

                Notiflix.Notify.Success("SE CARGARON LAS ENCUESTAS DE MANERA ÉXITOSA.");
                
            }else{

                Notiflix.Report.Failure( "ERROR DE SISTEMA", response.error , "Aceptar");
                $("#tablaEncuestasEmpleabilidad tbody").html('<tr><td class="text-center" colspan="5"><b>REALICE UNA BÚSQUEDA</b></td></tr>') 

            }   

        },
    });

})

function cargarRespuestasEncuestas(tr){
    
    $(".tr-cargar-respuestas").removeClass("success");
    $(tr).addClass("success");

    const id = $(tr).attr("id");
    
    $.ajax({
        url: path + "BolsaTrabajo/reporteEncuestaEmpleabilidad",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion : "cargarPreguntasRespuesta",
            id : id
        } ,
        beforeSend: function () {
            $('.text-loader').text('Cargando, por favor espere...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {   
            if(response.respuesta === "success" ){

                $("#div-preguntas-respuestas").css({"display" : "block"});               
                $("#div-preguntas").html("");

                response.preguntas.forEach(function(value,key){
                    const pregunta = `
                            <div class="col-lg-4 col-md-6">
                                <div style="color:#286090;font-size:12px;font-weight:800">Pregunta ${key+1}</div>
                                <div style="color:#333333;font-size:12px;font-weight:700">
                                    ${value.pregunta.toUpperCase()}
                                </div> 
                            </div>                   
                    `;
                    $("#div-preguntas").append(pregunta)  
                });

                $('#tablaEncuestasEmpleabilidadRespuesta').empty();
                $('#tablaEncuestasEmpleabilidadRespuesta').dataTable().fnDestroy();
                $("#tablaEncuestasEmpleabilidadRespuesta").DataTable({             
                    ordering:  false,                   
                    lengthMenu: [
                        [ response.preguntas.length  , (response.preguntas.length * 2) , (response.preguntas.length * 3) , (response.preguntas.length * 4) , (response.preguntas.length * 5)], 
                        [ response.preguntas.length  , (response.preguntas.length * 2) , (response.preguntas.length * 3) , (response.preguntas.length * 4) , (response.preguntas.length * 5)]
                    ],
                    data : response.respuestas,
                    columns: [
                        { 
                            data: {},
                            render: function (data, type, row, meta) {
                                return meta.row + meta.settings._iDisplayStart + 1;
                            },
                            className : 'celda-centrada'
                        },
                        { 
                            data: null ,
                            render: function (data) {
                                return data.codigo.trim();
                            },className : 'celda-centrada' },

                        { 
                            data: null ,
                            render: function (data) {
                                return data.Alumno.trim().toUpperCase();
                            },className : 'celda-centrada'
                        },
                        { 
                            data: null ,
                            render: function (data) {
                                return data.Pregunta.trim().toUpperCase();
                            },className : 'celda-centrada'
                        },
                        { 
                            data: null ,
                            render: function (data) {
                                return data.Respuesta.trim().toUpperCase();
                            },className : 'celda-centrada'
                        }

                    ],
                    language : language
                });

            }else{

                $("#div-preguntas").html("");
                $("#div-respuestas").html(""); 
                $("#div-preguntas-respuestas").css({"display" : "block"});
                Notiflix.Notify.Failure("Ocurrio un error inesperado, por favor recargue la página y vuelva a intentarlo.");
            
            }   

        },
    });
}