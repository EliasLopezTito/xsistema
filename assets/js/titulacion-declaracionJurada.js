document.addEventListener("DOMContentLoaded", () => {
     
    autocompleteAlumno();
    autocompleteAlumnoModal();
    cargarDocumentos();
    cargarUbicacion();

});

function autocompleteAlumno(){
    $("#alumno").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "titulacion/declaracionJurada",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function (data) {
                    console.log(data);
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
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {
                $("#alumno").val(ui.item.cod_alumno + " - " + ui.item.nombre);
                $("#codigoAlumno").val(ui.item.cod_alumno.trim());
                $("#cod_espe").val(ui.item.Cod_espe.trim());
                $("#alumno").next('i').removeClass('glyphicon-remove');
                $("#alumno").next('i').addClass('glyphicon-ok');
                $("#alumno").parent().removeClass('has-error');
                $("#alumno").parent().addClass('has-success');
                //cargarDataAlumno(ui.item.cod_alumno,ui.item.Cod_espe.trim());
            }
            return false;
        }
    })
    .autocomplete("instance")._renderItem = function (ul, item) {
        if (item.hasOwnProperty('vacio')) {
            return $("<li>")
                .append("<div>No se encontraron resultados</div>")
                .appendTo(ul);
        }
        return $("<li>")
            .append("<div>" + item.cod_alumno + " - " + item.nombre + "</div>")
            .appendTo(ul);
    };
    $("#alumno").focus();
} 

$("#alumno").keyup(function(){
    if( $(this).val().length < 1){        
        $("#alumno").next('i').removeClass('glyphicon-ok');
        $("#alumno").next('i').addClass('glyphicon-remove');
        $("#alumno").parent().removeClass('has-success');
        $("#alumno").parent().addClass('has-error');
    }
})

function autocompleteAlumnoModal() {
    $("#alumnoAgregar").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: path + "titulacion/declaracionJurada",
                dataType: "json",
                type: 'post',
                data: {
                    term: request.term,
                    opcion: 'searchAlumnos'
                },
                success: function (data) {

                    $("#alumnoAgregar").attr("codigo", ""); 
                    $("#alumnoAgregar").attr("codespe", ""); 
                    $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
                    $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
                    $("#alumnoAgregar").parent().removeClass('has-success');
                    $("#alumnoAgregar").parent().addClass('has-error');
                    let result = (!data.alumnos) ? [{ vacio: true }] : data.alumnos;
                    response(result);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            if (ui.item.vacio) {
                event.preventDefault();
            } else {                

                $("#alumnoAgregar").val(ui.item.cod_alumno + " - " + ui.item.nombre);                
                $("#alumnoAgregar").attr("codigo", ui.item.cod_alumno);    
                $("#alumnoAgregar").attr("codespe", ui.item.Cod_espe);             
                $("#alumnoAgregar").next('i').removeClass('glyphicon-remove');
                $("#alumnoAgregar").next('i').addClass('glyphicon-ok');
                $("#alumnoAgregar").parent().removeClass('has-error');
                $("#alumnoAgregar").parent().addClass('has-success');                
                
                $("#apellidosM").val(ui.item.apellidos);
                $("#nombresM").val(ui.item.nombres);
                $("#codigoM").val(ui.item.cod_interno);
                $("#documentoM").val(ui.item.documento);
                $("#domicilioM").val(ui.item.domicilio);
                $("#telefonosM").val(ui.item.telefono);
                $("#fechaNacM").val(ui.item.fecha_naci);

            }

            return false;
        }
    })
    .autocomplete("instance")._renderItem = function (ul, item) {
        if (item.hasOwnProperty('vacio')) {
            return $("<li>")
                .append("<div>No se encontraron resultados</div>")
                .appendTo(ul);
        }
        return $("<li>")
            .append("<div>" + item.cod_alumno + " - " + item.nombre + "</div>")
            .appendTo(ul);
    };
    $("#alumnoAgregar").focus();
} 

let backgroundColor = [
    'rgb(255, 99, 132,0.2)',
    'rgb(54, 162, 235,0.2)',
    'rgb(255, 205, 86,0.2)',
    'rgb(112, 173, 70,0.2)',
    'rgb(230, 148, 92,0.2)',
    'rgb(54, 162, 235,0.2)',
    'rgb(75, 192, 192,0.2)',
    'rgb(255, 205, 86,0.2)',
    'rgb(255, 99, 132,0.2)',
    'rgb(201, 203, 207,0.2)',
    'rgb(83, 211, 87,0.2)',
    'rgb(237, 208, 98,0.2)'
];

$('#btnBuscar').click(function () {
    cargarDataAlumno()
})

function cargarDataAlumno(){

    $.ajax({
        url: path + "titulacion/declaracionJurada",
        dataType: 'JSON',
        type: 'POST',
        data: {
            opcion: 'cargarData',
            cod_alumno: $('#codigoAlumno').val(),
            cod_espe: $('#cod_espe').val(),
            fecha_1: $('#fecha_1').val(),
            fecha_2: $('#fecha_2').val()
        },
        beforeSend: function(){
            $('.text-loader').text('CONSULTANDO INFORMACIÓN, POR FAVOR ESPERE...');
            $("#modalLoader").modal();
            $("#tablaListado tbody").html("");
        },
        complete: function(){
            $("#modalLoader").modal("hide");
        },
        success: function(data) {
                                                   
            if (data.respuesta === 'success') {

                const longitud = data.data.length;
                console.log("data", data);

                Notiflix.Notify.Success("OPERACIÓN EXITOSA");

                if ( longitud > 0 ) {
                        
                    //data.data.forEach( (e,k) => {                        
                        data.data.forEach( (el , key) => {   
                            
                            el.forEach( (e,k) => {
                                rowspan = `
                                    <td class='text-center' rowspan="5">
                                        <form method='post' target="_blank">
                                            <input type="hidden" name="codigo" value="${e.CodAlumno}"></input> 
                                            <input type="hidden" name="op" value="${e.Op}"></input>   
                                            <button class='btn boton-tabla boton-azul' type='submit' title='Descargar Declaración Jurada'><span class='icon-download3'></span></button>
                                        </form>   
                                        <form method='post' target="_blank">
                                            <input type="hidden" name="codigo" value="${e.CodAlumno}"></input>
                                            <input type="hidden" name="op" value="${e.Op}"></input>   
                                            <input type="hidden" name="formatoAntiguo" value="${e.Op}"></input>   
                                            <button class='btn boton-tabla boton-verde' type='submit' title='Descargar Solicitud'><span class='icon-download3'></span></button>
                                        </form>
                                        <div>
                                            <button class='btn boton-tabla boton-amarillo' codigo="${e.CodAlumno}" op="${e.Op}" type='button' onclick='verEditar(this)'><span class='icon-pencil2'></span></button>  
                                        </div>
                                        <div>
                                            <button class='btn boton-tabla boton-rojo' codigo="${e.CodAlumno}" op="${e.Op}" type='button' onclick='eliminar(this)'><span class='icon-bin'></span></button>                       
                                        </div>
                                    </td>
                                `;        
                                const correlativo = `<td class='text-center' rowspan="${el.length}"><b>${e.Op}</b></td>`;                     
                                $("#tablaListado tbody").append(`<tr style="background:${backgroundColor[key]}">
                                    ${k === 0 ? correlativo : ""}  
                                    <td class='text-center'>${e.Alumno.trim()}</td>
                                    <td class='text-center'>${e.Nombre_espe.trim()}</td>
                                    <td class='text-center'>${e.AnoEstudio.trim()}</td>                                                                    
                                    <td class='text-center'>${e.AnoCurso.trim()}</td>
                                    <td class='text-center'>${e.Colegio.trim()}</td>  
                                    ${k === 0 ? rowspan : ""}
                                </tr>`);

                        });  
                                               
                    });
                                        
                } else{

                    $("#tablaListado tbody").html(`<tr><td class='text-center' colspan="6">NO SE ENCONTRÓ INFORMACIÓN</td></tr>`)

                }

            } else{

                Notiflix.Notify.Failure("OCURRIO UN ERROR INESPERADO, POR FAVOR VUELVA A INTENTARLO");
                $("#tablaListado tbody").html("");

            }
       
        }
    });

}

function verEditar(btn){

    const op = $(btn).attr("op");
    const codigo = $(btn).attr("codigo");

    $.ajax({
        url: path + "titulacion/solicitudTitulacion",
        dataType: "JSON",
        type: 'POST',
        data: {
            opcion: "validar",
            tipo: 2,
            ruta: "titulacion/declaracionJurada"  
        },
        success: function(response) {
            /* console.log(response) */
            if (response.respuesta === "success" && response.validarUsuario === "SI") {
                $.ajax({
                    url: path + "titulacion/declaracionJurada",
                    dataType: "JSON",
                    type: 'POST',
                    data: { opcion: 'verEditar',
                            op: op
                    },
                    success: function (data) {
            
                        console.log("DATAVER EDIUTAR ", data);
            
                        datex = data.data
                        datexDeta = data.dataDetalle
                        
                        console.log("oio", datex.Op);
                        
                        if(data.respuesta === "success"){
                            //Notiflix.Notify.Success( "SU REGISTRO SE REALIZÓ CON ÉXITO" , { timeout: 5000 }); 
            
                            $("#idM").val(datex.Op.trim());
                            $("#alumnoAgregar").attr("codigo", datex.Cod_alumno.trim());
                            $("#alumnoAgregar").attr("codespe", datex.cod_espe.trim());
                            $("#alumnoAgregar").val(datex.Nombres + " " + datex.Apellidos);
                            $("#apellidosM").val(datex.Apellidos);
                            $("#nombresM").val(datex.Nombres);
                            $("#documentoM").val(datex.documento);
                            $("#codigoM").val(datex.codigo);
                            $("#fechaM").val(datex.Fecha.substr(0, 10)); 
                            $("#domicilioM").val(datex.domicilio);
                            //$("#paisM").val(datex.domicilio);
                            $("#departamentoM").val(datex.departamento);
                            $("#provinciaM").val(datex.provincia);
                            $("#distritosM").val(datex.distrito);
                            $("#lugarNacM").val(datex.LugarNacimineto);
                            $("#fechaNacM").val(datex.FechaNacimiento.substr(0, 10));
                            $("#telefonosM").val(datex.Telefonos);
                  
                            $("#colegioM_1").val(datexDeta[0].Colegio);
                            $("#colegioM_2").val(datexDeta[1].Colegio);
                            $("#colegioM_3").val(datexDeta[2].Colegio);
                            $("#colegioM_4").val(datexDeta[3].Colegio);
                            $("#colegioM_5").val(datexDeta[4].Colegio);
                            
                            $("#anioCursoM_1").val(datexDeta[0].AnoCurso);
                            $("#anioCursoM_2").val(datexDeta[1].AnoCurso);
                            $("#anioCursoM_3").val(datexDeta[2].AnoCurso);
                            $("#anioCursoM_4").val(datexDeta[3].AnoCurso);
                            $("#anioCursoM_5").val(datexDeta[4].AnoCurso);
            
                            $("#id_anioCursoM_1").val(datexDeta[0].Id);
                            $("#id_anioCursoM_2").val(datexDeta[1].Id);
                            $("#id_anioCursoM_3").val(datexDeta[2].Id);
                            $("#id_anioCursoM_4").val(datexDeta[3].Id);
                            $("#id_anioCursoM_5").val(datexDeta[4].Id);
                            
                            $("#btnRegistrar").html('Editar')
                            $("#tituloModal").html('Editar')
            
                            $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
                            $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
                            $("#alumnoAgregar").parent().removeClass('has-success');
                            $("#alumnoAgregar").parent().addClass('has-error');
                            
                            $("#modalAgregarEditar").modal();
            
                        }else if(data.respuesta === "warning"){
                            Notiflix.Notify.Warning( data.error , {timeout:5000})
                        }else{
                            Notiflix.Notify.Failure('Ocurrió un error inesperado, vuelva a intentarlo', { timeout: 5000 });
                        }
            
                    }
                });
            } else {
                Notiflix.Report.Warning("AVISO","No tienes permiso para realizar esta acción.", "Aceptar");;
            }
        },
        error: function() {
            Notiflix.Report.Failure("ERROR","Ocurrió un error al validar los permisos. Por favor, intenta de nuevo.", "Cerrar");
        }
    });  
}

function eliminar(btn){

    const op = $(btn).attr("op");
    const codigo = $(btn).attr("codigo");

    Notiflix.Confirm.Show(
        'Confirmación',
        `¿Está seguro de eliminar la operación seleccionada?`,
        'Si',
        'No',
        function () {
            
            $.ajax({
                url: path + "titulacion/declaracionJurada",
                dataType: "JSON",
                type: 'POST',
                data: {
                    opcion: "eliminar",
                    op: op
                },
                success: function (data) {

                    if (data.respuesta === "success") {

                        Notiflix.Notify.Success("EL REGISTRO SE ELIMINO CON ÉXITO", { timeout: 5000 });
                        //cargarDataAlumno(codigo);

                    } else {

                        Notiflix.Notify.Failure('Ocurrió un error inesperado, vuelva a intentarlo', { timeout: 5000 });

                    }

                }
            });

        },
        function () {
            
        }
    );
       
}

function cargarDocumentos() {

    $.ajax({
        url: path + "titulacion/declaracionJurada",
        dataType: 'JSON',
        type: 'POST',
        data: {
            opcion: 'cargarDocumentos'
        },        
        success: function (data) {

            if (data.respuesta === 'success') {
                
                data.data.forEach((e, k) => {
                    $("#tablaListado tbody").append(`<tr>
                        <td class='text-center'>${e.Alumno.trim()}</td>
                        <td class='text-center'>${e.Especialidad.trim()}</td>
                        <td class='text-center'>${e.Semestre.trim()}</td>                                                                    
                        <td class='text-center'>${e.Ciclo.trim()}</td>
                        <td class='text-center'>${e.Turno.trim()}</td>                                                                                        
                    </tr>`);
                });

            }  
        }
    });

}

$("#formulario").submit(function(e){

    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"registrar"})
    data.push({ name: "codigoAlumno", value: $("#alumnoAgregar").attr("codigo") });
    data.push({ name: "especialidad", value: $("#alumnoAgregar").attr("codespe") });
    
    $.ajax({
        url: path + "titulacion/declaracionJurada",
        dataType: "JSON",
        type: 'POST',
        data: $.param(data),
        success: function (data) {
            
            if(data.respuesta === "success"){
                Notiflix.Notify.Success( "SU REGISTRO SE REALIZÓ CON ÉXITO" , { timeout: 5000 }); 

                $(".colegioM").val("");               
                $("#telefonosM").val("");
                $("#lugarNacM").val("");
                $("#domicilioM").val("");
                $("#documentoM").val("");
                $("#codigoM").val("");
                $("#nombresM").val("");
                $("#apellidosM").val("");
                $("#alumnoAgregar").attr("codigo", "");
                $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
                $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
                $("#alumnoAgregar").parent().removeClass('has-success');
                $("#alumnoAgregar").parent().addClass('has-error');
                $("#alumnoAgregar").val("");
                $("#modalAgregarEditar").modal("hide");

            }else if(data.respuesta === "warning"){
                Notiflix.Notify.Warning( data.error , {timeout:5000})
            }else{
                Notiflix.Notify.Failure('Ocurrió un error inesperado, vuelva a intentarlo', { timeout: 5000 });
            }

        }
    });
    

})

$("#alumnoAgregar").keyup(function(){
    if( $(this).val().length < 1){
        $("#alumnoAgregar").attr("codigo", "");
        $("#alumnoAgregar").attr("codespe", "");  
        $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
        $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
        $("#alumnoAgregar").parent().removeClass('has-success');
        $("#alumnoAgregar").parent().addClass('has-error');
    }
})

$("#btnAgregar").click(function () {
    $("#btnRegistrar").html('Guardar')
    $("#tituloModal").html('Registrar')

                $("#idM").val("0");
                $("#alumnoAgregar").attr("codigo", '');
                $("#alumnoAgregar").attr("codespe", '');
                $("#alumnoAgregar").val('');
                $("#apellidosM").val('');
                $("#nombresM").val('');
                $("#documentoM").val('');
                $("#codigoM").val('');
                $("#fechaM").val(''); 
                $("#domicilioM").val('');
                //$("#paisM").val(datex.domicilio);
                $("#departamentoM").val('');
                $("#provinciaM").val('');
                $("#distritosM").val('');
                $("#lugarNacM").val('');
                $("#fechaNacM").val('');
                $("#telefonosM").val('');
      
                $("#colegioM_1").val('');
                $("#colegioM_2").val('');
                $("#colegioM_3").val('');
                $("#colegioM_4").val('');
                $("#colegioM_5").val('');
                
                $("#anioCursoM_1").val('');
                $("#anioCursoM_2").val('');
                $("#anioCursoM_3").val('');
                $("#anioCursoM_4").val('');
                $("#anioCursoM_5").val('');

                $("#id_anioCursoM_1").val('0');
                $("#id_anioCursoM_2").val('0');
                $("#id_anioCursoM_3").val('0');
                $("#id_anioCursoM_4").val('0');
                $("#id_anioCursoM_5").val('0');

                $("#alumnoAgregar").next('i').removeClass('glyphicon-ok');
                $("#alumnoAgregar").next('i').addClass('glyphicon-remove');
                $("#alumnoAgregar").parent().removeClass('has-success');
                $("#alumnoAgregar").parent().addClass('has-error');

    $("#modalAgregarEditar").modal({backdrop:"static",keyboard:false});

})

$("#paisM").change(function(){
    cargarUbicacion(false);
})

$("#departamentoM").change(function () {
    cargarUbicacion(false,false);
})

$("#provinciaM").change(function () {
    cargarUbicacion(false,false,false);
})

$("#distritosM").change(function () {
    cargarUbicacion(false,false,false,false);
})

//FUNCIONES PAISES - DEPARTAMENTO - PROVINCIA - DISTRITOS
async function cargarUbicacion(pais_ = true , departamento_ = true , provincia_ = true , distrito_ = true ) {
    
    const headers = { "Content-Type": "application/json", 'Accept': 'application/json' };

    //PAISES
    if(pais_){
        let paises = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST", 
            headers: headers,
            body: JSON.stringify({opcion:"cargarPaises"})
        });
        paises = await paises.json();
        $("#paisM").html("");
        paises.paises.forEach( pais => {
            $("#paisM").append(`<option value="${pais.ID}" ${pais.ID==="20"?"selected":""} > ${pais.Nombre.toUpperCase()} </option>`);
        }); 
    }

    //DEPARTAMENTOS
    if(departamento_){
        let departamentos = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarDepartamentos", pais: $("#paisM").val() })
        });
        departamentos = await departamentos.json();
        $("#departamentoM").html("");
        departamentos.departamentos.forEach( departamento => {
            $("#departamentoM").append(`<option value="${departamento.ID}" ${departamento.ID === "23" ? "selected" : ""} > ${departamento.Nombre.toUpperCase()} </option>`);
        });
    }

    //PROVINCIAS
    if(provincia_){
        let provincias = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarProvincias", departamento: $("#departamentoM").val() })
        });
        provincias = await provincias.json();
        $("#provinciaM").html("");
        provincias.provincias.forEach(provincia => {
            $("#provinciaM").append(`<option value="${provincia.ID}" ${provincia.ID === "20" ? "selected" : ""} > ${provincia.Nombre.toUpperCase()} </option>`);
        });
    }

    //DISTRITOS
    if(distrito_){
        let distritos = await fetch(`${path}titulacion/declaracionJurada`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ opcion: "cargarDistritos", provincia: $("#provinciaM").val() })
        });
        distritos = await distritos.json();
        $("#distritosM").html("");
        distritos.distritos.forEach(distrito => {
            $("#distritosM").append(`<option value="${distrito.ID}" > ${distrito.Nombre.toUpperCase()} </option>`);
        });
    }
    
}