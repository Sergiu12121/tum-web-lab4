import socket
import ssl
from urllib.parse import urlparse

def fetch_page(url, max_redirects=5):
    if max_redirects == 0:
        raise Exception("Too many redirects")

    parsed_url = urlparse(url)
    hostname = parsed_url.hostname
    path = parsed_url.path or "/"
    port = 443 if parsed_url.scheme == "https" else 80

    with socket.create_connection((hostname, port)) as sock:
        if parsed_url.scheme == "https":
            context = ssl.create_default_context()
            sock = context.wrap_socket(sock, server_hostname=hostname)

        request = f"GET {path} HTTP/1.1\r\nHost: {hostname}\r\nConnection: close\r\n\r\n"
        sock.sendall(request.encode())

        response = b""
        while True:
            data = sock.recv(4096)
            if not data:
                break
            response += data

    response_text = response.decode()
    headers, body = response_text.split("\r\n\r\n", 1)

    if "301" in headers or "302" in headers:
        for line in headers.split("\r\n"):
            if line.lower().startswith("location:"):
                new_url = line.split(":", 1)[1].strip()
                return fetch_page(new_url, max_redirects - 1)

    return {"headers": headers, "body": body}
