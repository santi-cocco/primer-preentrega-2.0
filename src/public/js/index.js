const socket = io();

socket.on('productos', productos => {
    const tbody = document.getElementById('productos-body');
    tbody.innerHTML = '';

    productos.forEach(producto => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${producto._id}</td>
            <td>${producto.title}</td>
            <td>${producto.description}</td>
            <td>${producto.price}</td>
            <td>${producto.code}</td>
            <td>${producto.stock}</td>
            <td>${producto.category}</td>
            <td>${producto.status ? 'Activo' : 'Desactivado'}</td>
            <td>${producto.thumbnails.length > 0 ? `<a href="${producto.thumbnails[0]}" target="_blank">${producto.thumbnails[0]}</a>` : 'No hay imagen'}</td>
        `;
    });
});

const formulario = document.getElementById('producto-form');

formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const titulo = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const precio = document.getElementById('price').value;
    const codigo = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;
    const categoria = document.getElementById('category').value;
    const thumbnail = document.getElementById('thumbnail').value;
    const estado = document.getElementById('flexCheckChecked').checked;

    // Enviar el nuevo producto al servidor a través del socket
    const producto = {
        title: titulo,
        description: description,
        price: precio,
        code: codigo,
        stock: stock,
        category: categoria,
        thumbnail: thumbnail,
        status: estado
    };

    socket.emit('agregarProducto', producto);
    formulario.reset();
});

// Manejar el evento de eliminación de producto
const deleteBtn = document.getElementById('delete-btn');

deleteBtn.addEventListener('click', () => {
    const productId = document.getElementById('id-prod').value.trim();

    if (productId) {
        socket.emit('eliminarProducto', productId);
    } else {
        alert('Por favor, ingrese un ID de producto válido.');
    }
});