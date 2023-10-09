const axios = require('axios')

const getProducts = async (req,res) =>{
    const { offset } = req.body
    if(offset >= 0){
        try{
            const response = await axios.get(`https://dummyjson.com/products?limit=10&skip=${offset}`)
        res.send(response.data)
        // res.sendStatus(200)  
        }catch(err){
            res.sendStatus(500)
        }
        
    }
   

}

const getByCategories = async (req,res) =>{
    const offset = 0;
    const { category } = req.body
    if(category){
        console.log(req.body)
    const response = await axios.get(`https://dummyjson.com/products/category/${category}?limit=0&skip=${offset}`)
    res.send(response.data)
    // res.sendStatus(200)
    }else{
        res.sendStatus(500)
    }
    
}
const getProductById = async (req,res) =>{
    const { id } = req.body
    console.log(req.body)
    if(id){
        const response = await axios.get(`https://dummyjson.com/products/${id}`)
    res.send(response.data)
    }else{
        res.sendStatus(500)
    }
    
    // res.sendStatus(200)
}

const searchProducts = async(req,res) =>{
    const {searchitem} = req.body;
    if(searchitem){
        try{
            const response = await axios.get(`https://dummyjson.com/products/search?q=${searchitem}`)
            console.log(response)
            if(response){
                res.send(response.data).status(200)
            }else{
                res.sendStatus(500)
            }
            
        }catch(err){
            console.log(err)
        }
    }
}

module.exports = {getProducts,getProductById,getByCategories,searchProducts}