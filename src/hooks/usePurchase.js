import { useState } from "react";
import { purchaseTicket } from "../api/purchaseApi";

const usePurchase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buyTicket = async (eventSectionId, quantity) => {
    setLoading(true);
    try {
      const response = await purchaseTicket(eventSectionId, quantity);
      return response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { buyTicket, loading, error };
};

export default usePurchase;
