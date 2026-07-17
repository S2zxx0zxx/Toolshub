import re
import os

def extract_styles():
    html_path = r"c:\toolshub\index.html"
    css_path = r"c:\toolshub\css\components\inline-extracted.css"
    
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

    css_rules = []
    counter = 1

    def style_replacer(match):
        nonlocal counter
        prefix = match.group(1)
        style_val = match.group(2)
        suffix = match.group(3)
        
        cls_name = f"extracted-inline-{counter}"
        counter += 1
        css_rules.append(f".{cls_name} {{\n    {style_val}\n}}\n")
        
        return f'{prefix}class="{cls_name}"{suffix}'

    # Replace style="..." with class="..."
    new_content = re.sub(r'(?i)(<[^>]+?\s)style\s*=\s*"([^"]+)"([^>]*>)', style_replacer, content)

    # Now we need to merge multiple class attributes in the same tag.
    def class_merger(match):
        tag_content = match.group(0)
        
        classes = []
        def class_extractor(cmatch):
            classes.extend(cmatch.group(1).split())
            return ""
            
        # Extract and remove all class="..."
        tag_without_classes = re.sub(r'(?i)\s+class\s*=\s*"([^"]*)"', class_extractor, tag_content)
        
        if classes:
            # Re-insert the merged classes right before the closing >
            # We handle the case where tag ends with /> or just >
            if tag_without_classes.endswith('/>'):
                return tag_without_classes[:-2] + f' class="{" ".join(classes)}"/>'
            else:
                return tag_without_classes[:-1] + f' class="{" ".join(classes)}">'
        return tag_without_classes

    # Apply class_merger to all tags
    final_content = re.sub(r'<[^>]+>', class_merger, new_content)
    
    # Add link to the new CSS file in the head if not there
    if 'inline-extracted.css' not in final_content:
        head_end = final_content.find('</head>')
        if head_end != -1:
            link_tag = '<link rel="stylesheet" href="css/components/inline-extracted.css">\n'
            final_content = final_content[:head_end] + link_tag + final_content[head_end:]

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(final_content)
        
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write("\n".join(css_rules))
        
    print(f"Extracted {counter - 1} inline styles.")

if __name__ == "__main__":
    extract_styles()
