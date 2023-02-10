$("document").ready(function() {
    //precio del envio
    const SHIPPING_VALUE = 19;

    // permite ejecutar una animacion cada vez que se requiera
    function toggleAnimateClass(className, select, self) {
        select.removeClass(className);
        setTimeout(function() {
            select.addClass(className);
        }.bind(self), 0);
    }

    var timeoutIds = [];
    function openModal(selector){
        $(".body").addClass("modal-open-body");
        $(selector).addClass("modal-open");
        $(".modal-content").addClass("modal-content-animate")
        var timeoutId = setTimeout(function() {
            $(".modal-content").removeClass("modal-content-animate");
            setTimeout(function() {
                $(".body").removeClass("modal-open-body");
                $(selector).removeClass("modal-open");
            }, 500)
        }, 5000);
        timeoutIds.push(timeoutId)
    }

    $(".close-icon-modal").click(function() {
        $(".modal-content").removeClass("modal-content-animate");
            setTimeout(function() {
                $(".body").removeClass("modal-open-body");
                $(".modal-valid").removeClass("modal-open");
                $(".modal-invalid").removeClass("modal-open");
            }, 500)
        timeoutIds.forEach(timeoutId => {
            clearTimeout(timeoutId);
        });
        timeoutIds = [];
    })

    $('.input-icon-container span, .input-icon-container button, .input-icon-container').click(function() {
        $(this).closest('.input-icon-container').find('.input').focus()
        $(this).closest('.input-icon-container').find('.input').parent().removeClass("input-invalid");
        let idInput = $(this).closest('.input-icon-container').find('.input').attr("id")
        $("label[for='" + idInput + "']").removeClass("input-invalid-label")
    });

    // Al seleccionar aplica una clase al contenedor del input y el icono
    $(".input").focus(function() {
        $(this).parent().addClass("input-icon-container-focus");
        $(this).siblings(".material-icons-round").addClass("icon-color");
    });

    // Al quitar el focus quita las clases
    $(".input").blur(function() {
        $(this).parent().removeClass("input-icon-container-focus");
        $(this).siblings(".material-icons-round").removeClass("icon-color");
    });

    $(".arrow_down-icon").click(function () {
        $(".country").toggleClass("show-country");
        $(".arrow_down-icon").toggleClass("arrow_down-icon-rotate");
    })

    $(".country").mousedown(function(e){
        e.preventDefault();
    });

    $('.country option').each(function() {
        $(this).click(function() {
            let actual = $(this).prop('selected');
            $(this).prop('selected', !actual);
            const selectedOptions = $(".country option:selected").map(function() {
                return $(this).val();
            }).get();

            let textCountry = selectedOptions.join(", ");
            $("#country").val(textCountry);
        })
    })

    function totalUpdate(){
        // array con el contenido de todas las etiquetas que tienen la clase discounted 
        const valuesItems = $(".dicounted").map(function(){
            return parseFloat($(this).text())
        }).get();

        // array con el contenido de todas las etiquetas que tienen la clase quantity-text
        const quantityItems = $(".quantity-text").map(function(){
            return parseInt($(this).val())
        }).get();

        //evalua si no hay ningun item en el carrito
        const noItemExists = quantityItems.every(function(item){
            return item === 0;
        })

        if(noItemExists){
            $(".shipping").text(0)
        }else{
            $(".shipping").text(SHIPPING_VALUE)
        }

        // multiplicacion de arrays indice a indice
        const totalByItem = valuesItems.map(function(value, index){
            return value * quantityItems[index];
        })

        const shippingTotal = parseInt($(".shipping").text())

        // suma todos los valores de un array
        let total = shippingTotal + totalByItem.reduce(function(acc, value){
                return acc + value
            })

        $(".total").text(total.toFixed(2));
    } 

    $(".quantity-text").change(function() {

        let number = $(this).val();
        
        function validateQuantity(number) {
            var re = /^\d+$/;
            return re.test(number);
        }

        if(parseInt(number) < 0 || ! validateQuantity(number)){
            $(this).val(1);
            toggleAnimateClass("quantity-text-animate-zero", $(this), this)
        }

        totalUpdate();
    });

    $(".icon-cart-item").each(function () { //la funcion itera en cada componente que que usa la clase .icon-cart-item
        $(this).click(function() { //evalua en cual se hizo click.
            
            //añade una animacion en el icono pulsado.
            toggleAnimateClass("icon-animate", $(this), this)
            
            let buttonClass = $(this).attr("class"); // extrae las clases
            let value = $(this).siblings(".quantity-text").val(); // estrae el contenido de su etiqueta hermana
            if (buttonClass.includes("add")){ //evalua si el boton añade
                $(this).siblings(".quantity-text").val(parseInt(value)+1) // aumenta en 1 el contenido de su etiqueta hermana
            }else if(buttonClass.includes("remove")){ //evalua si el boton sustrae
                // disminuye en 1 el contenido de su etiqueta hermana
                if(parseInt(value) === 1 || parseInt(value) === 0){
                    $(this).siblings(".quantity-text").val(0);
                    toggleAnimateClass("quantity-text-animate-zero", $(this).siblings(".quantity-text"), this)
                }else{
                    $(this).siblings(".quantity-text").val(parseInt(value)-1);
                }
            }

            totalUpdate()
        })
    })

    $(".form").submit(function(event) {
        event.preventDefault();
        
        // Obtener los valores de los inputs
        let email = $("#e-mail").val();
        let phone = $("#phone").val();
        let name = $("#name").val();
        let address = $("#address").val();
        let city = $("#city").val();
        let country = $("#country").val();
        let postal_code = $("#postal-code").val();

        let valid = true;

        // Validar los datos
        if(!validateEmail(email)){
            $("#e-mail").parent().addClass("input-invalid");
            $("label[for='e-mail']").addClass("input-invalid-label");
            valid = false;
        }

        if(phone.length!==10){
            $("#phone").parent().addClass("input-invalid");
            $("label[for='phone']").addClass("input-invalid-label");
            valid = false;
        }

        if(name.length===0){
            $("#name").parent().addClass("input-invalid");
            $("label[for='name']").addClass("input-invalid-label");
            valid = false;
        }

        if(address.length===0){
            $("#address").parent().addClass("input-invalid");
            $("label[for='address']").addClass("input-invalid-label");
            valid = false;
        }

        if(city.length===0){
            $("#city").parent().addClass("input-invalid");
            $("label[for='city']").addClass("input-invalid-label");
            valid = false;
        }

        if(country.length===0){
            $("#country").parent().addClass("input-invalid");
            $("label[for='country']").addClass("input-invalid-label");
            valid = false;
        }

        if(postal_code.length===0){
            $("#postal-code").parent().addClass("input-invalid");
            $("label[for='postal-code']").addClass("input-invalid-label");
            valid = false;
        }        

        // Si la validación es exitosa, enviar el formulario
        if(valid){
            openModal(".modal-valid");
        }else{
            openModal(".modal-invalid");
        }
        
        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email.toLowerCase());
        }

    });

})
