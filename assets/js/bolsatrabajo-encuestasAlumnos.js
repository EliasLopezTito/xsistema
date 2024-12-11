$(document).ready(function(){
    //$("#modalCrearEditarEncuesta").modal("show")
});



$("#btnCrearEncuesta").click(function(){

    $("#modalCrearEditarEncuesta").modal("show")
})
//AÑADIR PREGUNTA CON ALTERNATIVA
$("#add_pregunta_sin_alternativa").click(function(){  
    const count = $(".count-pregunta").length
    const plantilla = cargarPlantillaSinAlternativas(count)
    if(count < 1){
        $("#line").after(plantilla)
    }else{
        $(".btn-eliminar-pregunta").each(function(){
            $(this).remove()
        })
        $("#pregunta"+count).after(plantilla)
    }
})

//AÑADIR PREGUNTA CON ALTERNATIVA
$("#add_pregunta_alternativa").click(function(){  
    const count = $(".count-pregunta").length
    const plantilla = cargarPlantillaConAlternativas(count)
    if(count < 1){
        $("#line").after(plantilla)
    }else{
        $(".btn-eliminar-pregunta").each(function(){
            $(this).remove()
        })
        $("#pregunta"+count).after(plantilla)
    }
})

//DESPLAZAR PARA VER ALTERNATIVAS
$(document).on("click",".btn-alternativa",function(){
    $(this).parent().parent().next().next().toggle("hide")
})

//ELIMINAR PREGUNTA SELECCIONADA
$(document).on("click",".btn-eliminar-pregunta",function(){
    $(this).parent().parent().parent().remove();
    const count = $(".count-pregunta").length
    const btn_eliminar = `<button class="btn boton-rojo mipanel-btn-img-texto btn-eliminar-pregunta" style="padding:0px 6px;margin-left:10px"><span class="icon-bin" style="padding:0px"></span></button>`;
    $("#pregunta"+count).children(".caja-superior").children("div").append(btn_eliminar);

})

//CERRAR - REINICIAR MODAL
$("#cerrar_modal_registrar").click(function(){
    reiniciarModalAgregarEncuesta();
})

$('#frmEncuesta').submit(function(e){
    
    e.preventDefault();
    const data = $(this).serialize();
    const data_array = $(this).serializeArray(); 

    $.ajax({

        url: path + "BolsaTrabajo/encuestasAlumnos",
        type: "POST",
        dataType:"JSON",
        data: data ,
        beforeSend: function () {
            $('.text-loader').text('Cargando información, por favor espere..');
            $("#modalLoader").modal();
        },
        success: function (response) {

            if(response.respuesta === "success" ){

                Notiflix.Report.Success("Operación éxitosa","La encuesta ha sido registrada de manera correcta.","Cerrar");
                reiniciarModalAgregarEncuesta();
                $("#modalCrearEditarEncuesta").modal("hide")

            }else if( response.respuesta === "warning"){

                Notiflix.Report.Warning("Aviso de sistema", response.error.toUpperCase()+"."); 

            }else{

                Notiflix.Report.Failure("Ooops, Ocurrio un error inesperado","Por favor recargue la página y vuelva a intentarlo.", "Aceptar");
                reiniciarModalAgregarEncuesta();

            }         

        },
        complete: function(data){
            $("#modalLoader").modal("hide");
        }
    });

})

function reiniciarModalAgregarEncuesta(){
    $("#titulo").val("")
    $("#desde").val("")
    $("#hasta").val("")    
    $(".count-pregunta").each(function(){
        $(this).remove()
    })
}


$("#btnCargarEncuesta").click(function(){

    $.ajax({
        url: path + "BolsaTrabajo/encuestasAlumnos",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion : "cargarEncuestas",
            desde : $("#desdeCargar").val(),
            hasta : $("#hastaCargar").val()
        } ,
        beforeSend: function () {
            $('.text-loader').text('Cargando encuestas, por favor espere..');
            $("#modalLoader").modal();
        },
        success: function (response) {

            console.log(response)
            const encuestas = response.data

            if(response.respuesta === "success" ){

                $("#tablaListadoEncuestas tbody").html("");

                encuestas.forEach(function(e,i){

                    let preguntas = "" ;
                   
                    e.preguntas.forEach(function(p,n){
            
                        preguntas += `
                            <b>${n+1})</b> &nbsp; ${p.pregunta.toUpperCase()}</br>
                        `;

                    })

                    const tr = `<tr>
                        <td class="text-center">${e.titulo.toUpperCase()}</td>
                        <td class="text-center">${e.preguntas.length}</td>
                        <td class="">${preguntas}</td>
                        <td class="text-center">
                            <button disabled class="btn boton-tabla boton-verde" type="button" onclick="editarEncuesta(this,${e.id});"><span class="icon-pencil"></span></button>
                            <button disabled class="btn boton-tabla boton-rojo" type="button" onclick="borrarEncuesta(this,${e.id});"><span class="icon-bin"></span></button>
                        </td>
                    </tr>`

                    $("#tablaListadoEncuestas tbody").append(tr)    

                });

                Notiflix.Notify.Success("SE CARGARON LAS ENCUESTAS DE MANERA ÉXITOSA.");
                
            }else if( response.respuesta === "warning"){

                Notiflix.Report.Warning( "AVISO DE SISTEMA", response.error , "Aceptar");
                $("#tablaListadoEncuestas tbody").html('<tr><td class="text-center" colspan="5"><b>REALICE UNA BÚSQUEDA</b></td></tr>')   
                
            }else{

                Notiflix.Report.Failure( "ERROR DE SISTEMA", response.error , "Aceptar");
                $("#tablaListadoEncuestas tbody").html('<tr><td class="text-center" colspan="5"><b>REALICE UNA BÚSQUEDA</b></td></tr>') 

            }   
            
            $("#modalLoader").modal("hide");

        },
    });

})

function editarEncuesta(btn,id){
    
}

function borrarEncuesta(btn,id){

}

/*--=============================================
 * PLANTILLAS TIPOS DE PREGUNTAS
 =============================================--*/
function cargarPlantillaConAlternativas(count){
    const plantilla = `<div id="pregunta${count+1}" class="col-xs-12 mipanel-row-fila row-fila count-pregunta" style="margin-bottom:8px">  
        <div style="display:flex;justify-content:space-between;margin-bottom:5px" class="caja-superior">
            <label style="font-size:12px" class="text-muted">PREGUNTA ${count+1} <label style="color: red;"> (*)</label></label>    
            <div>
                <button type="button" class="btn boton-verde mipanel-btn-img-texto btn-alternativa" style="padding:0px 6px;margin-left:15px"> Agregar alternativas <span class="icon-circle-down" style="padding:0px"></span></button>
                <button type="button" class="btn boton-rojo mipanel-btn-img-texto btn-eliminar-pregunta" style="padding:0px 6px;margin-left:10px"><span class="icon-bin" style="padding:0px"></span></button>
            </div>
        </div>
        <div>
            <input type="hidden" value="true" name="pregunta${count+1}[]" />
            <textarea class="form-control" name="pregunta${count+1}[]" style="height: 40px;"></textarea>
        </div> 
        <div class="col-xs-12 mipanel-row-fila row-fila" style="font-size:12px;display:none">
            <div class="col-lg-2 col-md-3 col-sm-3 col-xs-12 mipanel-row-fila row-fila">Alternativa 1 :</div>
            <div class="col-lg-10 col-md-9 col-sm-9 col-xs-12 mipanel-row-fila row-fila">
                <textarea class="form-control" name="pregunta${count+1}[]" style="height: 32px;"></textarea>
            </div>
            <div class="col-lg-2 col-md-3 col-sm-3 col-xs-12 mipanel-row-fila row-fila">Alternativa 2 :</div>
            <div class="col-lg-10 col-md-9 col-sm-9 col-xs-12 mipanel-row-fila row-fila">
                <textarea class="form-control" name="pregunta${count+1}[]" style="height: 32px;"></textarea>
            </div>
            <div class="col-lg-2 col-md-3 col-sm-3 col-xs-12 mipanel-row-fila row-fila">Alternativa 3 :</div>
            <div class="col-lg-10 col-md-9 col-sm-9 col-xs-12 mipanel-row-fila row-fila">
                <textarea class="form-control" name="pregunta${count+1}[]" style="height: 32px;"></textarea>
            </div>
            <div class="col-lg-2 col-md-3 col-sm-3 col-xs-12 mipanel-row-fila row-fila">Alternativa 4 :</div>
            <div class="col-lg-10 col-md-9 col-sm-9 col-xs-12 mipanel-row-fila row-fila">
                <textarea class="form-control" name="pregunta${count+1}[]" style="height: 32px;"></textarea>
            </div>
            <div class="col-lg-2 col-md-3 col-sm-3 col-xs-12 mipanel-row-fila row-fila">Alternativa 5 :</div>
            <div class="col-lg-10 col-md-9 col-sm-9 col-xs-12 mipanel-row-fila row-fila">
                <textarea class="form-control" name="pregunta${count+1}[]" style="height: 32px;"></textarea>
            </div>
            <div class="col-lg-2 col-md-3 col-sm-3 col-xs-12 mipanel-row-fila row-fila">Alternativa 6 :</div>
            <div class="col-lg-10 col-md-9 col-sm-9 col-xs-12 mipanel-row-fila row-fila">
                <textarea class="form-control" name="pregunta${count+1}[]" style="height: 32px;"></textarea>
            </div>
        </div>             
    </div>`;
    return plantilla
}
function cargarPlantillaSinAlternativas(count){
    const plantilla = `<div id="pregunta${count+1}" class="col-xs-12 mipanel-row-fila row-fila count-pregunta" style="margin-bottom:8px">  
        <div style="display:flex;justify-content:space-between;margin-bottom:5px" class="caja-superior">
            <label style="font-size:12px" class="text-muted">PREGUNTA ${count+1} <label style="color: red;"> (*)</label></label>    
            <div>                                
                <button type="button" class="btn boton-rojo mipanel-btn-img-texto btn-eliminar-pregunta" style="padding:0px 6px;margin-left:10px"><span class="icon-bin" style="padding:0px"></span></button>
            </div>
        </div>
        <div>
            <input type="hidden" value="false" name="pregunta${count+1}[]" />
            <textarea class="form-control" name="pregunta${count+1}[]" style="height: 40px;"></textarea>
        </div>                             
    </div>`;
    return plantilla;
}