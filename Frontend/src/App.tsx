import React, { useEffect, useState } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
}

const API_URL = 'http://localhost:5069/api/Product';

interface AlertMessage {
  type: 'success' | 'error';
  message: string;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertMessage | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Afficher une alerte et log
  const showAlert = (message: string, type: 'success' | 'error') => {
    console.log(`[Alert] type=${type} message="${message}"`);
    setAlert({ message, type });
  };

  // Auto-clear alert après 5 secondes
  useEffect(() => {
    if (alert) {
      console.log('[Alert] Setting timer to clear alert in 5 seconds');
      const timer = setTimeout(() => {
        console.log('[Alert] Clearing alert');
        setAlert(null);
      }, 5000);
      return () => {
        console.log('[Alert] Cleanup timer');
        clearTimeout(timer);
      };
    }
  }, [alert]);

  async function fetchProducts() {
    console.log('[FetchProducts] Start fetching products');
    setLoading(true);
    // Important : NE PAS clear alert ici !
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      console.log('[FetchProducts] Fetched products:', data);
      setProducts(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('[FetchProducts] Error:', err.message);
        showAlert(err.message, 'error');
      } else {
        showAlert('An unexpected error occurred while fetching products', 'error');
      }
    } finally {
      setLoading(false);
      console.log('[FetchProducts] Finished fetching products');
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('[HandleSubmit] Submit form');

    setAlert(null); // Clear alert on submit start

    if (!name.trim() || !price.trim()) {
      showAlert('Please provide both name and price.', 'error');
      return;
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      showAlert('Price must be a positive number.', 'error');
      return;
    }

    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const payload: { name: string; price: number; id?: string } = {
        name,
        price: priceNum,
      };
      if (editingId) {
        payload.id = editingId;
      }

      console.log(`[HandleSubmit] Sending ${method} request to ${url} with payload`, payload);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        if (errorData && errorData.errors) {
          const messages = Object.values(errorData.errors).flat().join('; ');
          throw new Error(`Validation Error: ${messages}`);
        }
        throw new Error(`Failed to save product: ${res.statusText}`);
      }

      const successMessage = editingId
        ? `Product "${name}" updated successfully!`
        : `Product "${name}" created successfully!`;
      showAlert(successMessage, 'success');

      setName('');
      setPrice('');
      setEditingId(null);

      console.log('[HandleSubmit] Fetching products after save');
      await fetchProducts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('[HandleSubmit] Error:', err.message);
        showAlert(err.message, 'error');
      } else {
        showAlert('An unexpected error occurred during save.', 'error');
      }
    }
  }

  function startEdit(product: Product) {
    console.log('[StartEdit] Editing product:', product);
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setAlert(null);
  }

  async function handleDelete(id: string) {
    console.log('[HandleDelete] Request to delete product id:', id);

    if (!window.confirm('Are you sure you want to delete this product?')) {
      console.log('[HandleDelete] Deletion cancelled by user');
      return;
    }

    setAlert(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product.');
      showAlert('Product deleted successfully!', 'success');
      console.log('[HandleDelete] Product deleted, fetching products again');
      await fetchProducts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('[HandleDelete] Error:', err.message);
        showAlert(err.message, 'error');
      } else {
        showAlert('An unexpected error occurred during deletion.', 'error');
      }
    }
  }

  return (
    <main className="app-container">
      <header className="app-header">
        <h1 className="app-title">Product Management 📦</h1>
        <p className="app-subtitle">Effortlessly manage your product catalog.</p>
      </header>

      {alert && (
        <div
          role="alert"
          className={`alert-message ${alert.type}`}
          aria-live="assertive"
        >
          {alert.type === 'error' ? '❌ ' : '✅ '}
          {alert.message}
        </div>
      )}

      <section className="form-section">
        <h2 className="section-title">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
        <form className="product-form" onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Laptop, Smartphone"
              maxLength={100}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="price">Price (€)</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              min="0.01"
              step="0.01"
              placeholder="e.g., 999.99"
              required
            />
          </div>

          <div className="form-buttons">
            <button
              type="submit"
              className="btn btn-primary"
              aria-label={editingId ? 'Update product' : 'Create product'}
            >
              {editingId ? 'Update Product' : 'Add Product'}
            </button>

            {editingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  console.log('[CancelEdit] Cancelling edit');
                  setEditingId(null);
                  setName('');
                  setPrice('');
                  setAlert(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section
        className="products-section"
        aria-live="polite"
        aria-busy={loading}
      >
        <h2 className="section-title">Current Products</h2>
        {loading ? (
          <div className="loading-spinner" aria-label="Loading products"></div>
        ) : products.length === 0 ? (
          <p className="empty-text">No products available. Start by adding one above!</p>
        ) : (
          <div className="table-responsive">
            <table
              className="products-table"
              role="grid"
              aria-label="Product list"
            >
              <thead>
                <tr>
                  <th scope="col">Product Name</th>
                  <th scope="col">Price (€)</th>
                  <th
                    scope="col"
                    className="actions-header"
                    aria-label="Actions"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td data-label="Product Name">{product.name}</td>
                    <td data-label="Price">€{product.price.toFixed(2)}</td>
                    <td data-label="Actions" className="actions-cell">
                      <button
                        className="btn btn-icon btn-edit"
                        onClick={() => startEdit(product)}
                        aria-label={`Edit ${product.name}`}
                        title={`Edit ${product.name}`}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-icon btn-delete"
                        onClick={() => handleDelete(product.id)}
                        aria-label={`Delete ${product.name}`}
                        title={`Delete ${product.name}`}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <footer className="app-footer">
        <p className="footer-text">
          © {new Date().getFullYear()} HahnWebApidevza. All rights reserved.
        </p>
      </footer>

      {/* Modern & Polished CSS */}
      <style>{`
        :root {
            --primary-color: #0b3c5d; /* Dark Blue */
            --secondary-color: #f7f9fc; /* Light Gray Background */
            --text-color: #333;
            --light-text-color: #6c757d;
            --border-color: #e0e0e0;
            --success-bg: #e6ffe6;
            --success-border: #4dff4d;
            --success-text: #008000;
            --error-bg: #ffe6e6;
            --error-border: #ff4d4d;
            --error-text: #b20000;
            --accent-yellow: #ffc107;
            --accent-yellow-dark: #e0a800;
            --accent-red: #dc3545;
            --accent-red-dark: #b02a37;
            --hover-blue: #08304a;
            --focus-blue: #1976d2;
            --shadow-light: rgba(0,0,0,0.08);
            --shadow-medium: rgba(0,0,0,0.15);
            --radius-small: 6px;
            --radius-medium: 12px;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          background: var(--secondary-color);
          color: var(--text-color);
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .app-container {
          max-width: 800px;
          margin: 3rem auto 5rem;
          background: white;
          padding: 2.5rem 3.5rem;
          box-shadow: 0 5px 20px var(--shadow-light);
          border-radius: var(--radius-medium);
          display: flex;
          flex-direction: column;
          gap: 2.5rem; /* Increased gap for better spacing */
        }

        .app-header {
          text-align: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
        }
        .app-title {
          font-weight: 800; /* Bolder for impact */
          font-size: 2.8rem; /* Larger title */
          color: var(--primary-color);
          margin-bottom: 0.5rem;
          letter-spacing: -0.03em; /* Tighter letter spacing */
        }
        .app-subtitle {
          font-weight: 500;
          color: var(--light-text-color);
          font-size: 1.1rem;
        }

        .section-title {
          font-size: 1.8rem;
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          border-bottom: 2px solid var(--primary-color);
          padding-bottom: 0.5rem;
          display: inline-block; /* Makes border-bottom fit content */
        }

        .alert-message {
          padding: 1rem 1.5rem;
          border-radius: var(--radius-small);
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          animation: fadeIn 0.3s ease-out;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05); /* Subtle shadow for alerts */
        }
        .alert-message.error {
          background-color: var(--error-bg);
          border: 1px solid var(--error-border);
          color: var(--error-text);
        }
        .alert-message.success {
          background-color: var(--success-bg);
          border: 1px solid var(--success-border);
          color: var(--success-text);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .product-form {
          display: grid; /* Using Grid for better layout control */
          grid-template-columns: 1fr 1fr; /* Two columns */
          gap: 1.5rem; /* Increased gap */
          align-items: flex-end;
        }
        .input-group {
          display: flex;
          flex-direction: column;
        }
        .input-group label {
          font-weight: 600;
          margin-bottom: 0.6rem;
          color: var(--text-color);
          font-size: 0.95rem;
        }
        .input-group input {
          padding: 0.8rem 1rem;
          font-size: 1rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-small);
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
          background-color: #fcfcfc; /* Slightly off-white for inputs */
        }
        .input-group input:focus {
          outline: none;
          border-color: var(--focus-blue);
          box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.2); /* Ring focus style */
        }

        .form-buttons {
          grid-column: 1 / -1; /* Span across both columns */
          display: flex;
          gap: 1rem;
          justify-content: flex-start;
          margin-top: 1rem;
        }
        .btn {
          border: none;
          border-radius: var(--radius-small);
          padding: 0.8rem 1.8rem;
          font-size: 1.05rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease-in-out;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          min-width: 120px; /* Ensure consistent button width */
        }
        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }
        .btn-primary:hover {
          background-color: var(--hover-blue);
          transform: translateY(-2px); /* Subtle lift effect */
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .btn-primary:active {
            transform: translateY(0);
            box-shadow: none;
        }
        .btn-secondary {
          background-color: #e9ecef; /* Lighter secondary color */
          color: var(--text-color);
          border: 1px solid #ced4da; /* Add a light border */
        }
        .btn-secondary:hover {
          background-color: #dee2e6;
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .btn-secondary:active {
            transform: translateY(0);
            box-shadow: none;
        }

        .btn-icon {
            padding: 0.6rem; /* Make icon buttons smaller */
            min-width: unset; /* Override min-width for icons */
            width: 40px;
            height: 40px;
            border-radius: 50%; /* Circular buttons for icons */
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem; /* Larger icon size */
        }
        .btn-edit {
          background-color: var(--accent-yellow);
          color: var(--text-color); /* Keep text dark for contrast */
        }
        .btn-edit:hover {
          background-color: var(--accent-yellow-dark);
          color: white; /* Make text white on hover for better contrast on darker yellow */
        }
        .btn-delete {
          background-color: var(--accent-red);
          color: white;
        }
        .btn-delete:hover {
          background-color: var(--accent-red-dark);
        }

        .products-section {
          background: #ffffff;
          border-radius: var(--radius-medium);
          padding: 2rem;
          box-shadow: 0 3px 15px var(--shadow-light);
        }
        .loading-spinner {
            border: 4px solid var(--border-color);
            border-top: 4px solid var(--primary-color);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 2rem auto;
            text-align: center;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .loading-text,
        .empty-text {
          text-align: center;
          font-style: italic;
          color: var(--light-text-color);
          padding: 2rem 0;
          font-size: 1.1rem;
        }

        .table-responsive {
            overflow-x: auto;
            border-radius: var(--radius-small); /* Apply border-radius to the container */
            border: 1px solid var(--border-color); /* Light border around the table */
        }
        .products-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 500px; /* Ensure table is readable on smaller screens before wrapping */
        }
        .products-table thead tr {
          background-color: var(--primary-color);
          color: white;
        }
        .products-table th,
        .products-table td {
          padding: 14px 20px;
          border: 1px solid var(--border-color);
          text-align: left;
          vertical-align: middle;
        }
        .products-table tbody tr:nth-child(even) {
            background-color: #f8f9fa; /* Zebra striping */
        }
        .products-table tbody tr:hover {
            background-color: #eaf1f7; /* Hover effect on rows */
            transition: background-color 0.2s ease;
        }
        .actions-header {
          width: 150px; /* More space for actions */
          text-align: center;
        }
        .actions-cell {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          align-items: center;
        }
        
        .app-footer {
          text-align: center;
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
          color: var(--light-text-color);
          font-size: 0.9rem;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
            .app-container {
                margin: 2rem auto;
                padding: 1.5rem 2rem;
                gap: 2rem;
            }
            .app-title {
                font-size: 2.2rem;
            }
            .section-title {
                font-size: 1.5rem;
            }
            .product-form {
                grid-template-columns: 1fr; /* Stack inputs on small screens */
            }
            .form-buttons {
                justify-content: center;
                flex-direction: column; /* Stack buttons vertically */
                gap: 0.75rem;
            }
            .btn {
                width: 100%;
                max-width: 250px; /* Limit button width for stacked */
                margin: 0 auto; /* Center buttons */
            }
            .products-table th, .products-table td {
                padding: 12px 15px;
            }
            .actions-header {
                width: 120px;
            }
        }

        @media (max-width: 480px) {
            .app-container {
                padding: 1rem 1.2rem;
            }
            .app-title {
                font-size: 1.8rem;
            }
            .app-subtitle {
                font-size: 1rem;
            }
            .section-title {
                font-size: 1.3rem;
            }
            .btn {
                font-size: 0.95rem;
                padding: 0.7rem 1.5rem;
            }
            .alert-message {
                font-size: 0.9rem;
                padding: 0.8rem 1rem;
            }
            .input-group label {
                font-size: 0.9rem;
            }
            .input-group input {
                font-size: 0.9rem;
                padding: 0.6rem 0.8rem;
            }
        }
      `}</style>
    </main>
  );
}

export default App;