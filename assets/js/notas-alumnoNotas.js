let tbody_1 = $("#tablaNotasEvaluacion tbody");
let tbody_2 = $("#tablaNotasIntranet tbody");

$(document).ready(function () {

    $("#alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "Notas/alumnoNotas",
                type: 'post',
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarAlumnos'
                },
                success: function(data){
                    console.log(data);
                    $("#alumno").removeAttr("data-code");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');

                    let datos = $('#datos-alumno');
                    tbody_1.find('tr').remove();
                    tbody_2.find('tr').remove();

                    datos.hide('300');


                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos;
                    console.log(result);
                    response(result);
                }
            });
        },
        minLength: 3,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                $("#alumno").val(ui.item.nombre);
                $("#alumno").attr('data-code', ui.item.codigo);
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');
                let datos = $('#datos-alumno');
                datos.show('300');
                $('#codigo-alumno').text(ui.item.codigo);
                $('#nombre-alumno').text(ui.item.nombre);
                selectNotas(ui.item.codigo);
            }
            return false;
        }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
        if (item.vacio) {
            return $( "<li>" )
            .append( "<div>No se encontraron resultados</div>" )
            .appendTo( ul );
        }

        return $( "<li>" )
            .append( "<div><b>" + item.codigo + "</b> - " +item.nombre + "</div>" )
            .appendTo( ul );
    };

    $("#alumno").focus();
    
});

$('#alumno').click(function() {
    $("#alumno").select();
})

function selectNotas(codigo) {
    $.ajax({
        url: path + "Notas/alumnoNotas",
        type: "POST",
        dataType: 'json',
        data: {
            codigo: codigo,
            opcion: "selectNotas"
        },
        beforeSend: function () {
            $('.text-loader').text('Consultando datos, por favor espere...');
            $("#modalLoader").modal();
        },
        success: function (data) {
            console.log(data);

            if (data.respuesta === 'success') {
                let promesas = [
                    dibujarNotasEvaluacion(data.notas_1),
                    dibujarNotasIntranet(data.notas_2)
                ];
                Promise.all(promesas).then(r =>{
                    console.log(r);
                    console.log('Se terminó de dibujar la table 1');
                })

                // Notiflix.Report.Success("Correo enviado","El correo fue enviado correctamente.", "Aceptar");
            } else{
                // Notiflix.Notify.Failure('Ocurrió un error al enviar el correo');
            }

            // $("#modalEnviarCorreo").modal("hide");
            // limpiarModalCorreo();
                            
        },
        error: function (error) {
            console.log(error);
        },
        complete: function(){
            $("#modalLoader").modal("hide");
        }
    });
}

function dibujarNotasEvaluacion(notas) {
    return new Promise(function(resolve, reject) {

        tbody_1.find('tr').remove();

        var datax = notas;
            var ciclos = {}; 
            for (var i = 0; i < datax.length; i++) {
                var alu = datax[i];
                var alumnos = alu.cod_ciclo;
                if (!ciclos[alumnos]) {
                    ciclos[alumnos] = [];
                }
                ciclos[alumnos].push(alu);
            }

            console.log("cabezas", ciclos);

            for (var alumnos in ciclos) {
                var alumnosCiclo = ciclos[alumnos];
                 for (var j = 0; j < alumnosCiclo.length; j++) {
                    var item = alumnosCiclo[j];
                    var tr = "<tr>";
                        if (j === 0) {                                            
                            tr += "<tr><td colspan='22'><hr style='border-bottom: 1px solid #326299;'></td></tr>";                                      
                        }
                        tr+=`
                                <td class='text-center' style='height: 44px;'>${j+1}</td>
                                <td class='text-center'>${item.Especialidad}</td>
                                <td class='text-center'>${item.Cod_Curso}</td>
                                <td class='text-center'>${item.Curso}</td>
                                <td class='text-center'>${item.CodDocente}</td>
                                <td class='text-center'>${item.Docente}</td>
                                <td class='text-center'>${item.cod_ciclo}</td>
                                <td class='text-center'>${item.Año}</td>
                                <td class='text-center'>${item.Mes}</td> 

                                <td class='text-center'>${item.AP1}</td>
                                <td class='text-center'>${item.ED1}</td>
                                <td class='text-center'>${item.EP}</td>
                                <td class='text-center'>${item.AC1}</td>
                                <td class='text-center'>${item.PR1}</td>
                                            
                                <td class='text-center'>${item.AP2}</td>
                                <td class='text-center'>${item.ED2}</td>
                                <td class='text-center'>${item.EF}</td>
                                <td class='text-center'>${item.AC2}</td>
                                <td class='text-center'>${item.PR2}</td>
                                
                                <td class='text-center'>${item.PR}</td>
                                <td class='text-center'>${item.ER}</td>
                            </tr>`;
                        
                        tbody_1.append(tr);
                    };                    
            }
            // $.each(notas, function(i, item) {
                    //     tr=`
                    //             <td class='text-center' style='height: 44px;'>${i+1}</td>
                    //             <td class='text-center'>${item.Especialidad}</td>
                    //             <td class='text-center'>${item.Cod_Curso}</td>
                    //             <td class='text-center'>${item.Curso}</td>
                    //             <td class='text-center'>${item.CodDocente}</td>
                    //             <td class='text-center'>${item.Docente}</td>
                    //             <td class='text-center'>${item.cod_ciclo}</td>
                    //             <td class='text-center'>${item.Año}</td>
                    //             <td class='text-center'>${item.Mes}</td> 

                    //             <td class='text-center'>${item.AP1}</td>
                    //             <td class='text-center'>${item.ED1}</td>
                    //             <td class='text-center'>${item.EP}</td>
                    //             <td class='text-center'>${item.AC1}</td>
                    //             <td class='text-center'>${item.PR1}</td>
                                            
                    //             <td class='text-center'>${item.AP2}</td>
                    //             <td class='text-center'>${item.ED2}</td>
                    //             <td class='text-center'>${item.EF}</td>
                    //             <td class='text-center'>${item.AC2}</td>
                    //             <td class='text-center'>${item.PR2}</td>
                                
                    //             <td class='text-center'>${item.PR}</td>
                    //             <td class='text-center'>${item.ER}</td>
                    //         </tr>`;
                        
                    //     tbody_1.append(tr);
                    // });

        resolve(JSON.parse('true'));

    })

}

function dibujarNotasIntranet(notas) {
    return new Promise(function(resolve, reject) {

        tbody_2.find('tr').remove();

        var datax = notas;
            var ciclos = {}; 
            for (var i = 0; i < datax.length; i++) {
                var alu = datax[i];
                var alumnos = alu.cod_ciclo;
                if (!ciclos[alumnos]) {
                    ciclos[alumnos] = [];
                }
                ciclos[alumnos].push(alu);
            }

            console.log("cabezas2222", ciclos);

            for (var alumnos in ciclos) {
                var alumnosCiclo = ciclos[alumnos];
                 for (var j = 0; j < alumnosCiclo.length; j++) {
                    var item = alumnosCiclo[j];

                    color = ''
                        if(item.NotaDocente.trim() != item.PR.trim()){
                            color = '#fecaca'
                        }
                    var tr = "<tr style='background-color: "+color+"'>";
                        if (j === 0) {                                            
                            tr += "<tr><td colspan='22'><hr style='border-bottom: 1px solid #326299;'></td></tr>";                                      
                        }        

                        tr+=`
                            <td class='text-center'>${j+1}</td>
                            <td class='text-center'>${item.Especialidad}</td>
                            <td class='text-center'>${item.cod_ciclo}</td>
                            <td class='text-center'>${item.CodCurso}</td>
                            <td class='text-center'>${item.Curso}</td>
                            <td class='text-center'>${item.Sede}</td>
                            <td class='text-center'>${item.AP1}</td>
                            <td class='text-center'>${item.ED1}</td>
                            <td class='text-center'>${item.EP}</td>              
                            <td class='text-center'>${item.AC1}</td>
                            <td class='text-center'>${item.PR1}</td>               
                            <td class='text-center'>${item.AP2}</td>
                            <td class='text-center'>${item.ED2}</td>   
                            <td class='text-center'>${item.EF}</td>
                            <td class='text-center'>${item.AC2}</td>
                            <td class='text-center'>${item.PR2}</td>
                            <td class='text-center'>${item.PR}</td>
                            <td class='text-center'>${item.ER}</td>
                            <td class='text-center'>${item.Docente}</td>
                            <td class='text-center'>${item.NotaDocente}</td>
                            <td class='text-center'>${item.ERDocente}</td>
                            </tr>`;
                
                        tbody_2.append(tr);
                    };                    
            }
    
        // $.each(notas, function(i, item) {
    
        //     let tr=`<tr>
        //         <td class='text-center'>${i+1}</td>
        //         <td class='text-center'>${item.Especialidad}</td>
        //         <td class='text-center'>${item.cod_ciclo}</td>
        //         <td class='text-center'>${item.CodCurso}</td>
        //         <td class='text-center'>${item.Curso}</td>
        //         <td class='text-center'>${item.Local}</td>
        //         <td class='text-center'>${item.Sede}</td>
        //         <td class='text-center'>${item.AP1}</td>
        //         <td class='text-center'>${item.ED1}</td>
        //         <td class='text-center'>${item.EP}</td>              
        //         <td class='text-center'>${item.AC1}</td>
        //         <td class='text-center'>${item.PR1}</td>               
        //         <td class='text-center'>${item.AP2}</td>
        //         <td class='text-center'>${item.ED2}</td>   
        //         <td class='text-center'>${item.EF}</td>
        //         <td class='text-center'>${item.AC2}</td>
        //         <td class='text-center'>${item.PR2}</td>
        //         <td class='text-center'>${item.PR}</td>
        //         <td class='text-center'>${item.ER}</td>
        //         </tr>`;
    
        //     tbody_2.append(tr);
        // });

        resolve(JSON.parse('true'));

    })

    // resolve(JSON.parse({'res':'ok'}));

}