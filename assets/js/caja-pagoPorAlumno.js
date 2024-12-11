document.addEventListener("DOMContentLoaded", () => {

    $("#usuarios").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "caja/pagoPorAlumno",
                dataType: "json",
                type: 'post',
                data: {
                    alumno : request.term,
                    opcion : 'buscarAlumnos'
                },
                success: function(data){

                    $("#usuarios").next('i').removeClass('glyphicon-ok');
                    $("#usuarios").next('i').addClass('glyphicon-remove');
                    $("#usuarios").parent().removeClass('has-success');
                    $("#usuarios").parent().addClass('has-error');
                    
                    let result = ( data.alumnos === "vacio") ? [{ vacio: true }] : data.alumnos;
                                        
                    response(result);

                }
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{

                $("#usuarios").val(ui.item.cod_alumno.trim()+" - "+ui.item.apellidos_nombres.trim());
                $("#usuarios").next('i').removeClass('glyphicon-remove');
                $("#usuarios").next('i').addClass('glyphicon-ok');
                $("#usuarios").parent().removeClass('has-error');
                $("#usuarios").parent().addClass('has-success');
                
                descargarReportePorAlumno(ui.item.cod_alumno);

            }
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {

        if (item.hasOwnProperty('vacio')) {
            return $( "<li>" )
            .append( "<div>No se encontraron resultados</div>" )
            .appendTo( ul );
        }

        return $( "<li>" )
            .append( "<div><b>Código: </b>" + item.cod_alumno + " &nbsp&nbsp-&nbsp <b>Alumno: </b> " +item.apellidos_nombres + "</div>" )
            .appendTo( ul );
    };
    $("#usuarios").focus();

});

function descargarReportePorAlumno(codigo){

    $.ajax({
        url: path + "caja/pagoPorAlumno",
        type: "POST",
        dataType:"JSON",
        data: {
            opcion : "descargarPdf",
            codigo : codigo
        },
        beforeSend: function () {
            $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function (response) {
            
            if(response.respuesta === "success"){
                /**let $a = $("<a>");
                $a.attr("href",response.pdf);
                $("body").append($a);
                $a.attr("download","file.pdf");
                $a[0].click();
                $a.remove();
                $("#modalLoader").modal("hide"); 
                Notiflix.Notify.Success("OPERACIÓN ÉXITOSA.");**/
                //2021A0006
                meses = {"01" : "Enero", "02" : "Febrero", "03" : "Marzo", "04" : "Abril", "05" : "Mayo", "06" : "Junio", "07" : "Julio", "08" : "Agosto", "09" : "Septiembre",  "10" : "Octubre", "11" : "Noviembre", "12" : "Diciembre"}
                if(response.data.length > 0){
                    $("#tablaListadoo tbody").html("")
                    response.data.forEach(function(index,key){
                        let plantilla = `<tr>
                            <td>${key+1}</td>
                            <td>${index.Institucion}</td>
                            <td>${index.especialidad}</td>
                            <td class="text-center">${index.concepto}</td>
                            <td class="text-center">${ index.fecha.substring(0,10) }</td>
                            <td class="text-center">${index.Talon} - ${index.Recibo}</td>
                            <td class="text-center">${index.Cod_ciclo}</td>
                            <td class="text-center">${index.Mes_Pago} ${meses[index.Mes_Pago]} ${index.ano_pago} </td>
                            <td class="text-center">S/. ${ new Intl.NumberFormat('en-US').format(Number(index.monto))}</td>                   
                        </tr>`;
                        $("#tablaListadoo tbody").append(plantilla)
                        $("#modalLoader").modal("hide"); 
                    })
                }else{
                    Notiflix.Notify.Warning('No hay información para cargar.'); 
                    $("#tablaListadoo tbody").html("<tr><td colspan='9' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>")  
                    $("#modalLoader").modal("hide");  
                }
            }else{
                $("#modalLoader").modal("hide"); 
                Notiflix.Report.Failure('ERROR INESPERADO',response.error,"Cerrar");      
            }                                 
        },
    });
}