$(document).ready(function(){

})

function subirExcel(){
    $("#modalSubirExcel").modal("show")
}

$(".cerrarModalSubirExcel").click(function(){

    $("#inputSubirExcel").val("")

})

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
    var excel = $("#inputSubirExcel")[0].files[0];
    var data = new FormData()
    data.append("opcion","leerExcel")
    data.append("excel",excel)

    $.ajax({
        url: path + "marketing/cargarAlumnos",
        type: "POST",
        dataType: "JSON",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function () {
            //$('.text-loader').text('ENVIANDO CORREO ELECTRÓNICO, POR FAVOR ESPERE...');
            // $("#modalLoader").modal();
        },
        success: function (response) {
            
            console.log(response)
            $("#tablaListadoAlumnos tbody").html("")

            if(response.alumnos.length > 0 ){

                response.alumnos.forEach(function(alumno,index){
                    let doc = "";
                    if(alumno[15].trim().toUpperCase() === "DNI"){
                        doc = alumno[4];
                    }else{
                        doc = alumno[16];
                    }

                    var tr = `<tr class="trElimnar">
                                <td style="padding:0px 7px;min-width:170px" class="celda-centrada">${alumno[0]}</td>
                                <td style="padding:0px 7px;min-width:170px" class="celda-centrada">${alumno[1]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[2]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[3]}</td>
                                <td style="padding:0px 7px;min-width:70px" class="celda-centrada">${alumno[15].toUpperCase()}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${doc}</td>
                                <td style="padding:0px 7px;min-width:150px" class="celda-centrada">${alumno[5]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[6]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[7]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[8]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[9]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[10]}</td>
                                <td style="padding:0px 7px;min-width: 75px" class="celda-centrada">${alumno[11]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[12]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[13]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[14]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[17]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[18]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[19]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[20]}</td>
                                <td style="padding:0px 7px;min-width: 110px" class="celda-centrada">${alumno[21]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[22]}</td>
                                <td style="padding:0px 7px;min-width: 75px" class="celda-centrada">${alumno[23]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[24]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[25]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[26]}</td>
                                <td style="padding:0px 7px" class="celda-centrada">${alumno[27]}</td>
                                <td class="celda-centrada">
                                    <button class="btn btn-sm boton-rojo mipanel-btn-tabla-texto btnEliminarFila" type="button"><span class="icon-bin"></span></button>
                                </td>
                            </tr>`;

                    $("#tablaListadoAlumnos tbody").append(tr);
                    
                });
                
                Notiflix.Report.Success('CONFIRMACIÓN',"ALUMNOS CARGADOS SATISFACTORIAMENTE","Cerrar");

                if(response.errores.length > 0){
                    var errores = "";
                    errores += "<b style='text-transform:uppercase'>Las siguientes filas de su archivo excel no cumplen los requisitos para su registro o ya se encuentra registrado, se le indica el error por fila.</b> </br></br>"
                    response.errores.forEach(function(val,index){
                        console.log(val)
                        errores += "<b>Fila "+val.fila+"</b> : "+val.error+".<br>";
                    });
                    mostrarMensaje("mensaje", "AVISO DE SISTEMA", errores );
                }
                


                $("#btnRegistrarInformacion").prop("disabled",false)

            }else{

                if(response.errores.length > 0){
                    var errores = "";
                    errores += "<b style='text-transform:uppercase'>Las siguientes filas de su archivo excel no cumplen los requisitos para su registro o ya se encuentra registrado, se le indica el error por fila.</b> </br></br>"
                    response.errores.forEach(function(val,index){
                        console.log(val)
                        errores += "<b>Fila "+val.fila+"</b> : "+val.error+".<br>";
                    });
                }

                mostrarMensaje("mensaje", "AVISO DE SISTEMA", errores );
                $("#tablaListadoAlumnos tbody").html("<tr><td class='text-center' colspan='26'><b>No hay resultados que cargar</b></td></tr>")
                Notiflix.Report.Warning('AVISO DE SISTEMA',"NO HAY INFORMACIÓN DISPONBLE PARA CARGAR","Cerrar");

            }

            $("#inputSubirExcel").val("")
            $("#modalSubirExcel").modal("hide");
            $("#modalLoader").modal("hide");

        }
    })
})

$(document).on("click",".btnEliminarFila",function(){
    $(this).parent().parent().remove()
})

$("#btnRegistrarInformacion").click(function(){

    let data = [];
    $("#tablaListadoAlumnos tbody tr").each(function(vak,key){
        let data2 = [];
        $(this).find("td").each(function(){
            data2.push($(this).text().trim());
        })
        data.push(data2);
    })

    $.ajax({
        url: path + "marketing/cargarAlumnos",
        type: "POST",
        dataType: "JSON" ,
        data: {
            'opcion' : "importarAlumnos",
            'data': JSON.stringify(data)
        },
        beforeSend: function () {
            $('.text-loader').text('Cargando información, por favor espere..');
            $("#modalLoader").modal();
        },
        success: function (response) {

            console.log(response)    

            if(response.respuesta === "success"){

                $("#btnRegistrarInformacion").prop("disabled",true);
                $("#tablaListadoAlumnos tbody").html("<tr><td class='text-center' colspan='9'><b>No hay resultados que cargar</b></td></tr>");
                $("#inputSubirExcel").val("");
                Notiflix.Report.Success('OPERACIÓN ÉXITOSA',"La información se registro en la Base de Datos éxitosamente","Cerrar");

            }else{

                $("#btnRegistrarInformacion").prop("disabled",true);
                $("#tablaListadoAlumnos tbody").html("<tr><td class='text-center' colspan='9'><b>No hay resultados que cargar</b></td></tr>");
                $("#inputSubirExcel").val("");
                Notiflix.Report.Failure('OCURRIO UN ERROR',"No se pudo registrar la información </br>"+ response.error ,"Cerrar");

            }

        },
        complete: function(){
            $("#modalLoader").modal("hide");
        }
    });
    
    //data.forEach(array.forEach()
    //dataJson = Object.assign({}, data);
    //console.log(dataJson)

})