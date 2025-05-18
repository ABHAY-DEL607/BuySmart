# BuySmart Backend

This is the backend server for the BuySmart browser extension, handling real-time product data scraping from multiple e-commerce websites.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here
RATE_LIMIT_POINTS=10
RATE_LIMIT_DURATION=1
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Scrape Products
- **POST** `/api/scrape/:site`
- **Body:**
  ```json
  {
    "query": "product search query",
    "url": "full search URL"
  }
  ```
- **Response:**
  ```json
  {
    "products": [
      {
        "id": "product-id",
        "name": "Product Name",
        "price": 999,
        "image": "image-url",
        "rating": 4.5,
        "reviews": 100,
        "inStock": true,
        "url": "product-url"
      }
    ]
  }
  ```

## Supported Sites
- Amazon
- Flipkart
- Paytm Mall
- JioMart
- eBay

## Rate Limiting
- 10 requests per second per IP address
- Rate limit headers included in responses

## Error Handling
- Proper error messages for failed scrapes
- Rate limit exceeded messages
- Invalid site messages

## Security
- CORS enabled
- Rate limiting
- User agent rotation
- Request validation 