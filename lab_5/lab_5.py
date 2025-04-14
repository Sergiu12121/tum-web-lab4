#!/usr/bin/env python3

import socket
import sys
import re
import argparse
from bs4 import BeautifulSoup
from urllib.parse import quote_plus, urlparse


def print_help():
    print(
        """
Usage:
  go2web -u <URL>         Make an HTTP request to the specified URL and print the response
  go2web -s <search-term> Search using a search engine and print top 10 results
  go2web -h               Show this help message
    """
    )


def strip_html(html):
    soup = BeautifulSoup(html, "html.parser")
    return soup.get_text()


def make_http_request(host, path="/", port=80):
    try:
        with socket.create_connection((host, port), timeout=10) as s:
            request = f"GET {path} HTTP/1.1\r\nHost: {host}\r\nUser-Agent: go2web\r\nConnection: close\r\n\r\n"
            s.send(request.encode())
            response = b""
            while True:
                chunk = s.recv(4096)
                if not chunk:
                    break
                response += chunk
        return response
    except Exception as e:
        return f"Error: {e}".encode()


def parse_response(response):
    try:
        header, body = response.split(b"\r\n\r\n", 1)
        return body.decode(errors="ignore")
    except ValueError:
        return response.decode(errors="ignore")


def request_url(url):
    parsed = urlparse(url)
    if not parsed.scheme.startswith("http"):
        url = "http://" + url
        parsed = urlparse(url)

    host = parsed.hostname
    path = parsed.path or "/"
    if parsed.query:
        path += "?" + parsed.query

    response = make_http_request(host, path)
    body = parse_response(response)
    print(strip_html(body))


def search_term(term):
    query = quote_plus(term)
    url = f"/html/?q={query}"
    host = "duckduckgo.com"

    response = make_http_request(host, url)
    html = parse_response(response)

    soup = BeautifulSoup(html, "html.parser")
    results = soup.find_all("a", href=True)
    printed = set()

    print("Top search results:\n")
    for link in results:
        href = link["href"]
        text = link.get_text(strip=True)
        if href.startswith("http") and href not in printed:
            print(f"{text}\n{href}\n")
            printed.add(href)
            if len(printed) >= 10:
                break


def main():
    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument("-u", type=str, help="URL to fetch")
    parser.add_argument("-s", nargs="+", help="Search term")
    parser.add_argument("-h", action="store_true", help="Show help")
    args = parser.parse_args()

    if args.h or (not args.u and not args.s):
        print_help()
    elif args.u:
        request_url(args.u)
    elif args.s:
        search_term(" ".join(args.s))


if __name__ == "__main__":
    main()
