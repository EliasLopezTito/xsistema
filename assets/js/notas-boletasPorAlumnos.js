$(document).ready(function () {

    $("#alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Programacion/descargarBoleta",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function(data){
                    
                    $("#btnImprimirBoleta").prop("disabled",true);
                    $("#btnImprimirHistorico").prop("disabled",true);
                    $("#carrera").html("").prop("disabled",true);
                    $("#tablaCursos tbody").html("");

                    $("#alumno").attr("codigo","");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');
                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos; 
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                $("#alumno").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#alumno").attr('codigo', ui.item.cod_alumno);
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');
                cargarCarreras(ui.item.cod_alumno);
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
            .append( "<div>"+item.cod_alumno+" - "+item.nombre+"</div>" )
            .appendTo( ul );
    };
    $("#alumno").focus();

    $("#carrera").change(function () {
        cargarCursos($(this).val());
    });

    $("#btnImprimirBoleta").click(function () {
        imprimirBoleta();
    });

    $("#btnImprimirHistorico").click(function () {
        if ($("#codAlumno").val() != null && $("#carrera").val() != null && $("#codAlumno").val() != "" && $("#carrera").val() != "") {
            var form = $("#frmBoleta").serializeArray();
            form.push({name: "opcion", value: "imprimirHistoricoNotas"});
            $.ajax({
                url: path + "notas/boletaDeNotas",
                type: "POST",
                data: $.param(form),
                beforeSend: function () {
                    $("#modalLoaderTitle").html("Imprimiendo Histórico...");
                    $("#modalLoader").modal({backdrop: 'static', keyboard: false});
                },
                success: function (data) {
                    //console.log(data);
                    $("#modalLoader").modal("hide");
                    var datos = JSON.parse(data);
                    if (datos.respuesta == "success") {
                        var a = $("<a>");
                        a.attr("href", datos.file);
                        $("body").append(a);
                        a.attr("download", "file.pdf");
                        a[0].click();
                        a.remove();
                    } else {
                        var errores = "";
                        for (i = 0; i < datos.errores.length; i++) {
                            errores += datos.errores[i] + "<br>";
                        }
                        mostrarMensaje("error", "ERROR", errores);
                    }
                }
            });
        } else {
            mostrarMensaje("error", "ERROR", "Seleccione todos los parametros");
        }
    });

    $("#cerraModal").click(function(){
        $("#modalVistaPreviaPdf").modal("hide")
    })
    
});


function cargarCarreras( codigo ){

    $.ajax({
        url: path + "notas/boletasPorAlumnos",
        type: "POST",
        dataType: "JSON",
        data: {            
            opcion: "cargarCarreras",
            codigo: codigo
        },
        success: function (response) {

            if (response.respuesta === "success") {

                if ((response.carreras) !== "vacio") {  

                    $("#carrera").html("<option selected disabled >--- Seleccione ---</option>").prop("disabled",false);

                    (response.carreras).forEach( val => {
                        
                        $("#carrera").append(`<option value="${val.cod_local.trim()}_${val.tipo_espe.trim()}_${val.cod_espe.trim()}_${val.cod_alumno.trim()}" > ${val.cod_local} -- ${val.tipo_espe_des} -- ${val.especialidad_des} -- ${val.malla_curricular_abr}</option>`);

                    });
        
                }else{

                    Notiflix.Notify.Warning('NO SE ENCONTRARON CARRERAS RELACIONADAS AL ALUMNO.',{ timeout: 4000 });

                }

            } else {

                Notiflix.Notify.Failure('Ocurrio un error inesperado, por favor recargue la página y vuelva a intentarlo.');

            }
        }
    });

}

function cargarCursos( data ) {
    
    $.ajax({
        url: path + "notas/boletasPorAlumnos",
        type: "POST",
        dataType: "JSON",
        data: {      
            opcion: "cargarCursos",
            data : data
        },
        beforeSend: function(){
            $("#modalLoader").modal({backdrop: 'static', keyboard: false});
            $("#tablaCursos tbody").html("");
        },
        complete : function(){
            $("#modalLoader").modal("hide");
        },
        success: function (response) {

            if (response.respuesta == "success") {
               
                if ((response.cursos).length > 0) {
                
                    (response.cursos).forEach( val => {

                        $("#btnImprimirBoleta").prop("disabled",false);
                        $("#btnImprimirHistorico").prop("disabled",false);
                        
                        const trcolspan = `<tr class="info" > <td class="text-center" colspan="7" ><b>CICLO ${val[0].Ciclo}</b></td> </tr>`;
                        $("#tablaCursos tbody").append(trcolspan);

                        val.forEach( (val2,key2) => {
                            
                            const tr = `<tr>
                                <td class="text-center">${key2+1}</td>   
                                <td class="text-center">${val2.cod_curso}</td>
                                <td class="text-center">${val2.Curso}</td>
                                <td class="text-center">${val2.Semestre}</td>
                                <td class="text-center">${val2.creditos}</td>
                                <td class="text-center">${val2.TipoNota}</td>                               
                                <td class="text-center" style="color:${(Number(val2.pf.trim())>12?"#0000ff":"#ff0000")};">${val2.pf}</td>
                            </tr>`;

                            $("#tablaCursos tbody").append(tr);

                        });

                    });

                }else{

                    $("#tablaCursos tbody").html("<tr><tr class='text-center' colspan='7'><b>No se encontro información para cargar</b></tr></tr>")

                } 

            } else {
                
                Notiflix.Notify.Failure('Ocurrio un error inesperado, por favor recargue la página y vuelva a intentarlo.');
                $("#tablaCursos tbody").html("");

            }
        }
    });
}

function imprimirBoleta(){
    
    $.ajax({
        url: path + "notas/boletasPorAlumnos",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "imprimirBoletaNotas",
            data: $("#carrera").val()        
        },
        beforeSend: function () {
            //$("#modalLoaderTitle").html("Imprimiendo Boleta...");
            //$("#modalLoader").modal({backdrop: 'static', keyboard: false});
            $('#modalVistaPreviaPdf .modal-body #divIframePdf').html("");
        },
        complete: function(){
            //$("#modalLoader").modal("hide");
        },
        success: function (response) {
            
            if (response.respuesta == "success") {
                                       
                let pdf  = '<iframe src="'+response.file+'" frameborder="0" width="100%" style="height: 65vh;"></iframe>'
                $('#modalVistaPreviaPdf .modal-body #divIframePdf').html(pdf);
                $("#modalVistaPreviaPdf").modal("show")

            } else {

                Notiflix.Notify.Failure('Ocurrio un error inesperado, por favor recargue la página y vuelva a intentarlo.');
                $('#modalVistaPreviaPdf .modal-body #divIframePdf').html("");
                
            }
            
        }
    });
    
}