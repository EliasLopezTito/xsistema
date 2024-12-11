$(document).ready(function(){
    cargarInstituciones(true);
    cargarSedes();
})

$("#formExportar").submit(function(e){

    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"exportar"})

    $.ajax({
        url: path + "notas/nominasMasivasV2",
        type: "POST",
        dataType: "JSON",
        data: $.param(data), 
        beforeSend: function(){
            $('.text-loader').text('ESTO PUEDE TOMAR UNOS MINUTOS, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        complete: function(){
            $("#modalLoader").modal("hide");
        },    
        success: function (datos) {
                                                       
            if (datos.respuesta === "success") {

                var a = $("<a>");
                a.attr("href", datos.file);
                $("body").append(a);
                a.attr("download", "nominas-"+$("#periodo").val()+".xlsx");
                a[0].click();
                a.remove();
                Notiflix.Notify.Success("El documento se genero con éxito.")

            } else {

                Notiflix.Notify.Success("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO --> "+datos.error)

            }

        }
    });

})