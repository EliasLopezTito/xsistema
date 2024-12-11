$(document).ready(function(){

    cargarInstituciones(true);
    cargarInstituciones2(true);
    
    $("#institucion2").change(function () {
        cargarTipoEspecialidades2(true, false);
    })
    $("#tipoEspecialidad2").change(function(){
        cargarEspecialidades2(true,false, function() {
            var cboEspecialidad = $("#especialidad2");
            cboEspecialidad.find('option[value="0"]').remove();
        });
    })

    $("#institucion").change(function () {
        cargarTipoEspecialidades(true);
    });

    $("#tipoEspecialidad").change(function () {
        cargarEspecialidades(true);
    });

    cargarMalla();
    $("#modalEditarMalla").on("hidden.bs.modal", function () {
        $(".fila-seleccionada").removeClass("fila-seleccionada");
    });

})

function cargarMalla() {
    $.ajax({
        url: path + "notas/mallaCurricular",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion: "select"
        },
        beforeSend: function () {
            $("#tablaMalla tbody").html("");
        },
        success: function (datos) {
            if (datos.respuesta === "success") {
                for (let i = 0; i < datos.data.length; i++) {
                    const malla = datos.data[i];
                    const tr = `<tr>
                                    <td class="celda-centrada">${i + 1}</td>
                                    <td class="celda-izquierda">${malla.malla_curricular.trim()}</td>
                                    <td class="celda-izquierda">${malla.Tipo.trim()}</td>
                                    <td class="celda-centrada">${malla.Especialidad.trim()}</td>
                                    <td class="celda-centrada">${malla.Abreviatura.trim()}</td>
                                    <td class="celda-centrada">
                                        <button class="btn boton-tabla boton-verde" type="button" onclick="editarFila(this, '${malla.malla_curricular.trim()}','${malla.cod_local}','${malla.tipo_espe}','${malla.cod_espe}');"><span class="icon-pencil"></span></button>
                                        <button class="btn boton-tabla boton-rojo" disabled type="button"><span class="icon-bin"></span></button>
                                    </td>
                                </tr>`;
                    $("#tablaMalla tbody").append(tr);
                }

                Notiflix.Notify.Success('Mallas curriculares cargadas correctamente!');
            } else {
                Notiflix.Notify.Failure('Ocurrió un error inesperado');
            }
        }
    });
}

function editarFila(boton, malla_curricular, cod_local, tipo_espe, cod_espe) {
    $(boton).closest("tr").addClass("fila-seleccionada");
    obtenerDatos(malla_curricular, cod_local, tipo_espe, cod_espe);
}


function nuevoCurso(){

    $("#modalAgregarMalla").modal()
    $("#modalAgregarMalla").modal({backdrop: 'static', keyboard: false});

}

$("#formAgregar").submit(function(e){
    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"create"})
    /* console.log(data); */
    $.ajax({
        url: path + "notas/mallaCurricular",
        type: "POST",
        dataType : "JSON",
        data: data,  
        beforeSend: function(){
            $("#tablaMalla tbody").html("");
        },     
        success: function ( datos ) { 
            if (datos.respuesta === "success"){           
                Notiflix.Notify.Success('Malla registrada correctamente.');
                cargarMalla();
                $("#modalAgregarMalla").modal("hide") 
            } else {
                Notiflix.Notify.Failure('Ocurrio un error inesperado.');
            }        
        }
    });
})

function obtenerDatos(malla_curricular,cod_local,tipo_espe,cod_espe) {

    $.ajax({
        url: path + "notas/mallacurricular",
        type: "POST",
        dataType: "JSON",
        data: {
            opcion:"obtenerDatos",
            malla_curricular:malla_curricular,
            cod_local:cod_local,
            tipo_espe:tipo_espe,
            cod_espe:cod_espe
        },
        success: function (data) {
            if (data.respuesta == "success") {
                const rt = data.rt[0];
                $("#malla_curricularE").val(rt.malla_curricular.trim());
                cargarInstituciones2(true, false, function() {
                    $("#institucion2").val(rt.cod_local.trim()).prop("selected", true);
                    cargarTipoEspecialidades2(true, false, function () {
                        $("#tipoEspecialidad2").val(rt.tipo_espe.trim()).prop("selected", true);

                        cargarEspecialidades2(true, false, function () {
                            $("#especialidad2").val(rt.cod_espe.trim()).prop("selected", true);
                        });
                    });
                });
                $("#descripcionE").val(rt.descripcion.trim());
                $("#abreviaturaE").val(rt.abreviatura.trim());
            } else {
                
            }
        }
    });

    $("#modalEditarMalla").modal({ backdrop: 'static', keyboard: false });

}

$("#formEditar").submit(function(e){
    e.preventDefault();
    let data = $(this).serializeArray();
    data.push({name:"opcion",value:"actualizar"})
    /* console.log(data); */
    $.ajax({
        url: path + "notas/mallaCurricular",
        type: "POST",
        dataType : "JSON",
        data: data,  
        beforeSend: function(){
            $("#tablaMalla tbody").html("");
        },     
        success: function ( datos ) { 
            if (datos.respuesta === "success"){           
                Notiflix.Notify.Success('Malla registrada correctamente.');
                cargarMalla();
                $("#modalEditarMalla").modal("hide") 
            } else {
                Notiflix.Notify.Failure('Ocurrio un error inesperado.');
            }        
        }
    });
})