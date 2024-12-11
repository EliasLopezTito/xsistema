document.addEventListener("DOMContentLoaded", (e) => {

    cargarUsuarios($("#area").val())

});

$("#area").change(function(){
    cargarUsuarios( $(this).val() )
})

function cargarUsuarios(area){

    $.ajax({
        url: path + "seguridad/copiarPermisos",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion : "cargarUsuarios",
            area : area , 
        },
        beforeSend: function () {
            // $('.text-loader').text('CARGANDO USUARIOS, POR FAVOR ESPERE...');
            // $("#modalLoader").modal();
        },
        complete : function(){
            // $("#modalLoader").modal("hide");
        },
        success: function (res) {
        
            if(res.respuesta === "success"){

                $(".usuarios_class").html("")
                res.data.forEach(element => {
                    $(".usuarios_class").append(`<option value="${element.id_usuario}">${element.id_usuario} - ${element.apellidos} ${element.nombres} </option>`)    
                });

                //Notiflix.Notify.Success("ALUMNOS CARGADOS CON ÉXITO.");

            }else{

                Notiflix.Notify.Failure("Ocurrio un error inesperado, por favor vuelva a intentarlo."); 

            }
        },
        error : function(e){
            Notiflix.Notify.Failure("Ocurrio un error inesperado, por favor vuelva a intentarlo."); 
            console.log(e)
        } 
    })

}

$("#btnCopiarPermisos").click(function(){

    const usuario1 = $("#usuario1").val();
    const usuario2 = $("#usuario2").val();
    if(usuario1 === undefined || usuario2 === undefined){
        Notiflix.Notify.Warning("POR FAVOR SELECCIONE LOS USUARIOS");
    }
    $.ajax({
        url: path + "seguridad/copiarPermisos",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion : "copiarPermisos",
            usuario1 : usuario1 , 
            usuario2 : usuario2
        },
        beforeSend: function () {
            $('.text-loader').text('COPIANDO PERMISOS, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (res) {
            
            if(res.respuesta === "success"){
                Notiflix.Notify.Success("LOS PERMISOS SE COPIARON CON ÉXITO.");
            }else{
                Notiflix.Notify.Failure("Ocurrio un error inesperado, por favor vuelva a intentarlo."); 
            }
        }
    })

})