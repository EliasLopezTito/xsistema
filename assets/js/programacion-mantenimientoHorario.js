document.addEventListener('DOMContentLoaded', (event) => {
    cargarHorariosProgramadosPorTurno()
    cargarHorariosProgramados()
});

//SELECCIONAR TURNO
$("#turno").change(function(){
    cargarHorariosProgramadosPorTurno()
    cargarHorariosProgramados()
    $(".nombre__turno").html($(this).val().toUpperCase())
})

//SELECCIONAR ESPECIALIDAD
$("#especialidad").change(function(){
    cargarHorariosProgramadosPorTurno()
    cargarHorariosProgramados()
})

//CARGAR HORARIOS PROGRAMADOS POR TURNO (PARA AGREGAR O ACTUALIZAR)
function cargarHorariosProgramadosPorTurno(){
    $.ajax({
        url: path + "programacion/mantenimientoHorarios",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion : "mostrarHorariosPorTurno",
            turno : $("#turno").val(),
            especialidad : $("#especialidad").val()
        },
        beforeSend: function(){
            $("#tr__contenido__horarios").html("");
        },
        success: function (response) { 

            if (response.respuesta === "success") {
                                                                
                if(response.horario.length === 0){                
                    const plantilla = plantillaInicialHorarios()
                    $("#tr__contenido__horarios").html(plantilla)
                    $("#btn__add__semi").prop("disabled",false) 
                    $("#btn__add__virtual").prop("disabled",false)                   
                    return;                
                }
                
                const horarios = response.horario[0];
                const plantilla = plantillaHorarios(horarios)
                $("#tr__contenido__horarios").html(plantilla)

                const count_v = horarios.virtual.length
                const count_s = horarios.semipresencial.length 
                const count_p = horarios.presencial.length 

                if( count_v >= 4 ){
                    $("#btn__add__virtual").prop("disabled",true)
                }
                if( count_s >= 4 ){
                    $("#btn__add__semi").prop("disabled",true)
                }  
                if( count_p >= 4 ){
                    $("#btn__add__presencial").prop("disabled",true)
                }
            } 
        }
    });
}

//CARGAR HORARIOS PROGRAMADOS (LISTADO GENERAL -- MANANA-TARDE-NOCHE)
function cargarHorariosProgramados(){
    $.ajax({
        url: path + "programacion/mantenimientoHorarios",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion : "mostrarHorariosProgramados",
            especialidad : $("#especialidad").val()
        },
        beforeSend : function(){
            $("#manana_v").html("")
            $("#manana_s").html("")
            $("#manana_p").html("")
            $("#tarde_v").html("")
            $("#tarde_s").html("")
            $("#tarde_p").html("")
            $("#noche_v").html("")
            $("#noche_s").html("")
            $("#noche_p").html("")
        },
        success: function (response) {
                       
            if (response.respuesta === "success") {  

                const manana = response.horarios.filter(val => val.turno === "manana");
                const tarde = response.horarios.filter(val => val.turno === "tarde");
                const noche = response.horarios.filter(val => val.turno === "noche");

                if(manana.length > 0){
                    manana[0].virtual.forEach(function(valor,indice){
                        plantillaCargarHorarios(valor[0],valor[1],indice)
                        $("#manana_v").append(plantilla)
                    });
                    manana[0].semipresencial.forEach(function(valor,indice){
                        plantillaCargarHorarios(valor[0],valor[1],indice)
                        $("#manana_s").append(plantilla)
                    })
                    manana[0].presencial.forEach(function(valor,indice){
                        plantillaCargarHorarios(valor[0],valor[1],indice)
                        $("#manana_p").append(plantilla)
                    })
                }
                if(tarde.length > 0){
                    tarde[0].virtual.forEach(function(valor,indice){
                        plantillaCargarHorarios(valor[0],valor[1],indice)
                        $("#tarde_v").append(plantilla)
                    });
                    tarde[0].semipresencial.forEach(function(valor,indice){
                        plantillaCargarHorarios(valor[0],valor[1],indice)
                        $("#tarde_s").append(plantilla)
                    })
                    tarde[0].presencial.forEach(function(valor,indice){
                        plantillaCargarHorarios(valor[0],valor[1],indice)
                        $("#tarde_p").append(plantilla)
                    })
                }
                if(noche.length > 0){
                    noche[0].virtual.forEach(function(valor,indice){
                        plantillaCargarHorarios(valor[0],valor[1],indice)
                        $("#noche_v").append(plantilla)
                    });
                    noche[0].semipresencial.forEach(function(valor,indice){
                        plantillaCargarHorarios(valor[0],valor[1],indice)
                        $("#noche_s").append(plantilla)
                    })
                    noche[0].presencial.forEach(function(valor,indice){
                        plantillaCargarHorarios(valor[0],valor[1],indice)
                        $("#noche_p").append(plantilla)
                    })  
                }
            } 
        }
    });
}

//FORMULARIO REGISTRAR DISPONIBILIDAD HORARIA (FECHA)
$('#form__regis__disponibilidad').submit(function(e){
    e.preventDefault();
    $.ajax({
        url: path + "programacion/mantenimientoHorarios",
        type: "POST",
        data: $(this).serialize(),
        dataType : "JSON",
        success: function (response) {
            if (response.respuesta === "success") {
                $("#msj__disponibilidad").hide("slow");
                Notiflix.Notify.Success("El horario de disponibilidad se registro de manera satisfactoria.");            
            } else {
                Notiflix.Notify.Failure(response.error);
            }
        }
    });
})

//FORMULARIO REGISTRAR-ACTUALIZAR HORARIOS 
$(".form__horarios").submit(function(e){
    e.preventDefault();

    dat = $(this).serializeArray()
    dat.push({name:"especialidad",value:$("#especialidad").val()})
    dat.push({name:"turno",value:$("#turno").val()})
    dat.push({name:"opcion",value:"registrarHorarios"})

    if(dat[0].value !== ""){
        msj = "Esta especialidad en el turno seleccionado ya cuenta con un horario establecido \n ¿Quiere actualizar \n  el horario?"
    }else{
        msj = "¿Desea registrar este horario?"
    }
    

    Notiflix.Confirm.Show(
        'Confirmación',
        msj,
        'Si',
        'No',
        function(){
            $.ajax({
                url: path + "programacion/mantenimientoHorarios",
                type: "POST",
                data: $.param(dat),
                success: function (r) {
                    let response = JSON.parse(r);
                    if (response.respuesta === "success") {
                            Notiflix.Notify.Success("El horario se establecio de manera satisfactoria")
                            cargarHorariosProgramadosPorTurno()
                            cargarHorariosProgramados()
                    } else {
                        if(response.error === "existe"){
                            Notiflix.Notify.Warning("El horario para esta especialidad y turno ya ha sido registrado");
                        }else if(response.error === "camposvacios"){
                            Notiflix.Notify.Warning("Ingrese mínimo un horario");
                        }else{
                            Notiflix.Notify.Failure("Ocurrio un error inesperado");
                        }
                    }
                }
            });
        }
        ,function(){   
        });
})

//BOTON AGREGAR FILA
function btnAgregarFila(btn){
    const orden = $(btn).parent().parent().prev().attr("orden")
    let tipo = $(btn).attr("tipo")
    $(btn).parent().parent().prev().children().children(".btn__eliminar__fila").remove()
    const plantilla = `
    <div class="row" orden="${Number(orden)+1}">
        <div class="col-sx-12 text-center">
            <b class="after_">HORARIO ${Number(orden)+1}</b>
            <button class='btn boton-tabla boton-rojo btn__eliminar__fila' orden="${Number(orden)+1}" tipo="${tipo}" onclick="btnEliminarFila(this)" style="margin-left:6px" type='button'><span class='icon-bin'></span></button> 
        </div>
        <div class="col-xs-6 has-success text-center">
            <span class="text-dark">Desde:</span>
            <input type="time" name="${tipo}${Number(orden)+1}[]" class="form-control form-control-sm" style="height: 22px">
        </div>                                                                            
        <div class="col-xs-6 has-success">
            <span>Hasta:</span>
            <input type="time" name="${tipo}${Number(orden)+1}[]" class="form-control form-control-sm" style="height: 22px;">
        </div>
        <div class="col-xs-12"><hr></div>
    </div>  `   ;
    $(btn).parent().parent().prev().after(plantilla)
    if( Number(orden)+1 === 4 ){
        $(btn).prop("disabled",true)
    }
                    
}

//BOTON ELIMINAR FILA
function btnEliminarFila(btn){
    const tipo = $(btn).attr("tipo") 
    const orden = $(btn).attr("orden")
    const plantilla = `<button class='btn boton-tabla boton-rojo btn__eliminar__fila' orden='${Number(orden-1)}' tipo='${tipo}' onclick='btnEliminarFila(this)' style='margin-left:6px' type='button'><span class='icon-bin'></span></button>`
    $(btn).parent().parent().prev().children().children(".after_").after(plantilla)
    $(btn).parent().parent().remove();
    if(tipo === "virtual"){
        if( Number(orden) === 4 ){
            $("#btn__add__virtual").prop("disabled",false)
        }
    }else if(tipo === "semi"){
        if( Number(orden) === 4 ){
            $("#btn__add__semi").prop("disabled",false)
        }
    }else if(tipo === "presencial"){
        if( Number(orden) === 4 ){
            $("#btn__add__presencial").prop("disabled",false)
        }
    }  
}

//PLANTILLAS
function plantillaInicialHorarios(){
    plantilla = `
    <input type="hidden" name="id__uptade">
    <td class="celda-centrada">
        <div class="row" orden="1">
            <div class="col-sx-12 text-center"><b>HORARIO 1</b></div>
            <div class="col-xs-6 has-success text-center">
                <span class="text-dark">Desde:</span>
                <input type="time" name="virtual1[]" class="form-control form-control-sm" style="height: 22px">
            </div>                                                                            
            <div class="col-xs-6 has-success">
                <span>Hasta:</span>
                <input type="time" name="virtual1[]" class="form-control form-control-sm" style="height: 22px;">
            </div>
            <div class="col-xs-12"><hr></div>
        </div>
        <div class="row">
            <div class="col-xs-12 text-center">
                <button class="btn btn-success mipanel-btn-img-texto" id="btn__add__virtual" tipo="virtual" onclick="btnAgregarFila(this)" type="button">Agregar</button>
            </div>
        </div>                                                                              
    </td>
    <td class="celda-centrada">
        <div class="row" orden="1">
            <div class="col-sx-12 text-center"><b>HORARIO 1</b></div>
            <div class="col-xs-6 has-success text-center">
                <span class="text-dark">Desde:</span>
                <input type="time" name="semi1[]" class="form-control form-control-sm" style="height: 22px">
            </div>                                                                            
            <div class="col-xs-6 has-success">
                <span>Hasta:</span>
                <input type="time" name="semi1[]" class="form-control form-control-sm" style="height: 22px;">
            </div>
            <div class="col-xs-12"><hr></div>
        </div>
        <div class="row">
            <div class="col-xs-12 text-center">
                <button class="btn btn-success mipanel-btn-img-texto" id="btn__add__semi" tipo="semi" onclick="btnAgregarFila(this)" type="button">Agregar</button>
            </div>
        </div>
    </td>
    <td class="celda-centrada">
        <div class="row" orden="1">
            <div class="col-sx-12 text-center"><b>HORARIO 1</b></div>
            <div class="col-xs-6 has-success text-center">
                <span class="text-dark">Desde:</span>
                <input type="time" name="presencial1[]" class="form-control form-control-sm" style="height: 22px">
            </div>                                                                            
            <div class="col-xs-6 has-success">
                <span>Hasta:</span>
                <input type="time" name="presencial1[]" class="form-control form-control-sm" style="height: 22px;">
            </div>
            <div class="col-xs-12"><hr></div>
        </div>
        <div class="row">
            <div class="col-xs-12 text-center">
                <button class="btn btn-success mipanel-btn-img-texto" id="btn__add__presencial" tipo="presencial" onclick="btnAgregarFila(this)" type="button">Agregar</button>
            </div>
        </div>
    </td>
    `
    return plantilla
}

function plantillaHorarios(horarios){
  
    let plantilla_virtual = ""
    let plantilla_semi = ""
    let plantilla_presencial = ""
    const count_v = horarios.virtual.length
    const count_s = horarios.semipresencial.length
    const count_p = horarios.presencial.length

    if(count_s === 0){
        horarios.semipresencial.push([ "", "" ])   
    }
    if(count_v === 0){
        horarios.virtual.push([ "","" ])   
    }
    if(count_p === 0){
        horarios.presencial.push([ "", "" ])   
    }
    
    horarios.virtual.forEach(function(val,indice){  
        boton = ""
        after = ""
        if(indice+1 > 1){
            after = "after_"
            if(indice+1 === count_v){
                boton = `<button class='btn boton-tabla boton-rojo btn__eliminar__fila' orden='${count_v}' tipo='virtual' onclick='btnEliminarFila(this)' style='margin-left:6px' type='button'><span class='icon-bin'></span></button>`
            }
        }   
        plantilla_virtual += `
        <div class="row" orden="${indice+1}">
            <div class="col-sx-12 text-center">
                <b class="${after}">HORARIO ${indice+1}</b>
                ${boton}
            </div>
            <div class="col-xs-6 has-success text-center">
                <span class="text-dark">Desde:</span>
                <input type="time"  value="${val[0]}" name="virtual${indice+1}[]" class="form-control form-control-sm" style="height: 22px">
            </div>                                                                            
            <div class="col-xs-6 has-success">
                <span>Hasta:</span>
                <input type="time" value="${val[1]}" name="virtual${indice+1}[]" class="form-control form-control-sm" style="height: 22px;">
            </div>
            <div class="col-xs-12"><hr></div>
        </div>`    
    })
    horarios.semipresencial.forEach(function(val,indice){  
        boton = ""
        after = ""
        if(indice+1 > 1){
            after = "after_"
            if(indice+1 === count_s){
                boton = `<button class='btn boton-tabla boton-rojo btn__eliminar__fila' orden='${count_s}' tipo='semi' onclick='btnEliminarFila(this)' style='margin-left:6px' type='button'><span class='icon-bin'></span></button>`  
            }
        }
        plantilla_semi += `
            <div class="row" orden="${indice+1}">
            <div class="col-sx-12 text-center">
                <b class="${after}">HORARIO ${indice+1}</b>${boton}
            </div>
            <div class="col-xs-6 has-success text-center">
                <span class="text-dark">Desde:</span>
                <input type="time" value="${val[0]}" name="semi${indice+1}[]" class="form-control form-control-sm" style="height: 22px">
            </div>                                                                            
            <div class="col-xs-6 has-success">
                <span>Hasta:</span>
                <input type="time" value="${val[1]}" name="semi${indice+1}[]" class="form-control form-control-sm" style="height: 22px;">
            </div>
            <div class="col-xs-12"><hr></div></div>`    
    })

    horarios.presencial.forEach(function(val,indice){  
        boton = ""
        after = ""
        if(indice+1 > 1){
            after = "after_"
            if(indice+1 === count_p){
                boton = `<button class='btn boton-tabla boton-rojo btn__eliminar__fila' orden='${count_p}' tipo='presencial' onclick='btnEliminarFila(this)' style='margin-left:6px' type='button'><span class='icon-bin'></span></button>`  
            }
        }
        plantilla_presencial += `
            <div class="row" orden="${indice+1}">
            <div class="col-sx-12 text-center">
                <b class="${after}">HORARIO ${indice+1}</b>${boton}
            </div>
            <div class="col-xs-6 has-success text-center">
                <span class="text-dark">Desde:</span>
                <input type="time" value="${val[0]}" name="presencial${indice+1}[]" class="form-control form-control-sm" style="height: 22px">
            </div>                                                                            
            <div class="col-xs-6 has-success">
                <span>Hasta:</span>
                <input type="time" value="${val[1]}" name="presencial${indice+1}[]" class="form-control form-control-sm" style="height: 22px;">
            </div>
            <div class="col-xs-12"><hr></div></div>`    
    })

    plantilla = `
    <input type="hidden" name="id__uptade" value="${horarios.id}">
    <td class="celda-centrada">
        ${plantilla_virtual}
        <div class="row">
            <div class="col-xs-12 text-center">
                <button class="btn btn-success mipanel-btn-img-texto" id="btn__add__virtual" tipo="virtual" onclick="btnAgregarFila(this)" type="button">Agregar</button>
            </div>
        </div>                                                                              
    </td>
    <td class="celda-centrada">
        ${plantilla_semi}
        <div class="row">
            <div class="col-xs-12 text-center">
                <button class="btn btn-success mipanel-btn-img-texto" id="btn__add__semi" tipo="semi" onclick="btnAgregarFila(this)" type="button">Agregar</button>
            </div>
        </div>
    </td>
    <td class="celda-centrada">
        ${plantilla_presencial}
        <div class="row">
            <div class="col-xs-12 text-center">
                <button class="btn btn-success mipanel-btn-img-texto" id="btn__add__presencial" tipo="presencial" onclick="btnAgregarFila(this)" type="button">Agregar</button>
            </div>
        </div>                                                                              
    </td> `
    return plantilla
}

function plantillaCargarHorarios(hora1,hora2,key){
    h1 = Number(hora1.substring(0,2))
    h2 = Number(hora2.substring(0,2))
    if(h1 >= 0 && h1 < 12){
        h1_ = "am"
    }else{
        h1_ = "pm"
    }
    if(h2 >= 0 && h2 < 12){
        h2_ = "am"
    }else{
        h2_ = "pm"
    }
    plantilla = `
        <div class="border" style="padding:5px 0; margin-bottom:6px">
            <span style="display:block"><b>HORARIO ${key+1}</b></span>
            <span style="display:block;margin-bottom:5px">${hora1} ${h1_} - ${hora2} ${h2_}</span>   
        </div>
        `
    return plantilla
}