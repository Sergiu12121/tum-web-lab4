import re
from html.parser import HTMLParser

def strip_html_tags(html):
    class HTMLStripper(HTMLParser):
        def __init__(self):
            super().__init__()
            self.text = []

        def handle_data(self, data):
            self.text.append(data)

        def get_data(self):
            return "".join(self.text)

    stripper = HTMLStripper()
    stripper.feed(html)
    return stripper.get_data()

def parse_html(html, extract_links=False):
    if extract_links:
        return re.findall(r'href="(http[s]?://.*?)"', html)
    return strip_html_tags(html)

def parse_json(json_str):
    import json
    return json.dumps(json.loads(json_str), indent=2)