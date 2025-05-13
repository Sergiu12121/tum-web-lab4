def main():
    import sys
    from sockets.fetcher import fetch_page

    if len(sys.argv) < 2:
        print("Usage: python cli.py <url or search term>")
        sys.exit(1)

    input_value = sys.argv[1]

    try:
        response = fetch_page(input_value)
        print(response)
    except Exception as e:
        print(f"Error fetching data: {e}")


if __name__ == "__main__":
    main()
