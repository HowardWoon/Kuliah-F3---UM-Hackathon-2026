import re
import sys
with open("src/App.tsx", "r", encoding="utf-8") as f:
    text = f.read()

# Just strip the weird escape sequences before the backticks and dollar signs
text = text.replace(r"\`\${", "`${")
text = text.replace(r"}%\`", "}%`")

with open("src/App.tsx", "w", encoding="utf-8") as f:
    f.write(text)
