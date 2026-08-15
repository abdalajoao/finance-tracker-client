const API_URL = "http://localhost:5005";

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// GET /transactions
export const getTransactions = async () => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions.");
  }

  return response.json();
};


// GET /categories
export const getCategories = async () => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories.");
  }

  return response.json();
};

// POST /categories
export const createCategory = async (category) => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    throw new Error("Failed to create category.");
  }

  return response.json();
}

// PUT /categories/:id
export const updateCategory = async (categoryId, category) => {
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    throw new Error("Failed to update category.");
  }

  return response.json();
};

// DELETE /categories/:id
export const deleteCategory = async (categoryId) => {
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete category.");
  }

  return response.json();
};


// POST /transactions
export const createTransaction = async (transaction) => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    throw new Error("Failed to create transaction.");
  }

  return response.json();
};

// PUT /transactions/:id
export const updateTransaction = async (transactionId, transaction) => {
  const response = await fetch(
    `${API_URL}/transactions/${transactionId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(transaction),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update transaction.");
  }

  return response.json();
};

// DELETE /transactions/:id
export const deleteTransaction = async (transactionId) => {
  const response = await fetch(
    `${API_URL}/transactions/${transactionId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete transaction.");
  }

  return response.json();
};