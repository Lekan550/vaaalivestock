# Populating Your Django Admin with Initial Data

Now that you have a superuser for your Django project, you can use the Django administration panel to add initial data to your database. This data will then be served through your API and displayed on your frontend.

## 1. Accessing the Django Admin Panel

To access the Django Admin panel, ensure your Django development server is running:

```bash
cd vaaalivestock/vaaa-livestock-website/backend
source venv/bin/activate
python manage.py runserver
```

Then, open your web browser and navigate to `http://127.0.0.1:8000/admin/` (or your deployed backend URL followed by `/admin/`). Log in using the superuser credentials you created.

## 2. Models Available for Data Entry

Based on your `vaaa/models.py`, the following models are available for data entry in the admin panel:

*   **Animals**: Represents individual animals with details like name, breed, age, price, and description.
*   **Products**: Represents various products for sale, including poultry, goats, sheep, cattle, and by-products. This is the most crucial model for your frontend display.
*   **Orders**: Represents customer orders.
*   **Order Items**: Represents individual items within an order.

## 3. Populating the `Product` Model (Crucial for Frontend)

The `Product` model is directly consumed by your frontend's `main.js` script to display items on the products page. To see products on your website, you **must** add entries here.

### Steps to Add Products:

1.  In the Django Admin, click on **Products** under the `Vaaa` section.
2.  Click the **Add product** button.
3.  Fill in the following fields:
    *   **Name**: E.g., "Broiler Chickens", "Fresh Eggs", "Goats (West African Dwarf)"
    *   **Category**: Select from the dropdown (e.g., "Poultry", "Goats", "Sheep", "Cattle", "By-Products"). These categories directly correspond to the filter options on your frontend.
    *   **Price**: The price of the product (e.g., `3500.00`).
    *   **Unit**: E.g., "per bird", "per crate", "per animal", "per kg", "per liter", "per bag".
    *   **Image**: Upload an image for the product. This image will be displayed on your frontend. If you don't upload an image, a placeholder will be used.
4.  Click **Save** to add the product.
5.  Repeat these steps to add several products across different categories.

**Example Product Data to Add:**

| Field       | Example Value 1           | Example Value 2           | Example Value 3           |
| :---------- | :------------------------ | :------------------------ | :------------------------ |
| **Name**    | Broiler Chickens          | Fresh Eggs                | Goats (West African Dwarf)|
| **Category**| poultry                   | poultry                   | goats                     |
| **Price**   | 3500.00                   | 1800.00                   | 35000.00                  |
| **Unit**    | per bird                  | per crate                 | per animal                |
| **Image**   | (Upload broiler.jpg)      | (Upload eggs.jpg)         | (Upload goats.jpg)        |

### Impact on Frontend (`js/main.js`)

Your `js/main.js` script fetches products from the `/api/products/` endpoint. When you add products via the Django Admin, they become available through this API. The `loadProducts` function in your frontend then displays these products dynamically. The `category` field you select in the admin will be used for filtering products on the frontend.

## 4. Populating the `Animal` Model

The `Animal` model is currently not directly displayed on your main frontend pages or used by the ordering system. However, you can still populate it for future features or internal tracking.

### Steps to Add Animals:

1.  In the Django Admin, click on **Animals** under the `Vaaa` section.
2.  Click the **Add animal** button.
3.  Fill in the following fields:
    *   **Name**: E.g., "Babe", "Daisy"
    *   **Breed**: E.g., "Large White", "Holstein"
    *   **Age**: E.g., `1`, `3`
    *   **Price**: E.g., `150000.00`
    *   **Description**: A brief description of the animal.
4.  Click **Save**.

## 5. `Order` and `OrderItem` Models

The `Order` and `OrderItem` models are designed to be populated automatically when a customer places an order through your frontend. You generally **do not** need to manually create these entries in the admin panel, unless you are testing or managing orders manually.

When an order is successfully submitted via the frontend, you will see new entries appear under **Orders** in the Django Admin, with associated **Order Items** visible when you view an individual order.

## Conclusion

By populating the `Product` model in your Django Admin, you will immediately see your website come to life with dynamic product listings. The `Animal` model can be populated for future use, and `Order` and `OrderItem` models will grow as customers interact with your site. This setup provides a robust backend for managing your website's content.

---