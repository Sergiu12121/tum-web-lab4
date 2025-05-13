# lab_5/lab_5/README.md

# Lab 5: Minimal Command-Line Tool for Fetching Web Pages

## Overview
This project implements a minimal command-line tool that fetches web pages or search terms using raw sockets. It is designed to demonstrate basic socket programming and command-line interface handling in Python.

## Features
- Fetch web pages using HTTP requests.
- Handle user input for URLs or search terms.
- Simple command-line interface.

## Project Structure
```
lab_5/
├── src/
│   ├── cli.py          # Command-line interface for the tool
│   ├── sockets/
│   │   ├── __init__.py # Package initialization
│   │   └── fetcher.py   # Core functionality for fetching web pages
├── tests/
│   ├── __init__.py     # Test package initialization
│   └── test_fetcher.py  # Unit tests for the fetcher module
├── requirements.txt     # Project dependencies
├── setup.py             # Setup script for the project
└── README.md            # Project documentation
```

## Installation
To install the project dependencies, run:
```
pip install -r requirements.txt
```

## Usage
To use the command-line tool, run:
```
python src/cli.py <url_or_search_term>
```
Replace `<url_or_search_term>` with the desired URL or search term.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.