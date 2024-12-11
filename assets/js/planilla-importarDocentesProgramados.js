$(document).ready(function () {

})

function subirExcel(){
    $("#modalSubirExcel").modal("show")
}

$("#inputSubirExcel").change(function(){
    let archivo = $(this)[0].files[0];
    if(archivo["type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
        Notiflix.Notify.Success('DOCUMENTO EXCEL ACEPTADO');    
    }else{
        $(this).val(null);
        Notiflix.Report.Warning('AVISO',"EL ARCHIVO DEBE DE SER UN DOCUMENTO EXCEL","Cerrar");    
    }
})

$("#formSubirExcel").on("submit",function(e){
    e.preventDefault();

    let data = new FormData();
    let excel = $("#inputSubirExcel")[0].files[0];
    data.append("opcion","importarExcel");
    data.append('excel',excel);
    
    $.ajax({
        url: path + "planilla/importarDocentesProgramados",
        type: "POST",
        dataType: "JSON",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend : function(){
            $('.text-loader').text('Cargando información, por favor espere..');
            $("#modalLoader").modal();
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {
            
            if(response.respuesta === "success"){

                Notiflix.Notify.Success("SE IMPORTARON "+ response.cantidad +" DOCENTES CON ÉXITO.", { timeout : 10000 } );  
                $("#modalSubirExcel").modal("hide");
                $("#inputSubirExcel").val(null);  

            }else if(response.respuesta === "warning"){

                Notiflix.Notify.Warning( response.error , { timeout : 10000 }); 

            }else{

                Notiflix.Notify.Failure( 'OCURRIO UN ERROR INESPERADO, POR FAVOR ASEGURESE QUE CADA CELDA CUMPLA CON EL FORMATO CORRECTO.' , { timeout : 10000 } );    
            
            }

        }
    })
})