const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

/*Gets the details of an specific product by Id 
matching the product_id being passed as a parameter*/
async function getCarDetailsById (product_id) {
  try {
      const data = await pool.query(
          `SELECT * FROM public.inventory AS i            
          WHERE i.inv_id = $1`,
          [product_id]
      )
      return data.rows
  } catch (error) {
      console.error("getCarDetailsById error" + error)
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getCarDetailsById};