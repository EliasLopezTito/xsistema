$(document).ready(function(){
   
    cargarAnuncios();

})

$("#imagen").change(function(){

    let archivo = $(this)[0].files[0];
    if(archivo === undefined){

        $(this).val(null);
        $("#vistaPrevia").prop("disabled",true);
        $('#imgVistaPrevia').attr("src", ""); 

    } else if(archivo["type"] == "image/jpg" || archivo["type"] == "image/jpeg" || archivo["type"] == "image/png" || archivo["type"] == "video/mp4" ){

        Notiflix.Notify.Success('IMAGEN ACEPTADA');    
        $("#vistaPrevia").prop("disabled",false);

        var reader = new FileReader();
        reader.onload = function (e) {
            $('#imgVistaPrevia').attr('src', e.target.result);
        }
        reader.readAsDataURL(archivo);
        
    }else{

        $(this).val(null);
        $("#vistaPrevia").prop("disabled",true);
        Notiflix.Report.Warning('AVISO',"EL ARCHIVO DEBE DE SER JPG, JPEG O PNG.","Cerrar");
        $('#imgVistaPrevia').attr("src", ""); 

    }

})

$("#vistaPrevia").click(function(){
    $("#modalVistaPrevia").modal();
})

$("#close_modal").click(function(){
    $("#modalVistaPrevia").modal("hide");
})

$("#formCrearAnuncio").on("submit",function(e){
    e.preventDefault();

    let data = new FormData(this)
    data.append("opcion","registrarAnuncio")

    $.ajax({
        url: path + "marketing/anunciosIntranet",
        type: "POST",
        dataType: "JSON",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {                    

            if(response.respuesta === "success"){
                Notiflix.Notify.Success('EL ANUNCIO DE CREO CON ÉXITO.',{timeout:4000});
                $("#formCrearAnuncio")[0].reset();
                $("#vistaPrevia").prop("disabled",true);
                cargarAnuncios();
            }else if(response.respuesta === "warning"){
                Notiflix.Notify.Warning(response.error,{timeout:8000});
            }else{
                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO : "+response.error,{timeout:8000});
            }

        }
    })

})

function cargarAnuncios(){

    $.ajax({
        url: path + "marketing/anunciosIntranet",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "cargarAnuncios"
        },
        beforeSend : function(){
            $("#tablaAnuncios tbody").html("");
        },
        success: function (response) {    
            console.log(response)                            
           
            if(response.respuesta === "success"){
                
                if(response.data.length < 1){
                    const trcolspan = `
                        <tr>
                            <td class="text-center" colspan="7"><b>No hay anuncios creados</b></td>                            
                        </tr>
                    `;
                    $("#tablaAnuncios tbody").html(trcolspan);
                    return;
                }

                response.data.forEach( (val,key) => {
                    
                    const tr = `
                        <tr>
                            <td class="text-center">${key+1}</td>
                            <td class="text-center">${val.titulo.toUpperCase().trim()}</td>
                            <td class="text-center"><a href='${val.link.trim()}' target="_blank">${val.link.trim()}</a></td>
                            <td class="text-center">${val.desde.substring(0,10)}</td>
                            <td class="text-center">${val.hasta.substring(0,10)}</td>
                            <td class="text-center">${(val.estado===1?"<span style='color:green'>ACTIVO</span>":"<span style='color:red'>INACTIVO</span>")}</td>
                            <td class="text-center">${(val.estado===1?"<button onclick='cambiarEstado("+val.id+","+val.estado+")'><i class='fa fa-toggle-on' style='color:green' aria-hidden='true'></i></span></button>":"<button onclick='cambiarEstado("+val.id+","+val.estado+")'><i class='fa fa-toggle-off' aria-hidden='true'></i></span></button>")}</td>                            
                        </tr>
                    `;
                    $("#tablaAnuncios tbody").append(tr);

                });
            
            }else{

                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO : "+response.error,{timeout:8000});
            
            }

        }
    })

}

function cambiarEstado(id, estado){
    Notiflix.Confirm.Show(
        'Cambiar estado',
        '¿Esta segura cambiar de estado?',
        'Si',
        'No',
        function okCb() {
            $.ajax({
                url: path + "marketing/anunciosIntranet",
                type: "POST",
                data: {
                    id: id,
                    estado: estado,
                    opcion: 'cambiarEstado'
                },
                success: function (data) {
                    var datos = JSON.parse(data);
                    if (datos.respuesta == "success") {
                        cargarAnuncios()
                        console.log(datos)

                    }
                }
            });
        },
        function cancelCb() {

        },
        {
        },
    );
}