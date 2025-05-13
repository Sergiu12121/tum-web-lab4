from src.sockets.fetcher import fetch_page

def test_fetch_page_success():
    url = "example.com"
    response = fetch_page(url)
    assert "Example Domain" in response

def test_fetch_page_invalid_url():
    url = "invalid-url"
    response = fetch_page(url)
    assert response is None  # Assuming fetch_page returns None for invalid URLs

def test_fetch_page_timeout():
    url = "http://10.255.255.1"  # Example of a non-routable address
    response = fetch_page(url)
    assert response is None  # Assuming fetch_page handles timeouts and returns None