export const getAllOrders = async () => {
    const response = await fetch("http://localhost:5001/api/orders");
    return response.json();
};
