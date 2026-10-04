# Python Web Scraping with Selenium & BeautifulSoup

Web scraping is one of the most valuable skills in 2025. Automate data extraction
and build intelligent data pipelines that save thousands of hours of manual work.

## Why Web Scraping?

- **Market Research**: Extract competitor pricing and product data
- **Lead Generation**: Scrape business directories and contact information
- **Data Mining**: Collect training data for AI/ML models
- **Automation**: Eliminate repetitive manual data entry

## Tools You'll Need

**Selenium**: For JavaScript-heavy websites that require browser automation
**BeautifulSoup**: Fast HTML parsing for static websites
**Requests**: Simple HTTP library for basic web requests

## Installation

```bash
pip install selenium beautifulsoup4 requests
```

Download ChromeDriver from [here](https://chromedriver.chromium.org) and add to PATH.

## Basic Web Scraping with BeautifulSoup

For static HTML websites, BeautifulSoup is the fastest approach:

```python
import requests
from bs4 import BeautifulSoup

url = "https://example.com"
response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')

# Extract all product titles
products = soup.find_all('h2', class_='product-title')
for product in products:
    print(product.text)
```

## Advanced: Scraping JavaScript-Heavy Sites with Selenium

For websites using React/Vue that load content dynamically:

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()
driver.get("https://example.com")

# Wait for element to load
wait = WebDriverWait(driver, 10)
element = wait.until(
    EC.presence_of_all_elements_located((By.CLASS_NAME, "product-card"))
)

# Extract data
for item in element:
    title = item.find_element(By.CLASS_NAME, "title").text
    price = item.find_element(By.CLASS_NAME, "price").text
    print(f"{title} - {price}")

driver.quit()
```

## Handling Common Challenges

### 1. Rate Limiting (429 errors)

```python
import time
import random

for url in urls:
    response = requests.get(url)
    time.sleep(random.uniform(2, 5))  # Random delay
```

### 2. Rotating User Agents

```python
import requests
from fake_useragent import UserAgent

ua = UserAgent()
headers = {'User-Agent': ua.random}
response = requests.get(url, headers=headers)
```

### 3. Handling Pagination

```python
for page in range(1, 101):
    url = f"https://example.com/products?page={page}"
    response = requests.get(url)
    # Parse and process
```

## Building a Production Scraper

Here's a complete example scraping an e-commerce site:

```python
import requests
from bs4 import BeautifulSoup
import csv
from datetime import datetime

class ProductScraper:
    def __init__(self, base_url):
        self.base_url = base_url
        self.products = []

    def scrape(self):
        for page in range(1, 6):
            url = f"{self.base_url}?page={page}"
            response = requests.get(url)
            soup = BeautifulSoup(response.content, 'html.parser')

            for item in soup.find_all('div', class_='product'):
                product = {
                    'name': item.find('h2').text,
                    'price': item.find('span', class_='price').text,
                    'url': item.find('a')['href'],
                    'scraped_at': datetime.now().isoformat()
                }
                self.products.append(product)

    def save_csv(self, filename='products.csv'):
        with open(filename, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=['name', 'price', 'url', 'scraped_at'])
            writer.writeheader()
            writer.writerows(self.products)

# Usage
scraper = ProductScraper("https://example.com/products")
scraper.scrape()
scraper.save_csv()
print(f"Scraped {len(scraper.products)} products")
```

## Best Practices

1. **Respect robots.txt**: Check if the site allows scraping
2. **Use delays**: Add random delays between requests
3. **Cache responses**: Don't re-download the same page twice
4. **Error handling**: Wrap requests in try-except blocks
5. **User-Agent rotation**: Avoid detection by rotating headers
6. **Monitor rate**: Start slow, then increase gradually

## Legal Note

Always check the website's Terms of Service before scraping. Some sites explicitly forbid scraping.

## Next Steps

- Learn Splash or Playwright for more complex scenarios
- Integrate with databases (MongoDB, PostgreSQL)
- Build REST APIs around your scrapers
- Deploy to cloud servers for continuous data collection

Happy scraping!
