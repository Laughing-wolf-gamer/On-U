export const updateOrderStatusFromShipRokcet = (req,res)=>{
    try {
        const { order_id, status } = req.body;
        console.log(`Order ID: ${order_id}, Status: ${status}`);
    } catch (error) {
        console.error("Error updating order status: ",error);
    }
}