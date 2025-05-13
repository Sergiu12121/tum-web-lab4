def fetch_page(url):
    import socket

    # Parse the URL to extract the hostname and path
    if url.startswith("http://"):
        url = url[7:]
    elif url.startswith("https://"):
        url = url[8:]

    hostname, path = url.split("/", 1) if "/" in url else (url, "")
    path = "/" + path if path else "/"

    # Create a socket connection
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.connect((hostname, 80))

    # Send the HTTP GET request
    request = f"GET {path} HTTP/1.1\r\nHost: {hostname}\r\nConnection: close\r\n\r\n"
    sock.send(request.encode())

    # Receive the response
    response = b""
    while True:
        chunk = sock.recv(4096)
        if not chunk:
            break
        response += chunk

    sock.close()

    # Extract the body from the response
    headers, body = response.split(b"\r\n\r\n", 1)
    return body.decode()