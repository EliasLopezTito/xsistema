$(document).ready(function(){

    cargarCarreras();

})

$("#instituto").change(function(){
    cargarCarreras();
})

function cargarCarreras(){
    $.ajax({
        url: path + "programacion/impProgramacionPorCodigo",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion : "cargarCarreras",
            local : $("#instituto").val()
        },
        success: function (response) {           
            if(response.respuesta === "success"){
                $("#carrera").html("")
                response.data.forEach( e => {
                    $("#carrera").append("<option value='"+e.tipo_espe.trim()+"'>"+e.Descripcion.trim()+"</option>")
                });
                cargarEspecialidades();
            }else{
                $("#carrera").html("")
                $("#especialidad").html("")
            }        
        },        
    });
}

$("#carrera").change(function(){
    cargarEspecialidades();
})

function cargarEspecialidades(){
    $.ajax({
        url: path + "programacion/impProgramacionPorCodigo",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion : "cargarEspecialidades",
            local : $("#instituto").val(),
            carrera : $("#carrera").val()
        },
        success: function (response) {   
            if(response.respuesta === "success"){
                $("#especialidad").html("")
                response.data.forEach( e => {
                    $("#especialidad").append("<option value='"+e.cod_espe.trim()+"'>"+e.Descripcion.trim()+"</option>")
                });
            }else{
                $("#especialidad").html("")
            }        
        },        
    });
}

$("#cbxCodigo").change(function(){

    if( $(this).is(":checked") ){
        $("#codigo").prop("disabled",false).val("")

    }else{
        $("#codigo").prop("disabled",true).val("")
    }

})

$("#frmImportarProgramacionPorCodigo").submit(function(e){
    
    e.preventDefault();
    var form = $(this).serializeArray();
    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro se realizar la importación?',
        'Si',
        'No',
        function(){
                        
            form.push({name: "opcion", value: "importar"});
            
            $.ajax({

                url: path + "programacion/impProgramacionPorCodigo",
                type: "POST",
                dataType:"JSON",
                data: form,
                beforeSend: function () {
                    $('.text-loader').text('REALIZANDO LA IMPORTACIÓN, POR FAVOR ESPERE...');
                    $("#modalLoader").modal();
                },
                success: function (response) {
                    
                    if(response.respuesta === "success"){

                        Notiflix.Report.Success("OPERACIÓN ÉXITOSA","","Cerrar");

                        if(response.errores.length > 0){
                            var errores = "";
                            errores += "<b>Los siguientes códigos no se importaron debido a un error de sistema, por favor vuelva a intentarlo o importelos de manera individual.</b> </br>"
                            for(i = 0; i < response.errores.length; i++){
                                errores += response.errores[i] + "<br>";
                            }
                            mostrarMensaje("error","AVISO DE SISTEMA",errores);
                        }

                    }else if(response.respuesta === "warning"){
                        Notiflix.Report.Warning("AVISO DE SISTEMA",response.error,"Cerrar");
                    }else{
                        Notiflix.Report.Failure("ERROR DE SISTEMA",response.error,"Cerrar");
                    }
                    
                    $("#modalLoader").modal("hide");

                },
            
            });

        },
        function(){
           
        }
    );


})