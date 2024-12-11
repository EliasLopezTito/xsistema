$("#btnActualizar").click(function(){

    const contra = $("#contrasena").val()
    if(contra === ""){
        Notiflix.Notify.Warning("LA NUEVA CONTRASEÑA DEBE CONTENER MÍNIMO 4 CARACTERES.");
        return;
    }

    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Está seguro de actualizar su contraseña?',
        'Si',
        'No',
        function(){
            $.ajax({
                url: path + "seguridad/cambiarContrasena",
                type: "POST",
                dataType:"JSON",
                data: { contrasena : contra },
                beforeSend: function () {
                    $('.text-loader').text('ACTUALIZANDO CONTRASEÑA, POR FAVOR ESPERE.');
                    $("#modalLoader").modal();
                },
                complete : function(){
                    $("#modalLoader").modal("hide"); 
                },
                success: function (response) {
                 
                    if(response.respuesta === "success"){

                        const contra = $("#contrasena").val("")
                        Notiflix.Notify.Success("CONTRASEÑA ACTUALIZADA CORRECTAMENTE");

                    }else{

                        Notiflix.Notify.Warning("Ocurrio un error inesperado, por favor vuelva a intentarlo");

                    }
                                                 
                },
            });
        }
        ,function(){ 
        });
})