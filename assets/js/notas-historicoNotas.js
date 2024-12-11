let coloresAsesores = {};
const coloresFondo  = [ 
    "#c4b5fd",
    "#d9f99d",
    "#fecaca",
    "#fed7aa",
    "#bbf7d0",
    "#a5f3fc",
    "#bfdbfe",
    "#ddd6fe",
    "#f5d0fe",
    "#fecdd3"
]
$(document).ready(function () {

    $(".panel_notas").css("display", "none");

    $("#alumno").autocomplete({
        source: function(request, response){
            $.ajax({
                url: path + "notas/historicoNotas",
                type: 'post',
                dataType: "json",
                data: {
                    term: request.term,
                    opcion: 'buscarAlumnos'
                },
                success: function(data){
                    limpiarCampos();
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
            }
            cargarCarrera( ui.item.codigo );
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




function cargarCarrera( codigo ){
    
    $.ajax({
        url: path + "notas/historicoNotas",
        type: "POST",
        dataType : "JSON",
        data: {
            opcion : 'cargarCarrera',
            alumno : codigo
        },
        beforeSend: function () {
            $('.text-loader').text('CARGANDO CURSOS, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function(data){
            /* console.log(data) */
            if( data.respuesta === "success" ){
                /* $("#carrera").html("<option disabled selected>SELECCIONE</option>"); */
                $("#carrera").html(`<option disabled selected value="SELECCIONE">SELECCIONE</option>`)
                data.carreras.forEach(element => {
                    $("#carrera").append(`<option value="${element.cod_espe.trim()}-${element.tipo_espe.trim()}-${element.Cod_local.trim()}-${element.Cod_localinst.trim()}" > ${element.Cursos.trim()} </option>`)
                    $("#modalLoader").modal("hide");
                });
            }else {  
                $("#carrera").html("");
            }

        }
    });
}

$("#carrera").change(function(){
    const parametros = $(this).val();
    cargarCursosMatriculados(parametros);
    cargarCursosAplazados(parametros);
    $(".panel_notas").css("display", "block");
    console.log(parametros)
})



function cargarCursosMatriculados(parametros) {
    var alumno = $('#alumno').val().split(' ')[0];
    var tbody = $("#tablaCursosHistoricoMatriculados tbody");
    tbody.find('tr').remove();
    /* console.log(alumno) */

    $.ajax({
        url: path + "notas/historicoNotas",
        type: "POST",
        data: {
            codigo: alumno,
            parametros: parametros,
            opcion: "cursosMatriculados"
        },
        beforeSend: function () {
            $('.text-loader').text('CARGANDO CURSOS, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
        },
        success: function(data) {
            var datos = JSON.parse(data);
            /* console.log(datos); */
            if (datos.respuesta == "success") {
                if (datos.cursos != "vacio") {
                    var cursos = datos.cursos;
                    var semestres = {}; 
                    for (var i = 0; i < cursos.length; i++) {
                        var curso = cursos[i];
                        var semestre = curso.Semestre;
                        if (!semestres[semestre]) {
                            semestres[semestre] = [];
                        }
                        semestres[semestre].push(curso);
                    }
                    for (var semestre in semestres) {
                        var cursosSemestre = semestres[semestre];
                        //let colorAsesor = getColorAsesor(semestre);
                        for (var j = 0; j < cursosSemestre.length; j++) {
                            var cursoSemestre = cursosSemestre[j];
                            var trCurso = "<tr>";
                            if (j === 0) {
                                
                                trCurso += "<tr><td colspan='21'><hr style='border-bottom: 1px solid #326299;'></td></tr>"+
                                "<td class=\"celda-centrada\" style=\"font-weight: bold; color: black !important; font-size: 15px;\" rowspan=\"" + cursosSemestre.length + "\">" + semestre + "</td>";
                                             
                            }
                            trCurso +=
                            "    <input type=\"hidden\" id=\"" + cursoSemestre.id_Nota +"\" name=\"vacio[]\" value=\"" + cursoSemestre.id_Nota + "\">" +
                            "    <td class=\"celda-centrada\">" + cursoSemestre.cod_curso + "</td>" +
                            "    <td class=\"celda-izquierda\">" + cursoSemestre.Curso + "</td>" +
                            "    <td class=\"celda-centrada\" style=\"font-weight: bold;  color: black !important;\">" + cursoSemestre.Seccion + " / " + cursoSemestre.cod_ciclo +"</td>" +  
                            "    <td class=\"celda-centrada\">" + cursoSemestre.TipoNota +"</td>" +                                      
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ap1[]\" value=\"" + cursoSemestre.ap1.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ed1[]\" value=\"" + cursoSemestre.ed1.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ep[]\" value=\"" + cursoSemestre.ep.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ac1[]\" value=\"" + cursoSemestre.ac1.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pr1[]\" value=\"" + cursoSemestre.pr1.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ap2[]\" value=\"" + cursoSemestre.ap2.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ed2[]\" value=\"" + cursoSemestre.ed2.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ef[]\" value=\"" + cursoSemestre.ef.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ac2[]\" value=\"" + cursoSemestre.ac2.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pr2[]\" value=\"" + cursoSemestre.pr2.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pr[]\" value=\"" + cursoSemestre.pr.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);validarES(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"es[]\" value=\"" + cursoSemestre.es.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pf[]\" value=\"" + cursoSemestre.pf.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" + cursoSemestre.obs.trim() + "</td>" +
                            "    <td class=\"celda-centrada optionCheckBody\" style=\"display: none;\"> <input type=\"hidden\" value=\""+ cursoSemestre.id_Nota +"\"><input style=\"cursor:pointer\" name=\"selectCheckbox[]\" type=\"checkbox\" class=\"selectCheckbox\"></input> </td>" +    
                            "    <td class=\"celda-centrada\">" + cursoSemestre.usuario.trim() +"</td>" +    
                            "    <td class=\"celda-centrada\">" + cursoSemestre.fecha_registro.trim() +"</td>" + 
                            "</tr>";
                             tbody.append(trCurso)
                        }
                    }
                    pintarNotasCursosMatriculados();
                    $("#modalLoader").modal("hide");
                    Notiflix.Notify.Success("OPERACIÓN ÉXITOSA.");
                }else{
                    $("#modalLoader").modal("hide");
                    $("#tablaCursosHistoricoMatriculados tbody").html("<tr><td colspan='11' class='text-center' ><b>NO SE ENCONTRO INFORMACIÓN PARA CARGAR</b></td></tr>")
                    Notiflix.Notify.Warning('AVISO DE SISTEMA');
                }
            }else{
                $("#tablaCursosHistoricoMatriculados tbody").html("<tr><td colspan='11' class='text-center' ><b>NO SE ENCONTRO INFORMACIÓN PARA CARGAR</b></td></tr>")
                Notiflix.Notify.Warning('NO SE ENCONTRO INFORMACIÓN PARA CARGAR');
                $("#modalLoader").modal("hide");
            }
        }
    });
}

function abreviarVecesCursado(vecesCursado) {
    if (vecesCursado === 1) {
        return "1ra vez";
    } else if (vecesCursado === 2) {
        return "2da vez";
    } else if (vecesCursado === 3) {
        return "3ra vez";
    } else {
        return vecesCursado + "ta vez";
    }
}

function generarColorAleatorio() {
    return coloresFondo[Math.floor(Math.random() * coloresFondo.length)];
}
function getColorAsesor(asesor) {
    if (!coloresAsesores[asesor]) {
        coloresAsesores[asesor] = generarColorAleatorio();
    }
    return coloresAsesores[asesor];
}

function cargarCursosAplazados(parametros) {
    var alumno = $('#alumno').val().split(' ')[0];

    var tbody = $("#tablaCursosHistoricosAplazados tbody");
    tbody.find('tr').remove();

    $.ajax({
        url: path + "notas/historicoNotas",
        type: "POST",
        data: {
            codigo: alumno,
            parametros: parametros,
            opcion: "cursosAplazados"
        },
        success: function (data) {

            var datos = JSON.parse(data);
            if (datos.respuesta == "success") {
                if (datos.cursos != "vacio") {
                    var cursosA = datos.cursos;
                    var semestresA = {};
    
                    for (i = 0; i < cursosA.length; i++) {
                        var cursoA = cursosA[i];
                        var semestreA = cursoA.Semestre;
                        if(!semestresA[semestreA]){
                            semestresA[semestreA] = [];
                        }
                        semestresA[semestreA].push(cursoA)
                    }
                    for (var semestreA in semestresA) {
                        var cursosSemestreA = semestresA[semestreA];
                        for(var j = 0; j < cursosSemestreA.length; j++){
                            var cursoSemestreA = cursosSemestreA[j];
                            var trCursoA = "<tr>"
                            var tipo_nota;
                            if(j === 0){
                                trCursoA += "<td class=\"celda-centrada\" rowspan=\"" + cursosSemestreA.length + "\">" + semestreA + "</td>"
                            }
                            if (cursoSemestreA.TipoNota === 1) {
                                tipo_nota = "REG";
                            } else {
                                tipo_nota = "CVL";
                            }
                            trCursoA +=
                            "    <input type=\"hidden\" name=\"id_CursoAplazadoA[]\" value=\"" + cursoSemestreA.id_CursoAplazado + "\">" +
                            "    <td class=\"celda-centrada\">" + cursoSemestreA.cod_curso + "</td>" +
                            "    <td class=\"celda-izquierda\">" + cursoSemestreA.Curso + "</td>" +
                            "    <td class=\"celda-centrada\">" + cursoSemestreA.CodCiclo + "</td>" +
                            "    <td class=\"celda-centrada\">" + tipo_nota +"</td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ap1A[]\" value=\"" + cursoSemestreA.ap1.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ed1A[]\" value=\"" + cursoSemestreA.ed1.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"epA[]\" value=\"" + cursoSemestreA.ep.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio1(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ac1A[]\" value=\"" + cursoSemestreA.ac1.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pr1A[]\" value=\"" + cursoSemestreA.pr1.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ap2A[]\" value=\"" + cursoSemestreA.ap2.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ed2A[]\" value=\"" + cursoSemestreA.ed2.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"efA[]\" value=\"" + cursoSemestreA.ef.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);obtenerPromedio2(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"ac2A[]\" value=\"" + cursoSemestreA.ac2.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pr2A[]\" value=\"" + cursoSemestreA.pr2.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"prA[]\" value=\"" + cursoSemestreA.pr.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this);validarES(this);\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"esA[]\" value=\"" + cursoSemestreA.es.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\" >" +
                            "        <input type=\"text\" class=\"form-control\" onblur=\"validarNota(this)\" style=\"text-align: center; padding-left: 0px; padding-right: 0px;\" name=\"pfA[]\" value=\"" + cursoSemestreA.pf.trim() + "\" disabled />" +
                            "    </td>" +
                            "    <td class=\"celda-centrada\">" + abreviarVecesCursado(cursoSemestreA.NroVezCursado) + "</td>" +
                            "</tr>";
                            tbody.append(trCursoA);
                        }
                    }
                    pintarNotasCursosAplazados();
                }else{
                    $("#tablaCursosHistoricosAplazados tbody").html("<tr><td colspan='11' class='text-center' ><b>NO SE ENCONTRO INFORMACIÓN PARA CARGAR</b></td></tr>")
                    $("#modalLoader").modal("hide");
                }
            }else{
                $("#tablaCursosHistoricosAplazados tbody").html("<tr><td colspan='11' class='text-center' ><b>NO SE ENCONTRO INFORMACIÓN PARA CARGAR</b></td></tr>")
                $("#modalLoader").modal("hide");
            }
        }
    });
}

function pintarNotasCursosAplazados() {
    $("#tablaCursosHistoricosAplazados tbody").find("tr").each(function () {
        var nroText = $(this).find("input:text").length;
        var i = 0;
        for (i = 0; i < nroText; i++) {
            validarNota($(this).find("input:text").eq(i));
        }
    });

}

function pintarNotasCursosMatriculados() {
    $("#tablaCursosHistoricoMatriculados tbody").find("tr").each(function () {
        var nroText = $(this).find("input:text").length;
        var i = 0;
        for (i = 0; i < nroText; i++) {
            if( i != 13 ){
                validarNota($(this).find("input:text").eq(i));
            }
        }
    });

}

function validarNota(text) {
    var nota = $(text).val().trim();
    $(text).css({"color": "black"});
    if (isNaN(nota) || nota == "") {
        $(text).val("");
    } else {
        if (isNaN(parseInt(nota))) {
            $(text).val("");
        } else {
            nota = parseInt(nota);
            if (nota < 0 || nota > 20) {
                $(text).val("");
            } else {
                if (nota >= 0 && nota <= 9) {
                    $(text).val("0" + nota.toString());
                } else {
                    $(text).val(nota);
                }
                if (nota < 13) {
                    $(text).css({"color": "red"});
                } else {
                    $(text).css({"color": "blue"});
                }
            }
        }
    }
}

function obtenerPromedio1(elemento)
{

    var ap1 = ($(elemento).parent().parent().find("input:text").eq(0).val()).trim();
    var ed1 = ($(elemento).parent().parent().find("input:text").eq(1).val()).trim();
    var ep = ($(elemento).parent().parent().find("input:text").eq(2).val()).trim();
    var ac1 = ($(elemento).parent().parent().find("input:text").eq(3).val()).trim();
    

    if(ap1  != "" && ed1 != "" && ep != "" && ac1 != "")
    {

        if(ap1 == ""){ ap1 = 0; }
        if(ed1 == ""){ ed1 = 0; }
        if(ep == ""){ ep = 0; }
        if(ac1 == ""){ ac1 = 0; }

        var pr1 = ((parseInt(ap1) + parseInt(ed1) + parseInt(ep) + parseInt(ac1)) / 4).toFixed(0);
        
        $(elemento).parent().parent().find("input:text").eq(4).val(pr1);

        validarNota($(elemento).parent().parent().find("input:text").eq(4));


        //obteniendo promedio general
        var pr1 = ($(elemento).parent().parent().find("input:text").eq(4).val()).trim();
        var pr2 = ($(elemento).parent().parent().find("input:text").eq(9).val()).trim();

        if(pr1 == ""){ pr1 = 0; }
        if(pr2 == ""){ pr2 = 0; }


        var pr = ((parseInt(pr1) + parseInt(pr2)) / 2).toFixed(0);

        $(elemento).parent().parent().find("input:text").eq(10).val(pr);
        validarNota($(elemento).parent().parent().find("input:text").eq(10));

        //obteniendo promedio final
        obtenerPromedioFinal(elemento);

    }

}

function obtenerPromedio2(elemento)
{

    var ap2 = ($(elemento).parent().parent().find("input:text").eq(5).val()).trim();
    var ed2 = ($(elemento).parent().parent().find("input:text").eq(6).val()).trim();
    var ef = ($(elemento).parent().parent().find("input:text").eq(7).val()).trim();
    var ac2 = ($(elemento).parent().parent().find("input:text").eq(8).val()).trim();
    

    //console.log(ap2 + ' ' + ed2 + ' ' + ef + ' '+ ac2);

    if(ap2  != "" && ed2 != "" && ef != "" && ac2 != "")
    {
        if(ap2 == ""){ ap2 = 0; }
        if(ed2 == ""){ ed2 = 0; }
        if(ef == ""){ ef = 0; }
        if(ac2 == ""){ ac2 = 0; }

        var pr2 = ((parseInt(ap2) + parseInt(ed2) + parseInt(ef) + parseInt(ac2)) / 4).toFixed(0);

        $(elemento).parent().parent().find("input:text").eq(9).val(pr2);

        validarNota($(elemento).parent().parent().find("input:text").eq(9));


        //obteniendo promedio general
        var pr1 = ($(elemento).parent().parent().find("input:text").eq(4).val()).trim();
        var pr2 = ($(elemento).parent().parent().find("input:text").eq(9).val()).trim();

        if(pr1 == ""){ pr1 = 0; }
        if(pr2 == ""){ pr2 = 0; }


        var pr = ((parseInt(pr1) + parseInt(pr2)) / 2).toFixed(0);

        $(elemento).parent().parent().find("input:text").eq(10).val(pr);
        validarNota($(elemento).parent().parent().find("input:text").eq(10));

        //obteniendo promedio final
        obtenerPromedioFinal(elemento);

    }      
}

function obtenerPromedioFinal(elemento)
{

    //obteniendo promedio final
    var pr = ($(elemento).parent().parent().find("input:text").eq(10).val()).trim();
    var es = ($(elemento).parent().parent().find("input:text").eq(11).val()).trim();

    if(pr == ""){ pr = 0; }
    if(es == ""){ es = 0; }

    if(parseInt(pr) > parseInt(es))
    {

        $(elemento).parent().parent().find("input:text").eq(12).val(pr);
        
    }else
    {

        $(elemento).parent().parent().find("input:text").eq(12).val(es);

    }

    validarNota($(elemento).parent().parent().find("input:text").eq(12));
}

function validarES(elemento)
{
    
    var pr = ($(elemento).parent().parent().find("input:text").eq(10).val()).trim();
    var es = ($(elemento).parent().parent().find("input:text").eq(11).val()).trim();

    if(pr != "" && es != "")
    {

        obtenerPromedioFinal(elemento);

    }

}

function limpiarCampos() {
    $("#carrera").find('option').remove();
    /* $(".panel_notas").css("display", "none"); */
    $("#tablaCursosHistoricoMatriculados tbody").find('tr').remove();
    $("#tablaCursosHistoricosAplazados tbody").find('tr').remove();
}
