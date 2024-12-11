$(document).ready(function () {

    cargarRegistros();

});

let nombre_meses = {
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

function cargarRegistros() {
    let anio = $('#verAnio').val();

    $.ajax({
        url: path + "planilla/activarDescargaBoletas",
        type: "POST",
        dataType: 'json',
        data: {
            anio: anio,
            opcion: 'selectPeriodos'
        },
        success: function (data) {
            console.log(data);
            var tbody = $("#tablaRegistros tbody");
            tbody.find('tr').remove();
            if (data.respuesta === 'success') {
                console.log(data);
	        	$.each(data.registros, function(i, listado) {
                    if (listado.estado ===1) {
                        clase = 'success';
                        icono = 'checkmark';
                        text = 'Activado';
                    } else{
                        clase = 'default';
                        icono = 'uncheckmark';
                        text = 'Desactivado';
                    }
	        		 let tr=`<tr>
	        			 	<td class='text-center'>${i+1}</td>
	        			 	<td class='text-center'>${listado.anio}</td>
	        			 	<td class='text-center'>${nombre_meses[listado.mes]}</td>
	        			 	<td class='text-center'><span class='label label-${clase}'>${text}</span></td>
	        			 	<td class='text-center'>
                                <button class='btn boton-tabla boton-plomo' type='button' data-id = '${listado.id}' onclick='desactivarPeriodo(this)' title='Desactivar'><span class='icon-${icono}'></span></button>
	        			 	</td>
        		 			</tr>`;
        		 tbody.append(tr);
	        	});
	        } else{
                Notiflix.Notify.Failure('Ocurrió un error al actualizar los permisos');
            }

        }
    }); 
}

$("#btnGuardarPeriodo").click(function () {

    verificarRegistro();

});

function verificarRegistro(){

    let mes = $('#mes').val();
    let anio = $('#anio').val();
    $.ajax({
        url: path + "planilla/activarDescargaBoletas",
        type: "POST",
        dataType: 'json',
        data: {
            mes: mes,
            anio: anio,
            opcion: 'verificarRegistro'
        },
        success: function (data) {

            if (data.respuesta === 'success') {
	        	
                guardarRegistro(mes, anio);

	        } else{
                Notiflix.Notify.Failure('Ya existe un registro para el periodo seleccionado!!');
            }

        }
    });

}

function guardarRegistro(mes, anio){
    estado = $('#chkEstado').val();
    $.ajax({
        url: path + "planilla/activarDescargaBoletas",
        type: "POST",
        dataType: 'json',
        data: {
            mes: mes,
            anio: anio,
            estado: estado,
            opcion: 'guardarRegistro'
        },
        success: function (data) {
            console.log(data);
            if (data.respuesta === 'success') {
                $("#modalNuevoRegistro").modal("hide")
                cargarRegistros();
	        	Notiflix.Notify.Success('Registro guardado correctamente!');
	        } else{
                Notiflix.Notify.Failure('Ocurrió un error al actualizar los permisos');
            }

        }
    });
}

function desactivarPeriodo(e){
    let id = e.getAttribute("data-id");
    let estado = e.firstChild.matches('.icon-checkmark') ? 0 : 1;
    console.log(estado);
    $.ajax({
        url: path + "planilla/activarDescargaBoletas",
        type: "POST",
        dataType: 'json',
        data: {
            id: id,
            estado: estado,
            opcion: 'cambiarEstado'
        },
        success: function (data) {
            console.log(data);
            if (data.respuesta === 'success') {
                cargarRegistros();
	        	Notiflix.Notify.Success('Registro guardado correctamente!');
	        } else{
                Notiflix.Notify.Failure('Ocurrió un error');
            }

        }
    });
}

$("#btnNuevo").click(function () {

    $("#modalNuevoRegistro").modal({backdrop: 'static', keyboard: false});

});

$("#verAnio").change(function(){
    cargarRegistros();
});
