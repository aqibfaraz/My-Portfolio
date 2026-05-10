# Python Web Scraping with Selenium & BeautifulSoup

Automated data extraction is essential in modern development. Learn how to scrape websites efficiently using Python, Selenium, and BeautifulSoup4.

## Why Web Scraping?

Web scraping helps you:

- Collect market data for analytics
- Monitor competitor pricing in real-time
- Extract structured data from unstructured websites
- Automate repetitive data collection tasks
- Build datasets for machine learning models

## Getting Started

Install the required packages:

```bash
pip install selenium beautifulsoup4 requests pandas
```

Download ChromeDriver from [chromedriver.chromium.org](https://chromedriver.chromium.org)

## Static Scraping with BeautifulSoup

For websites with static HTML:

```python
from bs4 import BeautifulSoup
import requests

url = 'https://example.com'
response = requests.get(url)
soup = BeautifulSoup(response.content, 'html.parser')

# Extract titles
titles = soup.find_all('h1')
for title in titles:
    print(title.text)
```

## Dynamic Scraping with Selenium

For JavaScript-heavy websites that load content dynamically:

```python
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome('./chromedriver')
driver.get('https://example.com')

# Wait for element to load
element = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, 'content'))
)

print(element.text)
driver.quit()
```

## Combining Selenium + BeautifulSoup

```python
from selenium import webdriver
from bs4 import BeautifulSoup
import time

driver = webdriver.Chrome('./chromedriver')
driver.get('https://example.com')

# Let JS render
time.sleep(3)

# Parse HTML
soup = BeautifulSoup(driver.page_source, 'html.parser')
data = soup.find_all('div', class_='product')

for item in data:
    print(item.find('h2').text)

driver.quit()
```

## Advanced Scraping Patterns

### 1. Pagination

```python
for page in range(1, 11):
    url = f'https://example.com/products?page={page}'
    driver.get(url)
    time.sleep(2)
    # Extract data...
```

### 2. Handling Popups

```python
try:
    close_btn = driver.find_element(By.CLASS_NAME, 'popup-close')
    close_btn.click()
except:
    pass
```

### 3. Login Automation

```python
driver.find_element(By.ID, 'username').send_keys('your_email')
driver.find_element(By.ID, 'password').send_keys('your_password')
driver.find_element(By.ID, 'login_btn').click()
```

## Exporting Data to CSV

```python
import pandas as pd

data = {
    'title': titles,
    'price': prices,
    'url': urls
}

df = pd.DataFrame(data)
df.to_csv('products.csv', index=False)
```

## Best Practices

- **Respect robots.txt** — Check the website's scraping policy
- **Use delays** — Add `time.sleep()` between requests to avoid overloading servers
- **User-Agent headers** — Some sites block requests without proper headers
- **Error handling** — Use try-except blocks for robustness
- **Headless browsing** — Use `options.add_argument('--headless')` for faster execution
- **Proxy rotation** — Use rotating proxies for large-scale scraping

## Ethical Scraping

```python
import requests
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0'
}

for item in items:
    response = requests.get(url, headers=headers)
    time.sleep(2)  # Be respectful
```

## Common Challenges

**Challenge 1:** Site blocks your requests

**Solution:** Use rotating proxies and user-agent strings

**Challenge 2:** JavaScript renders content after load

**Solution:** Use Selenium instead of basic requests

**Challenge 3:** Data structure changes frequently

**Solution:** Use flexible selectors and CSS classes

## Conclusion

Web scraping with Python is a powerful skill for data engineers, analysts, and automation experts. Selenium handles complex dynamic sites while BeautifulSoup excels at parsing HTML. Combine both for maximum flexibility.

Remember: always scrape responsibly and respect website terms of service.

---

**Building an automated scraping pipeline for your business?** I offer custom web scraping solutions, data pipeline automation, and ML-ready datasets.
