d = document;

const meses = {
    '01': 'ENERO',
    '02': 'FEBRERO',
    '03': 'MARZO',
    '04': 'ABRIL',
    '05': 'MAYO',
    '06': 'JUNIO',
    '07': 'JULIO',
    '08': 'AGOSTO',
    '09': 'SEPTIEMBRE',
    '10': 'OCTUBRE',
    '11': 'NOVIEMBRE',
    '12': 'DICIEMBRE'
}

document.addEventListener("DOMContentLoaded", () => {
    cargarEspecialidades();
})

document.addEventListener('change', (e) => { 
    if (e.target.matches('#especialidad') || e.target.matches('#mes') || e.target.matches('#anio')) {
        cargarDisponibilidadesPorProfesores();
    }
})

//CARGAR SELECT - ESPECIALIDADES
function cargarEspecialidades(){
    $.ajax({
        url: path + "Programacion/reporteDisponibilidad",
        type: "post",
        dataType: 'json',
        data:{
            opcion: 'selectEspecialidades'
        },
        success: function (datos) {
            let cboEspecialidad = $("#especialidad");
            cboEspecialidad.find('option').remove();
            if (datos.respuesta == "success") {
                if (datos.especialidades != "vacio") {
                    var especialidades = datos.especialidades;
                    cboEspecialidad.append("<option value='%'>VER TODO</option>");
                    for (i = 0; i < especialidades.length; i++) {
                        var especialidad = especialidades[i];
                        cboEspecialidad.append("<option value=\"" + especialidad.cod_espe + "\" >" + especialidad.cod_espe + " - " + especialidad.descripcionM + "</option>");
                    }
                }
            }
        },
        error: function () {
            console.log('ocurrio un error');
        },
        complete: function() {
            cargarDisponibilidadesPorProfesores();
        }
    });
}

//CARGAR DISPONIBILIDADES SELECCIONADAS- PROFESORES
function cargarDisponibilidadesPorProfesores(){
    let anio = document.getElementById('anio').value;
    let mes = document.getElementById('mes').value;
    let cod_especialidad = document.getElementById('especialidad').value;
    $('#tablaListaDisponibilidades').dataTable().fnDestroy();
    $("#tablaListaDisponibilidades").DataTable({
        ordering:  false,
        ajax: {
            url: path + "Programacion/reporteDisponibilidad",
            type: 'post',
            beforeSend: function(){
                $('.text-loader').text('Cargando información, por favor espere..');
                $("#modalLoader").modal();
            },
            data:{
                mes: mes,
                anio: anio,
                cod_especialidad: cod_especialidad,
                opcion: 'selectDisponibilidadesHorariasPorProfesores'
            },
            dataSrc: function(data){                    
                return data.docentes;
            },
            complete: function(data){
                $("#modalLoader").modal("hide");
            }
        },
        columnDefs: [
            {
                targets: '_all',
                className: 'celda-centrada',
                orderable: false
            }
        ],
        columns: [
            { 
                data: 'id',
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { data: null,
                render: function (data, type, row, meta) {
                    return data.nombre;
                } 
            },
            { data: 'cod_emp' },
            { 
                data: 'mes',
                render: function(data){
                    return meses[data]
                }
            },
            { 
                data: null,
                render: function(data){
                    local = data.local.replace('-', ' ')
                    return local.toUpperCase();
                }
            },
            {  data: null,
                render: function(data){
                    return data.cod_espe+" - "+data.especialidad
                }
            },
            { 
                data: null ,
                render: function(data){
                    return `<button class='btn boton-naranja boton-tabla' data-id='${data.id}' data-desc="${data.especialidad}" data-local="${data.local}" data-mes="${meses[data.mes]}" data-nombre='${data.nombre}' type='button' onclick='cargarHorarioSeleccionado(this)'> <span class='icon-eye'></span></button>`
                }

            },
            {
                data: null ,
                render: function(data){
                    if( data.acceso === "true") {
                        return `<td>
                            <button disabled class='btn boton-tabla btn-warning' type='button' onclick='editarRegistro(this)' data-id='${data.id}' data-desc="${data.especialidad}" data-local="${data.local}" data-cod-espe="${data.cod_espe}" data-mes="${meses[data.mes]}" data-nombre='${data.nombre}' title='Editar Registro'><span class='icon-pencil2'></span></button>
                        
                            <button disabled class='btn boton-tabla btn-danger' type='button' onclick='eliminarRegistro(this)' data-id='${data.id}' title='Eliminar Registro'><span class='icon-bin'></span></button>
                        </td>`;
                    }else{
                        return "";

                    }
                }
            }
        ],
        createdRow : function( row, data, dataIndex ) {
            if ( data.acceso == "true" ) {
                $( row ).addClass( "success" );
            }
        },
        language: {
            "processing": "Procesando...",
            "lengthMenu": "Mostrar _MENU_ registros",
            "zeroRecords": "No se encontraron resultados",
            "emptyTable": "No se encontraron registros",
            "infoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "infoFiltered": "(filtrado de un total de _MAX_ registros)",
            "search": "Buscar:",
            "infoThousands": ",",
            "loadingRecords": "Cargando...",
            "paginate": {
                "first": "Primero",
                "last": "Último",
                "next": "Siguiente",
                "previous": "Anterior"
            },
            "info": "Mostrando _START_ a _END_ de _TOTAL_ registros"
        }
    });
}

/***** FUNCIONES EDITAR REGISTRO (DISPONIBILIDAD) *****/
function editarRegistro(btn){
    $("#td_edit_manana_v").html("")
    $("#td_edit_manana_s").html("")
    $("#td_edit_tarde_v").html("")
    $("#td_edit_tarde_s").html("")
    $("#td_edit_noche_v").html("")
    $("#td_edit_noche_s").html("")

    let id = btn.getAttribute('data-id');
    let profesor = btn.getAttribute('data-nombre');
    let especialidad = btn.getAttribute('data-desc');
    let codigo_especialidad = btn.getAttribute('data-cod-espe');
    let local = btn.getAttribute('data-local');
    let mes = btn.getAttribute('data-mes');

    $("#idDisponibilidadActualizar").val(id.trim())
    $("#editProfesor").html(profesor.toUpperCase())  
    $("#editEspecialidad").html(especialidad.toUpperCase())
    $("#editLocal").html(local.replace('-', ' ').toUpperCase())
    $("#editMes").html(mes.toUpperCase())

    $.ajax({
        url: path + "Programacion/reporteDisponibilidad",
        type: "POST",
        dataType : "JSON",
        data: {
            "opcion" : "selectInfoActualizarDisponibilidad", 
            "especialidad" : codigo_especialidad,
            "id" : id 
        },
        beforeSend: function () {
        },
        success: function (r) {
            
            console.log(r)

            if (r.respuesta === "success") {
                //HORARIOS ESTABLECIOS POR EL ÁREA DE PROGRAMACIÓN   
                arraym = r.horariosEspecialidad.filter(val=>val.turno === "manana")
                arrayt = r.horariosEspecialidad.filter(val=>val.turno === "tarde")
                arrayn = r.horariosEspecialidad.filter(val=>val.turno === "noche")
                const m_virtual_p =  arraym.length > 0 ? arraym[0].virtual : [];
                const m_semi_p =  arraym.length > 0 ? arraym[0].semipresencial : [];
                const t_virtual_p =  arrayt.length > 0 ? arrayt[0].virtual : [];
                const t_semi_p =  arrayt.length > 0 ? arrayt[0].semipresencial : [];
                const n_virtual_p =  arrayn.length > 0 ? arrayn[0].virtual : [];
                const n_semi_p =  arrayn.length > 0 ? arrayn[0].semipresencial : [];
                //HORARIOS SELECCIONADOS POR LOS DOCENTES
                const m_virtual_d = convertirHorarioSeleccionado(r.horarioDocente.manana.virtual)
                const m_semi_d = convertirHorarioSeleccionado(r.horarioDocente.manana.semipresencial)
                const t_virtual_d = convertirHorarioSeleccionado(r.horarioDocente.tarde.virtual)
                const t_semi_d = convertirHorarioSeleccionado(r.horarioDocente.tarde.semipresencial)
                const n_virtual_d = convertirHorarioSeleccionado(r.horarioDocente.noche.virtual)
                const n_semi_d = convertirHorarioSeleccionado(r.horarioDocente.noche.semipresencial)   
                //HORARIOS DEFINIDOS
                const m_virtual = convinarArraysHorarios(m_virtual_p,m_virtual_d)
                const m_semi = convinarArraysHorarios(m_semi_p,m_semi_d)
                const t_virtual = convinarArraysHorarios(t_virtual_p,t_virtual_d)
                const t_semi = convinarArraysHorarios(t_semi_p,t_semi_d)
                const n_virtual = convinarArraysHorarios(n_virtual_p,n_virtual_d)
                const n_semi = convinarArraysHorarios(n_semi_p,n_semi_d)
       
                if(m_virtual.length > 0){
                    m_virtual.forEach( function(v,k){
                        if(v[0] !== "" || v[1] !== ""){
                            plantilla = cargarTablaHorariosProgramados(v[0],v[1],k,"m_virtual",v[2])
                            $("#td_edit_manana_v").append(plantilla)
                        }                         
                    });
                }
                if(m_semi.length > 0){
                    m_semi.forEach( function(v,k){
                        if(v[0] !== "" || v[1] !== ""){
                            plantilla = cargarTablaHorariosProgramados(v[0],v[1],k,"m_semi",v[2])
                            $("#td_edit_manana_s").append(plantilla)
                        } 
                    });
                }
                if(t_virtual.length > 0){
                    t_virtual.forEach( function(v,k){
                        if(v[0] !== "" || v[1] !== ""){
                            plantilla = cargarTablaHorariosProgramados(v[0],v[1],k,"t_virtual",v[2])
                            $("#td_edit_tarde_v").append(plantilla)
                        }
                    });
                }
                if(t_semi.length > 0){
                    t_semi.forEach( function(v,k){
                        if(v[0] !== "" || v[1] !== ""){
                            plantilla = cargarTablaHorariosProgramados(v[0],v[1],k,"t_semi",v[2])
                            $("#td_edit_tarde_s").append(plantilla)
                        }
                    });
                }                                                     
                if(n_virtual.length > 0){
                    n_virtual.forEach( function(v,k){
                        if(v[0] !== "" || v[1] !== ""){
                            plantilla = cargarTablaHorariosProgramados(v[0],v[1],k,"n_virtual",v[2])
                            $("#td_edit_noche_v").append(plantilla)
                        }
                    });
                }
                if(n_semi.length > 0){
                    n_semi.forEach( function(v,k){
                        if(v[0] !== "" || v[1] !== ""){
                            plantilla = cargarTablaHorariosProgramados(v[0],v[1],k,"n_semi",v[2])
                            $("#td_edit_noche_s").append(plantilla)
                        }
                    });
                }
                
                $("#modalEditarRegistroSeleccionado").modal({backdrop: 'static', keyboard: false});
                $("#btn__edit__disponibilidad").prop("disabled",false)
                
            }else{
                Notiflix.Notify.Failure( response.error.toUpperCase() );       
            }
        }
    });
}

function convertirHorarioSeleccionado(data){
    let horarioArray = []
    data.forEach(function(indice){
        const regex1 = /am/gi;
        const regex2 = /pm/gi;
        const regex3 = / /gi;
        horario = indice.replace(regex1 , "");
        horario = horario.replace(regex2 , "");
        horario = horario.replace(regex3, "");
        horario = horario.split("-");
        horarioArray.push(horario)
    })
    return horarioArray
}

function convinarArraysHorarios(programacion , docente){
    let horarioConvinado = []
    programacion.forEach(function(index1,key){
        if(docente.length > 0){   
            try {
                docente.forEach(function(index2){
                    if(index1[0] === index2[0] && index1[1] === index2[1]){
                        horarioConvinado[key] = Array(index1[0],index1[1],"1")
                        throw 'Break';
                    }else{
                        horarioConvinado[key] = Array(index1[0],index1[1],"0")
                    }
                });
            }catch(e){
                //====
            }
        }else{
            horarioConvinado[key] = Array(index1[0],index1[1],"0")
        }
    });
    return horarioConvinado;
}

function cargarTablaHorariosProgramados(hora1,hora2,indice,name,estado){
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
    const count = $(".count_"+name).length
    if(estado === "1"){
        check = "checked"
        estado = "DISPONIBLE"
        value = "1"
        background = "bg-info"
    }else{
        estado = "NO DISPONIBLE"
        check = ""
        value = "0"
        background = ""
    }
    plantilla = `
        <div class="border count_${name} ${background}" style="padding:5px 0; margin-bottom:6px">
            <span style="display:block"> <b> HORARIO ${indice+1} </b></span>
            <span style="display:block;margin-bottom:5px"> ${hora1} ${h1_} - ${hora2} ${h2_}</span>
            <label class="checkbox-inline">  
                <input type="checkbox" ${check} class="checkEstado">
                <span>${estado}</span>
                <input type="hidden" class="estado__seleccionado__check" name="${name}${count+1}[]" value="${value}">
                <input type="hidden" name="${name}${count+1}[]" value="${hora1} ${h1_} - ${hora2} ${h2_}">
            </label>
        </div>`;    
    return plantilla
}

$(document).on('change','.checkEstado', function(){
    if ($(this).is(':checked') ) {
        $(this).next().next().val("1")
        $(this).parent().parent().addClass("bg-info")
        $(this).next().html("DISPONIBLE")
    } else {
        $(this).next().next().val("0")
        $(this).parent().parent().removeClass("bg-info")
        $(this).next().html("NO DISPONIBLE")
    }
});

$("#formActualizarDisponibilidadDocentes").submit(function(e){
    
    e.preventDefault();
   
    $.ajax({
        url: path + "Programacion/reporteDisponibilidad",
        type: "POST",
        data: $(this).serialize(),
        dataType : "JSON",
        success: function (response) {

            if (response.respuesta === "success") {
                
                Notiflix.Report.Success("ACTUALIZACIÓN EXITOSA","El registro de actualizo de manera satisfactoria","Continuar");
                
            } else {
    
                if(response.error === "noselecciono"){
                    Notiflix.Notify.Warning("POR FAVOR SELECCIONE AL MENOS UN HORARIO");
                } 

            }
        }
    });

})
/***** END *****/

document.addEventListener('click', (e) => {
    if (e.target.matches('#btnCancelar')) {
        $("#modalEditarRegistro").modal("hide");
    }
    if (e.target.matches('#btnReporte')) {
        descargarReporte();
    }
})

//CARGAR HORARIOS DISPONIBILIDADES - PROFESOR SELECCIONADO
function cargarHorarioSeleccionado(btn){

    $("#td_ver_manana_v").html("")
    $("#td_ver_manana_s").html("")
    $("#td_ver_manana_p").html("")
    $("#td_ver_tarde_v").html("")
    $("#td_ver_tarde_s").html("")
    $("#td_ver_tarde_p").html("")
    $("#td_ver_noche_v").html("")
    $("#td_ver_noche_s").html("")
    $("#td_ver_noche_p").html("")

    $("#modalMostrarRegistroSeleccionado").modal({backdrop: 'static', keyboard: false});
    
    let id = btn.getAttribute('data-id');
    let profesor = btn.getAttribute('data-nombre');
    let especialidad = btn.getAttribute('data-desc');
    let local = btn.getAttribute('data-local');
    let mes = btn.getAttribute('data-mes');

    $("#nom_mdl_selec").html(profesor)
    $("#esp_mdl_selec").html(especialidad)
    $("#local_mdl_selec").html(local.replace('-', ' ').toUpperCase())
    $("#mes_mdl_selec").html(mes)

    $.ajax({
        url: path + "Programacion/reporteDisponibilidad",
        type: "POST",
        dataType: 'json',
        data: {
            id: id,
            opcion: 'cargarDisponibilidadSeleccionada'
        },
        success: function(response){

            if (response.respuesta === "success") { 

                const manana = response.registro.manana
                const tarde = response.registro.tarde
                const noche = response.registro.noche

                if(manana.virtual.length > 0){
                    manana.virtual.forEach(function(valor,indice){
                    plantilla = plantillaCargarHorario(valor,indice)
                    $("#td_ver_manana_v").append(plantilla)
                    });
                }
                if(manana.semipresencial.length > 0){
                    manana.semipresencial.forEach(function(valor,indice){
                        plantilla = plantillaCargarHorario(valor,indice)
                        $("#td_ver_manana_s").append(plantilla)
                    });
                }
                if( manana.presencial && (manana.presencial.length > 0) ){
                    manana.presencial.forEach(function(valor,indice){
                        plantilla = plantillaCargarHorario(valor,indice)
                        $("#td_ver_manana_p").append(plantilla)
                    });
                }

                
                if(tarde.virtual.length > 0){
                    tarde.virtual.forEach(function(valor,indice){
                        plantilla = plantillaCargarHorario(valor,indice)
                        $("#td_ver_tarde_v").append(plantilla)
                    });
                }
                if(tarde.semipresencial.length > 0){
                    tarde.semipresencial.forEach(function(valor,indice){
                    plantilla = plantillaCargarHorario(valor,indice)
                    $("#td_ver_tarde_s").append(plantilla)
                    })
                }
                if( tarde.presencial && (tarde.presencial.length > 0) ){
                    tarde.presencial.forEach(function(valor,indice){
                    plantilla = plantillaCargarHorario(valor,indice)
                    $("#td_ver_tarde_p").append(plantilla)
                    })
                }


                if(noche.virtual.length > 0){
                    noche.virtual.forEach(function(valor,indice){
                    plantilla = plantillaCargarHorario(valor,indice)
                    $("#td_ver_noche_v").append(plantilla)
                    });
                }
                if(noche.semipresencial.length > 0){
                    noche.semipresencial.forEach(function(valor,indice){
                    plantilla = plantillaCargarHorario(valor,indice)
                    $("#td_ver_noche_s").append(plantilla)
                    })
                }
                if( noche.presencial && (noche.presencial.length > 0) ){
                    noche.presencial.forEach(function(valor,indice){
                    plantilla = plantillaCargarHorario(valor,indice)
                    $("#td_ver_noche_p").append(plantilla)
                    })
                }
                

            } 
        }
    })
}

function plantillaCargarHorario(hora,key){
    plantilla = `
        <div class="border" style="padding:5px 0;margin-bottom:6px;">
            <span style="display:block"><b>HORARIO ${key+1}</b></span>
            <span style="display:block;margin-bottom:5px">${hora}</span>   
        </div>
        `
    return plantilla
}

function eliminarRegistro(btn){

    Notiflix.Confirm.Show(
        'Confirmación',
        '¿Desea eliminar el registro seleccionado?',
        'Si',
        'No',
        function(){
            let id = btn.getAttribute('data-id');
            $.ajax({
                url: path + "Programacion/reporteDisponibilidad",
                type: "POST",
                dataType: 'json',
                data: {
                    id: id,
                    opcion: 'eliminarRegistro'
                },
                success: function(data){
        
                    if (data.respuesta === 'success') {
                        cargarDisponibilidadesPorProfesores();
                        Notiflix.Notify.Success('Registro eliminado correctamente!');
                    } else{
                        Notiflix.Notify.Failure('Ocurrió un error al eliminar el registro!');
                    }
                    
                }
            });
        },
        function(){    
        }
    );
}

function descargarReporte(){
    d.getElementById('input-anio').value = d.getElementById('anio').value;
    d.getElementById('input-mes').value = d.getElementById('mes').value;
    d.getElementById('input-especialidad').value = d.getElementById('especialidad').value;
    d.getElementById("frmReporte").submit();
}

$("#btnReporteExcel").click(function(){

    let anio = d.getElementById('anio').value;
    let mes = d.getElementById('mes').value;
    let espe = d.getElementById('especialidad').value;

    $.ajax({
        url: path + "Programacion/reporteDisponibilidad",
        type: "POST",
        dataType: 'json',
        data: {
            opcion : "exportarExcel",
            anio : anio,
            mes : mes,
            espe : espe
        },
        success: function(r){

            console.log(r);

            var $a = $("<a>");
            $a.attr("href",r.data);
            $("body").append($a);
            $a.attr("download","ReporteDisponibilidadHoraria.xlsx");
            $a[0].click();
            $a.remove();

            return;

            if (data.respuesta === 'success') {
                cargarDisponibilidadesPorProfesores();
                Notiflix.Notify.Success('Registro eliminado correctamente!');
            } else{
                Notiflix.Notify.Failure('Ocurrió un error al eliminar el registro!');
            }
            
        }
    });

})