$(document).ready(function () {
    
    

});

//INCIO DE CONFIGURACIONES



$("#formRegistrar").submit(function (e) {

    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"registrarParametros"});    

    $.ajax({
        url: path + "programacion/parametrosPresencial",
        type: "POST",
        dataType: "JSON",
        data: $.param(data),
        success: function (data) {
            
            if (data.respuesta === "success") {
                
                Notiflix.Notify.Success('LOS PARÁMETROS SE REGISTRARON CON ÉXITO');

            } else {
                
                Notiflix.Notify.Failure('OCURRIO UN ERROR INESPERADO, POR FAVOR VUELVA A INTENTARLO');

            }
        }
    });
});