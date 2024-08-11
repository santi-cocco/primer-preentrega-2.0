import { request, response } from 'express';
import { addProductService, deleteProductService, getProductsByIdService, getProductsService, updateProductService } from '../services/productsServices.js';

export const getProducts = async (req = request, res = response) => {
  try {
    const result = await getProductsService({ ...req.query })
  return res.json({ result });
  } catch (error) {
    return res.status(500).json({ msg: 'Hablar con un administrador' });
  }
};

export const getProductsById = async (req = request, res = response) =>{
    try {
     const { pid } = req.params;
     const producto = await getProductsByIdService(pid);
     if (!producto) 
        return res.status(404).json({ msg: `El producto con id ${pid} no existe`})
     return res.json({ producto });
    } catch (error) {
     console.log('getProductsById->', error)
     return res.status(500).json({msg: 'Hablar con un administrador'})   
    }
}

export const addProduct = async (req = request, res = response) => {
  try {
    const { title, description, price, code, stock, category } = req.body;

    if (!title || !description || !price || !code || !stock || !category) {
      return res.status(400).json({ msg: 'Los campos requeridos son [title, description, price, code, stock, category]' });
    }
    const producto = await addProductService({ ...req.body });
    return res.json({ producto });
  } catch (error) {
    return res.status(500).json({ msg: 'Hablar con un administrador' });
  }
};

export const updateProduct = async (req = request, res = response) => {
  try {
      const { pid } = req.params;
      const producto = await updateProductService(pid, req.body);

      if (producto) 
          return res.json({ msg: 'Producto Actualizado', producto });
      return res.status(404).json({ msg: `No se pudo actualizar el producto con id ${pid}` });
  } catch (error) {
      return res.status(500).json({ msg: 'Error al actualizar el producto. Hablar con un administrador.' });
  }
};

export const deleteProduct = async (req = request, res = response) => {
  try {
      const {pid} = req.params;
      const producto = await deleteProductService(pid);
      if(producto)
          return res.json({msg: 'Producto eliminado', producto});
      return res.status(404).json({msg:`No se pudo eliminar el producto con id ${pid}`});
  } catch (error) {
      console.log('deleteProduct->', error);
      return res.status(500).json({ msg: 'Hablar con un administrador' });
  }
};


// export const getProductsView = async () => {
//   try {
//     const productList = await getProductsViewService();
//     return productList;
//   } catch (error) {
//     throw new Error('Error al obtener los productos de la base de datos: ' + error.message);
//   }
// };