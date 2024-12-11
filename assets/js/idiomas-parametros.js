$(document).ready(function () {

    //cargarConfiguraciones();
    //cargarParametrosEncuesta();

});

//INCIO DE CONFIGURACIONES

$("#btnNuevaConfiRegNotas").click(function () {
    
    $("#modalParametroRegistroNotas").modal({ backdrop: 'static', keyboard: false });

});

$("#formParametrosRegitroNotas").submit(function(e){

    e.preventDefault();
    let req = $(this).serializeArray();
    req.push({ name:'opcion',value:'registrarParametrosRegistroNotas'})

    $.ajax({
        url: path + "idiomas/parametros",
        type: "POST",
        dataType: "JSON",
        data: $.param(req),
        success: function (data) {
            
            console.log(data);
            window.location.reload()
            return;
            
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                bloquearDesbloquear(2);
                Notiflix.Notify.Success("OPERACIÓN EXITOSA")
            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });

})

function EditarConfiRegNotas(id){

    $.ajax({
        type: "POST",
        url: path + "idiomas/parametros",
        dataType: "JSON",
        data: {
            id_editar: id,
            opcion: "editarParametrosRegistroNotas"
        },
        success: function(resp){
            console.log("DATA_EDTIAR",resp)        
            $('#anioProg').val(resp.data[0].anioProg)
            $('#mesProg').val(resp.data[0].mesProg)
            $('#unidad').val(resp.data[0].unidadDidactica)
            $('#finicio').val(resp.data[0].fechaInicio)
            $('#fFin').val(resp.data[0].fechaFin)
            $('#idEditar').val(resp.data[0].id)         
            
        }
    })



    $("#modalParametroEditarNotas").modal({backdrop: 'static', keyboard: false});
    
}

$("#formParametrosEditarNotas").submit(function(e){

    e.preventDefault();
    let req = $(this).serializeArray();
    req.push({ name:'opcion',value:'registrarParametrosEditarNotas'})

    $.ajax({
        url: path + "idiomas/parametros",
        type: "POST",
        dataType: "JSON",
        data: $.param(req),
        success: function (data) {
            
            console.log(data);
            window.location.reload()
            return;
            
            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                bloquearDesbloquear(2);
                Notiflix.Notify.Success("OPERACIÓN EXITOSA")
            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });

})