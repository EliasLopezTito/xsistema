
$(document).ready(function(){
       
    mobiscroll.setOptions({
            locale: mobiscroll.localeEs,                                             // Specify language like: locale: mobiscroll.localePl or omit setting to use default
            theme: 'ios',                                                            // Specify theme like: theme: 'ios' or omit setting to use default
            themeVariant: 'light'                                                // More info about themeVariant: https://docs.mobiscroll.com/5-22-1/select#opt-themeVariant
    });

    $('#profesion').mobiscroll().select({
        inputElement: document.getElementById('demo-multiple-select-input'),
        touchUi: false,
        filter: true
    });

    $("#docentes").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "programacion/datosDocente",
                dataType: "json",
                method : "post",
                data: {
                    docente: request.term,
                    opcion: 'buscarDocente'
                },
                success: function(data){
                    $(".tr-horas").remove();
                    $("#docentes").attr("codigo" , "");
                    $("#docentes").next('i').removeClass('glyphicon-ok');
                    $("#docentes").next('i').addClass('glyphicon-remove');
                    $("#docentes").parent().removeClass('has-success');
                    $("#docentes").parent().addClass('has-error');                
                    $("#tablaDocente tbody").html("");                                      
                    let result = (!data.docentes) ? [{ vacio: true }] : data.docentes;
                    response(result);                  
                }                    
            });
        },
        minLength: 2,
        select: function(event, ui){
            if (ui.item.vacio) {
                event.preventDefault();
            } else{
                $("#docentes").attr("codigo" , ui.item.cod_emp.trim() );
                $("#docentes").val( ui.item.cod_emp+" - "+ui.item.nombre);                
                $("#docentes").next('i').removeClass('glyphicon-remove');
                $("#docentes").next('i').addClass('glyphicon-ok');
                $("#docentes").parent().removeClass('has-error');
                $("#docentes").parent().addClass('has-success');  

                /**const mes = $("#mes").val();
                const anio = $("#anio").val();
                const profesion = $("#profesion").val();
                const especialidad = $("#especialidad").val();
                const codigo = $("#docentes").attr("codigo");
                cargarDocentes(anio,mes,profesion,especialidad,codigo);**/

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
            .append( "<div><b>"+item.cod_emp+"</b> - "+item.nombre+"</div>" )
            .appendTo( ul );
    };    
    $("#docentes").focus();

})

$("#btnBuscar").click(function(){

    const anio = $("#anio").val();
    const mes = $("#mes").val();
    const profesion = $("#profesion").val();
    const especialidad = $("#especialidad").val();
    let codigo = $("#docentes").attr("codigo");
    if($("#docentes").val() === ""){
        codigo = "";
    }
    cargarDocentes(anio,mes,profesion,especialidad,codigo);

})

function cargarDocentes(anio,mes,profesion,especialidad,codigo){

    $.ajax({
        url: path + "programacion/docentesProgramadosPorAula",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "selectListado",
            anio : anio,
            mes: mes,
            profesion: profesion,
            especialidad: especialidad,
            docente: codigo
        },
        beforeSend: function () {
            $('.text-loader').text('PROCESANDO, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
            $(".tr-horas").remove();
            $("#tablaDocente tbody").html("");
        },
        complete: function(){
            $("#modalLoader").modal("hide");
        }, 
        success: function(data){

            if(data.respuesta === "success"){
               
                if(data.docentes.length > 0){
                 
                    data.horas.forEach( val => {                                                
                        $("#tr-docentes").append(`<th style="position: sticky;top: 0;z-index: 10;background:#326299" class="celda-centrada tr-horas">${val}</th>`)
                    });

                    data.docentes.forEach( ( docente , key ) => {
                       
                        let td = "";
                        let horas_obj = {};
                        let especialidades_obj = {};

                        docente.forEach( val => {

                            especialidades_obj[val.Especialidad.trim()] = val.Especialidad.trim();

                            if( val.PrimeraHora.trim() !== "" ){
                                horas_obj[val.PrimeraHora.trim()] = (horas_obj[val.PrimeraHora.trim()] || val.PrimeraHora.trim())+"/"+val.cod_aula.trim();
                            }

                            if( val.SegundaHora.trim() !== "" ){
                                horas_obj[val.SegundaHora.trim()] = (horas_obj[val.SegundaHora.trim()] || val.SegundaHora.trim())+"/"+val.cod_aula.trim(); 
                            }

                        });
                        
                        
                        console.log(horas_obj);

                        
                        const horas_array = Object.values(horas_obj);
                        const especialidades_array = Object.values(especialidades_obj);                                            

                        let especialidades = "";

                        especialidades_array.forEach( (val , keyes ) => {
                            especialidades += (val+(especialidades_array.length===(keyes+1)?"":" <b>/</b> "))
                        });

                        data.horas.forEach( hora => {

                            let repeat = false;

                            horas_array.forEach( hora_arr => {
                                if(hora === hora_arr.split('/')[0] ){
                                    td += `<td class="text-center">${hora_arr.split('/')[1]} ${hora_arr.split('/')[2]!==undefined?" / "+(hora_arr.split('/')[2]):""} ${hora_arr.split('/')[3]!==undefined?" / "+(hora_arr.split('/')[3]):""}</td>`;
                                    repeat = true; 
                                }
                            });
                            
                            if(repeat === false){
                                td += `<td class="text-center"></td>`;
                            }
                            
                        });

                        const tr = `<tr>
                                <td class="text-center">${key+1}</td>
                                <td class="text-center">${docente[0].Docente}</td>
                                <td class="text-center">${docente[0].Profesion}</td>
                                <td class="text-center">${docente[0].condicion}</td>                                
                                <td class="text-center">${especialidades}</td>                                 
                                ${td}
                        </tr>`;

                        $("#tablaDocente tbody").append(tr);
                

                    })

                }

            }else if(data.respuesta === "warning"){

                Notiflix.Notify.Warning(data.error)

            }else{            
               
                Notiflix.Notify.Failure('Ocurrio un error inesperado, por favor recargue la página y vuelva a intentarlo');                

            }

        }
    });

}

