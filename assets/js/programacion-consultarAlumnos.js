$(document).ready(function () {

    $("#alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "programacion/consultarAlumnos",
                type: 'post',
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarAlumnos'
                },
                beforeSend : function(){
                    $("#especialidades").prop("disabled",true).html("")
                    $("#ciclo").prop("disabled",true)
                    $("#tablaCursos tbody").html("");
                    $("#tablaPagos tbody").html("");
                    $("#tablaNotas tbody").html("");
                    $("#empleado-curso").val("")
                    $("#sede-detalle").val("")
                    $("#totalCursos").val("")
                    $("#cursosDictados").val("")
                    $("#cursosPorDictar").val("")
                },
                success: function(data){

                    $("#alumno").attr("codigo","");
                    $("#alumno").next('i').removeClass('glyphicon-ok');
                    $("#alumno").next('i').addClass('glyphicon-remove');
                    $("#alumno").parent().removeClass('has-success');
                    $("#alumno").parent().addClass('has-error');
                    
                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos;
                    response( result );                
                }
            });
        },
        minLength: 3,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                $("#alumno").val( ui.item.codigo +" - "+ui.item.nombre);
                $("#alumno").attr('codigo', ui.item.codigo);
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');    
                cargarEspecialidades( ui.item.codigo );         
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

function cargarEspecialidades( codigo ){

    $.ajax({
        url: path + "programacion/consultarAlumnos",
        type: "POST",
        dataType : "JSON",
        data: {
            opcion : 'cargarEspecialidades',
            alumno : codigo
        },
        beforeSend: function () {

            $("#especialidades").html("")
            $('.text-loader').text('CARGANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal();

        },
        complete : function(){
        
            cargarInfoTablas( false );

        },
        success: function(data){

            if( data.respuesta === "success" ){

                data.especialidades.forEach(element => {
                    $("#especialidades").append(`<option value="${element.cod_espe.trim()}-${element.tipo_espe.trim()}-${element.Cod_local.trim()}-${element.Cod_localinst.trim()}" > ${element.Cursos.trim()} </option>`)
                });

                $("#btnConsultar").prop("disabled",false)
                $("#especialidades").prop("disabled",false)
                $("#ciclo").prop("disabled",false);

            }else{

                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO");
                
            }

        }
    });

}

function cargarInfoTablas( carga = true ){
    
    $("#tablaCursos tbody").html("");
    $("#tablaPagos tbody").html("");
    $("#tablaNotas tbody").html("");

    $("#empleado-curso").val("")
    $("#sede-detalle").val("")
    $("#totalCursos").val("")
    $("#cursosDictados").val("")
    $("#cursosPorDictar").val("")

    let data = $("#formConsultarAlumno").serializeArray();
    data.push({name : "opcion" , value : "cargarInformacion"});
    data.push({name : "alumno" , value : $("#alumno").attr("codigo") });
    
    $.ajax({
        url: path + "programacion/consultarAlumnos",
        type: "POST",
        dataType : "JSON",
        data: data ,
        beforeSend: function () {
            if(carga){
                $('.text-loader').text('Cargando información, por favor espere..');
                $("#modalLoader").modal();
            }
        },
        complete : function(){
            $("#modalLoader").modal("hide"); 
        },
        success: function( res ){  

            if( res.respuesta === "success" ){

                if(res.cursos.length > 0){

                    console.log(res.cursos)
                
                    $("#totalCursos").val(res.detalles[0].Total);
                    $("#cursosDictados").val(res.detalles[0].Dictados);
                    $("#cursosPorDictar").val(res.detalles[0].Falta);

                    res.cursos.forEach( ( val , key ) => {                      
                        const tr = `
                            <tr class="tr-cursos" cod_local="${val.local.trim()}" tipoespe="${val.tipo.trim()}" cod_espe="${val.espe.trim()}" cod_localinst="${val.cod_localinst.trim()}" hora="${val.hora.trim()}" cod_ciclo="${val.Ciclo.trim()}" cod_curso="${val.cod_curso.trim()}"  cod_aula="${val.cod_aula.trim()}" mes="${val.mes.trim()}" turno="${val.Turno.trim()}" anio="${val.ano}" >
                                <td>${key+1}</td>
                                <td class="text-center" >${val.Curso.trim()}</td>
                                <td class="text-center" >${val.Ciclo.trim()}</td>
                                <td class="text-center" >${val.Seccion.trim()}</td>
                                <td class="text-center" >${val.Turno.trim()}</td>
                                
                            </tr>
                        `;
                        // <td class="text-center" >${val.mes.trim()}</td>
                        // <td class="text-center" >${val.ano.trim()}</td>
                        // <td class="text-center" >${val.hora.trim()}</td>
                        $("#tablaCursos tbody").append(tr);
                    });
                    
                }

                if(res.pagos.length > 0){
                    res.pagos.forEach( ( val , key ) => {                      
                        const tr = `
                            <tr>
                                <td class="text-center" >${val.Talon.trim()}</td>
                                <td class="text-center" >${val.Recibo.trim()}</td>
                                <td class="text-center" >${val.Fecha.trim().substring(0,10)}</td>
                                <td class="text-center" >${val.Monto}</td>
                                <td class="text-center" >${val.Ciclo.trim()}</td>
                                <td class="text-center" >${val.Ano.trim()}</td>
                                <td class="text-center" >${val.Mensualidad.trim()}</td>
                                <td class="text-center" >${val.Concepto.trim()}</td>
                                <td class="text-center" >${val.Observacion}</td>
                                <td class="text-center" >${val.Especialidad.trim()}</td>
                            </tr>
                        `;
                        $("#tablaPagos tbody").append(tr);
                    });
                }

                if(res.notas.length > 0){
                    res.notas.forEach( ( val , key ) => {                      
                        const tr = `
                            <tr>
                                <td class="text-center" >${val.Curso.trim()}</td>
                                <td class="text-center" >${val.Semestre.trim()}</td>
                                <td class="text-center" >${val.Ciclo.trim()}</td>
                                <td class="text-center" >${val.Nota}</td>
                                <td class="text-center" >${val.Especialidad.trim()}</td>                               
                            </tr>
                        `;
                        $("#tablaNotas tbody").append(tr);
                    });
                }
                
            }else{

                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR RECARGUE LA PÁGINA Y VUELVA A INTENTARLO");
                
            }
        }
    });

}

$("#ciclo").change(function(){
  
    cargarInfoTablas();

})

$("#especialidades").change(function(){

    cargarInfoTablas();

})

$(document).on( "click" , ".tr-cursos" ,function(){

    const data = {
        opcion : "infoAdicionalCurso",
        localinst : $(this).attr("cod_localinst"),
        hora : $(this).attr("hora"),
        ciclo : $(this).attr("cod_ciclo"),
        curso : $(this).attr("cod_curso"),
        aula : $(this).attr("cod_aula"),
        mes : $(this).attr("mes"),
        turno : $(this).attr("turno"),
        anio : $(this).attr("anio"),
        cod_local : $(this).attr("cod_local"),
        tipo_espe : $(this).attr("tipoespe"),
        cod_espe : $(this).attr("cod_espe"),
        codigo : $("#alumno").attr("codigo")
    }

    $(".tr-cursos").removeClass("success");
    $(this).addClass("success");

    $.ajax({
        url: path + "programacion/consultarAlumnos",
        type: "POST",
        dataType : "JSON",
        data: data ,
        success: function( res ){  

            if( res.respuesta === "success" ){
               
                if(res.detalles.length > 0){

                    $("#empleado-curso").val(res.detalles[0].Empleado+" // "+res.detalles[0].Curso)
                    $("#sede-detalle").val(res.detalles[0].Sede)

                }else{

                    $("#empleado-curso").val("")
                    $("#sede-detalle").val("")

                }

            }else{
                 
                $("#empleado-curso").val("")
                $("#sede-detalle").val("")

            }
        }
    });

})