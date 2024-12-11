
$(document).ready(function(){



})

$("#consultarBoleta").click(function(e){
    const proceso = $("#planilla").val();  
    const empleado = $("#empleado").val();
    
    $.ajax({
        url: path + "planilla/boletaPorEmpleados",
        type: "POST",
        dataType:"JSON",
        data: {
            empleado: empleado,
            planilla: proceso,
            opcion: "buscar"
        } ,
        beforeSend: function () {
            $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function (response) {
            
            if(response.respuesta === "success"){
                
                if(response.personal.length > 0){
                    $("#tablaEmpleados tbody").html("");
                    response.personal.forEach(function(index,key){

                    if(index.feccese === "" || index.feccese === null){
                        fcese = "-";
                    }else{
                        fcese = index.feccese.substring(0,10);
                    }
                    plantilla = `<tr>
                            <td>${key+1}</td>
                            <td>${index.CodEmpleado.trim()}</td>
                            <td>${index.Empleado.trim()}</td>
                            <td>${index.DNI}</td>
                            <td>${index.Cargo}</td>
                            <td>${index.FIngreso}</td>
                            <td>${index.Empleador}</td>
                            <td>${fcese}</td>
                            <td>${index.Situacion}</td>
                            <td><button class="btn boton-tabla boton-rojo" type="button" data-codigo="${index.CodEmpleado.trim()}" onclick="mostrarBoleta(this)"><span class="icon-download2"></span></button></td>
                        </tr>`
                    $("#tablaEmpleados tbody").append(plantilla)

                    });
                }else{
                    $("#tablaEmpleados tbody").html("<tr><td class='text-center' colspan='10'><b>NO SE ENCONTRARON RESULTADOS</b></td></tr>");
                }
                $("#modalLoader").modal("hide");
            
            }else{

                $("#modalLoader").modal("hide"); 
                Notiflix.Report.Failure('ERROR INESPERADO',response.error,"Cerrar");
            }                                 
        },
    });
})

function descargarBoleta(btn){

    const codigo = $(btn).attr("data-codigo");
    const mes = $("#mes").val();
    const anio = $("#anio").val();
    const proceso = $("#proceso").val();
    let data = {
        opcion : "generarBoleta", 
        codigo : codigo,
        mes : mes,
        anio : anio,
        proceso : proceso
    }

    if(mes === "" || anio === ""){
        Notiflix.Notify.Warning("EL CAMPO MES O EL CAMPO AÑO NO PUEDEN ESTAR VACIAS");
        return; 
    }

    $.ajax({
        url: path + "planilla/boletaPorEmpleados",
        type: "POST",
        dataType:"JSON",
        data: data,
        beforeSend: function () {
            $('.text-loader').text('GENERANDO BOLETA, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function (response) {
            
            if(response.respuesta === "success"){
             
                let $a = $("<a>");
                $a.attr("href",response.pdf);
                
                $("body").append($a);
                $a.attr("download","file.pdf");
                $a[0].click();
                $a.remove();
                $("#modalLoader").modal("hide"); 
                Notiflix.Notify.Success("OPERACIÓN ÉXITOSA.");
               
            }else if(response.respuesta === "warning"){

                $("#modalLoader").modal("hide"); 
                Notiflix.Report.Warning('AVISO DE SISTEMA',response.error,"Cerrar");  

            }else{

                $("#modalLoader").modal("hide"); 
                Notiflix.Report.Failure('ERROR INESPERADO',response.error,"Cerrar");  
                
            }                                 
        },
    });

}

function mostrarBoleta(btn) {
    var codigo = $(btn).attr("data-codigo");
    var mes = $("#mes").val();
    var anio = $("#anio").val();
    var proceso = $("#proceso").val();
    $("#codigo").val(codigo);
    $("#frmBoletas").submit();
    
    $.ajax({
        url: path + "planilla/boletaPorEmpleados",
        type: "POST",
        dataType: "JSON",
        data: {
            codigo : codigo,
            mes : mes,
            anio : anio,
            proceso : proceso,
            opcion: "generarBoleta"
        },
        beforeSend: function () {
            $('.text-loader').text('DESCARGANDO BOLETA, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function (response) {
            if (response.respuesta === "success") {
                $("#modalLoader").modal("hide");
                Notiflix.Notify.Success("OPERACIÓN ÉXITOSA.");
            } else if (response.respuesta === "warning") {
                $("#modalLoader").modal("hide");
                Notiflix.Report.Warning('AVISO DE SISTEMA', response.error, "Cerrar");
            } else {
                $("#modalLoader").modal("hide");
                Notiflix.Report.Failure('ERROR INESPERADO', response.error, "Cerrar");
            }
        }
    });
}


async function convertirBlob(pdf) {
    const base64Response = await fetch(pdf);
    const blob = await base64Response.blob();
    return blob;
}