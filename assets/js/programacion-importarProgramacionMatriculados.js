$(document).ready(function () {

    cargarInstituciones(true);

    $("#institucion").change(function () {
        cargarTipoEspecialidades(true);
    });

    $("#tipoEspecialidad").change(function () {
        cargarEspecialidades(true);
    });

    cargarSedes();
    cargarPabellones();
    cargarPisos();
    cargarComboAulas();

    $("#institucion").change(function(){
        cargarComboAulas();
    });

    $("#sede").change(function(){
        cargarComboAulas();
    });

    $("#pabellon").change(function(){
        cargarComboAulas();
    });

    $("#piso").change(function(){
        cargarComboAulas();
    });

    $("#cbxTodos").change(function () {
        marcarCheckboxTodos();
    });

    $("#codigoAlumno, #apellidosNombresAlumno, #grupoProgramacionAcademica").keydown(function (event) {
        if (event.keyCode == 13) {
            buscarProgramacionAcademica();
        }
    });

 });

function consultarProgramacion()
{

    $("#grupoProgramacionAcademica").val("");
    $("#codigoAlumno").val("");
    $("#apellidosNombresAlumno").val("");
    $("#tablaProgramacionAcademica tbody").find('tr').remove();
    $("#grupoProgramacionAcademica").focus();
    $("#modalProgramacionAcademica").modal({backdrop: 'static', keyboard: false});

}

function buscarProgramacionAcademica() {
    
    var codigoAlumno = $("#codigoAlumno").val().trim();
    var apellidosNombres = $("#apellidosNombresAlumno").val();
    var grupoProgramacionAcademica = $("#grupoProgramacionAcademica").val().trim();
    var mes = $("#mes").val();
    var ano = $("#ano").val();
    

    if (grupoProgramacionAcademica == "") {
        $("#errorProgramacionAcademica").html("Debe ingresar el código del grupo.");
        $("#errorProgramacionAcademica").css("display", "block");
        return false;
    } else {
        $("#errorProgramacionAcademica").html("");
        $("#errorProgramacionAcademica").css("display", "none");
    }

    $.ajax({
        url: path + "programacion/importarProgramacionMatriculados",
        type: "POST",
        data: {
            codigoAlumno: codigoAlumno,
            apellidosNombres: apellidosNombres,
            grupoProgramacionAcademica: grupoProgramacionAcademica,
            mes: mes,
            ano: ano,
            opcion: "consultarProgramacion"
        },
        success: function (data) {
            //console.log(data);
            var tbody = $("#tablaProgramacionAcademica tbody");
            tbody.find('tr').remove();

            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.resultadosProgramacionAcademica != "vacio") {
                    var resultadosProgramacionAcademica = datos.resultadosProgramacionAcademica;
                    for (i = 0; i < resultadosProgramacionAcademica.length; i++) {
                        var resultadoProgramacionAcademica = resultadosProgramacionAcademica[i];

                        var numeroFila = i + 1;

                        var tr = "<tr>" +
                                "<td class=\"celda-centrada\">" + numeroFila + "</td>" +
                                "<td class=\"celda-centrada\">" + resultadoProgramacionAcademica.cod_alumno + "</td>" +
                                "<td>" + resultadoProgramacionAcademica.alumno + "</td>" +
                                "</tr>";
                        tbody.append(tr);
                    }
                }
            } else {
                var errores = "";
                for (i = 0; i < datos.errores.length; i++) {
                    errores += datos.errores[i] + "<br>";
                }
                mostrarMensaje("error", "ERROR", errores);
            }
        }
    });
}

function marcarCheckboxTodos() {

    if ($(".celda_checkbox").length == $(".celda_checkbox:checked").length) 
    {  
       $("#cbxTodos").prop("checked",false);
        $("#tablaAlumnos tbody").find("tr").each(function () {
            $(this).find("td").eq(4).find("input:checkbox").prop("checked", false);
        });

    } else 
    {  
        $("#cbxTodos").prop("checked",true);
       
        $("#tablaAlumnos tbody").find("tr").each(function () {
            $(this).find("td").eq(4).find("input:checkbox").prop("checked", true);
        });

    }  

    obtenerCantidadAlumnosSeleccionados();
    
}

function obtenerCantidadAlumnosSeleccionados(){

    var cantAlumnosSeleccionados = $(".celda_checkbox:checked").length;
    $("#nroAlumnosSeleccionados").text(cantAlumnosSeleccionados);

}
  
$("#btnPrepararProgramacion").click(function () {

    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();
    var especialidad = $("#especialidad").val();
    var anioProg = $("#anioProg").val();
    var mesProg = $("#mesProg").val();
    var sede = $("#sede").val();
    var ciclo = $("#ciclo").val();
    var aula = $("#aula").val();
    var grupo = $("#codigo").val();
    var turno = $("#turno").val();
    var opcionMostradoAlumnos = $('input:radio[name=opcionMostradoAlumnos]:checked').val();

    var estado_cant_alumnos_programados = false;
    var estado_curso = false;

    $.ajax({
        url: path + "programacion/importarProgramacionMatriculados",
        type: "POST",
        data: {
            institucion: institucion,
            tipoEspecialidad: tipoEspecialidad,
            especialidad: especialidad,
            anioProg: anioProg,
            mesProg: mesProg,
            sede: sede,
            ciclo: ciclo,
            aula: aula,
            grupo: grupo,
            opcionMostradoAlumnos: opcionMostradoAlumnos,
            turno: turno,
            opcion: "consultar"
        },
        beforeSend: function () {
            $("#loader_cursos").css({"display": "block"});
            $("#loader_alumnos").css({"display": "block"});
            $("#nroAlumnosProgramados").text("-");
            $("#nroAlumnosMatriculados").text("");
            $("#nroAlumnosSeleccionados").text("");
            desactivarFiltro(true);
        },
        success: function (data) {
            var cantAlumnosProgramados = 0;
            var datos = JSON.parse(data);
            $("#loader_cursos").css({"display": "none"});
            $("#loader_alumnos").css({"display": "none"});
            if(datos.validacion == null)
            {
                if (datos.respuesta2 === "success") {
                    //cantAlumnosProgramados por grupos, mes y año
                    cantAlumnosProgramados = datos.cantAlumnosProgramados;
                    $("#nroAlumnosProgramados").text(cantAlumnosProgramados);
                    if(cantAlumnosProgramados < 60)
                    {
                        estado_cant_alumnos_programados = true;
                    }else{
                        Notiflix.Report.Warning('AVISO',"EL GRUPO SELECCIONADO YA CONTIENE 60 ALUMNOS","Cerrar"); 
                    }
                } else {                  
                    var errores = "";
                    for (i = 0; i < datos.errores2.length; i++) {
                        errores += datos.errores2[i] + "<br>";
                    }
                    mostrarMensaje("error", "ERROR", errores);
                } 
                if (datos.respuesta1 === "success") {
                    //cursos asignados al aula
                    estado_curso = true;
                    var tbodyTablaCursosDeAulas = $("#tablaCursosDeAulas tbody");
                    tbodyTablaCursosDeAulas.html("")
                    var cursosDeAula = datos.cursosDeAula;
                    for (i = 0; i < cursosDeAula.length; i++) {
                        var cursoDeAula = cursosDeAula[i];
                        var nroFila = i + 1;
                        var tr = "<tr class=\"fila\">" + 
                                    "<td class=\"celda-centrada\">" + nroFila + "</td>" +
                                    "<td class=\"celda-centrada\">" + cursoDeAula.cod_curso + "</td>" +
                                    "<td class=\"celda-centrada\">" + cursoDeAula.Descripcion + "</td>" +
                                    "<td class=\"celda-centrada\">" + cursoDeAula.Hora + "</td>" +
                                    "</tr>";
                        tbodyTablaCursosDeAulas.append(tr);
                    }
                } else {
                    var errores = "";
                    for (i = 0; i < datos.errores1.length; i++) {
                        errores += datos.errores1[i] + "<br>";
                    }
                    mostrarMensaje("error", "ERROR", errores);
                }
                if(estado_cant_alumnos_programados && estado_curso){
                    //aún hay capacidad para programar, se cuenta con cursos y alumnos matriculados
                    $("#btnImportar").prop("disabled",false)
                    $("#buscadorAlumnos").prop("disabled",false)                    
                    $("#btnPrepararOtraProgramacion").prop("disabled",false)
                    $("#btnSubirExcel").prop("disabled",false)
                }else{
                    desactivarFiltro(false)
                    $("#tablaCursosDeAulas tbody").html('<tr><td colspan="5" class="text-center"><b>REALICE UNA BÚSQUEDA</b></td></tr>')
                    $("#tablaAlumnos tbody").html('<tr><td colspan="5" class="text-center"><b>REALICE UNA BÚSQUEDA</b></td></tr>')
                    $("#nroAlumnosProgramados").text("-")
                }
            }else{                   
                desactivarFiltro(false);
                var errores = "";
                for (i = 0; i < datos.validacion.length; i++) {
                    errores += datos.validacion[i] + "<br/>";
                }
                mostrarMensaje("error", "ERROR", errores);  
            }
        }
    });
});

$("#buscadorAlumnos").autocomplete({
    source: function(request, response){
        $.ajax({
            url: path + "programacion/importarProgramacionMatriculados",
            type: "POST",
            dataType : "JSON",
            data: {
                institucion: $("#institucion").val(),
                tipoEspecialidad: $("#tipoEspecialidad").val(),
                especialidad: $("#especialidad").val(),
                anioProg: $("#anioProg").val(),
                mesProg: $("#mesProg").val(),
                sede: $("#sede").val(),
                ciclo: $("#ciclo").val(),
                aula: $("#aula").val(),
                grupo: $("#codigo").val(),
                opcionMostradoAlumnos: $('input:radio[name=opcionMostradoAlumnos]:checked').val(),
                alumno: $("#buscadorAlumnos").val(),
                opcion: "buscarAlumnoCodNom"      
            },
            success: function(data){
                let result = ( data.result.length === 0 ) ? [{ vacio: true }] : data.result;
                response(result);
            }
        });
    },
    minLength: 2,
    select: function(event, ui){
        if (ui.item.vacio) {
            event.preventDefault();
        } else{ 

            cargarTablaAlumnosSeleccionados(ui.item);

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
        .append( "<div><b>Código: </b>" + item.cod_alumno + " &nbsp&nbsp-&nbsp <b>Nombre: </b> " +item.alumno +"&nbsp&nbsp-&nbsp <b>Código administrativo: </b> "+ item.cod_administrativo +"</div>" )
        .appendTo( ul );
};

function cargarTablaAlumnosSeleccionados(alumno){
    
    countTrAlumnos = $("#tablaAlumnos tbody tr").length
    valorTd = $("#tablaAlumnos tbody").find("tr").eq(0).text()
    if( countTrAlumnos === 1 ){
        if( valorTd.trim() === "REALICE UNA BÚSQUEDA" ){
            $("#tablaAlumnos tbody").html("")
        }  
    }

    repetido = false
    $('.tr-informacion').each(function(index, value) {
        
        if( $(this).children(".td-cod-alumno").text() === alumno.cod_alumno && $(this).children(".td-cod-administrativo").text() === alumno.cod_administrativo){
            Notiflix.Notify.Warning("EL ALUMNO YA HA SIDO SELECCIONADO");
            repetido = true
            return false
        }
        
    })

    if(repetido === true){
        return
    }

    Notiflix.Notify.Success("ALUMNO AGREGADO");

    count = $("#tablaAlumnos tbody tr").length
    var nroFila = count + 1
    var tr = `<tr class="fila tr-informacion ">"
                <td class="celda-centrada"> ${nroFila}</td>
                <td class="celda-centrada td-cod-alumno">${alumno.cod_alumno}</td>
                <td class="celda-izquierda">${alumno.alumno}</td>
                <td class="celda-centrada td-cod-administrativo">${alumno.cod_administrativo}</td>
                <td class="celda-centrada">
                    <button class="btn btn-danger mipanel-btn-img-texto" type="button" onclick="quitarAlumnoSeleccionado(this)"><span class="icon-cross"></span></button>
                </td>
            </tr>`;

    $("#tablaAlumnos tbody").append(tr);
}

function quitarAlumnoSeleccionado(btn){
    
    $(btn).parent().parent().remove()
    countTrAlumnos = $("#tablaAlumnos tbody tr").length
    if( countTrAlumnos === 0 ){
        $("#tablaAlumnos tbody").html("<tr><td colspan='5' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>")
    }

}

$("#btnPrepararOtraProgramacion").click(function (){
    
    desactivarFiltro(false)
    $("#btnImportar").prop("disabled",true)
    $("#buscadorAlumnos").prop("disabled",true)                    
    $("#btnPrepararOtraProgramacion").prop("disabled",true)
    $("#btnSubirExcel").prop("disabled",true)
    $("#tablaCursosDeAulas tbody").html('<tr><td colspan="5" class="text-center"><b>REALICE UNA BÚSQUEDA</b></td></tr>')
    $("#tablaAlumnos tbody").html('<tr><td colspan="5" class="text-center"><b>REALICE UNA BÚSQUEDA</b></td></tr>')
    $("#nroAlumnosProgramados").text("-")

})

$("#btnImportar").click(function () {

    var institucion = $("#institucion").val();
    var tipoEspecialidad = $("#tipoEspecialidad").val();
    var especialidad = $("#especialidad").val();
    var anioProg = $("#anioProg").val();
    var mesProg = $("#mesProg").val();
    var sede = $("#sede").val();
    var ciclo = $("#ciclo").val();
    var aula = $("#aula").val();
    var codigo = $("#codigo").val().trim();
    var turno = $("#turno").val();
    var pabellon = $("#pabellon").val();
    var piso = $("#piso").val();

    var nroAlumnosProgramados = parseInt($("#nroAlumnosProgramados").text());

    var estatus_capacidad = false;
    //var cantAlumnosSeleccionados = 0;
    var capacidadDisponible  = 60 - nroAlumnosProgramados;
    var cursos = new Array();
    var alumnos = new Array();
    var errorAlumno = new Array();

    //Validando cantidad de alumnos a programar
    var cantAlumnosSeleccionados = $("#tablaAlumnos tbody tr").length
    if(cantAlumnosSeleccionados <= capacidadDisponible)
    {
        estatus_capacidad = true;
    }

    if(estatus_capacidad)
    {
        countTrAlumnos = $("#tablaAlumnos tbody tr").length
        valorTd = $("#tablaAlumnos tbody").find("tr").eq(0).text()
        if( countTrAlumnos === 1 ){
            if( valorTd.trim() === "REALICE UNA BÚSQUEDA" ){
                Notiflix.Report.Warning('Aviso',"POR FAVOR AGREGUE MÍNIMO UN ALUMNO","Cerrar");
                return
            }  
        }

        //Obteniendo los cursos para importar programación
        $("#tablaCursosDeAulas tbody").find("tr").each(function () {

            var codcurso = $(this).find("td").eq(1).html().trim();
            var hora = $(this).find("td").eq(3).html().trim();
            cursos.push(new Array(codcurso,hora));

        });

        //Obteniendo los alumnos para importar programación
        $("#tablaAlumnos tbody").find("tr").each(function () {
            
            var codalumno = $(this).find("td").eq(1).html().trim();
            var nombrealumno = $(this).find("td").eq(2).html().trim();
            var codinterno = $(this).find("td").eq(3).html().trim();
            if(codalumno == "" || codinterno == "")
            {
                errorAlumno.push("El alumno: " + nombrealumno + " debe contar con un código de alumno y código interno.");
            }else
            {
                alumnos.push(new Array(codalumno,codinterno))
            }
        });

        if(alumnos != "")
        {//hay alumnos seleccionados
            if(errorAlumno == "")
            {//Si los datos de alumnos están completos

                $.ajax({
                    url: path + "programacion/importarProgramacionMatriculados",
                    type: "POST",
                    data: {
                        institucion: institucion,
                        tipoEspecialidad: tipoEspecialidad,
                        especialidad: especialidad,
                        anioProg: anioProg,
                        mesProg: mesProg,
                        sede: sede,
                        ciclo: ciclo,
                        aula: aula,
                        codigo: codigo,
                        turno: turno,
                        pabellon: pabellon,
                        piso: piso,
                        cursos: cursos,
                        alumnos: alumnos,
                        opcion: "importar"
                    },
                    beforeSend: function () {
                        desactivarFiltro(true);
                        $("#modalLoader").modal({backdrop: 'static', keyboard: false});

                    },
                    success: function (data) {

                        //console.log(data);
                        $("#modalLoader").modal("hide");
                        var datos = JSON.parse(data);
                        desactivarFiltro(false);

                        if(datos.validacion == null)
                        {

                            if (datos.respuesta === "success") 
                            {

                                desactivarFiltro(false)
                                $("#btnImportar").prop("disabled",true)
                                $("#buscadorAlumnos").prop("disabled",true)                    
                                $("#btnPrepararOtraProgramacion").prop("disabled",true)
                                $("#btnSubirExcel").prop("disabled",true)

                                $("#tablaCursosDeAulas tbody").html('<tr><td colspan="5" class="text-center"><b>REALICE UNA BÚSQUEDA</b></td></tr>')
                                $("#tablaAlumnos tbody").html('<tr><td colspan="5" class="text-center"><b>REALICE UNA BÚSQUEDA</b></td></tr>')
                                $("#nroAlumnosProgramados").text("-")

                                mostrarMensaje("exito", "EXITO", "La importación de la programación académica se ha realizado exitosamente.");

                                //PONER METODO CON EL MODAL DE PROGRAMACION ACADEMICA
                                consultarProgramacion();

                               $("#grupoProgramacionAcademica").val(codigo);
                               $("#mes").val(mesProg);
                               $("#ano").val(anioProg);

                                $('#grupoProgramacionAcademica').trigger(
                                    jQuery.Event( 'keydown', { keyCode: 13, which:13 } )
                                );

                            } else {
                                var errores = "";
                                for (i = 0; i < datos.errores.length; i++) {
                                    errores += datos.errores[i] + "<br>";
                                }
                                mostrarMensaje("error", "ERROR", errores);
                            }

                        }else
                        {

                            var errores = "";
                            for (i = 0; i < datos.validacion.length; i++) {
                                    errores += datos.validacion[i] +   "<br>";
                            }
                             mostrarMensaje("error", "ERROR", errores);
                        
                        }
                    }
                });

            }else{

                var errores = "";

                for (i = 0; i < errorAlumno.length; i++) 
                {
                    errores += errorAlumno[i] + "<br>";
                }

                mostrarMensaje("error","ERROR",errores);

            }
        }else
        {

            Notiflix.Report.Failure('Error',"Seleccione alumnos para la programación","Cerrar");

        }  
       
    }else
    {

        Notiflix.Report.Failure('Error',"Se está superando la cantidad máxima de alumnos a programar para éste grupo. Solo se permite 60 alumnos.","Cerrar");

    }

});

function desactivarFiltro(opcion) {
    
    $("#institucion").prop("disabled", opcion);
    $("#tipoEspecialidad").prop("disabled", opcion);
    $("#especialidad").prop("disabled", opcion);
    $("#anioProg").prop("disabled", opcion);
    $("#mesProg").prop("disabled", opcion);
    $("#sede").prop("disabled", opcion);
    $("#turno").prop("disabled", opcion);
    $("#ciclo").prop("disabled", opcion);
    $("#pabellon").prop("disabled", opcion);
    $("#piso").prop("disabled", opcion);
    $("#aula").prop("disabled", opcion);
    $("#codigo").prop("disabled", opcion);
    $('input:radio[name=opcionMostradoAlumnos]').prop("disabled",opcion)
    $("#btnPrepararProgramacion").prop("disabled",opcion)

}

function cargarComboAulas(){
    var institucion = $("#institucion").val();
    var sede = $("#sede").val();
    var pabellon = $("#pabellon").val();
    var piso = $("#piso").val();
    if(institucion != null && sede != null && pabellon != null && piso != null){
        $.ajax({
            url: path + "programacion/getAulas",
            type: "POST",
            data: {
                institucion: institucion,
                sede: sede,
                pabellon: pabellon,
                piso: piso
            },
            success: function(data){
                //console.log(data);
                $("#aula").html("");
                var datos = JSON.parse(data);                
                if(datos.respuesta=="success"){
                    if(datos.aulas != "vacio"){            
                        var aulas = datos.aulas;
                        for(i=0;i<aulas.length;i++){
                            var aula = aulas[i];
                            $("#aula").append("<option value='" + aula.cod_aula + "'>" + aula.cod_aula + "</option>");
                        }
                    }

                }else{
                    mostrarMensaje("error","ERROR",datos.errores);
                }
            }
        });
    }
}

function subirExcel(){
    $("#modalSubirExcel").modal("show")
}

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
    data.append('excel',excel)
    data.append("institucion" , $("#institucion").val())
    data.append("tipoEspecialidad" , $("#tipoEspecialidad").val())
    data.append("especialidad" , $("#especialidad").val())
    data.append("anioProg" , $("#anioProg").val())
    data.append("mesProg" , $("#mesProg").val())
    data.append("sede" , $("#sede").val())
    data.append("ciclo" , $("#ciclo").val())
    data.append("aula" , $("#aula").val())
    data.append("grupo" , $("#codigo").val())
    data.append("opcionMostradoAlumnos" , $('input:radio[name=opcionMostradoAlumnos]:checked').val() )
    
    $.ajax({
        url: path + "programacion/importarProgramacionMatriculados",
        type: "POST",
        dataType: "JSON",
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            
            if(response.respuesta === "success"){

                $("#modalSubirExcel").modal("hide")
                Notiflix.Report.Success('CONFIRMACIÓN',"ALUMNOS CARGADOS SATISFACTORIAMENTE","Cerrar");

                /**countTrAlumnos = $("#tablaAlumnos tbody tr").length
                valorTd = $("#tablaAlumnos tbody").find("tr").eq(0).text()
                if( countTrAlumnos === 1 ){
                    if( valorTd.trim() === "REALICE UNA BÚSQUEDA"){
                        $("#tablaAlumnos tbody").html("")
                    }  
                }**/

                if(response.errores !== null){  
                    var errores = "";
                    for (i = 0; i < response.errores.length; i++) {
                        errores += "<b>Código "+(i+1)+" : </b> "+response.errores[i] + "<br/>";
                    }
                    mostrarMensaje("error", "ERROR","LOS SIGUIENTES CÓDIGOS NO CUMPLEN CON LOS FILTROS ESTABLECIDOS: <br/> <br/>"+errores);
                }

                if( response.alumnos.length < 1 ){
                    $("#tablaAlumnos tbody").html("<tr><td colspan='5' class='text-center'><b>REALICE UNA BÚSQUEDA</b></td></tr>")
                }else{
                    $("#tablaAlumnos tbody").html("")
                }  

                response.alumnos.forEach(function(alumno){
                   
                    count = $("#tablaAlumnos tbody tr").length
                    var nroFila = count + 1
                    var tr = `<tr class="fila tr-informacion ">"
                                <td class="celda-centrada"> ${nroFila}</td>
                                <td class="celda-centrada td-cod-alumno ">${alumno.cod_alumno}</td>
                                <td class="celda-izquierda">${alumno.alumno}</td>
                                <td class="celda-centrada td-cod-administrativo ">${alumno.cod_administrativo}</td>
                                <td class="celda-centrada">
                                    <button class="btn btn-danger mipanel-btn-img-texto" type="button" onclick="quitarAlumnoSeleccionado(this)"><span class="icon-cross"></span></button>
                                </td>
                            </tr>`;
                    $("#tablaAlumnos tbody").append(tr);
      
                });
            }
        }
    })
})