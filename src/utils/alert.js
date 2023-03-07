import  sw from 'sweetalert2'

const alert = ({title, icon, timer, position} = {}) => {
    return sw.fire({
        position: position || 'center',
        icon: icon || 'warning',
        title:  title || 'Por favor llenar todos los campos.',
        timer: timer || 1500 ,
        showConfirmButton: false,   
    })
}

export default alert