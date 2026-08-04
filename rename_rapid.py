import os
import re

files_to_update = [
    'client/src/components/SubjectCard.jsx',
    'client/src/pages/About.jsx',
    'client/src/pages/Admin.jsx',
    'client/src/pages/Cart.jsx',
    'client/src/pages/OrderHistory.jsx',
    'server/controllers/subjectController.js',
    'server/models/Order.js',
    'server/models/Subject.js',
]

for filepath in files_to_update:
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace rapid -> flash
        content = re.sub(r'\brapid\b', 'flash', content)
        # Replace Rapid -> Flash
        content = re.sub(r'\bRapid\b', 'Flash', content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filepath}')
    else:
        print(f'File not found: {filepath}')
