$(document).ready(function(){

})

$("#encuestas").change(function(){
    const id_encuesta = $(this).val();
    $.ajax({
        url: path + "Supervisor/encuestas",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion : "cargarPromedio",
            id : id_encuesta
        },
        beforeSend: function () {
            $("#tablaPromedios tbody").html("<tr><td colspan='4' class='text-center'> <b> Cargando... </b> </td></tr>");
        },
        success: function (response) {
            if (response.respuesta === "success") {
                if((response.data).length > 0){
                    $("#tablaPromedios tbody").html("");
                    let indice = 0 ;
                    response.data.forEach( ( val , key ) => {
                        let totalnota = 0 ;
                        val.forEach( ( val2 , key2 ) => {
                            val2.forEach(element => {
                                totalnota = totalnota + element.Puntaje;
                            });
                            indice += 1;
                            const tr = `
                                <tr>
                                    <td class="text-center" >${indice}</td>                                  
                                    <td class="text-center" >${val2[0].Curso.trim()}</td>
                                    <td class="text-center" >${val2[0].Docente.trim()}</td>
                                    <td class="text-center" >${ (  totalnota / val2.length ).toFixed() }</td>
                                </tr>
                            `;
                            totalnota = 0;
                            $("#tablaPromedios tbody").append(tr);
                        });
                    });
                }else{
                    $("#tablaPromedios tbody").html("<tr><td colspan='4' class='text-center'> <b> No se encontro información para cargar </b> </td></tr>");
                }
                Notiflix.Notify.Success("CONSULTA ÉXITOSA.");
            } else {
                Notiflix.Notify.Failure('OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO.');
                $("#tablaPromedios tbody").html("");
            }
        }
    });
})

$("#formConsultarEncuestas").submit(function(e){

    e.preventDefault();
    let form = $(this).serializeArray();
    form.push({name:"opcion",value:"consultarEncuestas"});

    $.ajax({
        url: path + "Supervisor/encuestas",
        type: "POST",
        dataType: "JSON",
        data: form,
        beforeSend: function () {
            $("#tablaPromedios tbody").html("");
            $("#tablaEncuestas tbody").html("<tr><td colspan='4' class='text-center'>Cargando...</td></tr>");
        },
        success: function (response) {

            if (response.respuesta === "success") {

                if(response.data !== "vacio"){

                    $("#tablaEncuestas tbody").html("");

                    response.data.forEach( ( val , key ) => {
                       
                        const tr = `
                            <tr class="tr-encuesta" idencuesta="${val.id_Encuesta}" >
                                <td class="text-center" >${key+1}</td>
                                <td class="text-center" >${val.Descripcion.trim()}</td>
                                <td class="text-center" >${val.DescripcionClasificacionEncuesta.trim()}</td>
                                <td class="text-center" >${val.NroItem}</td>
                            </tr>
                        `;

                        $("#tablaEncuestas tbody").append(tr);

                    });

                }else{

                    $("#tablaEncuestas tbody").html("<tr><td colspan='4' class='text-center'>No hay encuestas programadas en el periodo seleccionado.</td></tr>");

                }

                Notiflix.Notify.Success("CONSULTA ÉXITOSA.");

            } else {

                Notiflix.Notify.Failure('OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO.');
                
            }

        }
    });

})

$(document).on("click",".tr-encuesta",function(){

    $(".tr-encuesta").removeClass("success");
    $(this).addClass("success");
    const id_encuesta = $(this).attr("idencuesta");

    $.ajax({
        url: path + "Supervisor/encuestas",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion : "cargarPromedio",
            id : id_encuesta
        },
        beforeSend: function () {
            $("#tablaPromedios tbody").html("<tr><td colspan='5' class='text-center'> Cargando... </td></tr>");
        },
        success: function (response) {

            if (response.respuesta === "success") {

                if((response.data).length > 0){

                    $("#tablaPromedios tbody").html("");
                    let indice = 0 ;

                    response.data.forEach( ( val , key ) => {

                        let totalnota = 0 ;
                        val.forEach( ( val2 , key2 ) => {

                            val2.forEach(element => {
                                totalnota = totalnota + element.Puntaje;
                            });

                            indice += 1;
                            const tr = `
                                <tr>
                                    <td class="text-center" >${indice}</td>                                  
                                    <td class="text-center" >${val2[0].Curso.trim()}</td>
                                    <td class="text-center" >${val2[0].Docente.trim()}</td>
                                    <td class="text-center" >${ (  totalnota / val2.length ).toFixed() }</td>
                                </tr>
                            `;
                            totalnota = 0;

                            $("#tablaPromedios tbody").append(tr);

                        });

                    });

                }else{

                    $("#tablaPromedios tbody").html("<tr><td colspan='4' class='text-center'> No se encontro información para cargar</td></tr>");

                }

                Notiflix.Notify.Success("CONSULTA ÉXITOSA.");

            } else {
                Notiflix.Notify.Failure('OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO.');
            }

        }
    });

})